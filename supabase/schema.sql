-- =============================================================================
-- Pachapp · Esquema de base de datos (Supabase / PostgreSQL)
--
-- Cómo usarlo: Supabase Dashboard → SQL Editor → pegar y ejecutar este archivo,
-- y luego ejecutar supabase/seed.sql. Es re-ejecutable (idempotente).
--
-- Principios de seguridad:
--   * Los jugadores NUNCA leen la tabla `questions` directamente (contiene la
--     respuesta correcta). Obtienen las preguntas con get_module_questions() y
--     responden con answer_question(), que valida en el servidor.
--   * XP, HP de jefes y emblemas solo cambian a través de funciones
--     SECURITY DEFINER; los clientes no tienen permisos de escritura sobre ellos.
--   * Admin = correo presente en `admin_emails` (sin acceso desde el cliente).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tablas
-- -----------------------------------------------------------------------------

create table if not exists public.admin_emails (
  email text primary key
);

-- Usuarios (perfil de juego asociado a auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  rpg_class text check (rpg_class in ('brujo', 'paladin', 'druida', 'picaro')),
  total_xp integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id integer primary key,
  slug text not null unique,
  title text not null,
  summary text not null default '',
  initially_unlocked boolean not null default false,
  -- Se fija cuando la comunidad derrota al jefe que lo desbloquea. Es permanente:
  -- reiniciar el HP de ese jefe no vuelve a bloquear el módulo.
  unlocked_at timestamptz,
  -- [{ "heading": "...", "body": ["párrafo", ...] }, ...]
  codex jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id text primary key,
  module_id integer not null references public.modules (id) on delete cascade,
  prompt text not null,
  correct_answer text not null,
  distractors text[] not null check (array_length(distractors, 1) = 3),
  is_boss_final boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists questions_module_idx on public.questions (module_id, sort_order);

create table if not exists public.bosses (
  id text primary key,
  module_id integer not null unique references public.modules (id) on delete cascade,
  name text not null,
  title text not null default '',
  max_hp integer not null default 1000 check (max_hp > 0),
  current_hp integer not null default 1000 check (current_hp >= 0),
  damage_per_hit integer not null default 10 check (damage_per_hit > 0),
  final_question_id text references public.questions (id) on delete set null,
  unlocks_module_id integer references public.modules (id) on delete set null,
  defeated_at timestamptz,
  defeated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.codex_reads (
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_id integer not null references public.modules (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- Registro de todas las respuestas. `awarded` marca el primer acierto de un
-- usuario en una pregunta: solo ese otorga XP y daña al jefe.
create table if not exists public.answers (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id text not null references public.questions (id) on delete cascade,
  module_id integer not null references public.modules (id) on delete cascade,
  is_correct boolean not null,
  awarded boolean not null default false,
  xp_awarded integer not null default 0,
  damage_dealt integer not null default 0,
  answered_at timestamptz not null default now()
);
create unique index if not exists answers_first_correct_uidx
  on public.answers (user_id, question_id) where awarded;
create index if not exists answers_user_time_idx on public.answers (user_id, answered_at desc);
create index if not exists answers_time_idx on public.answers (answered_at);

-- Emblemas (loot)
create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text not null default '',
  icon text not null default '',
  -- { "type": "codex_read" | "boss_defeated" | "module_completed" | "correct_streak" | "final_blow", ... }
  criterion jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  user_id uuid not null references public.profiles (id) on delete cascade,
  badge_id text not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.is_module_unlocked(p_module_id integer)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.modules
    where id = p_module_id and (initially_unlocked or unlocked_at is not null)
  );
$$;

-- Crea el perfil automáticamente al registrarse con Google.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Vista de estado de módulos (desbloqueo comunitario)
-- -----------------------------------------------------------------------------

create or replace view public.module_status
with (security_invoker = true)
as
select
  m.id as module_id,
  (m.initially_unlocked or m.unlocked_at is not null) as unlocked
from public.modules m;

-- -----------------------------------------------------------------------------
-- Emblemas: evaluación
-- -----------------------------------------------------------------------------

-- Otorga al usuario todos los emblemas cuyo criterio cumple y devuelve los nuevos.
-- `final_blow` se otorga directamente en answer_question().
create or replace function public.evaluate_badges(p_user_id uuid)
returns setof text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_badge record;
  v_ok boolean;
  v_streak integer;
begin
  -- Racha actual de aciertos consecutivos (desde el más reciente). Solo cuentan
  -- los primeros aciertos y los errores: repetir una pregunta ya acertada no suma.
  select count(*) into v_streak
  from (
    select is_correct,
           sum(case when is_correct then 0 else 1 end) over (order by answered_at desc, id desc) as misses
    from public.answers
    where user_id = p_user_id and (awarded or not is_correct)
  ) s
  where s.misses = 0;

  for v_badge in
    select b.id, b.criterion from public.badges b
    where not exists (select 1 from public.user_badges ub where ub.user_id = p_user_id and ub.badge_id = b.id)
  loop
    v_ok := case v_badge.criterion ->> 'type'
      when 'codex_read' then
        (select count(*) from public.codex_reads where user_id = p_user_id)
          >= coalesce((v_badge.criterion ->> 'count')::integer, 1)
      when 'correct_streak' then
        v_streak >= coalesce((v_badge.criterion ->> 'count')::integer, 1)
      when 'module_completed' then
        not exists (
          select 1 from public.questions q
          where q.module_id = (v_badge.criterion ->> 'moduleId')::integer
            and not q.is_boss_final
            and not exists (
              select 1 from public.answers a
              where a.user_id = p_user_id and a.question_id = q.id and a.awarded
            )
        )
        and exists (
          select 1 from public.questions q
          where q.module_id = (v_badge.criterion ->> 'moduleId')::integer
        )
      when 'boss_defeated' then
        exists (
          select 1 from public.bosses b
          where b.module_id = (v_badge.criterion ->> 'moduleId')::integer
            and b.defeated_at is not null
            and exists (
              select 1 from public.answers a
              where a.user_id = p_user_id and a.module_id = b.module_id and a.damage_dealt > 0
            )
        )
      else false
    end;

    if v_ok then
      insert into public.user_badges (user_id, badge_id)
      values (p_user_id, v_badge.id)
      on conflict do nothing;
      if found then
        return next v_badge.id;
      end if;
    end if;
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPCs del juego (lo que llama el frontend)
-- -----------------------------------------------------------------------------

-- Marca el Códice como leído (requisito para responder). Devuelve emblemas nuevos.
create or replace function public.mark_codex_read(p_module_id integer)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '28000';
  end if;
  if not public.is_module_unlocked(p_module_id) then
    raise exception 'Módulo bloqueado' using errcode = 'P0001';
  end if;

  insert into public.codex_reads (user_id, module_id)
  values (v_uid, p_module_id)
  on conflict do nothing;

  return coalesce(array(select public.evaluate_badges(v_uid)), '{}');
end;
$$;

-- Preguntas de un módulo con las alternativas barajadas, SIN revelar la correcta.
create or replace function public.get_module_questions(p_module_id integer)
returns table (
  id text,
  prompt text,
  options text[],
  is_boss_final boolean,
  already_answered boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '28000';
  end if;
  if not public.is_module_unlocked(p_module_id) then
    raise exception 'Módulo bloqueado' using errcode = 'P0001';
  end if;

  return query
  select
    q.id,
    q.prompt,
    array(
      select opt from unnest(array_append(q.distractors, q.correct_answer)) as opt
      order by random()
    ),
    q.is_boss_final,
    exists (
      select 1 from public.answers a
      where a.user_id = v_uid and a.question_id = q.id and a.awarded
    )
  from public.questions q
  where q.module_id = p_module_id
  order by q.is_boss_final, q.sort_order;
end;
$$;

-- Responde una pregunta. Valida en el servidor, registra el intento y, si es el
-- primer acierto del usuario en esa pregunta: otorga XP y daña al jefe.
-- Si el golpe deja al jefe en 0 HP, se desbloquea el siguiente módulo.
create or replace function public.answer_question(p_question_id text, p_answer text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_q public.questions;
  v_boss public.bosses;
  v_correct boolean;
  v_awarded boolean := false;
  v_xp integer := 0;
  v_damage integer := 0;
  v_final_blow boolean := false;
  v_new_badges text[] := '{}';
  v_participant uuid;
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '28000';
  end if;

  select * into v_q from public.questions where id = p_question_id;
  if not found then
    raise exception 'Pregunta no existe' using errcode = 'P0002';
  end if;
  if not public.is_module_unlocked(v_q.module_id) then
    raise exception 'Módulo bloqueado' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.codex_reads where user_id = v_uid and module_id = v_q.module_id) then
    raise exception 'Debes leer el Códice antes de jugar' using errcode = 'P0001';
  end if;

  v_correct := trim(p_answer) = trim(v_q.correct_answer);
  select * into v_boss from public.bosses where module_id = v_q.module_id;

  if v_correct then
    -- Primer acierto: XP base 10, la pregunta final del jefe vale 50 y pega x5.
    v_xp := case when v_q.is_boss_final then 50 else 10 end;
    v_damage := case
      when v_boss.id is null or v_boss.defeated_at is not null then 0
      when v_q.is_boss_final then v_boss.damage_per_hit * 5
      else v_boss.damage_per_hit
    end;

    insert into public.answers (user_id, question_id, module_id, is_correct, awarded, xp_awarded, damage_dealt)
    values (v_uid, v_q.id, v_q.module_id, true, true, v_xp, v_damage)
    on conflict (user_id, question_id) where awarded do nothing;
    v_awarded := found;
  end if;

  if not v_awarded then
    -- Error, o acierto repetido: solo se registra el intento (cuenta para rachas).
    v_xp := 0;
    v_damage := 0;
    insert into public.answers (user_id, question_id, module_id, is_correct)
    values (v_uid, v_q.id, v_q.module_id, v_correct);
  end if;

  if v_awarded and v_damage > 0 then
    -- Update atómico: el lock de fila serializa golpes simultáneos, y solo el
    -- golpe que cruza a 0 HP ve `defeated_at` recién asignado.
    update public.bosses
    set current_hp = greatest(current_hp - v_damage, 0),
        defeated_at = case when current_hp - v_damage <= 0 then now() else null end,
        defeated_by = case when current_hp - v_damage <= 0 then v_uid else null end
    where id = v_boss.id and defeated_at is null
    returning * into v_boss;

    if not found then
      -- Otro jugador lo derrotó justo antes: no hubo daño real.
      v_damage := 0;
      update public.answers set damage_dealt = 0
      where user_id = v_uid and question_id = v_q.id and awarded;
      select * into v_boss from public.bosses where module_id = v_q.module_id;
    elsif v_boss.defeated_at is not null then
      v_final_blow := true;
      update public.modules set unlocked_at = coalesce(unlocked_at, now())
      where id = v_boss.unlocks_module_id;
      v_xp := v_xp + 100;
      update public.answers set xp_awarded = v_xp
      where user_id = v_uid and question_id = v_q.id and awarded;
    end if;
  end if;

  if v_xp > 0 then
    update public.profiles set total_xp = total_xp + v_xp where id = v_uid;
  end if;

  if v_final_blow then
    with ins as (
      insert into public.user_badges (user_id, badge_id)
      select v_uid, b.id from public.badges b where b.criterion ->> 'type' = 'final_blow'
      on conflict do nothing
      returning badge_id
    )
    select coalesce(array_agg(badge_id), '{}') into v_new_badges from ins;
    -- Todos los que dañaron al jefe reciben su emblema de jefe derrotado.
    for v_participant in
      select distinct a.user_id from public.answers a
      where a.module_id = v_q.module_id and a.damage_dealt > 0 and a.user_id <> v_uid
    loop
      perform public.evaluate_badges(v_participant);
    end loop;
  end if;

  v_new_badges := v_new_badges || coalesce(array(select public.evaluate_badges(v_uid)), '{}');

  return jsonb_build_object(
    'correct', v_correct,
    'correct_answer', v_q.correct_answer,
    'awarded', v_awarded,
    'xp_gained', v_xp,
    'damage_dealt', v_damage,
    'boss_hp', v_boss.current_hp,
    'boss_max_hp', v_boss.max_hp,
    'boss_defeated', v_boss.defeated_at is not null,
    'final_blow', v_final_blow,
    'unlocked_module_id', case when v_final_blow then v_boss.unlocks_module_id end,
    'new_badges', to_jsonb(v_new_badges)
  );
end;
$$;

-- Estado de la campaña para el usuario actual: desbloqueo, progreso y Códice.
create or replace function public.get_campaign()
returns table (
  module_id integer,
  unlocked boolean,
  question_count integer,
  answered_count integer,
  codex_read boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    m.id,
    (m.initially_unlocked or m.unlocked_at is not null),
    (select count(*)::integer from public.questions q where q.module_id = m.id),
    (select count(*)::integer from public.answers a
      where a.module_id = m.id and a.user_id = auth.uid() and a.awarded),
    exists (select 1 from public.codex_reads c where c.module_id = m.id and c.user_id = auth.uid())
  from public.modules m
  order by m.id;
$$;

-- Ranking de XP del mes calendario actual (zona horaria de Chile).
create or replace function public.get_monthly_leaderboard(p_limit integer default 50)
returns table (
  rank bigint,
  user_id uuid,
  display_name text,
  avatar_url text,
  rpg_class text,
  monthly_xp bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with month_xp as (
    select a.user_id, sum(a.xp_awarded)::bigint as xp
    from public.answers a
    where a.xp_awarded > 0
      and a.answered_at >= date_trunc('month', now() at time zone 'America/Santiago') at time zone 'America/Santiago'
    group by a.user_id
  )
  select
    rank() over (order by mx.xp desc),
    p.id,
    p.display_name,
    p.avatar_url,
    p.rpg_class,
    mx.xp
  from month_xp mx
  join public.profiles p on p.id = mx.user_id
  order by mx.xp desc, p.display_name
  limit least(greatest(p_limit, 1), 200);
$$;

-- Admin: métricas globales del juego.
create or replace function public.admin_overview()
returns table (
  players bigint,
  answers bigint,
  correct_answers bigint,
  bosses_defeated bigint,
  bosses_total bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo admin' using errcode = '42501';
  end if;
  return query
  select
    (select count(*) from public.profiles),
    (select count(*) from public.answers),
    (select count(*) from public.answers where is_correct),
    (select count(*) from public.bosses where defeated_at is not null),
    (select count(*) from public.bosses);
end;
$$;

-- Admin: tasa de acierto por pregunta (para detectar preguntas difíciles o mal redactadas).
create or replace function public.admin_question_stats()
returns table (
  question_id text,
  module_id integer,
  prompt text,
  attempts bigint,
  correct bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo admin' using errcode = '42501';
  end if;
  return query
  select q.id, q.module_id, q.prompt, count(a.id), count(a.id) filter (where a.is_correct)
  from public.questions q
  left join public.answers a on a.question_id = q.id
  group by q.id, q.module_id, q.prompt
  order by q.module_id, q.id;
end;
$$;

-- Admin: reinicia el HP de un jefe. El módulo que ya desbloqueó sigue abierto.
create or replace function public.admin_reset_boss(p_boss_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo admin' using errcode = '42501';
  end if;
  update public.bosses
  set current_hp = max_hp, defeated_at = null, defeated_by = null
  where id = p_boss_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.admin_emails enable row level security;
alter table public.profiles     enable row level security;
alter table public.modules      enable row level security;
alter table public.questions    enable row level security;
alter table public.bosses       enable row level security;
alter table public.codex_reads  enable row level security;
alter table public.answers      enable row level security;
alter table public.badges       enable row level security;
alter table public.user_badges  enable row level security;

-- admin_emails: sin políticas → inaccesible desde el cliente.

-- profiles: cada uno ve y edita su perfil; el admin ve todos.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Solo estas columnas son editables por el usuario (XP y email no).
revoke update on public.profiles from anon, authenticated;
grant update (display_name, avatar_url, rpg_class) on public.profiles to authenticated;

-- Contenido: lectura para usuarios autenticados, escritura solo admin.
drop policy if exists modules_select on public.modules;
create policy modules_select on public.modules
  for select to authenticated using (true);
drop policy if exists modules_admin on public.modules;
create policy modules_admin on public.modules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- questions: SOLO admin (los jugadores usan get_module_questions / answer_question).
drop policy if exists questions_admin on public.questions;
create policy questions_admin on public.questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists bosses_select on public.bosses;
create policy bosses_select on public.bosses
  for select to authenticated using (true);
drop policy if exists bosses_admin on public.bosses;
create policy bosses_admin on public.bosses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists badges_select on public.badges;
create policy badges_select on public.badges
  for select to authenticated using (true);
drop policy if exists badges_admin on public.badges;
create policy badges_admin on public.badges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Progreso: cada usuario lee lo suyo; escritura solo vía RPC.
drop policy if exists codex_reads_select on public.codex_reads;
create policy codex_reads_select on public.codex_reads
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists answers_select on public.answers;
create policy answers_select on public.answers
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists user_badges_select on public.user_badges;
create policy user_badges_select on public.user_badges
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- -----------------------------------------------------------------------------
-- Permisos de funciones
-- -----------------------------------------------------------------------------

revoke execute on function public.evaluate_badges(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

revoke execute on function public.mark_codex_read(integer) from public, anon;
revoke execute on function public.get_module_questions(integer) from public, anon;
revoke execute on function public.answer_question(text, text) from public, anon;
revoke execute on function public.get_monthly_leaderboard(integer) from public, anon;
revoke execute on function public.get_campaign() from public, anon;
revoke execute on function public.admin_reset_boss(text) from public, anon;
revoke execute on function public.admin_overview() from public, anon;
revoke execute on function public.admin_question_stats() from public, anon;

grant execute on function public.mark_codex_read(integer) to authenticated;
grant execute on function public.get_module_questions(integer) to authenticated;
grant execute on function public.answer_question(text, text) to authenticated;
grant execute on function public.get_monthly_leaderboard(integer) to authenticated;
grant execute on function public.get_campaign() to authenticated;
grant execute on function public.admin_reset_boss(text) to authenticated;
grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_question_stats() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_module_unlocked(integer) to authenticated;
grant select on public.module_status to authenticated;

-- -----------------------------------------------------------------------------
-- Realtime: el HP del jefe se actualiza en vivo para toda la comunidad
-- -----------------------------------------------------------------------------

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bosses'
     ) then
    alter publication supabase_realtime add table public.bosses;
  end if;
end;
$$;

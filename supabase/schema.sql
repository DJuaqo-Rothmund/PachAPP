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
  rpg_class text check (rpg_class in ('brujo', 'paladin', 'druida', 'picaro', 'artifice', 'alquimista', 'cultivador', 'guardian')),
  total_xp integer not null default 0,
  created_at timestamptz not null default now()
);

-- Bases creadas antes de las últimas clases: se reemplaza el check con la lista vigente.
alter table public.profiles drop constraint if exists profiles_rpg_class_check;
alter table public.profiles add constraint profiles_rpg_class_check
  check (rpg_class in ('brujo', 'paladin', 'druida', 'picaro', 'artifice', 'alquimista', 'cultivador', 'guardian'));

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

-- Batallas semanales: una por jugador, jefe y semana (ver "Boss Raid semanal").
create table if not exists public.raid_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  boss_id text not null references public.bosses (id) on delete cascade,
  module_id integer not null references public.modules (id) on delete cascade,
  week_start date not null,
  question_ids text[] not null,
  answered_ids text[] not null default '{}',
  correct_count integer not null default 0,
  damage_dealt integer not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (user_id, boss_id, week_start)
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
-- Batalla a la que pertenece la respuesta (null = entrenamiento).
alter table public.answers
  add column if not exists raid_session_id bigint references public.raid_sessions (id) on delete set null;

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
-- Campaña de 13 módulos: submódulos con subjefe individual y Códices con video
-- -----------------------------------------------------------------------------

-- Módulos retirados (p. ej. el antiguo "Fundamentos"): se conservan con su
-- historial pero no se muestran ni se pueden jugar.
alter table public.modules add column if not exists archived boolean not null default false;

-- Las FK hacia modules y bosses propagan cambios de id (renumeración segura).
do $$
declare
  fk record;
begin
  for fk in
    select * from (values
      ('questions',     'module_id',         'modules', 'cascade'),
      ('bosses',        'module_id',         'modules', 'cascade'),
      ('bosses',        'unlocks_module_id', 'modules', 'set null'),
      ('codex_reads',   'module_id',         'modules', 'cascade'),
      ('raid_sessions', 'module_id',         'modules', 'cascade'),
      ('raid_sessions', 'boss_id',           'bosses',  'cascade'),
      ('answers',       'module_id',         'modules', 'cascade')
    ) as t(tbl, col, ref, on_delete)
  loop
    execute format('alter table public.%I drop constraint if exists %I', fk.tbl, fk.tbl || '_' || fk.col || '_fkey');
    execute format(
      'alter table public.%I add constraint %I foreign key (%I) references public.%I (id) on update cascade on delete %s',
      fk.tbl, fk.tbl || '_' || fk.col || '_fkey', fk.col, fk.ref, fk.on_delete
    );
  end loop;
end $$;

-- Migración desde la campaña de 3 módulos (0 Fundamentos, 1 Cranberry, 2 Frambuesa):
-- Cranberry pasa a M7 y Frambuesa a M8 conservando preguntas, respuestas, lecturas,
-- raids y el HP de sus jefes; Fundamentos queda archivado. Solo corre una vez.
do $$
begin
  if exists (select 1 from public.modules where id = 1 and slug = 'cranberry')
     and not exists (select 1 from public.modules where id in (7, 8)) then
    update public.modules set id = 7 where id = 1;
    update public.modules set id = 8 where id = 2 and slug = 'frambuesa';
    update public.bosses set id = 'boss-cranberry' where id = 'boss-m1';
    update public.bosses set id = 'boss-frambuesa' where id = 'boss-m2';
    update public.modules set archived = true where id = 0;
    update public.bosses set unlocks_module_id = null where module_id = 0;
  end if;
end $$;

create table if not exists public.submodules (
  id text primary key,
  module_id integer not null references public.modules (id) on update cascade on delete cascade,
  sort_order integer not null,
  title text not null,
  description text not null default '',
  -- Subjefe individual: cada jugador lo enfrenta por su cuenta (ver submodule_progress).
  subboss_name text not null,
  subboss_title text not null default '',
  subboss_max_hp integer not null default 40 check (subboss_max_hp > 0),
  subboss_damage_per_hit integer not null default 10 check (subboss_damage_per_hit > 0),
  created_at timestamptz not null default now(),
  unique (module_id, sort_order)
);
create index if not exists submodules_module_idx on public.submodules (module_id, sort_order);

-- Valida los checkpoints interactivos de un Códice:
-- [{ "id", "timestamp_seconds", "prompt", "options": [...], "correct_index", "explanation" }]
create or replace function public.codex_checkpoints_valid(p jsonb)
returns boolean
language sql
immutable
as $$
  select jsonb_typeof(p) = 'array' and not exists (
    select 1 from jsonb_array_elements(p) cp
    where jsonb_typeof(cp -> 'id') is distinct from 'string'
       or jsonb_typeof(cp -> 'timestamp_seconds') is distinct from 'number'
       or (cp ->> 'timestamp_seconds')::numeric < 0
       or jsonb_typeof(cp -> 'prompt') is distinct from 'string'
       or jsonb_typeof(cp -> 'options') is distinct from 'array'
       or jsonb_array_length(cp -> 'options') < 2
       or jsonb_typeof(cp -> 'correct_index') is distinct from 'number'
       or (cp ->> 'correct_index')::int not between 0 and jsonb_array_length(cp -> 'options') - 1
  );
$$;

create table if not exists public.codices (
  id text primary key,
  submodule_id text not null unique references public.submodules (id) on delete cascade,
  title text not null,
  -- Texto estructurado: [{ "heading": "...", "body": ["párrafo", ...] }, ...]
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  -- Video opcional; los checkpoints pausan el video en `timestamp_seconds`.
  video_url text,
  video_duration_seconds integer check (video_duration_seconds > 0),
  interactive_checkpoints jsonb not null default '[]'::jsonb
    check (public.codex_checkpoints_valid(interactive_checkpoints)),
  updated_at timestamptz not null default now()
);

-- Las preguntas de un submódulo alimentan a su subjefe y al pool del jefe cooperativo.
alter table public.questions
  add column if not exists submodule_id text references public.submodules (id) on delete set null;
create index if not exists questions_submodule_idx on public.questions (submodule_id);

-- Progreso individual de cada jugador por submódulo (lo escriben solo funciones del servidor).
create table if not exists public.submodule_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  submodule_id text not null references public.submodules (id) on delete cascade,
  codex_read_at timestamptz,
  checkpoints_passed text[] not null default '{}',
  subboss_damage integer not null default 0 check (subboss_damage >= 0),
  subboss_defeated_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, submodule_id)
);
create index if not exists submodule_progress_submodule_idx on public.submodule_progress (submodule_id);

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
    where id = p_module_id and not archived and (initially_unlocked or unlocked_at is not null)
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
from public.modules m
where not m.archived;

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

-- -----------------------------------------------------------------------------
-- Boss Raid semanal
-- -----------------------------------------------------------------------------
-- Cada jugador tiene UNA batalla por semana contra cada jefe, de máximo 15
-- preguntas (14 al azar del banco + la pregunta final del jefe). Solo los aciertos
-- dentro de la batalla dañan al jefe: así derrotarlo exige a la comunidad.
-- La semana va de lunes a domingo, hora de Chile.

create or replace function public.raid_question_limit()
returns integer
language sql
immutable
as $$ select 15 $$;

create or replace function public.current_raid_week()
returns date
language sql
stable
as $$ select date_trunc('week', now() at time zone 'America/Santiago')::date $$;

-- Momento en que vuelve a estar disponible la batalla (próximo lunes 00:00, Chile).
create or replace function public.next_raid_reset()
returns timestamptz
language sql
stable
as $$ select (public.current_raid_week() + 7)::timestamp at time zone 'America/Santiago' $$;

-- Preguntas pendientes de una batalla, con alternativas barajadas y sin la correcta.
create or replace function public.raid_pending_questions(p_session public.raid_sessions)
returns jsonb
language sql
volatile
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id,
    'prompt', q.prompt,
    'options', to_jsonb(array(
      select opt from unnest(array_append(q.distractors, q.correct_answer)) as opt order by random()
    )),
    'is_boss_final', q.is_boss_final,
    'already_answered', false
  ) order by ids.ord), '[]'::jsonb)
  from unnest(p_session.question_ids) with ordinality as ids(id, ord)
  join public.questions q on q.id = ids.id
  where not (ids.id = any (p_session.answered_ids));
$$;

-- Inicia (o retoma) la batalla semanal contra el jefe del módulo.
create or replace function public.start_raid(p_module_id integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_boss public.bosses;
  v_session public.raid_sessions;
  v_week date := public.current_raid_week();
  v_final text;
  v_ids text[];
begin
  if v_uid is null then
    raise exception 'No autenticado' using errcode = '28000';
  end if;
  if not public.is_module_unlocked(p_module_id) then
    raise exception 'Módulo bloqueado' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.codex_reads where user_id = v_uid and module_id = p_module_id) then
    raise exception 'Debes leer el Códice antes de jugar' using errcode = 'P0001';
  end if;

  select * into v_boss from public.bosses where module_id = p_module_id;
  if not found then
    raise exception 'Este módulo no tiene jefe' using errcode = 'P0002';
  end if;
  if v_boss.defeated_at is not null then
    raise exception 'El jefe ya fue derrotado' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.questions where module_id = p_module_id and not is_boss_final) then
    raise exception 'Este módulo aún no tiene preguntas' using errcode = 'P0001';
  end if;

  select * into v_session from public.raid_sessions
  where user_id = v_uid and boss_id = v_boss.id and week_start = v_week;

  if found and v_session.finished_at is not null then
    raise exception 'Ya combatiste contra este jefe esta semana' using errcode = 'P0001';
  end if;

  if not found then
    select id into v_final from public.questions
    where module_id = p_module_id and is_boss_final
    order by sort_order limit 1;

    v_ids := array(
      select id from public.questions
      where module_id = p_module_id and not is_boss_final
      order by random()
      limit public.raid_question_limit() - (case when v_final is null then 0 else 1 end)
    );
    if v_final is not null then
      v_ids := array_append(v_ids, v_final);  -- el ataque especial siempre al final
    end if;
    if coalesce(array_length(v_ids, 1), 0) = 0 then
      raise exception 'Este módulo no tiene preguntas' using errcode = 'P0002';
    end if;

    -- on conflict: dos pestañas iniciando a la vez comparten la misma batalla.
    insert into public.raid_sessions (user_id, boss_id, module_id, week_start, question_ids)
    values (v_uid, v_boss.id, p_module_id, v_week, v_ids)
    on conflict (user_id, boss_id, week_start) do nothing;

    select * into v_session from public.raid_sessions
    where user_id = v_uid and boss_id = v_boss.id and week_start = v_week;
  end if;

  return jsonb_build_object(
    'session_id', v_session.id,
    'total', array_length(v_session.question_ids, 1),
    'answered', coalesce(array_length(v_session.answered_ids, 1), 0),
    'correct', v_session.correct_count,
    'damage', v_session.damage_dealt,
    'questions', public.raid_pending_questions(v_session)
  );
end;
$$;

-- Responde una pregunta. Valida en el servidor y registra el intento.
--  * XP: solo el primer acierto de cada usuario en cada pregunta (10, final 50).
--  * Daño al jefe: solo los aciertos dentro de la batalla semanal (p_raid_session_id).
--    La pregunta final pega x5. El golpe que deja al jefe en 0 HP es el golpe final
--    (+100 XP) y desbloquea el siguiente módulo.
drop function if exists public.answer_question(text, text);
create or replace function public.answer_question(
  p_question_id text,
  p_answer text,
  p_raid_session_id bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_q public.questions;
  v_boss public.bosses;
  v_session public.raid_sessions;
  v_correct boolean;
  v_awarded boolean := false;
  v_xp integer := 0;
  v_damage integer := 0;
  v_answer_id bigint;
  v_final_blow boolean := false;
  v_raid_finished boolean := false;
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

  if p_raid_session_id is not null then
    -- for update: serializa respuestas simultáneas a la misma batalla.
    select * into v_session from public.raid_sessions
    where id = p_raid_session_id and user_id = v_uid
    for update;
    if not found then
      raise exception 'Batalla no encontrada' using errcode = 'P0002';
    end if;
    if v_session.week_start <> public.current_raid_week() or v_session.finished_at is not null then
      raise exception 'Esta batalla ya terminó' using errcode = 'P0001';
    end if;
    if not (v_q.id = any (v_session.question_ids)) then
      raise exception 'La pregunta no pertenece a esta batalla' using errcode = 'P0001';
    end if;
    if v_q.id = any (v_session.answered_ids) then
      raise exception 'Ya respondiste esta pregunta en la batalla' using errcode = 'P0001';
    end if;
  end if;

  v_correct := trim(p_answer) = trim(v_q.correct_answer);
  select * into v_boss from public.bosses where module_id = v_q.module_id;

  if v_correct and v_session.id is not null and v_boss.id is not null and v_boss.defeated_at is null then
    v_damage := case when v_q.is_boss_final then v_boss.damage_per_hit * 5 else v_boss.damage_per_hit end;
  end if;

  if v_correct then
    v_xp := case when v_q.is_boss_final then 50 else 10 end;
    insert into public.answers (user_id, question_id, module_id, is_correct, awarded, xp_awarded, damage_dealt, raid_session_id)
    values (v_uid, v_q.id, v_q.module_id, true, true, v_xp, v_damage, v_session.id)
    on conflict (user_id, question_id) where awarded do nothing
    returning id into v_answer_id;
    v_awarded := v_answer_id is not null;
  end if;

  if not v_awarded then
    -- Error, o acierto repetido: sin XP (cuenta para rachas; en batalla igual daña).
    v_xp := 0;
    insert into public.answers (user_id, question_id, module_id, is_correct, damage_dealt, raid_session_id)
    values (v_uid, v_q.id, v_q.module_id, v_correct, v_damage, v_session.id)
    returning id into v_answer_id;
  end if;

  if v_damage > 0 then
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
      update public.answers set damage_dealt = 0 where id = v_answer_id;
      select * into v_boss from public.bosses where module_id = v_q.module_id;
    elsif v_boss.defeated_at is not null then
      v_final_blow := true;
      update public.modules set unlocked_at = coalesce(unlocked_at, now())
      where id = v_boss.unlocks_module_id;
      v_xp := v_xp + 100;
      update public.answers set xp_awarded = xp_awarded + 100 where id = v_answer_id;
    end if;
  end if;

  if v_session.id is not null then
    update public.raid_sessions
    set answered_ids = array_append(answered_ids, v_q.id),
        correct_count = correct_count + (case when v_correct then 1 else 0 end),
        damage_dealt = damage_dealt + v_damage,
        finished_at = case
          when coalesce(array_length(answered_ids, 1), 0) + 1 >= array_length(question_ids, 1) then now()
        end
    where id = v_session.id
    returning finished_at is not null into v_raid_finished;
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
    'raid_finished', v_raid_finished,
    'new_badges', to_jsonb(v_new_badges)
  );
end;
$$;

-- Estado de la campaña para el usuario actual: desbloqueo, progreso, Códice y
-- estado de la batalla semanal ('available' | 'in_progress' | 'done' | 'defeated' | 'none').
drop function if exists public.get_campaign();
create or replace function public.get_campaign()
returns table (
  module_id integer,
  unlocked boolean,
  question_count integer,
  answered_count integer,
  codex_read boolean,
  raid_status text,
  raid_answered integer,
  raid_total integer,
  raid_next_reset timestamptz
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
    exists (select 1 from public.codex_reads c where c.module_id = m.id and c.user_id = auth.uid()),
    case
      when b.id is null then 'none'
      when b.defeated_at is not null then 'defeated'
      when s.id is null then 'available'
      when s.finished_at is not null then 'done'
      else 'in_progress'
    end,
    coalesce(array_length(s.answered_ids, 1), 0),
    coalesce(array_length(s.question_ids, 1),
      least(public.raid_question_limit(), (select count(*)::integer from public.questions q where q.module_id = m.id))),
    public.next_raid_reset()
  from public.modules m
  left join public.bosses b on b.module_id = m.id
  left join public.raid_sessions s
    on s.boss_id = b.id and s.user_id = auth.uid() and s.week_start = public.current_raid_week()
  where not m.archived
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
alter table public.raid_sessions enable row level security;
alter table public.submodules    enable row level security;
alter table public.codices       enable row level security;
alter table public.submodule_progress enable row level security;

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
  for select to authenticated using (not archived or public.is_admin());
drop policy if exists modules_admin on public.modules;
create policy modules_admin on public.modules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- questions: SOLO admin (los jugadores usan get_module_questions / answer_question).
drop policy if exists questions_admin on public.questions;
create policy questions_admin on public.questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Submódulos y Códices: lectura para jugadores (solo de módulos vigentes), escritura solo admin.
-- Los checkpoints incluyen su respuesta: son de práctica y no dan XP ni daño.
drop policy if exists submodules_select on public.submodules;
create policy submodules_select on public.submodules
  for select to authenticated using (
    public.is_admin() or exists (select 1 from public.modules m where m.id = module_id and not m.archived)
  );
drop policy if exists submodules_admin on public.submodules;
create policy submodules_admin on public.submodules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists codices_select on public.codices;
create policy codices_select on public.codices
  for select to authenticated using (
    public.is_admin() or exists (
      select 1 from public.submodules sm join public.modules m on m.id = sm.module_id
      where sm.id = submodule_id and not m.archived
    )
  );
drop policy if exists codices_admin on public.codices;
create policy codices_admin on public.codices
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Progreso por submódulo: cada jugador ve el suyo (admin, todos). Sin políticas de
-- escritura: solo lo modifican funciones security definer del servidor.
drop policy if exists submodule_progress_select on public.submodule_progress;
create policy submodule_progress_select on public.submodule_progress
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

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

drop policy if exists raid_sessions_select on public.raid_sessions;
create policy raid_sessions_select on public.raid_sessions
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
revoke execute on function public.answer_question(text, text, bigint) from public, anon;
revoke execute on function public.start_raid(integer) from public, anon;
revoke execute on function public.raid_pending_questions(public.raid_sessions) from public, anon, authenticated;
revoke execute on function public.get_monthly_leaderboard(integer) from public, anon;
revoke execute on function public.get_campaign() from public, anon;
revoke execute on function public.admin_reset_boss(text) from public, anon;
revoke execute on function public.admin_overview() from public, anon;
revoke execute on function public.admin_question_stats() from public, anon;

grant execute on function public.mark_codex_read(integer) to authenticated;
grant execute on function public.get_module_questions(integer) to authenticated;
grant execute on function public.answer_question(text, text, bigint) to authenticated;
grant execute on function public.start_raid(integer) to authenticated;
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

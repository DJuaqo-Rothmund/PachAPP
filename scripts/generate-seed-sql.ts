/**
 * Genera supabase/seed.sql a partir de src/data/seed.ts (fuente única de verdad).
 *
 *   npm run db:seed-sql
 *
 * Los correos admin se toman de ADMIN_EMAILS (separados por coma).
 * El SQL resultante es re-ejecutable: actualiza el contenido sin tocar el HP
 * ni el estado de derrota de los jefes.
 */
import { BADGES, MODULES } from '../src/data/seed.ts'
import type { Codex, Question } from '../src/data/types.ts'
import { encounterForModule } from '../src/data/encounters.ts'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'joaquin.rothmund@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

const str = (s: string) => `'${s.replace(/'/g, "''")}'`
const json = (v: unknown) => `${str(JSON.stringify(v))}::jsonb`
const textArray = (items: string[]) => `array[${items.map(str).join(', ')}]::text[]`
const nullable = (v: string | number | null) => (v === null ? 'null' : typeof v === 'number' ? String(v) : str(v))

const out: string[] = []
const emit = (line = '') => out.push(line)

emit('-- =============================================================================')
emit('-- Pachapp · Datos semilla')
emit('-- ARCHIVO GENERADO por scripts/generate-seed-sql.ts — no editar a mano.')
emit('-- Ejecutar después de supabase/schema.sql.')
emit('-- =============================================================================')
emit()
emit('begin;')
emit()

emit('-- Administradores')
for (const email of ADMIN_EMAILS) {
  emit(`insert into public.admin_emails (email) values (${str(email)}) on conflict do nothing;`)
}
emit()

emit('-- Módulos')
for (const m of MODULES) {
  const enc = encounterForModule(m.id)
  emit(
    `insert into public.modules (id, slug, title, summary, initially_unlocked, codex, bg_theme, sprite_url) values (` +
      `${m.id}, ${str(m.slug)}, ${str(m.title)}, ${str(m.summary)}, ${m.initiallyUnlocked}, ${json(m.codex)}, ` +
      `${str(enc.bgTheme)}, ${nullable(enc.spriteUrl)})`,
  )
  emit(
    '  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,' +
      ' initially_unlocked = excluded.initially_unlocked, codex = excluded.codex, bg_theme = excluded.bg_theme,' +
      // Una imagen ya conectada en la base de datos no se pisa con un null del seed.
      ' sprite_url = coalesce(excluded.sprite_url, public.modules.sprite_url);',
  )
}
emit()

emit('-- Submódulos con su subjefe individual')
for (const m of MODULES) {
  for (const sm of m.submodules) {
    const b = sm.subboss
    emit(
      `insert into public.submodules (id, module_id, sort_order, title, description, subboss_name, subboss_title, subboss_max_hp, subboss_damage_per_hit) values (` +
        `${str(sm.id)}, ${m.id}, ${sm.order}, ${str(sm.title)}, ${str(sm.description)}, ${str(b.name)}, ${str(b.title)}, ${b.maxHp}, ${b.damagePerHit})`,
    )
    emit(
      '  on conflict (id) do update set module_id = excluded.module_id, sort_order = excluded.sort_order, title = excluded.title,' +
        ' description = excluded.description, subboss_name = excluded.subboss_name, subboss_title = excluded.subboss_title,' +
        ' subboss_max_hp = excluded.subboss_max_hp, subboss_damage_per_hit = excluded.subboss_damage_per_hit;',
    )
  }
}
emit()

emit('-- Códices de submódulo (texto, video opcional y checkpoints interactivos)')
const checkpointsJson = (codex: Codex) =>
  codex.checkpoints.map((cp) => ({
    id: cp.id,
    timestamp_seconds: cp.timestampSeconds,
    prompt: cp.prompt,
    options: cp.options,
    correct_index: cp.correctIndex,
    explanation: cp.explanation,
  }))
for (const m of MODULES) {
  for (const sm of m.submodules) {
    const c = sm.codex
    emit(
      `insert into public.codices (id, submodule_id, title, sections, video_url, video_duration_seconds, interactive_checkpoints) values (` +
        `${str(c.id)}, ${str(sm.id)}, ${str(c.title)}, ${json(c.sections)}, ${nullable(c.videoUrl)}, ${nullable(c.videoDurationSeconds)}, ${json(checkpointsJson(c))})`,
    )
    emit(
      '  on conflict (id) do update set submodule_id = excluded.submodule_id, title = excluded.title, sections = excluded.sections,' +
        ' video_url = excluded.video_url, video_duration_seconds = excluded.video_duration_seconds,' +
        ' interactive_checkpoints = excluded.interactive_checkpoints, updated_at = now();',
    )
  }
}
emit()

emit('-- Preguntas')
const questionRow = (moduleId: number, submoduleId: string | null, q: Question, sortOrder: number, isBossFinal: boolean) =>
  `  (${str(q.id)}, ${moduleId}, ${nullable(submoduleId)}, ${str(q.prompt)}, ${str(q.correct)}, ${textArray(q.distractors)}, ${isBossFinal}, ${sortOrder})`

const questionRows = MODULES.flatMap((m) => {
  const submoduleOf = new Map(m.submodules.flatMap((sm) => sm.questions.map((q) => [q.id, sm.id] as const)))
  return [
    ...m.questions.map((q, i) => questionRow(m.id, submoduleOf.get(q.id) ?? null, q, i + 1, false)),
    ...(m.boss.finalQuestion ? [questionRow(m.id, null, m.boss.finalQuestion, 999, true)] : []),
  ]
})
emit(
  'insert into public.questions (id, module_id, submodule_id, prompt, correct_answer, distractors, is_boss_final, sort_order) values',
)
emit(questionRows.join(',\n'))
emit(
  'on conflict (id) do update set module_id = excluded.module_id, submodule_id = excluded.submodule_id, prompt = excluded.prompt,' +
    ' correct_answer = excluded.correct_answer, distractors = excluded.distractors,' +
    ' is_boss_final = excluded.is_boss_final, sort_order = excluded.sort_order;',
)
// Preguntas de un submódulo de la campaña que ya no están en el seed (submódulo reescrito):
// se retiran. Las preguntas creadas desde el admin no tienen submódulo y no se tocan.
const seededSubmodules = MODULES.flatMap((m) => m.submodules.map((sm) => sm.id))
const seededQuestions = MODULES.flatMap((m) =>
  [...m.questions, ...(m.boss.finalQuestion ? [m.boss.finalQuestion] : [])].map((q) => q.id),
)
emit('-- Preguntas retiradas de submódulos reescritos, y combates en curso que las usaban.')
emit(
  `delete from public.questions where submodule_id = any (${textArray(seededSubmodules)}) and not (id = any (${textArray(seededQuestions)}));`,
)
emit(
  "update public.submodule_progress sp set fight_question_ids = '{}', fight_answered_ids = '{}', subboss_damage = 0" +
    ' where sp.subboss_defeated_at is null and exists (select 1 from unnest(sp.fight_question_ids) i' +
    ' where not exists (select 1 from public.questions q where q.id = i));',
)
emit(
  'update public.raid_sessions rs set question_ids = array(select i from unnest(rs.question_ids) i' +
    ' where exists (select 1 from public.questions q where q.id = i)),' +
    ' answered_ids = array(select i from unnest(rs.answered_ids) i where exists (select 1 from public.questions q where q.id = i))' +
    ' where exists (select 1 from unnest(rs.question_ids) i where not exists (select 1 from public.questions q where q.id = i));',
)
emit('-- Las respuestas siguen a su pregunta si esta cambió de módulo.')
emit(
  'update public.answers a set module_id = q.module_id from public.questions q where q.id = a.question_id and a.module_id <> q.module_id;',
)
emit()

emit('-- Jefes (el HP actual y la derrota se preservan al re-ejecutar)')
for (const m of MODULES) {
  const b = m.boss
  emit(
    `insert into public.bosses (id, module_id, name, title, max_hp, current_hp, damage_per_hit, final_question_id, unlocks_module_id) values (` +
      `${str(b.id)}, ${m.id}, ${str(b.name)}, ${str(b.title)}, ${b.maxHp}, ${b.maxHp}, ${b.damagePerHit}, ` +
      `${nullable(b.finalQuestion?.id ?? null)}, ${nullable(b.unlocksModuleId)})`,
  )
  emit(
    '  on conflict (id) do update set module_id = excluded.module_id, name = excluded.name, title = excluded.title,' +
      // Si cambia el HP máximo de un jefe vivo, su HP actual sube o baja en la misma cantidad.
      ' current_hp = case when public.bosses.defeated_at is null' +
      ' then greatest(1, least(excluded.max_hp, public.bosses.current_hp + excluded.max_hp - public.bosses.max_hp))' +
      ' else public.bosses.current_hp end,' +
      ' max_hp = excluded.max_hp, damage_per_hit = excluded.damage_per_hit,' +
      ' final_question_id = excluded.final_question_id, unlocks_module_id = excluded.unlocks_module_id;',
  )
}
emit()

emit('-- Emblemas')
for (const b of BADGES) {
  emit(
    `insert into public.badges (id, name, description, icon, criterion) values (` +
      `${str(b.id)}, ${str(b.name)}, ${str(b.description)}, ${str(b.icon)}, ${json(b.criterion)})`,
  )
  emit(
    '  on conflict (id) do update set name = excluded.name, description = excluded.description,' +
      ' icon = excluded.icon, criterion = excluded.criterion;',
  )
}
emit()
emit('commit;')

process.stdout.write(out.join('\n') + '\n')

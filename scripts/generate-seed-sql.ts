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
import type { Question } from '../src/data/types.ts'

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
  emit(
    `insert into public.modules (id, slug, title, summary, initially_unlocked, codex) values (` +
      `${m.id}, ${str(m.slug)}, ${str(m.title)}, ${str(m.summary)}, ${m.initiallyUnlocked}, ${json(m.codex)})`,
  )
  emit(
    '  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary,' +
      ' initially_unlocked = excluded.initially_unlocked, codex = excluded.codex;',
  )
}
emit()

emit('-- Preguntas')
const questionRow = (moduleId: number, q: Question, sortOrder: number, isBossFinal: boolean) =>
  `  (${str(q.id)}, ${moduleId}, ${str(q.prompt)}, ${str(q.correct)}, ${textArray(q.distractors)}, ${isBossFinal}, ${sortOrder})`

const questionRows = MODULES.flatMap((m) => [
  ...m.questions.map((q, i) => questionRow(m.id, q, i + 1, false)),
  ...(m.boss.finalQuestion ? [questionRow(m.id, m.boss.finalQuestion, 999, true)] : []),
])
emit('insert into public.questions (id, module_id, prompt, correct_answer, distractors, is_boss_final, sort_order) values')
emit(questionRows.join(',\n'))
emit(
  'on conflict (id) do update set module_id = excluded.module_id, prompt = excluded.prompt,' +
    ' correct_answer = excluded.correct_answer, distractors = excluded.distractors,' +
    ' is_boss_final = excluded.is_boss_final, sort_order = excluded.sort_order;',
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

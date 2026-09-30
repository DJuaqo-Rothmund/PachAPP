/**
 * Genera supabase/batches.sql a partir de los lotes revisados en src/data/db/*.json
 * (creados por generate_questions.ts).
 *
 *   npm run db:batches-sql
 *
 * Ejecutar en Supabase después de schema.sql y seed.sql. Es re-ejecutable: si
 * editas un lote y vuelves a generar el SQL, las preguntas se actualizan por id.
 * Las preguntas nuevas entran de inmediato al pool aleatorio del Boss Raid.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { BatchFile } from '../generate_questions.ts'

const DIR = 'src/data/db'
const str = (s: string) => `'${s.replace(/'/g, "''")}'`
const textArray = (items: string[]) => `array[${items.map(str).join(', ')}]::text[]`

const files = existsSync(DIR)
  ? readdirSync(DIR)
      .filter((f) => /_batch_\d+\.json$/.test(f))
      .sort()
  : []

const rows = files.flatMap((f) => {
  const batch = JSON.parse(readFileSync(join(DIR, f), 'utf8')) as BatchFile
  return batch.questions.map(
    (q, i) =>
      `  (${str(q.id)}, ${batch.moduleId}, ${str(q.prompt)}, ${str(q.correct)}, ${textArray(q.distractors)}, false, ${batch.batch * 1000 + i + 1})`,
  )
})

const out = [
  '-- =============================================================================',
  '-- Pachapp · Preguntas generadas (lotes revisados)',
  '-- ARCHIVO GENERADO por scripts/batches-to-sql.ts — no editar a mano.',
  `-- Lotes: ${files.length ? files.join(', ') : '(ninguno)'}`,
  '-- =============================================================================',
  '',
]
if (rows.length) {
  out.push(
    'insert into public.questions (id, module_id, prompt, correct_answer, distractors, is_boss_final, sort_order) values',
    rows.join(',\n'),
    'on conflict (id) do update set module_id = excluded.module_id, prompt = excluded.prompt,' +
      ' correct_answer = excluded.correct_answer, distractors = excluded.distractors,' +
      ' sort_order = excluded.sort_order;',
  )
}
process.stdout.write(out.join('\n') + '\n')

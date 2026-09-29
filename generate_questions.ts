/**
 * Generador de preguntas para Pachapp con la API de Anthropic.
 *
 *   ANTHROPIC_API_KEY=sk-... npm run generate:questions -- --module cranberry --count 20 --batches 3
 *
 * Cada lote se guarda apenas llega, en src/data/db/<slug>_batch_<n>.json, así una
 * falla a mitad de camino no pierde los lotes anteriores. Las preguntas se
 * validan (3 distractores distintos de la respuesta) y se descartan las que
 * repiten un enunciado de la semilla o de lotes anteriores.
 *
 * Los lotes NO entran solos al juego: revísalos y luego ejecuta
 * `npm run db:batches-sql` para generar supabase/batches.sql.
 *
 * Opciones:
 *   --module <id|slug>   módulo (0 | fundamentos, 1 | cranberry, 2 | frambuesa). Obligatorio.
 *   --count <n>          preguntas por lote (por defecto 20, máx. 40).
 *   --batches <n>        cuántos lotes generar (por defecto 1).
 *   --effort <nivel>     low | medium | high | xhigh | max (por defecto high).
 *   --out <dir>          carpeta de salida (por defecto src/data/db).
 *   --dry-run            muestra el prompt sin llamar a la API.
 *   --from-file <json>   usa una respuesta guardada en vez de la API (pruebas sin red).
 */
import Anthropic from '@anthropic-ai/sdk'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { MODULES } from './src/data/seed.ts'
import type { Module } from './src/data/types.ts'

const MODEL = 'claude-opus-5-5'
const TOPICS = ['Fisiología', 'Riego de Precisión', 'Patología', 'Postcosecha'] as const
const DIFFICULTIES = ['básica', 'intermedia', 'avanzada'] as const
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'] as const
type Effort = (typeof EFFORTS)[number]

export interface GeneratedQuestion {
  id: string
  topic: (typeof TOPICS)[number]
  difficulty: (typeof DIFFICULTIES)[number]
  prompt: string
  correct: string
  distractors: [string, string, string]
  explanation: string
}

export interface BatchFile {
  moduleId: number
  slug: string
  batch: number
  model: string
  generatedAt: string
  questions: GeneratedQuestion[]
}

// Esquema de salida estructurada: la API garantiza JSON que lo cumple.
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          topic: { type: 'string', enum: [...TOPICS] },
          difficulty: { type: 'string', enum: [...DIFFICULTIES] },
          prompt: { type: 'string', description: 'Enunciado de la pregunta, en español de Chile.' },
          correct: { type: 'string', description: 'La única alternativa correcta.' },
          distractors: {
            type: 'array',
            items: { type: 'string' },
            description: 'Exactamente 3 alternativas incorrectas pero plausibles.',
          },
          explanation: { type: 'string', description: 'Por qué la respuesta es correcta, en 1-2 frases.' },
        },
        required: ['topic', 'difficulty', 'prompt', 'correct', 'distractors', 'explanation'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
  additionalProperties: false,
}

const SYSTEM_PROMPT = `Eres un agrónomo chileno senior y diseñador instruccional de Pachapp, un juego de aprendizaje para agrónomos de campo en el sur de Chile.
Escribes preguntas de selección múltiple para un "Boss Raid": cada pregunta tiene una sola respuesta correcta y tres distractores.

Criterios de calidad:
- Cubre cuatro ejes técnicos: Fisiología (fenología, horas frío, nutrición, relaciones fuente-sumidero), Riego de Precisión (tensiometría, capacidad de campo, ETc, fertirriego, drenaje), Patología (enfermedades, plagas, nematodos, virus, manejo integrado) y Postcosecha (cosecha, cadena de frío, firmeza, pudriciones, calidad de exportación).
- Reparte las preguntas de forma pareja entre los cuatro ejes y mezcla dificultades (básica, intermedia, avanzada), con énfasis en decisiones prácticas de campo.
- Usa como base el Códice del módulo que se entrega; puedes profundizar con conocimiento agronómico sólido y consensuado, pero nunca inventes cifras, productos ni normas.
- Los distractores deben ser plausibles para alguien que no estudió, del mismo largo y registro que la respuesta correcta, y claramente incorrectos para un experto. Evita "todas las anteriores", "ninguna de las anteriores" y dobles negaciones.
- No repitas preguntas ya existentes ni hagas variaciones triviales de ellas.
- Enunciados breves (máximo ~25 palabras) y alternativas de máximo ~15 palabras, en español neutro de Chile.`

function buildUserPrompt(module: Module, count: number, existingPrompts: string[]): string {
  const codex = module.codex
    .map((s) => `## ${s.heading}\n${s.body.map((p) => `- ${p}`).join('\n')}`)
    .join('\n\n')
  // Solo los enunciados más recientes, para no inflar el prompt indefinidamente.
  const avoid = existingPrompts.slice(-150).map((p) => `- ${p}`).join('\n')
  return `<modulo>
Módulo ${module.id}: ${module.title}
${module.summary}
</modulo>

<codice>
${codex}
</codice>

<preguntas_existentes>
${avoid || '(ninguna)'}
</preguntas_existentes>

Escribe ${count} preguntas nuevas para este módulo, repartidas entre Fisiología, Riego de Precisión, Patología y Postcosecha.`
}

function findModule(key: string): Module {
  const module = MODULES.find((m) => String(m.id) === key || m.slug === key.toLowerCase())
  if (!module) {
    throw new Error(`Módulo desconocido "${key}". Usa: ${MODULES.map((m) => `${m.id} | ${m.slug}`).join(', ')}`)
  }
  return module
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

function readBatches(outDir: string, slug: string): BatchFile[] {
  if (!existsSync(outDir)) return []
  return readdirSync(outDir)
    .filter((f) => new RegExp(`^${slug}_batch_\\d+\\.json$`).test(f))
    .map((f) => JSON.parse(readFileSync(join(outDir, f), 'utf8')) as BatchFile)
}

/** Valida una pregunta cruda; devuelve el motivo de rechazo o null. */
function rejectReason(q: Omit<GeneratedQuestion, 'id'>, seen: Set<string>): string | null {
  if (!q.prompt.trim() || !q.correct.trim()) return 'enunciado o respuesta vacíos'
  if (q.distractors.length !== 3) return `tiene ${q.distractors.length} distractores`
  const options = [q.correct, ...q.distractors].map(normalize)
  if (new Set(options).size !== 4) return 'alternativas repetidas'
  if (seen.has(normalize(q.prompt))) return 'enunciado duplicado'
  return null
}

async function requestQuestions(
  client: Anthropic,
  module: Module,
  count: number,
  effort: Effort,
  existingPrompts: string[],
): Promise<unknown> {
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ['server-side-fallback-2026-07-01'],
    // Si el modelo declina la solicitud, la API la reintenta con el modelo de respaldo recomendado.
    fallbacks: 'default',
    output_config: { effort, format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(module, count, existingPrompts) }],
  })
  const message = await stream.finalMessage()

  if (message.stop_reason === 'refusal') {
    throw new Error('El modelo declinó la solicitud (stop_reason: refusal).')
  }
  if (message.stop_reason === 'max_tokens') {
    throw new Error('La respuesta se cortó por max_tokens: prueba con un --count menor.')
  }
  const text = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
  console.log(`   tokens: ${message.usage.input_tokens} entrada / ${message.usage.output_tokens} salida · ${message.model}`)
  return JSON.parse(text)
}

async function main() {
  const { values } = parseArgs({
    options: {
      module: { type: 'string' },
      count: { type: 'string', default: '20' },
      batches: { type: 'string', default: '1' },
      effort: { type: 'string', default: 'high' },
      out: { type: 'string', default: 'src/data/db' },
      'dry-run': { type: 'boolean', default: false },
      'from-file': { type: 'string' },
    },
  })

  if (!values.module) throw new Error('Falta --module (ej. --module cranberry).')
  const module = findModule(values.module)
  const count = Number(values.count)
  const batches = Number(values.batches)
  const effort = values.effort as Effort
  if (!Number.isInteger(count) || count < 1 || count > 40) throw new Error('--count debe estar entre 1 y 40.')
  if (!Number.isInteger(batches) || batches < 1) throw new Error('--batches debe ser un entero positivo.')
  if (!EFFORTS.includes(effort)) throw new Error(`--effort debe ser uno de: ${EFFORTS.join(', ')}`)

  const outDir = values.out
  const previous = readBatches(outDir, module.slug)
  const existingPrompts = [
    ...module.questions.map((q) => q.prompt),
    ...(module.boss.finalQuestion ? [module.boss.finalQuestion.prompt] : []),
    ...previous.flatMap((b) => b.questions.map((q) => q.prompt)),
  ]

  if (values['dry-run']) {
    console.log(`Modelo: ${MODEL} · effort: ${effort}\n\n--- system ---\n${SYSTEM_PROMPT}\n\n--- user ---`)
    console.log(buildUserPrompt(module, count, existingPrompts))
    return
  }

  if (!values['from-file'] && !process.env.ANTHROPIC_API_KEY) {
    throw new Error('Define ANTHROPIC_API_KEY (o usa --from-file / --dry-run para probar sin la API).')
  }
  const client = values['from-file'] ? null : new Anthropic()
  let nextBatch = Math.max(0, ...previous.map((b) => b.batch)) + 1
  mkdirSync(outDir, { recursive: true })

  for (let i = 0; i < batches; i++, nextBatch++) {
    console.log(`→ ${module.slug}: lote ${nextBatch} (${count} preguntas)…`)
    const raw = client
      ? await requestQuestions(client, module, count, effort, existingPrompts)
      : JSON.parse(readFileSync(values['from-file']!, 'utf8'))
    const candidates = (raw as { questions: Omit<GeneratedQuestion, 'id'>[] }).questions

    const seen = new Set(existingPrompts.map(normalize))
    const accepted: GeneratedQuestion[] = []
    for (const q of candidates) {
      const reason = rejectReason(q, seen)
      if (reason) {
        console.warn(`   descartada (${reason}): ${q.prompt}`)
        continue
      }
      seen.add(normalize(q.prompt))
      accepted.push({
        id: `${module.slug}-b${nextBatch}-q${accepted.length + 1}`,
        topic: q.topic,
        difficulty: q.difficulty,
        prompt: q.prompt.trim(),
        correct: q.correct.trim(),
        distractors: q.distractors.map((d) => d.trim()) as [string, string, string],
        explanation: q.explanation.trim(),
      })
    }

    if (accepted.length === 0) {
      console.warn('   ✖ ninguna pregunta válida en este lote; no se guardó archivo.')
      nextBatch--
      continue
    }
    const file: BatchFile = {
      moduleId: module.id,
      slug: module.slug,
      batch: nextBatch,
      model: client ? MODEL : 'from-file',
      generatedAt: new Date().toISOString(),
      questions: accepted,
    }
    const path = join(outDir, `${module.slug}_batch_${nextBatch}.json`)
    writeFileSync(path, JSON.stringify(file, null, 2) + '\n')
    existingPrompts.push(...accepted.map((q) => q.prompt))
    console.log(`   ✔ ${accepted.length}/${candidates.length} preguntas guardadas en ${path}`)
  }
}

main().catch((err: unknown) => {
  if (err instanceof Anthropic.AuthenticationError) {
    console.error('API key inválida o ausente: define ANTHROPIC_API_KEY.')
  } else if (err instanceof Anthropic.RateLimitError) {
    console.error('Límite de uso alcanzado: espera un momento y reintenta (los lotes ya guardados se conservan).')
  } else if (err instanceof Anthropic.APIError) {
    console.error(`Error de la API (${err.status}): ${err.message}`)
  } else {
    console.error(err instanceof Error ? err.message : err)
  }
  process.exit(1)
})

import type { CodexSection, Question, Submodule } from '../types'

/** Pregunta escrita como tupla: enunciado, respuesta correcta y 3 distractores. */
export type QuestionTuple = [prompt: string, correct: string, distractors: [string, string, string]]

export interface SubmoduleSpec {
  order: number
  title: string
  description: string
  subboss: { name: string; title: string; maxHp?: number }
  codexTitle: string
  sections: CodexSection[]
  checkpoint: {
    /** Segundo del futuro video en que se pausa. */
    at: number
    prompt: string
    options: string[]
    correctIndex: number
    explanation: string
  }
  /** Tuplas (preguntas nuevas, id `m{módulo}-s{orden}-q{n}`) o preguntas ya existentes que conservan su id. */
  questions: Array<QuestionTuple | Question>
}

/**
 * Ayudantes para escribir un módulo de la campaña con ids estables:
 * submódulo `m{n}-s{orden}`, Códice `codex-m{n}-s{orden}`, checkpoint `m{n}-s{orden}-cp1`,
 * preguntas `m{n}-s{orden}-q{k}` y pregunta final del jefe `m{n}-boss`.
 */
export function campaignModule(moduleId: number) {
  function submodule(spec: SubmoduleSpec): Submodule {
    const id = `m${moduleId}-s${spec.order}`
    let n = 0
    return {
      id,
      order: spec.order,
      title: spec.title,
      description: spec.description,
      // Los subjefes intermedios tienen 40 HP; el último del módulo, 50.
      subboss: {
        name: spec.subboss.name,
        title: spec.subboss.title,
        maxHp: spec.subboss.maxHp ?? (spec.order === 5 ? 50 : 40),
        damagePerHit: 10,
      },
      codex: {
        id: `codex-${id}`,
        title: spec.codexTitle,
        videoUrl: null,
        videoDurationSeconds: null,
        sections: spec.sections,
        checkpoints: [
          {
            id: `${id}-cp1`,
            timestampSeconds: spec.checkpoint.at,
            prompt: spec.checkpoint.prompt,
            options: spec.checkpoint.options,
            correctIndex: spec.checkpoint.correctIndex,
            explanation: spec.checkpoint.explanation,
          },
        ],
      },
      questions: spec.questions.map((item) => {
        if (!Array.isArray(item)) return item
        n++
        const [prompt, correct, distractors] = item
        return { id: `${id}-q${n}`, prompt, correct, distractors }
      }),
    }
  }

  function bossFinal(prompt: string, correct: string, distractors: [string, string, string]): Question {
    return { id: `m${moduleId}-boss`, prompt, correct, distractors }
  }

  return { submodule, bossFinal }
}

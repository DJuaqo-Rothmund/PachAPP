export interface Question {
  id: string
  prompt: string
  correct: string
  /** Siempre 3 alternativas falsas. El orden se baraja en tiempo de ejecución. */
  distractors: [string, string, string]
}

export interface CodexSection {
  heading: string
  body: string[]
}

export interface Boss {
  id: string
  name: string
  title: string
  maxHp: number
  /** HP que resta cada respuesta correcta de cualquier jugador. */
  damagePerHit: number
  /** Pregunta especial del jefe (opcional). */
  finalQuestion: Question | null
  /** Módulo que la comunidad desbloquea al dejar al jefe en 0 HP. */
  unlocksModuleId: number | null
}

export interface Module {
  id: number
  slug: string
  title: string
  summary: string
  initiallyUnlocked: boolean
  codex: CodexSection[]
  questions: Question[]
  boss: Boss
}

export type BadgeCriterion =
  | { type: 'codex_read'; count: number }
  | { type: 'boss_defeated'; moduleId: number }
  | { type: 'module_completed'; moduleId: number }
  | { type: 'correct_streak'; count: number }
  | { type: 'final_blow' }

export interface Badge {
  id: string
  name: string
  description: string
  /** Nombre del ícono pixel art (sprite a definir en el hito de UI). */
  icon: string
  criterion: BadgeCriterion
}

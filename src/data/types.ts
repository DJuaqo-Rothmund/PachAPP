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

/** Pregunta que pausa el video del Códice en un momento dado. Es de práctica: no da XP ni daño. */
export interface CodexCheckpoint {
  id: string
  timestampSeconds: number
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

/** Códice de un submódulo: texto estructurado, video opcional y checkpoints interactivos. */
export interface Codex {
  id: string
  title: string
  sections: CodexSection[]
  videoUrl: string | null
  videoDurationSeconds: number | null
  checkpoints: CodexCheckpoint[]
}

/** Subjefe individual de un submódulo: cada jugador lo enfrenta por su cuenta. */
export interface Subboss {
  name: string
  title: string
  maxHp: number
  damagePerHit: number
}

export interface Submodule {
  id: string
  order: number
  title: string
  description: string
  subboss: Subboss
  codex: Codex
  /** Alimentan al subjefe y también al pool del jefe cooperativo del módulo. */
  questions: Question[]
}

export interface Module {
  id: number
  slug: string
  title: string
  summary: string
  initiallyUnlocked: boolean
  /** Códice a nivel de módulo (vista actual de la app). Con submódulos, se arma con sus Códices. */
  codex: CodexSection[]
  /** Todas las preguntas del módulo (las de sus submódulos incluidas). */
  questions: Question[]
  submodules: Submodule[]
  /** Jefe cooperativo semanal del módulo. */
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

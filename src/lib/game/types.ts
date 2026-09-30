import type { RpgClassId } from '../../data/classes'
import type { Badge, CodexSection } from '../../data/types'

export interface Profile {
  id: string
  displayName: string
  avatarUrl: string | null
  rpgClass: RpgClassId | null
  totalXp: number
}

export interface BossState {
  id: string
  moduleId: number
  name: string
  title: string
  maxHp: number
  currentHp: number
  defeated: boolean
  unlocksModuleId: number | null
}

/**
 * Estado de la batalla semanal del jugador contra el jefe del módulo:
 * available (puede combatir), in_progress (empezó y puede retomarla),
 * done (ya combatió esta semana), defeated (el jefe cayó), none (sin jefe).
 */
export type RaidStatusCode = 'available' | 'in_progress' | 'done' | 'defeated' | 'none'

export interface RaidStatus {
  status: RaidStatusCode
  answered: number
  total: number
  /** Próximo reinicio semanal (ISO). */
  nextResetAt: string
}

export interface CampaignModule {
  id: number
  title: string
  summary: string
  codex: CodexSection[]
  unlocked: boolean
  questionCount: number
  answeredCount: number
  codexRead: boolean
  boss: BossState | null
  raid: RaidStatus
}

/** Batalla semanal en curso: solo trae las preguntas pendientes. */
export interface RaidSession {
  id: number
  total: number
  answered: number
  correct: number
  damage: number
  questions: PlayQuestion[]
}

export interface PlayQuestion {
  id: string
  prompt: string
  options: string[]
  isBossFinal: boolean
  alreadyAnswered: boolean
}

export interface AnswerResult {
  correct: boolean
  correctAnswer: string
  awarded: boolean
  xpGained: number
  damageDealt: number
  bossHp: number
  bossMaxHp: number
  bossDefeated: boolean
  finalBlow: boolean
  unlockedModuleId: number | null
  /** true cuando esta respuesta completó la batalla semanal. */
  raidFinished: boolean
  newBadges: string[]
}

export interface LeaderboardRow {
  rank: number
  userId: string
  displayName: string
  avatarUrl: string | null
  rpgClass: RpgClassId | null
  monthlyXp: number
}

export interface EarnedBadge {
  badgeId: string
  earnedAt: string
}

export interface GameApi {
  getProfile(): Promise<Profile>
  setRpgClass(rpgClass: RpgClassId): Promise<void>
  getCampaign(): Promise<CampaignModule[]>
  markCodexRead(moduleId: number): Promise<string[]>
  /** Todas las preguntas del módulo, para entrenar (no daña al jefe). */
  getQuestions(moduleId: number): Promise<PlayQuestion[]>
  /** Inicia o retoma la batalla semanal (máximo 15 preguntas). */
  startRaid(moduleId: number): Promise<RaidSession>
  /** Sin raidSessionId es entrenamiento; con él, la respuesta cuenta para la batalla. */
  answer(questionId: string, answer: string, raidSessionId?: number): Promise<AnswerResult>
  getLeaderboard(): Promise<LeaderboardRow[]>
  getMyBadges(): Promise<EarnedBadge[]>
  /** Catálogo completo de emblemas (editable desde el panel admin). */
  getBadges(): Promise<Badge[]>
  /** Escucha cambios de HP del jefe en vivo. Devuelve la función para desuscribirse. */
  subscribeBoss(bossId: string, onChange: (boss: Pick<BossState, 'currentHp' | 'defeated'>) => void): () => void
}

// -----------------------------------------------------------------------------
// Administración
// -----------------------------------------------------------------------------

export interface AdminModule {
  id: number
  slug: string
  title: string
  summary: string
  initiallyUnlocked: boolean
  /** Desbloqueado por la comunidad (o manualmente por el admin). */
  unlocked: boolean
  codex: CodexSection[]
}

export interface AdminQuestion {
  id: string
  moduleId: number
  prompt: string
  correct: string
  distractors: [string, string, string]
  isBossFinal: boolean
  sortOrder: number
}

export interface AdminBoss {
  id: string
  moduleId: number
  name: string
  title: string
  maxHp: number
  currentHp: number
  damagePerHit: number
  unlocksModuleId: number | null
  defeatedAt: string | null
}

export interface AdminOverview {
  players: number
  answers: number
  correctAnswers: number
  bossesDefeated: number
  bossesTotal: number
}

export interface QuestionStat {
  questionId: string
  moduleId: number
  prompt: string
  attempts: number
  correct: number
}

export interface AdminBadge extends Badge {
  /** Cuántos jugadores lo han ganado. */
  holders: number
}

export interface AdminApi {
  getOverview(): Promise<AdminOverview>
  getQuestionStats(): Promise<QuestionStat[]>
  listModules(): Promise<AdminModule[]>
  saveModule(module: AdminModule): Promise<void>
  deleteModule(id: number): Promise<void>
  listQuestions(moduleId: number): Promise<AdminQuestion[]>
  saveQuestion(question: AdminQuestion): Promise<void>
  deleteQuestion(id: string): Promise<void>
  listBosses(): Promise<AdminBoss[]>
  saveBoss(boss: AdminBoss): Promise<void>
  deleteBoss(id: string): Promise<void>
  resetBoss(id: string): Promise<void>
  listBadges(): Promise<AdminBadge[]>
  saveBadge(badge: Badge): Promise<void>
  deleteBadge(id: string): Promise<void>
}

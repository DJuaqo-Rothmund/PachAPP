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
  getQuestions(moduleId: number): Promise<PlayQuestion[]>
  answer(questionId: string, answer: string): Promise<AnswerResult>
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

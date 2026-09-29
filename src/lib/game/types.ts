import type { RpgClassId } from '../../data/classes'
import type { CodexSection } from '../../data/types'

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
  /** Escucha cambios de HP del jefe en vivo. Devuelve la función para desuscribirse. */
  subscribeBoss(bossId: string, onChange: (boss: Pick<BossState, 'currentHp' | 'defeated'>) => void): () => void
}

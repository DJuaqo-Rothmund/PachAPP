/**
 * Backend simulado para el modo demo (sin Supabase). Replica las reglas de
 * supabase/schema.sql y guarda contenido y progreso en localStorage, para
 * poder probar el juego y el panel admin completos sin servidor.
 */
import type { RpgClassId } from '../../data/classes'
import { BADGES, MODULES } from '../../data/seed'
import type { Badge } from '../../data/types'
import type {
  AdminApi,
  AdminBoss,
  AdminModule,
  AdminQuestion,
  AnswerResult,
  BossState,
  GameApi,
  LeaderboardRow,
} from './types'

const STORAGE_KEY = 'pachapp-demo-v2'
const DEMO_USER_ID = 'demo-user'

/**
 * En la demo juegas solo, así que el jefe parte "herido" por la comunidad
 * simulada: con los aciertos de un módulo alcanza para derrotarlo.
 */
const DEMO_START_HP = 120

type DemoModule = Omit<AdminModule, 'unlocked'>

interface DemoAnswer {
  questionId: string
  moduleId: number
  correct: boolean
  awarded: boolean
  xp: number
  damage: number
  at: string
}

interface DemoState {
  modules: DemoModule[]
  questions: AdminQuestion[]
  bosses: AdminBoss[]
  badgeCatalog: Badge[]
  /** Módulos abiertos por la comunidad (o por el admin). */
  unlockedModules: number[]
  rpgClass: RpgClassId | null
  totalXp: number
  codexReads: number[]
  answers: DemoAnswer[]
  badges: { badgeId: string; earnedAt: string }[]
}

function initialState(): DemoState {
  return {
    modules: MODULES.map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      summary: m.summary,
      initiallyUnlocked: m.initiallyUnlocked,
      codex: m.codex,
    })),
    questions: MODULES.flatMap((m) => [
      ...m.questions.map((q, i) => ({
        id: q.id,
        moduleId: m.id,
        prompt: q.prompt,
        correct: q.correct,
        distractors: q.distractors,
        isBossFinal: false,
        sortOrder: i + 1,
      })),
      ...(m.boss.finalQuestion
        ? [
            {
              id: m.boss.finalQuestion.id,
              moduleId: m.id,
              prompt: m.boss.finalQuestion.prompt,
              correct: m.boss.finalQuestion.correct,
              distractors: m.boss.finalQuestion.distractors,
              isBossFinal: true,
              sortOrder: 999,
            },
          ]
        : []),
    ]),
    bosses: MODULES.map((m) => ({
      id: m.boss.id,
      moduleId: m.id,
      name: m.boss.name,
      title: m.boss.title,
      maxHp: m.boss.maxHp,
      currentHp: Math.min(DEMO_START_HP, m.boss.maxHp),
      damagePerHit: m.boss.damagePerHit,
      unlocksModuleId: m.boss.unlocksModuleId,
      defeatedAt: null,
    })),
    badgeCatalog: BADGES,
    unlockedModules: [],
    rpgClass: null,
    totalXp: 0,
    codexReads: [],
    answers: [],
    badges: [],
  }
}

/** Almacenamiento clave-valor síncrono. En la web es localStorage; la app móvil inyecta el suyo. */
export interface DemoStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

let storage: DemoStorage = {
  getItem: (key) => globalThis.localStorage?.getItem(key) ?? null,
  setItem: (key, value) => globalThis.localStorage?.setItem(key, value),
  removeItem: (key) => globalThis.localStorage?.removeItem(key),
}

/** Reemplaza el almacenamiento de la demo. Debe llamarse antes del primer uso de la API. */
export function setDemoStorage(next: DemoStorage) {
  storage = next
  memoryState = null
}

let memoryState: DemoState | null = null

function load(): DemoState {
  if (memoryState) return memoryState
  try {
    const raw = storage.getItem(STORAGE_KEY)
    memoryState = raw ? { ...initialState(), ...JSON.parse(raw) } : initialState()
  } catch {
    memoryState = initialState()
  }
  return memoryState!
}

function save(state: DemoState) {
  memoryState = state
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Sin storage (modo privado): el progreso vive solo en memoria.
  }
}

const bossListeners = new Map<string, Set<(b: Pick<BossState, 'currentHp' | 'defeated'>) => void>>()

function notifyBoss(boss: AdminBoss) {
  bossListeners.get(boss.id)?.forEach((cb) => cb({ currentHp: boss.currentHp, defeated: boss.defeatedAt !== null }))
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const isUnlocked = (s: DemoState, moduleId: number) =>
  s.modules.some((m) => m.id === moduleId && (m.initiallyUnlocked || s.unlockedModules.includes(moduleId)))

const moduleQuestions = (s: DemoState, moduleId: number) =>
  s.questions
    .filter((q) => q.moduleId === moduleId)
    .sort((a, b) => Number(a.isBossFinal) - Number(b.isBossFinal) || a.sortOrder - b.sortOrder)

const toBossState = (b: AdminBoss): BossState => ({
  id: b.id,
  moduleId: b.moduleId,
  name: b.name,
  title: b.title,
  maxHp: b.maxHp,
  currentHp: b.currentHp,
  defeated: b.defeatedAt !== null,
  unlocksModuleId: b.unlocksModuleId,
})

function evaluateBadges(s: DemoState): string[] {
  const earned = new Set(s.badges.map((b) => b.badgeId))
  let streak = 0
  for (const a of [...s.answers].reverse()) {
    if (!a.awarded && a.correct) continue
    if (!a.correct) break
    streak++
  }

  const fresh: string[] = []
  for (const badge of s.badgeCatalog) {
    if (earned.has(badge.id)) continue
    const c = badge.criterion
    let ok = false
    switch (c.type) {
      case 'codex_read':
        ok = s.codexReads.length >= c.count
        break
      case 'correct_streak':
        ok = streak >= c.count
        break
      case 'module_completed': {
        const qs = moduleQuestions(s, c.moduleId).filter((q) => !q.isBossFinal)
        ok = qs.length > 0 && qs.every((q) => s.answers.some((a) => a.questionId === q.id && a.awarded))
        break
      }
      case 'boss_defeated': {
        const boss = s.bosses.find((b) => b.moduleId === c.moduleId)
        ok = !!boss?.defeatedAt && s.answers.some((a) => a.moduleId === c.moduleId && a.damage > 0)
        break
      }
      case 'final_blow':
        ok = false // se otorga directamente al dar el golpe final
        break
    }
    if (ok) fresh.push(badge.id)
  }
  const now = new Date().toISOString()
  s.badges.push(...fresh.map((badgeId) => ({ badgeId, earnedAt: now })))
  return fresh
}

const DEMO_RIVALS: Omit<LeaderboardRow, 'rank'>[] = [
  { userId: 'r1', displayName: 'Druida del Maule', avatarUrl: null, rpgClass: 'druida', monthlyXp: 140 },
  { userId: 'r2', displayName: 'Paladina de Curicó', avatarUrl: null, rpgClass: 'paladin', monthlyXp: 90 },
  { userId: 'r3', displayName: 'Brujo de Osorno', avatarUrl: null, rpgClass: 'brujo', monthlyXp: 60 },
  { userId: 'r4', displayName: 'Pícaro de Rancagua', avatarUrl: null, rpgClass: 'picaro', monthlyXp: 30 },
]

export function createDemoApi(): GameApi {
  return {
    async getProfile() {
      const s = load()
      return { id: DEMO_USER_ID, displayName: 'Aventurero Demo', avatarUrl: null, rpgClass: s.rpgClass, totalXp: s.totalXp }
    },

    async setRpgClass(rpgClass) {
      const s = load()
      save({ ...s, rpgClass })
    },

    async getCampaign() {
      const s = load()
      return [...s.modules]
        .sort((a, b) => a.id - b.id)
        .map((m) => {
          const boss = s.bosses.find((b) => b.moduleId === m.id)
          return {
            id: m.id,
            title: m.title,
            summary: m.summary,
            codex: m.codex,
            unlocked: isUnlocked(s, m.id),
            questionCount: moduleQuestions(s, m.id).length,
            answeredCount: s.answers.filter((a) => a.moduleId === m.id && a.awarded).length,
            codexRead: s.codexReads.includes(m.id),
            boss: boss ? toBossState(boss) : null,
          }
        })
    },

    async markCodexRead(moduleId) {
      const s = load()
      if (!isUnlocked(s, moduleId)) throw new Error('Módulo bloqueado')
      if (!s.codexReads.includes(moduleId)) s.codexReads.push(moduleId)
      const fresh = evaluateBadges(s)
      save(s)
      return fresh
    },

    async getQuestions(moduleId) {
      const s = load()
      if (!isUnlocked(s, moduleId)) throw new Error('Módulo bloqueado')
      return moduleQuestions(s, moduleId).map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: shuffle([q.correct, ...q.distractors]),
        isBossFinal: q.isBossFinal,
        alreadyAnswered: s.answers.some((a) => a.questionId === q.id && a.awarded),
      }))
    },

    async answer(questionId, answer): Promise<AnswerResult> {
      const s = load()
      const q = s.questions.find((x) => x.id === questionId)
      if (!q) throw new Error('Pregunta no existe')
      if (!isUnlocked(s, q.moduleId)) throw new Error('Módulo bloqueado')
      if (!s.codexReads.includes(q.moduleId)) throw new Error('Debes leer el Códice antes de jugar')

      const boss = s.bosses.find((b) => b.moduleId === q.moduleId)
      const correct = answer.trim() === q.correct.trim()
      const firstCorrect = correct && !s.answers.some((a) => a.questionId === q.id && a.awarded)
      let xp = 0
      let damage = 0
      let finalBlow = false
      const fresh: string[] = []

      if (firstCorrect) {
        xp = q.isBossFinal ? 50 : 10
        if (boss && !boss.defeatedAt) {
          damage = q.isBossFinal ? boss.damagePerHit * 5 : boss.damagePerHit
          boss.currentHp = Math.max(boss.currentHp - damage, 0)
          if (boss.currentHp === 0) {
            boss.defeatedAt = new Date().toISOString()
            finalBlow = true
            xp += 100
            const next = boss.unlocksModuleId
            if (next !== null && !s.unlockedModules.includes(next)) s.unlockedModules.push(next)
            for (const badge of s.badgeCatalog.filter((b) => b.criterion.type === 'final_blow')) {
              if (s.badges.some((b) => b.badgeId === badge.id)) continue
              s.badges.push({ badgeId: badge.id, earnedAt: new Date().toISOString() })
              fresh.push(badge.id)
            }
          }
        }
        s.totalXp += xp
      }

      s.answers.push({
        questionId: q.id,
        moduleId: q.moduleId,
        correct,
        awarded: firstCorrect,
        xp,
        damage,
        at: new Date().toISOString(),
      })
      fresh.push(...evaluateBadges(s))
      save(s)
      if (boss && damage > 0) notifyBoss(boss)

      return {
        correct,
        correctAnswer: q.correct,
        awarded: firstCorrect,
        xpGained: xp,
        damageDealt: damage,
        bossHp: boss?.currentHp ?? 0,
        bossMaxHp: boss?.maxHp ?? 0,
        bossDefeated: Boolean(boss?.defeatedAt),
        finalBlow,
        unlockedModuleId: finalBlow ? (boss?.unlocksModuleId ?? null) : null,
        newBadges: fresh,
      }
    },

    async getLeaderboard() {
      const s = load()
      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      const myXp = s.answers.filter((a) => new Date(a.at) >= monthStart).reduce((sum, a) => sum + a.xp, 0)
      const rows = [...DEMO_RIVALS]
      if (myXp > 0) {
        rows.push({ userId: DEMO_USER_ID, displayName: 'Aventurero Demo', avatarUrl: null, rpgClass: s.rpgClass, monthlyXp: myXp })
      }
      rows.sort((a, b) => b.monthlyXp - a.monthlyXp)
      return rows.map((r, i) => ({ ...r, rank: i + 1 }))
    },

    async getMyBadges() {
      return load().badges
    },

    async getBadges() {
      return load().badgeCatalog
    },

    subscribeBoss(bossId, onChange) {
      if (!bossListeners.has(bossId)) bossListeners.set(bossId, new Set())
      bossListeners.get(bossId)!.add(onChange)
      return () => {
        bossListeners.get(bossId)?.delete(onChange)
      }
    },
  }
}

export function createDemoAdminApi(): AdminApi {
  return {
    async getOverview() {
      const s = load()
      return {
        players: 1,
        answers: s.answers.length,
        correctAnswers: s.answers.filter((a) => a.correct).length,
        bossesDefeated: s.bosses.filter((b) => b.defeatedAt).length,
        bossesTotal: s.bosses.length,
      }
    },

    async getQuestionStats() {
      const s = load()
      return [...s.questions]
        .sort((a, b) => a.moduleId - b.moduleId || a.id.localeCompare(b.id))
        .map((q) => {
          const attempts = s.answers.filter((a) => a.questionId === q.id)
          return {
            questionId: q.id,
            moduleId: q.moduleId,
            prompt: q.prompt,
            attempts: attempts.length,
            correct: attempts.filter((a) => a.correct).length,
          }
        })
    },

    async listModules() {
      const s = load()
      return [...s.modules].sort((a, b) => a.id - b.id).map((m) => ({ ...m, unlocked: isUnlocked(s, m.id) }))
    },

    async saveModule({ unlocked, ...module }) {
      const s = load()
      if (s.modules.some((m) => m.slug === module.slug && m.id !== module.id)) {
        throw new Error(`El slug "${module.slug}" ya existe`)
      }
      s.modules = [...s.modules.filter((m) => m.id !== module.id), module]
      s.unlockedModules = s.unlockedModules.filter((id) => id !== module.id)
      if (unlocked && !module.initiallyUnlocked) s.unlockedModules.push(module.id)
      save(s)
    },

    async deleteModule(id) {
      const s = load()
      const questionIds = new Set(s.questions.filter((q) => q.moduleId === id).map((q) => q.id))
      s.modules = s.modules.filter((m) => m.id !== id)
      s.questions = s.questions.filter((q) => q.moduleId !== id)
      s.bosses = s.bosses
        .filter((b) => b.moduleId !== id)
        .map((b) => (b.unlocksModuleId === id ? { ...b, unlocksModuleId: null } : b))
      s.answers = s.answers.filter((a) => !questionIds.has(a.questionId))
      s.codexReads = s.codexReads.filter((m) => m !== id)
      s.unlockedModules = s.unlockedModules.filter((m) => m !== id)
      save(s)
    },

    async listQuestions(moduleId) {
      return moduleQuestions(load(), moduleId)
    },

    async saveQuestion(question) {
      const s = load()
      s.questions = [...s.questions.filter((q) => q.id !== question.id), question]
      save(s)
    },

    async deleteQuestion(id) {
      const s = load()
      s.questions = s.questions.filter((q) => q.id !== id)
      s.answers = s.answers.filter((a) => a.questionId !== id)
      save(s)
    },

    async listBosses() {
      return [...load().bosses].sort((a, b) => a.moduleId - b.moduleId)
    },

    async saveBoss(boss) {
      const s = load()
      if (s.bosses.some((b) => b.moduleId === boss.moduleId && b.id !== boss.id)) {
        throw new Error('Ese módulo ya tiene un jefe')
      }
      const saved = {
        ...boss,
        defeatedAt: boss.currentHp === 0 ? (boss.defeatedAt ?? new Date().toISOString()) : null,
      }
      s.bosses = [...s.bosses.filter((b) => b.id !== boss.id), saved]
      save(s)
      notifyBoss(saved)
    },

    async deleteBoss(id) {
      const s = load()
      s.bosses = s.bosses.filter((b) => b.id !== id)
      save(s)
    },

    async resetBoss(id) {
      const s = load()
      const boss = s.bosses.find((b) => b.id === id)
      if (!boss) return
      boss.currentHp = boss.maxHp
      boss.defeatedAt = null
      save(s)
      notifyBoss(boss)
    },

    async listBadges() {
      const s = load()
      return s.badgeCatalog.map((b) => ({ ...b, holders: s.badges.some((e) => e.badgeId === b.id) ? 1 : 0 }))
    },

    async saveBadge(badge) {
      const s = load()
      const i = s.badgeCatalog.findIndex((b) => b.id === badge.id)
      s.badgeCatalog = i === -1 ? [...s.badgeCatalog, badge] : s.badgeCatalog.map((b, j) => (j === i ? badge : b))
      save(s)
    },

    async deleteBadge(id) {
      const s = load()
      s.badgeCatalog = s.badgeCatalog.filter((b) => b.id !== id)
      s.badges = s.badges.filter((b) => b.badgeId !== id)
      save(s)
    },
  }
}

/** Borra el progreso y el contenido editado de la demo. */
export function resetDemo() {
  memoryState = null
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // ignorar
  }
}

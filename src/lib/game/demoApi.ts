/**
 * Backend simulado para el modo demo (sin Supabase). Replica las reglas de
 * supabase/schema.sql usando los datos semilla y guarda el progreso en
 * localStorage, para poder probar el juego completo sin servidor.
 */
import type { RpgClassId } from '../../data/classes'
import { BADGES, MODULES, getModule } from '../../data/seed'
import type { Question } from '../../data/types'
import type { AnswerResult, BossState, GameApi, LeaderboardRow } from './types'

const STORAGE_KEY = 'pachapp-demo-v1'
const DEMO_USER_ID = 'demo-user'

/**
 * En la demo juegas solo, así que el jefe parte "herido" por la comunidad
 * simulada: con los aciertos de un módulo alcanza para derrotarlo.
 */
const DEMO_START_HP = 120

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
  rpgClass: RpgClassId | null
  totalXp: number
  codexReads: number[]
  answers: DemoAnswer[]
  bossHp: Record<string, number>
  unlockedModules: number[]
  badges: { badgeId: string; earnedAt: string }[]
}

const initialState = (): DemoState => ({
  rpgClass: null,
  totalXp: 0,
  codexReads: [],
  answers: [],
  bossHp: Object.fromEntries(MODULES.map((m) => [m.boss.id, DEMO_START_HP])),
  unlockedModules: MODULES.filter((m) => m.initiallyUnlocked).map((m) => m.id),
  badges: [],
})

let memoryState: DemoState | null = null

function load(): DemoState {
  if (memoryState) return memoryState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    memoryState = raw ? { ...initialState(), ...JSON.parse(raw) } : initialState()
  } catch {
    memoryState = initialState()
  }
  return memoryState!
}

function save(state: DemoState) {
  memoryState = state
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Sin storage (modo privado): el progreso vive solo en memoria.
  }
}

const bossListeners = new Map<string, Set<(b: Pick<BossState, 'currentHp' | 'defeated'>) => void>>()

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function allQuestions(moduleId: number): Question[] {
  const m = getModule(moduleId)
  if (!m) return []
  return [...m.questions, ...(m.boss.finalQuestion ? [m.boss.finalQuestion] : [])]
}

function findQuestion(questionId: string) {
  for (const m of MODULES) {
    const q = allQuestions(m.id).find((x) => x.id === questionId)
    if (q) return { module: m, question: q, isBossFinal: q.id === m.boss.finalQuestion?.id }
  }
  return null
}

function evaluateBadges(state: DemoState): string[] {
  const earned = new Set(state.badges.map((b) => b.badgeId))
  let streak = 0
  for (const a of [...state.answers].reverse()) {
    if (!a.awarded && a.correct) continue
    if (!a.correct) break
    streak++
  }

  const fresh: string[] = []
  for (const badge of BADGES) {
    if (earned.has(badge.id)) continue
    const c = badge.criterion
    let ok = false
    switch (c.type) {
      case 'codex_read':
        ok = state.codexReads.length >= c.count
        break
      case 'correct_streak':
        ok = streak >= c.count
        break
      case 'module_completed': {
        const m = getModule(c.moduleId)
        ok = !!m && m.questions.every((q) => state.answers.some((a) => a.questionId === q.id && a.awarded))
        break
      }
      case 'boss_defeated': {
        const m = getModule(c.moduleId)
        ok =
          !!m &&
          state.bossHp[m.boss.id] === 0 &&
          state.answers.some((a) => a.moduleId === m.id && a.damage > 0)
        break
      }
      case 'final_blow':
        ok = false // se otorga directamente al dar el golpe final
        break
    }
    if (ok) fresh.push(badge.id)
  }
  const now = new Date().toISOString()
  state.badges.push(...fresh.map((badgeId) => ({ badgeId, earnedAt: now })))
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
      return MODULES.map((m) => {
        const hp = s.bossHp[m.boss.id] ?? DEMO_START_HP
        return {
          id: m.id,
          title: m.title,
          summary: m.summary,
          codex: m.codex,
          unlocked: s.unlockedModules.includes(m.id),
          questionCount: allQuestions(m.id).length,
          answeredCount: s.answers.filter((a) => a.moduleId === m.id && a.awarded).length,
          codexRead: s.codexReads.includes(m.id),
          boss: {
            id: m.boss.id,
            moduleId: m.id,
            name: m.boss.name,
            title: m.boss.title,
            maxHp: m.boss.maxHp,
            currentHp: hp,
            defeated: hp === 0,
            unlocksModuleId: m.boss.unlocksModuleId,
          },
        }
      })
    },

    async markCodexRead(moduleId) {
      const s = load()
      if (!s.unlockedModules.includes(moduleId)) throw new Error('Módulo bloqueado')
      if (!s.codexReads.includes(moduleId)) s.codexReads.push(moduleId)
      const fresh = evaluateBadges(s)
      save(s)
      return fresh
    },

    async getQuestions(moduleId) {
      const s = load()
      if (!s.unlockedModules.includes(moduleId)) throw new Error('Módulo bloqueado')
      const m = getModule(moduleId)!
      return allQuestions(moduleId).map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: shuffle([q.correct, ...q.distractors]),
        isBossFinal: q.id === m.boss.finalQuestion?.id,
        alreadyAnswered: s.answers.some((a) => a.questionId === q.id && a.awarded),
      }))
    },

    async answer(questionId, answer): Promise<AnswerResult> {
      const s = load()
      const found = findQuestion(questionId)
      if (!found) throw new Error('Pregunta no existe')
      const { module: m, question: q, isBossFinal } = found
      if (!s.unlockedModules.includes(m.id)) throw new Error('Módulo bloqueado')
      if (!s.codexReads.includes(m.id)) throw new Error('Debes leer el Códice antes de jugar')

      const correct = answer.trim() === q.correct.trim()
      const firstCorrect = correct && !s.answers.some((a) => a.questionId === q.id && a.awarded)
      let hp = s.bossHp[m.boss.id] ?? DEMO_START_HP
      let xp = 0
      let damage = 0
      let finalBlow = false
      const fresh: string[] = []

      if (firstCorrect) {
        xp = isBossFinal ? 50 : 10
        damage = hp > 0 ? (isBossFinal ? m.boss.damagePerHit * 5 : m.boss.damagePerHit) : 0
        if (damage > 0) {
          hp = Math.max(hp - damage, 0)
          s.bossHp[m.boss.id] = hp
          if (hp === 0) {
            finalBlow = true
            xp += 100
            const next = m.boss.unlocksModuleId
            if (next !== null && !s.unlockedModules.includes(next)) s.unlockedModules.push(next)
            for (const badge of BADGES.filter((b) => b.criterion.type === 'final_blow')) {
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
        moduleId: m.id,
        correct,
        awarded: firstCorrect,
        xp,
        damage,
        at: new Date().toISOString(),
      })
      fresh.push(...evaluateBadges(s))
      save(s)

      if (damage > 0) {
        bossListeners.get(m.boss.id)?.forEach((cb) => cb({ currentHp: hp, defeated: hp === 0 }))
      }

      return {
        correct,
        correctAnswer: q.correct,
        awarded: firstCorrect,
        xpGained: xp,
        damageDealt: damage,
        bossHp: hp,
        bossMaxHp: m.boss.maxHp,
        bossDefeated: hp === 0,
        finalBlow,
        unlockedModuleId: finalBlow ? m.boss.unlocksModuleId : null,
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

    subscribeBoss(bossId, onChange) {
      if (!bossListeners.has(bossId)) bossListeners.set(bossId, new Set())
      bossListeners.get(bossId)!.add(onChange)
      return () => {
        bossListeners.get(bossId)?.delete(onChange)
      }
    },
  }
}

/** Borra el progreso de la demo (útil para volver a probar desde cero). */
export function resetDemo() {
  memoryState = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignorar
  }
}

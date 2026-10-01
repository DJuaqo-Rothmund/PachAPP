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
  RaidStatus,
  SubbossAnswerResult,
} from './types'
import { DEMO_MASTER_CODE, MAX_LIVES, livesDayKey, nextLivesReset } from './lives'
import { RAID_QUESTION_LIMIT, nextRaidReset, raidWeekKey } from './raid'

const STORAGE_KEY = 'pachapp-demo-v3'
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

interface DemoRaid {
  id: number
  bossId: string
  moduleId: number
  /** Lunes de la semana de la batalla (AAAA-MM-DD). */
  weekKey: string
  questionIds: string[]
  answeredIds: string[]
  correct: number
  damage: number
  finished: boolean
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
  raids: DemoRaid[]
  /** Modo maestro activo. */
  isTester: boolean
  /** Errores en combate del día (las vidas se calculan con esto). */
  lives: { day: string; mistakes: number }
  masterAttempts: { day: string; failed: number }
  submodules: Record<string, DemoSubProgress>
}

interface DemoSubProgress {
  codexRead: boolean
  checkpoints: string[]
  damage: number
  defeated: boolean
  fightIds: string[]
  fightAnswered: string[]
}

/** Submódulos de la campaña (contenido fijo de seed.ts). */
const SUBMODULES = MODULES.flatMap((m) => m.submodules.map((sm) => ({ ...sm, moduleId: m.id })))

function initialState(): DemoState {
  return {
    modules: MODULES.map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      summary: m.summary,
      initiallyUnlocked: m.initiallyUnlocked,
      codex: m.codex,
      spriteUrl: null,
      bgTheme: null,
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
    raids: [],
    isTester: false,
    lives: { day: livesDayKey(), mistakes: 0 },
    masterAttempts: { day: livesDayKey(), failed: 0 },
    submodules: {},
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
  s.modules.some((m) => m.id === moduleId && (s.isTester || m.initiallyUnlocked || s.unlockedModules.includes(moduleId)))

function livesLeft(s: DemoState): number {
  if (s.isTester) return MAX_LIVES
  if (s.lives.day !== livesDayKey()) s.lives = { day: livesDayKey(), mistakes: 0 }
  return Math.max(0, MAX_LIVES - s.lives.mistakes)
}

function consumeLife(s: DemoState): number {
  if (!s.isTester) {
    livesLeft(s)
    s.lives.mistakes++
  }
  return livesLeft(s)
}

function requireLives(s: DemoState) {
  if (livesLeft(s) <= 0) throw new Error('Sin vidas: vuelve mañana a las 00:00')
}

const subProgress = (s: DemoState, id: string): DemoSubProgress =>
  (s.submodules[id] ??= { codexRead: false, checkpoints: [], damage: 0, defeated: false, fightIds: [], fightAnswered: [] })

function isSubUnlocked(s: DemoState, id: string): boolean {
  const sm = SUBMODULES.find((x) => x.id === id)
  if (!sm || !isUnlocked(s, sm.moduleId)) return false
  if (s.isTester) return true
  return SUBMODULES.filter((x) => x.moduleId === sm.moduleId && x.order < sm.order).every(
    (prev) => s.submodules[prev.id]?.defeated,
  )
}

const subbossesOf = (s: DemoState, moduleId: number) => {
  const subs = SUBMODULES.filter((x) => x.moduleId === moduleId)
  return { total: subs.length, defeated: subs.filter((x) => s.submodules[x.id]?.defeated).length }
}

const moduleQuestions = (s: DemoState, moduleId: number) =>
  s.questions
    .filter((q) => q.moduleId === moduleId)
    .sort((a, b) => Number(a.isBossFinal) - Number(b.isBossFinal) || a.sortOrder - b.sortOrder)

const currentRaid = (s: DemoState, bossId: string) =>
  s.raids.find((r) => r.bossId === bossId && r.weekKey === raidWeekKey())

function raidStatus(s: DemoState, moduleId: number, boss: AdminBoss | undefined): RaidStatus {
  const nextResetAt = nextRaidReset().toISOString()
  const poolSize = moduleQuestions(s, moduleId).length
  if (!boss) return { status: 'none', answered: 0, total: 0, nextResetAt }
  const raid = currentRaid(s, boss.id)
  const total = raid?.questionIds.length ?? Math.min(RAID_QUESTION_LIMIT, poolSize)
  const answered = raid?.answeredIds.length ?? 0
  if (boss.defeatedAt) return { status: 'defeated', answered, total, nextResetAt }
  if (!raid) return { status: 'available', answered, total, nextResetAt }
  return { status: raid.finished ? 'done' : 'in_progress', answered, total, nextResetAt }
}

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
      return {
        id: DEMO_USER_ID,
        displayName: 'Aventurero Demo',
        avatarUrl: null,
        rpgClass: s.rpgClass,
        totalXp: s.totalXp,
        isTester: s.isTester,
      }
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
            raid: raidStatus(s, m.id, boss),
            subbossesTotal: subbossesOf(s, m.id).total,
            subbossesDefeated: subbossesOf(s, m.id).defeated,
            // Editables desde el panel admin de la demo; null = estilo de src/data/encounters.ts.
            spriteUrl: m.spriteUrl ?? null,
            bgTheme: m.bgTheme ?? null,
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

    async startRaid(moduleId) {
      const s = load()
      if (!isUnlocked(s, moduleId)) throw new Error('Módulo bloqueado')
      if (!s.isTester && !s.codexReads.includes(moduleId)) throw new Error('Debes leer el Códice antes de jugar')
      const boss = s.bosses.find((b) => b.moduleId === moduleId)
      if (!boss) throw new Error('Este módulo no tiene jefe')
      if (boss.defeatedAt) throw new Error('El jefe ya fue derrotado')
      const subs = subbossesOf(s, moduleId)
      if (!s.isTester && subs.defeated < subs.total) throw new Error('Derrota primero a todos los subjefes del módulo')
      requireLives(s)

      let raid = currentRaid(s, boss.id)
      if (raid?.finished && s.isTester) {
        // Modo maestro: puede repetir la batalla de la semana.
        s.raids = s.raids.filter((r) => r.id !== raid!.id)
        raid = undefined
      }
      if (raid?.finished) throw new Error('Ya combatiste contra este jefe esta semana')
      if (!raid) {
        const pool = moduleQuestions(s, moduleId)
        const final = pool.find((q) => q.isBossFinal)
        const regular = shuffle(pool.filter((q) => !q.isBossFinal)).slice(0, RAID_QUESTION_LIMIT - (final ? 1 : 0))
        if (regular.length === 0) throw new Error('Este módulo aún no tiene preguntas')
        const questionIds = [...regular.map((q) => q.id), ...(final ? [final.id] : [])]
        raid = {
          id: Math.max(0, ...s.raids.map((r) => r.id)) + 1,
          bossId: boss.id,
          moduleId,
          weekKey: raidWeekKey(),
          questionIds,
          answeredIds: [],
          correct: 0,
          damage: 0,
          finished: false,
        }
        s.raids.push(raid)
        save(s)
      }

      return {
        id: raid.id,
        lives: livesLeft(s),
        total: raid.questionIds.length,
        answered: raid.answeredIds.length,
        correct: raid.correct,
        damage: raid.damage,
        questions: raid.questionIds
          .filter((id) => !raid.answeredIds.includes(id))
          .map((id) => s.questions.find((q) => q.id === id))
          .filter((q): q is AdminQuestion => Boolean(q))
          .map((q) => ({
            id: q.id,
            prompt: q.prompt,
            options: shuffle([q.correct, ...q.distractors]),
            isBossFinal: q.isBossFinal,
            alreadyAnswered: false,
          })),
      }
    },

    async answer(questionId, answer, raidSessionId): Promise<AnswerResult> {
      const s = load()
      const q = s.questions.find((x) => x.id === questionId)
      if (!q) throw new Error('Pregunta no existe')
      if (!isUnlocked(s, q.moduleId)) throw new Error('Módulo bloqueado')
      if (!s.isTester && !s.codexReads.includes(q.moduleId)) throw new Error('Debes leer el Códice antes de jugar')

      const raid = raidSessionId === undefined ? undefined : s.raids.find((r) => r.id === raidSessionId)
      if (raidSessionId !== undefined) {
        if (!raid) throw new Error('Batalla no encontrada')
        if (raid.finished || raid.weekKey !== raidWeekKey()) throw new Error('Esta batalla ya terminó')
        if (!raid.questionIds.includes(q.id)) throw new Error('La pregunta no pertenece a esta batalla')
        if (raid.answeredIds.includes(q.id)) throw new Error('Ya respondiste esta pregunta en la batalla')
        requireLives(s)
      }

      const boss = s.bosses.find((b) => b.moduleId === q.moduleId)
      const correct = answer.trim() === q.correct.trim()
      // Un error dentro del Boss Raid gasta una vida (el entrenamiento es libre).
      const lives = raid && !correct ? consumeLife(s) : livesLeft(s)
      const firstCorrect = correct && !s.answers.some((a) => a.questionId === q.id && a.awarded)
      let xp = firstCorrect ? (q.isBossFinal ? 50 : 10) : 0
      let damage = 0
      let finalBlow = false
      const fresh: string[] = []

      // Solo los aciertos dentro de la batalla semanal dañan al jefe.
      if (correct && raid && boss && !boss.defeatedAt) {
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

      if (raid) {
        raid.answeredIds.push(q.id)
        if (correct) raid.correct++
        raid.damage += damage
        raid.finished = raid.answeredIds.length >= raid.questionIds.length
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
        raidFinished: raid?.finished ?? false,
        livesLeft: lives,
        newBadges: fresh,
      }
    },

    async getLives() {
      const s = load()
      return {
        lives: livesLeft(s),
        maxLives: MAX_LIVES,
        resetsAt: nextLivesReset().toISOString(),
        unlimited: s.isTester,
      }
    },

    async getModuleTree(moduleId) {
      const s = load()
      return SUBMODULES.filter((sm) => sm.moduleId === moduleId)
        .sort((a, b) => a.order - b.order)
        .map((sm) => {
          const p = s.submodules[sm.id]
          return {
            id: sm.id,
            order: sm.order,
            title: sm.title,
            description: sm.description,
            unlocked: isSubUnlocked(s, sm.id),
            codexRead: Boolean(p?.codexRead),
            checkpointsTotal: sm.codex.checkpoints.length,
            checkpointsPassed: p?.checkpoints.length ?? 0,
            questionCount: sm.questions.length,
            subboss: {
              name: sm.subboss.name,
              title: sm.subboss.title,
              maxHp: sm.subboss.maxHp,
              hp: p?.defeated ? 0 : sm.subboss.maxHp - (p?.damage ?? 0),
              defeated: Boolean(p?.defeated),
            },
            spriteUrl: null,
            bgTheme: null,
          }
        })
    },

    async getSubmoduleCodex(submoduleId) {
      const sm = SUBMODULES.find((x) => x.id === submoduleId)
      if (!sm) throw new Error('Submódulo no existe')
      return {
        submoduleId,
        title: sm.codex.title,
        sections: sm.codex.sections,
        videoUrl: sm.codex.videoUrl,
        checkpoints: sm.codex.checkpoints,
      }
    },

    async markSubmoduleCodexRead(submoduleId) {
      const s = load()
      const sm = SUBMODULES.find((x) => x.id === submoduleId)
      if (!sm || !isSubUnlocked(s, submoduleId)) throw new Error('Submódulo bloqueado')
      subProgress(s, submoduleId).codexRead = true
      if (!s.codexReads.includes(sm.moduleId)) s.codexReads.push(sm.moduleId)
      const fresh = evaluateBadges(s)
      save(s)
      return fresh
    },

    async passCheckpoint(submoduleId, checkpointId) {
      const s = load()
      const p = subProgress(s, submoduleId)
      if (!p.checkpoints.includes(checkpointId)) p.checkpoints.push(checkpointId)
      save(s)
    },

    async startSubboss(submoduleId) {
      const s = load()
      const sm = SUBMODULES.find((x) => x.id === submoduleId)
      if (!sm) throw new Error('Submódulo no existe')
      if (!isSubUnlocked(s, submoduleId)) throw new Error('Submódulo bloqueado')
      const p = subProgress(s, submoduleId)
      if (!p.codexRead && !s.isTester) throw new Error('Debes leer el Códice antes de combatir')
      if (p.defeated && !s.isTester) throw new Error('Ya derrotaste a este subjefe')
      requireLives(s)
      if (p.fightIds.length === 0 || p.fightAnswered.length >= p.fightIds.length || p.defeated) {
        if (sm.questions.length === 0) throw new Error('Este submódulo aún no tiene preguntas')
        p.fightIds = shuffle(sm.questions.map((q) => q.id))
        p.fightAnswered = []
        p.damage = 0
        p.defeated = false
      }
      save(s)
      return {
        submoduleId,
        hp: sm.subboss.maxHp - p.damage,
        maxHp: sm.subboss.maxHp,
        total: p.fightIds.length,
        answered: p.fightAnswered.length,
        lives: livesLeft(s),
        questions: p.fightIds
          .filter((id) => !p.fightAnswered.includes(id))
          .map((id) => sm.questions.find((q) => q.id === id)!)
          .map((q) => ({
            id: q.id,
            prompt: q.prompt,
            options: shuffle([q.correct, ...q.distractors]),
            isBossFinal: false,
            alreadyAnswered: false,
          })),
      }
    },

    async answerSubboss(submoduleId, questionId, answer): Promise<SubbossAnswerResult> {
      const s = load()
      const sm = SUBMODULES.find((x) => x.id === submoduleId)
      const p = s.submodules[submoduleId]
      if (!sm || !p || !p.fightIds.includes(questionId)) throw new Error('La pregunta no pertenece a este combate')
      if (p.fightAnswered.includes(questionId)) throw new Error('Ya respondiste esta pregunta en el combate')
      if (p.defeated) throw new Error('Este subjefe ya fue derrotado')
      requireLives(s)

      const q = sm.questions.find((x) => x.id === questionId)!
      const correct = answer.trim() === q.correct.trim()
      const firstCorrect = correct && !s.answers.some((a) => a.questionId === q.id && a.awarded)
      const xp = firstCorrect ? 10 : 0
      const damage = correct ? Math.min(sm.subboss.damagePerHit, sm.subboss.maxHp - p.damage) : 0
      const lives = correct ? livesLeft(s) : consumeLife(s)
      p.damage += damage
      p.defeated = p.damage >= sm.subboss.maxHp
      p.fightAnswered.push(questionId)
      s.totalXp += xp
      s.answers.push({
        questionId,
        moduleId: sm.moduleId,
        correct,
        awarded: firstCorrect,
        xp,
        damage: 0,
        at: new Date().toISOString(),
      })
      const fresh = evaluateBadges(s)
      save(s)
      return {
        correct,
        correctAnswer: q.correct,
        awarded: firstCorrect,
        xpGained: xp,
        damageDealt: damage,
        subbossHp: sm.subboss.maxHp - p.damage,
        subbossMaxHp: sm.subboss.maxHp,
        subbossDefeated: p.defeated,
        fightOver: p.defeated || p.fightAnswered.length >= p.fightIds.length || lives <= 0,
        livesLeft: lives,
        newBadges: fresh,
      }
    },

    async activateMasterMode(code) {
      const s = load()
      if (s.masterAttempts.day !== livesDayKey()) s.masterAttempts = { day: livesDayKey(), failed: 0 }
      if (s.masterAttempts.failed >= 5) throw new Error('Demasiados intentos. Vuelve a intentarlo mañana')
      const ok = code === DEMO_MASTER_CODE
      if (ok) s.isTester = true
      else s.masterAttempts.failed++
      save(s)
      return ok
    },

    async deactivateMasterMode() {
      const s = load()
      s.isTester = false
      save(s)
    },

    async testerReset(scope) {
      const s = load()
      if (!s.isTester) throw new Error('Solo disponible en modo maestro')
      const fresh = initialState()
      if (scope === 'lives' || scope === 'progress' || scope === 'all') s.lives = fresh.lives
      if (scope === 'progress' || scope === 'all') {
        s.totalXp = 0
        s.codexReads = []
        s.answers = []
        s.badges = []
        s.raids = []
        s.submodules = {}
      }
      if (scope === 'bosses' || scope === 'all') {
        // La demo vuelve a su estado inicial: jefes "malheridos" por la comunidad simulada.
        s.bosses = s.bosses.map((b) => ({ ...b, currentHp: Math.min(DEMO_START_HP, b.maxHp), defeatedAt: null }))
        s.unlockedModules = []
      }
      save(s)
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

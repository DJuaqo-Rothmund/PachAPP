import type { SupabaseClient } from '@supabase/supabase-js'
import type { RpgClassId } from '../../data/classes'
import type { Badge, CodexCheckpoint, CodexSection } from '../../data/types'
import type { AnswerResult, BossState, GameApi, PlayQuestion, RaidStatusCode, SubbossAnswerResult } from './types'

interface CampaignRow {
  module_id: number
  unlocked: boolean
  question_count: number
  answered_count: number
  codex_read: boolean
  raid_status: RaidStatusCode
  raid_answered: number
  raid_total: number
  raid_next_reset: string
  subbosses_total: number
  subbosses_defeated: number
}

interface TreeRow {
  submodule_id: string
  sort_order: number
  title: string
  description: string
  subboss_name: string
  subboss_title: string
  subboss_max_hp: number
  subboss_hp: number
  subboss_defeated: boolean
  unlocked: boolean
  codex_read: boolean
  checkpoints_total: number
  checkpoints_passed: number
  question_count: number
}

interface CheckpointRow {
  id: string
  timestamp_seconds: number
  prompt: string
  options: string[]
  correct_index: number
  explanation: string
}

const toPlayQuestion = (q: { id: string; prompt: string; options: string[]; is_boss_final?: boolean }): PlayQuestion => ({
  id: q.id,
  prompt: q.prompt,
  options: q.options,
  isBossFinal: Boolean(q.is_boss_final),
  alreadyAnswered: false,
})

interface BossRow {
  id: string
  module_id: number
  name: string
  title: string
  max_hp: number
  current_hp: number
  defeated_at: string | null
  unlocks_module_id: number | null
}

const toBoss = (b: BossRow): BossState => ({
  id: b.id,
  moduleId: b.module_id,
  name: b.name,
  title: b.title,
  maxHp: b.max_hp,
  currentHp: b.current_hp,
  defeated: b.defeated_at !== null,
  unlocksModuleId: b.unlocks_module_id,
})

async function currentUserId(sb: SupabaseClient): Promise<string> {
  const { data } = await sb.auth.getSession()
  const id = data.session?.user.id
  if (!id) throw new Error('No autenticado')
  return id
}

export function createSupabaseApi(sb: SupabaseClient): GameApi {
  return {
    async getProfile() {
      const id = await currentUserId(sb)
      const { data, error } = await sb
        .from('profiles')
        .select('id, display_name, avatar_url, rpg_class, total_xp, is_tester')
        .eq('id', id)
        .single()
      if (error) throw error
      return {
        id: data.id,
        displayName: data.display_name ?? 'Aventurero',
        avatarUrl: data.avatar_url,
        rpgClass: data.rpg_class,
        totalXp: data.total_xp,
        isTester: Boolean(data.is_tester),
      }
    },

    async setRpgClass(rpgClass: RpgClassId) {
      const id = await currentUserId(sb)
      const { error } = await sb.from('profiles').update({ rpg_class: rpgClass }).eq('id', id)
      if (error) throw error
    },

    async getCampaign() {
      const [modules, bosses, campaign] = await Promise.all([
        sb.from('modules').select('id, title, summary, codex').eq('archived', false).order('id'),
        sb.from('bosses').select('*'),
        sb.rpc('get_campaign'),
      ])
      if (modules.error) throw modules.error
      if (bosses.error) throw bosses.error
      if (campaign.error) throw campaign.error

      const status = new Map<number, CampaignRow>((campaign.data as CampaignRow[]).map((c) => [c.module_id, c]))
      const bossByModule = new Map((bosses.data as BossRow[]).map((b) => [b.module_id, toBoss(b)]))

      return modules.data.map((m: { id: number; title: string; summary: string; codex: CodexSection[] }) => {
        const s = status.get(m.id)
        return {
          id: m.id,
          title: m.title,
          summary: m.summary,
          codex: m.codex,
          unlocked: s?.unlocked ?? false,
          questionCount: s?.question_count ?? 0,
          answeredCount: s?.answered_count ?? 0,
          codexRead: s?.codex_read ?? false,
          boss: bossByModule.get(m.id) ?? null,
          raid: {
            status: s?.raid_status ?? 'none',
            answered: s?.raid_answered ?? 0,
            total: s?.raid_total ?? 0,
            nextResetAt: s?.raid_next_reset ?? new Date().toISOString(),
          },
          subbossesTotal: s?.subbosses_total ?? 0,
          subbossesDefeated: s?.subbosses_defeated ?? 0,
        }
      })
    },

    async markCodexRead(moduleId) {
      const { data, error } = await sb.rpc('mark_codex_read', { p_module_id: moduleId })
      if (error) throw error
      return (data as string[]) ?? []
    },

    async getQuestions(moduleId) {
      const { data, error } = await sb.rpc('get_module_questions', { p_module_id: moduleId })
      if (error) throw error
      return (data as { id: string; prompt: string; options: string[]; is_boss_final: boolean; already_answered: boolean }[]).map(
        (q) => ({
          id: q.id,
          prompt: q.prompt,
          options: q.options,
          isBossFinal: q.is_boss_final,
          alreadyAnswered: q.already_answered,
        }),
      )
    },

    async startRaid(moduleId) {
      const { data, error } = await sb.rpc('start_raid', { p_module_id: moduleId })
      if (error) throw error
      const r = data as {
        session_id: number
        total: number
        answered: number
        correct: number
        damage: number
        lives: number
        questions: { id: string; prompt: string; options: string[]; is_boss_final: boolean }[]
      }
      return {
        id: Number(r.session_id),
        total: r.total,
        answered: r.answered,
        correct: r.correct,
        damage: r.damage,
        lives: r.lives,
        questions: r.questions.map(toPlayQuestion),
      }
    },

    async answer(questionId, answer, raidSessionId) {
      const { data, error } = await sb.rpc('answer_question', {
        p_question_id: questionId,
        p_answer: answer,
        p_raid_session_id: raidSessionId ?? null,
      })
      if (error) throw error
      const r = data as Record<string, unknown>
      return {
        correct: r.correct as boolean,
        correctAnswer: r.correct_answer as string,
        awarded: r.awarded as boolean,
        xpGained: r.xp_gained as number,
        damageDealt: r.damage_dealt as number,
        bossHp: r.boss_hp as number,
        bossMaxHp: r.boss_max_hp as number,
        bossDefeated: r.boss_defeated as boolean,
        finalBlow: r.final_blow as boolean,
        unlockedModuleId: (r.unlocked_module_id as number | null) ?? null,
        raidFinished: Boolean(r.raid_finished),
        livesLeft: Number(r.lives_left ?? 0),
        newBadges: (r.new_badges as string[]) ?? [],
      } satisfies AnswerResult
    },

    async getLeaderboard() {
      const { data, error } = await sb.rpc('get_monthly_leaderboard', { p_limit: 50 })
      if (error) throw error
      return (
        data as {
          rank: number
          user_id: string
          display_name: string | null
          avatar_url: string | null
          rpg_class: RpgClassId | null
          monthly_xp: number
        }[]
      ).map((r) => ({
        rank: Number(r.rank),
        userId: r.user_id,
        displayName: r.display_name ?? 'Aventurero',
        avatarUrl: r.avatar_url,
        rpgClass: r.rpg_class,
        monthlyXp: Number(r.monthly_xp),
      }))
    },

    async getMyBadges() {
      const id = await currentUserId(sb)
      const { data, error } = await sb.from('user_badges').select('badge_id, earned_at').eq('user_id', id)
      if (error) throw error
      return data.map((b) => ({ badgeId: b.badge_id, earnedAt: b.earned_at }))
    },

    async getBadges() {
      const { data, error } = await sb
        .from('badges')
        .select('id, name, description, icon, criterion')
        .order('created_at')
        .order('id')
      if (error) throw error
      return data as Badge[]
    },

    async getLives() {
      const { data, error } = await sb.rpc('get_lives')
      if (error) throw error
      const r = data as { lives: number; max_lives: number; resets_at: string; unlimited: boolean }
      return { lives: r.lives, maxLives: r.max_lives, resetsAt: r.resets_at, unlimited: r.unlimited }
    },

    async getModuleTree(moduleId) {
      const { data, error } = await sb.rpc('get_module_tree', { p_module_id: moduleId })
      if (error) throw error
      return (data as TreeRow[]).map((r) => ({
        id: r.submodule_id,
        order: r.sort_order,
        title: r.title,
        description: r.description,
        unlocked: r.unlocked,
        codexRead: r.codex_read,
        checkpointsTotal: r.checkpoints_total,
        checkpointsPassed: r.checkpoints_passed,
        questionCount: r.question_count,
        subboss: {
          name: r.subboss_name,
          title: r.subboss_title,
          maxHp: r.subboss_max_hp,
          hp: r.subboss_hp,
          defeated: r.subboss_defeated,
        },
      }))
    },

    async getSubmoduleCodex(submoduleId) {
      const { data, error } = await sb
        .from('codices')
        .select('submodule_id, title, sections, video_url, interactive_checkpoints')
        .eq('submodule_id', submoduleId)
        .single()
      if (error) throw error
      return {
        submoduleId: data.submodule_id,
        title: data.title,
        sections: data.sections as CodexSection[],
        videoUrl: data.video_url,
        checkpoints: (data.interactive_checkpoints as CheckpointRow[]).map(
          (cp): CodexCheckpoint => ({
            id: cp.id,
            timestampSeconds: cp.timestamp_seconds,
            prompt: cp.prompt,
            options: cp.options,
            correctIndex: cp.correct_index,
            explanation: cp.explanation,
          }),
        ),
      }
    },

    async markSubmoduleCodexRead(submoduleId) {
      const { data, error } = await sb.rpc('mark_submodule_codex_read', { p_submodule_id: submoduleId })
      if (error) throw error
      return (data as string[]) ?? []
    },

    async passCheckpoint(submoduleId, checkpointId) {
      const { error } = await sb.rpc('pass_checkpoint', { p_submodule_id: submoduleId, p_checkpoint_id: checkpointId })
      if (error) throw error
    },

    async startSubboss(submoduleId) {
      const { data, error } = await sb.rpc('start_subboss', { p_submodule_id: submoduleId })
      if (error) throw error
      const r = data as {
        submodule_id: string
        hp: number
        max_hp: number
        total: number
        answered: number
        lives: number
        questions: { id: string; prompt: string; options: string[] }[]
      }
      return {
        submoduleId: r.submodule_id,
        hp: r.hp,
        maxHp: r.max_hp,
        total: r.total,
        answered: r.answered,
        lives: r.lives,
        questions: r.questions.map(toPlayQuestion),
      }
    },

    async answerSubboss(submoduleId, questionId, answer) {
      const { data, error } = await sb.rpc('answer_subboss', {
        p_submodule_id: submoduleId,
        p_question_id: questionId,
        p_answer: answer,
      })
      if (error) throw error
      const r = data as Record<string, unknown>
      return {
        correct: r.correct as boolean,
        correctAnswer: r.correct_answer as string,
        awarded: r.awarded as boolean,
        xpGained: r.xp_gained as number,
        damageDealt: r.damage_dealt as number,
        subbossHp: r.subboss_hp as number,
        subbossMaxHp: r.subboss_max_hp as number,
        subbossDefeated: r.subboss_defeated as boolean,
        fightOver: r.fight_over as boolean,
        livesLeft: r.lives_left as number,
        newBadges: (r.new_badges as string[]) ?? [],
      } satisfies SubbossAnswerResult
    },

    async activateMasterMode(code) {
      const { data, error } = await sb.rpc('activate_master_mode', { p_code: code })
      if (error) throw error
      return Boolean(data)
    },

    async deactivateMasterMode() {
      const { error } = await sb.rpc('deactivate_master_mode')
      if (error) throw error
    },

    async testerReset(scope) {
      const { error } = await sb.rpc('tester_reset', { p_scope: scope })
      if (error) throw error
    },

    subscribeBoss(bossId, onChange) {
      const channel = sb
        .channel(`boss-${bossId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'bosses', filter: `id=eq.${bossId}` },
          (payload) => {
            const row = payload.new as BossRow
            onChange({ currentHp: row.current_hp, defeated: row.defeated_at !== null })
          },
        )
        .subscribe()
      return () => {
        sb.removeChannel(channel)
      }
    },
  }
}

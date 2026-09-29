import type { SupabaseClient } from '@supabase/supabase-js'
import type { RpgClassId } from '../../data/classes'
import type { Badge, CodexSection } from '../../data/types'
import type { AnswerResult, BossState, GameApi } from './types'

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
        .select('id, display_name, avatar_url, rpg_class, total_xp')
        .eq('id', id)
        .single()
      if (error) throw error
      return {
        id: data.id,
        displayName: data.display_name ?? 'Aventurero',
        avatarUrl: data.avatar_url,
        rpgClass: data.rpg_class,
        totalXp: data.total_xp,
      }
    },

    async setRpgClass(rpgClass: RpgClassId) {
      const id = await currentUserId(sb)
      const { error } = await sb.from('profiles').update({ rpg_class: rpgClass }).eq('id', id)
      if (error) throw error
    },

    async getCampaign() {
      const [modules, bosses, campaign] = await Promise.all([
        sb.from('modules').select('id, title, summary, codex').order('id'),
        sb.from('bosses').select('*'),
        sb.rpc('get_campaign'),
      ])
      if (modules.error) throw modules.error
      if (bosses.error) throw bosses.error
      if (campaign.error) throw campaign.error

      const status = new Map<number, { unlocked: boolean; question_count: number; answered_count: number; codex_read: boolean }>(
        campaign.data.map((c: { module_id: number }) => [c.module_id, c]),
      )
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

    async answer(questionId, answer) {
      const { data, error } = await sb.rpc('answer_question', { p_question_id: questionId, p_answer: answer })
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

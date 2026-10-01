import type { SupabaseClient } from '@supabase/supabase-js'
import type { AdminApi, AdminBadge, AdminBoss, AdminModule, AdminQuestion } from './types'

function check<T>(res: { data: T; error: unknown }): T {
  if (res.error) throw res.error
  return res.data
}

export function createSupabaseAdminApi(sb: SupabaseClient): AdminApi {
  return {
    async getOverview() {
      const rows = check(await sb.rpc('admin_overview')) as Record<string, number>[]
      const r = rows[0]
      return {
        players: Number(r.players),
        answers: Number(r.answers),
        correctAnswers: Number(r.correct_answers),
        bossesDefeated: Number(r.bosses_defeated),
        bossesTotal: Number(r.bosses_total),
      }
    },

    async getQuestionStats() {
      const rows = check(await sb.rpc('admin_question_stats')) as {
        question_id: string
        module_id: number
        prompt: string
        attempts: number
        correct: number
      }[]
      return (rows ?? []).map((r) => ({
        questionId: r.question_id,
        moduleId: r.module_id,
        prompt: r.prompt,
        attempts: Number(r.attempts),
        correct: Number(r.correct),
      }))
    },

    async listModules() {
      const rows = check(await sb.from('modules').select('*').order('id'))
      return (rows ?? []).map(
        (m): AdminModule => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          summary: m.summary,
          initiallyUnlocked: m.initially_unlocked,
          unlocked: m.initially_unlocked || m.unlocked_at !== null,
          codex: m.codex,
          spriteUrl: m.sprite_url ?? null,
          bgTheme: m.bg_theme ?? null,
        }),
      )
    },

    async saveModule(m) {
      // Conserva la fecha original de desbloqueo si ya estaba abierto.
      const existing = check(await sb.from('modules').select('unlocked_at').eq('id', m.id).maybeSingle())
      const unlockedAt = m.unlocked && !m.initiallyUnlocked ? (existing?.unlocked_at ?? new Date().toISOString()) : null
      check(
        await sb.from('modules').upsert({
          id: m.id,
          slug: m.slug,
          title: m.title,
          summary: m.summary,
          initially_unlocked: m.initiallyUnlocked,
          unlocked_at: unlockedAt,
          codex: m.codex,
          sprite_url: m.spriteUrl?.trim() || null,
          bg_theme: m.bgTheme || null,
        }),
      )
    },

    async deleteModule(id) {
      check(await sb.from('modules').delete().eq('id', id))
    },

    async listQuestions(moduleId) {
      const rows = check(
        await sb.from('questions').select('*').eq('module_id', moduleId).order('is_boss_final').order('sort_order'),
      )
      return (rows ?? []).map(
        (q): AdminQuestion => ({
          id: q.id,
          moduleId: q.module_id,
          prompt: q.prompt,
          correct: q.correct_answer,
          distractors: q.distractors,
          isBossFinal: q.is_boss_final,
          sortOrder: q.sort_order,
        }),
      )
    },

    async saveQuestion(q) {
      check(
        await sb.from('questions').upsert({
          id: q.id,
          module_id: q.moduleId,
          prompt: q.prompt,
          correct_answer: q.correct,
          distractors: q.distractors,
          is_boss_final: q.isBossFinal,
          sort_order: q.sortOrder,
        }),
      )
    },

    async deleteQuestion(id) {
      check(await sb.from('questions').delete().eq('id', id))
    },

    async listBosses() {
      const rows = check(await sb.from('bosses').select('*').order('module_id'))
      return (rows ?? []).map(
        (b): AdminBoss => ({
          id: b.id,
          moduleId: b.module_id,
          name: b.name,
          title: b.title,
          maxHp: b.max_hp,
          currentHp: b.current_hp,
          damagePerHit: b.damage_per_hit,
          unlocksModuleId: b.unlocks_module_id,
          defeatedAt: b.defeated_at,
        }),
      )
    },

    async saveBoss(b) {
      const defeated = b.currentHp === 0
      check(
        await sb.from('bosses').upsert({
          id: b.id,
          module_id: b.moduleId,
          name: b.name,
          title: b.title,
          max_hp: b.maxHp,
          current_hp: b.currentHp,
          damage_per_hit: b.damagePerHit,
          unlocks_module_id: b.unlocksModuleId,
          defeated_at: defeated ? (b.defeatedAt ?? new Date().toISOString()) : null,
        }),
      )
    },

    async deleteBoss(id) {
      check(await sb.from('bosses').delete().eq('id', id))
    },

    async resetBoss(id) {
      check(await sb.rpc('admin_reset_boss', { p_boss_id: id }))
    },

    async listBadges() {
      const rows = check(
        await sb
          .from('badges')
          .select('id, name, description, icon, criterion, user_badges(count)')
          .order('created_at')
          .order('id'),
      )
      return (rows ?? []).map(
        (b): AdminBadge => ({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          criterion: b.criterion,
          holders: (b.user_badges as { count: number }[] | null)?.[0]?.count ?? 0,
        }),
      )
    },

    async saveBadge(b) {
      check(
        await sb.from('badges').upsert({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          criterion: b.criterion,
        }),
      )
    },

    async deleteBadge(id) {
      check(await sb.from('badges').delete().eq('id', id))
    },
  }
}

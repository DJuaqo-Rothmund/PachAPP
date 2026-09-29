/** Reglas del Boss Raid semanal (las mismas que aplica supabase/schema.sql). */

/** Preguntas por batalla: 14 al azar del banco + la pregunta final del jefe. */
export const RAID_QUESTION_LIMIT = 15

/** Lunes 00:00 (hora local) de la semana de `date`. */
export function raidWeekStart(date = new Date()): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)
  return start
}

/** Próximo lunes 00:00: cuando vuelve a estar disponible la batalla. */
export function nextRaidReset(date = new Date()): Date {
  const next = raidWeekStart(date)
  next.setDate(next.getDate() + 7)
  return next
}

/** Clave estable de la semana (AAAA-MM-DD del lunes). */
export function raidWeekKey(date = new Date()): string {
  const d = raidWeekStart(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** "el lunes 6 de octubre" para mostrar cuándo vuelve la batalla. */
export function formatRaidReset(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

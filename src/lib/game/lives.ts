/** Vidas por día: cada error en un combate gasta una y vuelven a las 00:00 (hora de Chile). */
export const MAX_LIVES = 3
const ZONE = 'America/Santiago'

function chileParts(date: Date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date)
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
    return { y: get('year'), m: get('month'), d: get('day'), h: get('hour'), mi: get('minute'), s: get('second') }
  } catch {
    // Sin soporte de zonas horarias: se usa la hora local del dispositivo.
    return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), h: date.getHours(), mi: date.getMinutes(), s: date.getSeconds() }
  }
}

/** Día de juego en Chile (AAAA-MM-DD). */
export function livesDayKey(date = new Date()): string {
  const { y, m, d } = chileParts(date)
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Próximo 00:00 de Chile. */
export function nextLivesReset(date = new Date()): Date {
  const p = chileParts(date)
  const offsetMs = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(date.getTime() / 1000) * 1000
  return new Date(Date.UTC(p.y, p.m - 1, p.d + 1, 0, 0, 0) - offsetMs)
}

/** "en 5 h 12 min" hasta el reinicio de vidas. */
export function formatLivesCountdown(resetsAt: string, now = new Date()): string {
  const ms = Math.max(0, new Date(resetsAt).getTime() - now.getTime())
  const h = Math.floor(ms / 3_600_000)
  const min = Math.ceil((ms % 3_600_000) / 60_000)
  if (h === 0) return `en ${Math.max(1, min)} min`
  return `en ${h} h ${min === 60 ? 0 : min} min`
}

/** Clave del modo maestro en la demo (en Supabase vive hasheada en master_settings). */
export const DEMO_MASTER_CODE = '1234'

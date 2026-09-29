/** Cada 100 XP se sube un nivel. */
export const XP_PER_LEVEL = 100

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const intoLevel = xp % XP_PER_LEVEL
  return { level, intoLevel, toNext: XP_PER_LEVEL - intoLevel, pct: (intoLevel / XP_PER_LEVEL) * 100 }
}

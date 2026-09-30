import { classUnlockState, RPG_CLASSES, type ClassUnlockState, type RpgClassId } from '../../data/classes'
import { levelFromXp } from './level'
import type { CampaignModule } from './types'

/** Estado de desbloqueo de cada clase según el nivel del jugador y los jefes derrotados. */
export function classUnlocks(totalXp: number, campaign: CampaignModule[] | null): Record<RpgClassId, ClassUnlockState> {
  const bosses = (campaign ?? []).flatMap((m) => (m.boss ? [m.boss] : []))
  const progress = {
    level: levelFromXp(totalXp).level,
    defeatedBossIds: bosses.filter((b) => b.defeated).map((b) => b.id),
  }
  const bossNames = Object.fromEntries(bosses.map((b) => [b.id, b.name]))
  return Object.fromEntries(RPG_CLASSES.map((c) => [c.id, classUnlockState(c, progress, bossNames)])) as Record<
    RpgClassId,
    ClassUnlockState
  >
}

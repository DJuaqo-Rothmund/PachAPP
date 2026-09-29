import { StyleSheet, View } from 'react-native'
import { BADGE_SPRITES, BOSS_SPRITE, CLASS_SPRITES } from '@shared/components/pixel/sprites'
import type { RpgClassId } from '@shared/data/classes'
import { PixelSprite } from './PixelSprite'
import { PixelText } from './ui'
import { colors, radius } from '@/theme'

export function ClassAvatar({ rpgClass, size }: { rpgClass: RpgClassId | null; size: number }) {
  if (!rpgClass) return <View style={{ width: size, height: size, borderRadius: radius.sm, backgroundColor: colors.stone }} />
  return <PixelSprite rows={CLASS_SPRITES[rpgClass]} size={size} />
}

export function BossSprite({ size, defeated = false }: { size: number; defeated?: boolean }) {
  return <PixelSprite rows={BOSS_SPRITE} size={size} muted={defeated} />
}

export function BadgeIcon({ icon, size, locked = false }: { icon: string; size: number; locked?: boolean }) {
  return <PixelSprite rows={BADGE_SPRITES[icon] ?? BADGE_SPRITES.book} size={size} muted={locked} />
}

export function HpBar({ current, max, compact = false }: { current: number; max: number; compact?: boolean }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const fill = pct > 50 ? colors.blood : pct > 20 ? colors.orange : colors.gold
  return (
    <View>
      {!compact && (
        <View style={styles.hpHeader}>
          <PixelText size={9} tone="blood">
            HP
          </PixelText>
          <PixelText size={9}>
            {current} / {max}
          </PixelText>
        </View>
      )}
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="HP del jefe"
        accessibilityValue={{ min: 0, max, now: current }}
        style={[styles.hpTrack, { height: compact ? 8 : 18 }]}
      >
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: fill }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  hpTrack: {
    backgroundColor: colors.stone,
    borderColor: colors.rune,
    borderWidth: 1,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
})

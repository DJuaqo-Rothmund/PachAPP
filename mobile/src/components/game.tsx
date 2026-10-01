import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { BADGE_SPRITES, bossSprite, CLASS_SPRITES, subbossSprite } from '@shared/components/pixel/sprites'
import { formatLivesCountdown } from '@shared/lib/game/lives'
import type { LivesStatus } from '@shared/lib/game/types'
import type { RpgClassId } from '@shared/data/classes'
import { PixelSprite } from './PixelSprite'
import { Body, PixelText } from './ui'
import { colors, radius } from '@/theme'

export function ClassAvatar({ rpgClass, size }: { rpgClass: RpgClassId | null; size: number }) {
  if (!rpgClass) return <View style={{ width: size, height: size, borderRadius: radius.sm, backgroundColor: colors.stone }} />
  return <PixelSprite rows={CLASS_SPRITES[rpgClass]} size={size} />
}

export function BossSprite({ bossId, size, defeated = false }: { bossId: string; size: number; defeated?: boolean }) {
  return <PixelSprite rows={bossSprite(bossId)} size={size} muted={defeated} />
}

export function SubbossSprite({ submoduleId, size, defeated = false }: { submoduleId: string; size: number; defeated?: boolean }) {
  return <PixelSprite rows={subbossSprite(submoduleId)} size={size} muted={defeated} />
}

const HEART = ['.RR.RR.', 'RXRRRRR', 'RRRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...']
const HEART_EMPTY = ['.tt.tt.', 't..t..t', 't.....t', 't.....t', '.t...t.', '..t.t..', '...t...']
const HEART_MASTER = ['.YY.YY.', 'YyYYYYY', 'YYYYYYY', 'YYYYYYY', '.YYYYY.', '..YYY..', '...Y...']

/** Vidas del día como corazones pixel; dorados (∞) en modo maestro. */
export function LivesHearts({ lives, size = 16, showCountdown = false }: { lives: LivesStatus | null; size?: number; showCountdown?: boolean }) {
  if (!lives) return null
  const label = lives.unlimited ? 'Vidas ilimitadas (modo maestro)' : `${lives.lives} de ${lives.maxLives} vidas`
  return (
    <View accessibilityLabel={label} style={styles.hearts}>
      {Array.from({ length: lives.maxLives }, (_, i) => (
        <PixelSprite key={i} rows={lives.unlimited ? HEART_MASTER : i < lives.lives ? HEART : HEART_EMPTY} size={size} />
      ))}
      {lives.unlimited && (
        <PixelText size={8} tone="gold">
          ∞
        </PixelText>
      )}
      {showCountdown && !lives.unlimited && lives.lives < lives.maxLives && (
        <Body tone="mist" size={11}>
          recarga {formatLivesCountdown(lives.resetsAt)}
        </Body>
      )}
    </View>
  )
}

/** Aviso de "sin vidas" con cuenta regresiva hasta las 00:00 de Chile. */
export function OutOfLives({ lives }: { lives: LivesStatus | null }) {
  return (
    <View style={{ alignItems: 'center', gap: 10 }}>
      <LivesHearts lives={lives} size={24} />
      <PixelText size={11} tone="blood">
        Sin vidas por hoy
      </PixelText>
      <Body tone="mist" style={{ textAlign: 'center' }}>
        Te equivocaste 3 veces. Tus vidas vuelven a las 00:00 (hora de Chile){lives ? `, ${formatLivesCountdown(lives.resetsAt)}` : ''}.
        Mientras tanto puedes repasar el Códice o entrenar: el entrenamiento no gasta vidas.
      </Body>
    </View>
  )
}

/** Jefe cooperativo: marco dorado y carmesí con remaches y sello "JEFE COOPERATIVO". */
export function CoopBossFrame({
  bossId,
  name,
  title,
  defeated = false,
  spriteSize = 72,
  sprite,
  children,
}: {
  bossId: string
  name: string
  title?: string
  defeated?: boolean
  spriteSize?: number
  /** Reemplaza el sprite (por ejemplo, uno animado). */
  sprite?: ReactNode
  children?: ReactNode
}) {
  return (
    <View style={[styles.frame, styles.coop]}>
      <View style={[styles.rivet, { left: 6 }]} />
      <View style={[styles.rivet, { right: 6 }]} />
      <View style={[styles.seal, styles.coopSeal]}>
        <PixelText size={7} style={{ color: '#450a0a' }}>
          ♛ JEFE COOPERATIVO
        </PixelText>
      </View>
      <View style={styles.frameRow}>
        <View style={[styles.stage, styles.coopStage, { width: spriteSize + 16, height: spriteSize + 16 }]}>
          {sprite ?? <BossSprite bossId={bossId} size={spriteSize} defeated={defeated} />}
        </View>
        <View style={{ flex: 1 }}>
          <PixelText size={10} tone="blood">
            {name}
          </PixelText>
          {title ? (
            <Body tone="mist" size={13} style={{ marginTop: 2 }}>
              {title}
            </Body>
          ) : null}
          {children}
        </View>
      </View>
    </View>
  )
}

/** Subjefe: marco de piedra y acero, compacto, con sello "SUBJEFE". */
export function SubbossFrame({
  submoduleId,
  name,
  title,
  defeated = false,
  spriteSize = 48,
  sprite,
  children,
}: {
  submoduleId: string
  name: string
  title?: string
  defeated?: boolean
  spriteSize?: number
  sprite?: ReactNode
  children?: ReactNode
}) {
  return (
    <View style={[styles.frame, styles.sub]}>
      <View style={[styles.seal, styles.subSeal]}>
        <PixelText size={7} style={{ color: '#e2e8f0' }}>
          ⚔ SUBJEFE
        </PixelText>
      </View>
      <View style={styles.frameRow}>
        <View style={[styles.stage, styles.subStage, { width: spriteSize + 12, height: spriteSize + 12 }]}>
          {sprite ?? <SubbossSprite submoduleId={submoduleId} size={spriteSize} defeated={defeated} />}
        </View>
        <View style={{ flex: 1 }}>
          <PixelText size={9}>{name}</PixelText>
          {title ? (
            <Body tone="mist" size={12} style={{ marginTop: 2 }}>
              {title}
            </Body>
          ) : null}
          {children}
        </View>
      </View>
    </View>
  )
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
  hearts: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  frame: { borderRadius: radius.lg, paddingTop: 18, paddingHorizontal: 12, paddingBottom: 12, marginTop: 8 },
  frameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coop: { borderWidth: 3, borderColor: '#a16207', backgroundColor: '#1d1010' },
  sub: { borderWidth: 2, borderColor: '#475569', backgroundColor: colors.crypt },
  rivet: { position: 'absolute', top: 6, width: 6, height: 6, backgroundColor: colors.gold, borderWidth: 1, borderColor: '#713f12' },
  seal: { position: 'absolute', top: -10, left: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  coopSeal: { backgroundColor: colors.gold, borderWidth: 1, borderColor: '#713f12' },
  subSeal: { backgroundColor: '#334155', borderWidth: 1, borderColor: '#0f172a' },
  stage: { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  coopStage: { backgroundColor: '#1a0b0b', borderWidth: 2, borderColor: '#7f1d1d' },
  subStage: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155' },
  hpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  hpTrack: {
    backgroundColor: colors.stone,
    borderColor: colors.rune,
    borderWidth: 1,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
})

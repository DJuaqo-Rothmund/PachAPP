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
      <View style={[styles.rivet, { left: 5 }]} />
      <View style={[styles.rivet, { right: 5 }]} />
      <View style={[styles.rivet, { left: 5, top: undefined, bottom: 5 }]} />
      <View style={[styles.rivet, { right: 5, top: undefined, bottom: 5 }]} />
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
          <PixelText size={10} style={{ color: '#ff6b5e' }}>
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

/** Color de la vida según cuánto queda: rojo sangre → brasa → oro. */
function hpColors(pct: number): [string, string] {
  if (pct > 50) return ['#f0574a', '#a3241b']
  if (pct > 20) return ['#f59a3c', '#b4521a']
  return ['#f7d14d', '#b8860b']
}

/**
 * Barra de HP segmentada en un marco de hierro, como en los juegos de pelea
 * clásicos. compact: versión delgada para tarjetas.
 */
export function HpBar({ current, max, compact = false, segments }: { current: number; max: number; compact?: boolean; segments?: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const [light, dark] = hpColors(pct)
  const count = segments ?? (compact ? 10 : 20)
  return (
    <View>
      {!compact && (
        <View style={styles.hpHeader}>
          <PixelText size={9} tone="blood">
            HP
          </PixelText>
          <PixelText size={9}>
            {current.toLocaleString('es-CL')} / {max.toLocaleString('es-CL')}
          </PixelText>
        </View>
      )}
      <View style={[styles.hpFrame, { padding: compact ? 2 : 3 }]}>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="HP del jefe"
          accessibilityValue={{ min: 0, max, now: current }}
          style={[styles.hpTrack, { height: compact ? 10 : 22 }]}
        >
          <View style={{ width: `${pct}%`, height: '100%', backgroundColor: dark }}>
            <View style={{ height: '50%', backgroundColor: light }} />
            <View style={styles.hpShine} />
          </View>
          {/* Separadores de segmentos */}
          <View pointerEvents="none" style={styles.hpSegments}>
            {Array.from({ length: count - 1 }, (_, i) => (
              <View key={i} style={[styles.hpDivider, { left: `${((i + 1) * 100) / count}%` }]} />
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hearts: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  frame: { paddingTop: 20, paddingHorizontal: 12, paddingBottom: 12, marginTop: 10 },
  frameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  // Jefe cooperativo: hierro oxidado con remaches.
  coop: {
    borderWidth: 4,
    borderTopColor: colors.rustLight,
    borderLeftColor: colors.rustLight,
    borderBottomColor: '#3b1d0e',
    borderRightColor: '#3b1d0e',
    backgroundColor: '#1b1310',
  },
  // Subjefe: piedra tallada con raíces en el borde superior.
  sub: {
    borderWidth: 3,
    borderTopColor: '#6b8e3a',
    borderLeftColor: '#6d665a',
    borderBottomColor: '#24211c',
    borderRightColor: '#24211c',
    backgroundColor: colors.crypt,
  },
  rivet: { position: 'absolute', top: 5, width: 7, height: 7, backgroundColor: '#e0b15c', borderWidth: 2, borderColor: '#6b3f14' },
  seal: { position: 'absolute', top: -12, left: 12, paddingHorizontal: 6, paddingVertical: 3, borderWidth: 2, borderColor: colors.ink },
  coopSeal: { backgroundColor: colors.gold },
  subSeal: { backgroundColor: '#5a5449' },
  stage: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.ink },
  coopStage: { backgroundColor: '#170908' },
  subStage: { backgroundColor: '#121110' },
  hpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 },
  hpFrame: {
    backgroundColor: '#4f453c',
    borderWidth: 2,
    borderColor: colors.ink,
  },
  hpTrack: { backgroundColor: '#0d0b09', overflow: 'hidden' },
  hpShine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: 'rgba(255, 255, 255, 0.35)' },
  hpSegments: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  hpDivider: { position: 'absolute', top: 0, bottom: 0, width: 2, marginLeft: -1, backgroundColor: '#0d0b09' },
})

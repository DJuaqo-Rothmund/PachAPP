import { useState, type ReactNode } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { BADGE_SPRITES, bossSprite, CLASS_SPRITES, subbossSprite } from '@shared/components/pixel/sprites'
import { formatLivesCountdown } from '@shared/lib/game/lives'
import type { LivesStatus } from '@shared/lib/game/types'
import { encounterForBoss, encounterForSubmodule, type EncounterStyle } from '@shared/data/encounters'
import type { RpgClassId } from '@shared/data/classes'
import { PixelSprite } from './PixelSprite'
import { Body, PixelText } from './ui'
import { colors, fonts, mix, radius } from '@/theme'

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

/**
 * Retrato del encuentro: la imagen pixel art (si sprite_url es una URL http/https)
 * o el sprite pixel de respaldo. Si la imagen falla, vuelve al sprite.
 */
export function EncounterPortrait({ url, size, fallback }: { url: string | null | undefined; size: number; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false)
  const remote = url && /^https?:\/\//.test(url) ? url : null
  if (!remote || failed) return <>{fallback}</>
  return <Image source={{ uri: remote }} style={{ width: size, height: size }} resizeMode="contain" onError={() => setFailed(true)} />
}

interface EncounterProps {
  name: string
  title?: string
  defeated?: boolean
  spriteSize?: number
  /** Reemplaza el retrato (por ejemplo, uno animado). */
  sprite?: ReactNode
  /** Imagen desde la base de datos (sprite_url). */
  spriteUrl?: string | null
  children?: ReactNode
}

/**
 * Tarjeta universal de encuentro al estilo RPG de 16 bits (equivalente a EncounterCard
 * de la web). Usa la paleta del módulo de src/data/encounters.ts.
 */
function EncounterFrame({
  tier,
  encounter,
  name,
  title,
  spriteSize,
  portrait,
  children,
}: {
  tier: 'boss' | 'subboss'
  encounter: EncounterStyle
  name: string
  title?: string
  spriteSize: number
  portrait: ReactNode
  children?: ReactNode
}) {
  const boss = tier === 'boss'
  const { palette } = encounter
  const ring = boss ? 5 : 3
  return (
    <View style={[styles.encounterShadow, { marginTop: 12 }]}>
      <View
        style={{
          backgroundColor: palette.surface,
          borderWidth: ring,
          borderTopColor: palette.frameLight,
          borderLeftColor: palette.frameLight,
          borderBottomColor: palette.frameDark,
          borderRightColor: palette.frameDark,
          paddingTop: 20,
          paddingHorizontal: 12,
          paddingBottom: 12,
        }}
      >
        {boss && (
          <>
            <View style={[styles.rivet, { left: 4 }]} />
            <View style={[styles.rivet, { right: 4 }]} />
            <View style={[styles.rivet, { left: 4, top: undefined, bottom: 4 }]} />
            <View style={[styles.rivet, { right: 4, top: undefined, bottom: 4 }]} />
          </>
        )}
        <View style={styles.frameRow}>
          <View
            style={[
              styles.stage,
              {
                width: spriteSize + (boss ? 16 : 12),
                height: spriteSize + (boss ? 16 : 12),
                backgroundColor: mix(palette.glow, '#000000', 0.22),
              },
            ]}
          >
            {portrait}
          </View>
          <View style={{ flex: 1 }}>
            <PixelText size={boss ? 10 : 9} style={{ color: palette.primary }}>
              {name}
            </PixelText>
            {title ? (
              <Body size={boss ? 17 : 15} style={{ fontFamily: fonts.title, lineHeight: boss ? 18 : 16, color: palette.secondary, marginTop: 2 }}>
                {title}
              </Body>
            ) : null}
            {children}
          </View>
        </View>
      </View>
      <View style={[styles.seal, { backgroundColor: boss ? palette.secondary : palette.frameDark }]}>
        <PixelText size={7} style={{ color: boss ? '#000000' : palette.secondary }}>
          {boss ? '♛ JEFE COOPERATIVO' : '⚔ SUBJEFE'}
        </PixelText>
      </View>
    </View>
  )
}

/** Jefe cooperativo con el estilo de su módulo. */
export function CoopBossFrame({ bossId, defeated = false, spriteSize = 72, sprite, spriteUrl, ...rest }: EncounterProps & { bossId: string }) {
  return (
    <EncounterFrame
      tier="boss"
      encounter={encounterForBoss(bossId)}
      spriteSize={spriteSize}
      portrait={sprite ?? <EncounterPortrait url={spriteUrl} size={spriteSize} fallback={<BossSprite bossId={bossId} size={spriteSize} defeated={defeated} />} />}
      {...rest}
    />
  )
}

/** Subjefe: versión menor con el material del módulo al que pertenece. */
export function SubbossFrame({ submoduleId, defeated = false, spriteSize = 48, sprite, spriteUrl, ...rest }: EncounterProps & { submoduleId: string }) {
  return (
    <EncounterFrame
      tier="subboss"
      encounter={encounterForSubmodule(submoduleId)}
      spriteSize={spriteSize}
      portrait={
        sprite ?? (
          <EncounterPortrait url={spriteUrl} size={spriteSize} fallback={<SubbossSprite submoduleId={submoduleId} size={spriteSize} defeated={defeated} />} />
        )
      }
      {...rest}
    />
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
  encounterShadow: { borderWidth: 2, borderColor: '#000000' },
  rivet: { position: 'absolute', top: 5, width: 7, height: 7, backgroundColor: '#e0b15c', borderWidth: 2, borderColor: '#6b3f14' },
  seal: { position: 'absolute', top: -12, left: 14, paddingHorizontal: 6, paddingVertical: 3, borderWidth: 2, borderColor: '#000000' },
  stage: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.ink },
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

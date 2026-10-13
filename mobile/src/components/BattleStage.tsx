import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native'
import { CLASS_SPRITES } from '@shared/components/pixel/sprites'
import type { EncounterStyle } from '@shared/data/encounters'
import type { RpgClassId } from '@shared/data/classes'
import type { StageEvent, StageOutcome } from '@shared/lib/game/stage'
import { EncounterPortrait, HpBar } from './game'
import { PixelSprite } from './PixelSprite'
import { PixelText } from './ui'

interface BattleStageProps {
  tier: 'boss' | 'subboss'
  encounter: EncounterStyle
  heroClass: RpgClassId | null
  enemyName: string
  enemySprite: string[]
  enemyImage?: string | null
  hp: number
  maxHp: number
  event: StageEvent | null
  outcome?: StageOutcome
}

const IDLE_MS = 3200
const TILE = 16

/**
 * Interpolación "cuadro a cuadro": cada valor se mantiene fijo hasta el siguiente punto,
 * como una animación de sprites de 16 bits.
 */
function steps(points: Array<[number, number]>) {
  const inputRange: number[] = []
  const outputRange: number[] = []
  points.forEach(([t, v], i) => {
    if (i > 0) {
      inputRange.push(Math.max(t - 0.0001, inputRange[inputRange.length - 1] + 0.00001))
      outputRange.push(points[i - 1][1])
    }
    inputRange.push(t)
    outputRange.push(v)
  })
  return { inputRange, outputRange }
}

// Ciclo de reposo (3,2 s): seis pasos de caminata y un tajo de ambiente al final.
const WALK_Y = steps([
  [0, 0],
  [0.0625, -1],
  [0.125, 0],
  [0.1875, -1],
  [0.25, 0],
  [0.3125, -1],
  [0.375, 0],
  [0.4375, -1],
  [0.5, 0],
  [0.5625, -1],
  [0.625, 0],
  [0.6875, -1],
  [0.75, 0],
  [1, 0],
])
const JAB_X = steps([
  [0, 0],
  [0.82, -0.06],
  [0.88, 0.22],
  [0.94, 0],
  [1, 0],
])
const BREATHE = steps([
  [0, 1],
  [0.25, 1.03],
  [0.5, 1],
  [0.75, 1.03],
  [0.86, 1],
  [1, 1],
])
const FLINCH_X = steps([
  [0, 0],
  [0.88, 0.05],
  [0.92, 0],
  [1, 0],
])

const timing = (value: Animated.Value, toValue: number, duration: number, delay = 0) =>
  Animated.timing(value, { toValue, duration, delay, easing: Easing.step0, useNativeDriver: true })
const smooth = (value: Animated.Value, toValue: number, duration: number, delay = 0) =>
  Animated.timing(value, { toValue, duration, delay, easing: Easing.out(Easing.quad), useNativeDriver: true })

/**
 * Escenario de batalla "idle" fijo en el tercio superior de los combates: el héroe (sprite
 * de su clase) camina sobre un suelo que avanza y lanza tajos al enemigo. Acierto = embestida
 * y tajo con daño; error = el enemigo se lanza contra el héroe. Equivale a BattleStage de la web.
 */
export function BattleStage({
  tier,
  encounter,
  heroClass,
  enemyName,
  enemySprite,
  enemyImage,
  hp,
  maxHp,
  event,
  outcome = 'fighting',
}: BattleStageProps) {
  const { palette } = encounter
  const boss = tier === 'boss'
  const { height: windowHeight } = useWindowDimensions()
  const height = Math.max(190, Math.min(320, Math.round(windowHeight / 3)))
  const [width, setWidth] = useState(0)
  const heroSize = Math.round(height * 0.38)
  const enemySize = Math.round(height * (boss ? 0.58 : 0.46))
  const groundHeight = Math.round(height * 0.16)
  const heroLeft = width * 0.1
  const enemyLeft = width * 0.92 - enemySize
  const reach = Math.max(0, enemyLeft - heroLeft - heroSize * 0.45)
  const heroRows = CLASS_SPRITES[heroClass ?? ''] ?? CLASS_SPRITES.cultivador

  // Bucles de reposo
  const idle = useRef(new Animated.Value(0)).current
  const ground = useRef(new Animated.Value(0)).current
  const hills = useRef(new Animated.Value(0)).current
  // Golpes y desenlace
  const heroDash = useRef(new Animated.Value(0)).current
  const heroRecoil = useRef(new Animated.Value(0)).current
  const enemyShake = useRef(new Animated.Value(0)).current
  const enemyLunge = useRef(new Animated.Value(0)).current
  const enemyBlink = useRef(new Animated.Value(1)).current
  const slash = useRef(new Animated.Value(0)).current
  const damageFloat = useRef(new Animated.Value(0)).current
  const heartFloat = useRef(new Animated.Value(0)).current
  const flash = useRef(new Animated.Value(0)).current
  const finale = useRef(new Animated.Value(0)).current
  const cheer = useRef(new Animated.Value(0)).current

  const fighting = outcome === 'fighting'

  useEffect(() => {
    if (!fighting) return
    const loops = [
      Animated.loop(Animated.timing(idle, { toValue: 1, duration: IDLE_MS, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(Animated.timing(ground, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(Animated.timing(hills, { toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: true })),
    ]
    loops.forEach((l) => l.start())
    return () => loops.forEach((l) => l.stop())
  }, [fighting, idle, ground, hills])

  // Cada respuesta dispara su animación.
  useEffect(() => {
    if (!event) return
    if (event.kind === 'attack') {
      heroDash.setValue(0)
      slash.setValue(0)
      damageFloat.setValue(0)
      enemyShake.setValue(0)
      Animated.parallel([
        Animated.sequence([
          timing(heroDash, -0.1, 180),
          timing(heroDash, 1, 270),
          timing(heroDash, 0.9, 135),
          smooth(heroDash, 0, 315),
        ]),
        Animated.sequence([
          timing(enemyShake, 0.08, 90, 450),
          timing(enemyShake, -0.05, 90),
          timing(enemyShake, 0.03, 135),
          timing(enemyShake, 0, 135),
        ]),
        Animated.sequence([
          timing(enemyBlink, 0.25, 70, 450),
          timing(enemyBlink, 1, 70),
          timing(enemyBlink, 0.25, 70),
          timing(enemyBlink, 1, 70),
        ]),
        Animated.sequence([timing(slash, 1, 90, 400), smooth(slash, 2, 300)]),
        Animated.sequence([Animated.delay(300), smooth(damageFloat, 1, 1100)]),
      ]).start()
    } else {
      enemyLunge.setValue(0)
      heroRecoil.setValue(0)
      flash.setValue(0)
      heartFloat.setValue(0)
      Animated.parallel([
        Animated.sequence([timing(enemyLunge, -0.1, 225), timing(enemyLunge, 1, 225), smooth(enemyLunge, 0, 450)]),
        Animated.sequence([timing(heroRecoil, 1, 100, 400), timing(heroRecoil, 0.5, 180), smooth(heroRecoil, 0, 220)]),
        Animated.sequence([timing(flash, 1, 90, 400), smooth(flash, 0, 400)]),
        smooth(heartFloat, 1, 1100),
      ]).start()
    }
    // Solo se reacciona al cambio de golpe (key), no a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.key])

  // Desenlace: el enemigo cae o el héroe queda tendido.
  useEffect(() => {
    if (fighting) {
      finale.setValue(0)
      return
    }
    smooth(finale, 1, 900).start()
    if (outcome !== 'victory') return
    const loop = Animated.loop(Animated.sequence([timing(cheer, 1, 200), timing(cheer, 0, 200)]))
    loop.start()
    return () => loop.stop()
  }, [fighting, outcome, finale, cheer])

  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width))

  // Suelo de baldosas que avanza a saltos de 8 px; colinas lejanas más lentas.
  const groundX = ground.interpolate(
    steps([
      [0, 0],
      [0.25, -8],
      [0.5, -16],
      [0.75, -24],
      [1, -32],
    ]),
  )
  const hillsX = hills.interpolate({ inputRange: [0, 1], outputRange: [0, -Math.max(width, 1)] })
  const tiles = useMemo(() => Math.ceil((width + TILE * 4) / TILE), [width])
  const hillCount = useMemo(() => Math.ceil((width * 2) / 60) + 1, [width])

  const heroTransform = [
    {
      translateX: Animated.add(
        Animated.add(
          heroDash.interpolate({ inputRange: [-1, 1], outputRange: [-reach, reach] }),
          idle.interpolate({ ...JAB_X, outputRange: JAB_X.outputRange.map((v) => v * heroSize) }),
        ),
        heroRecoil.interpolate({ inputRange: [0, 1], outputRange: [0, -heroSize * 0.25] }),
      ),
    },
    {
      translateY: Animated.add(
        idle.interpolate({ ...WALK_Y, outputRange: WALK_Y.outputRange.map((v) => v * heroSize * 0.05) }),
        cheer.interpolate({ inputRange: [0, 1], outputRange: [0, -heroSize * 0.14] }),
      ),
    },
    { rotate: heroRecoil.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-12deg'] }) },
    { rotate: finale.interpolate({ inputRange: [0, 1], outputRange: ['0deg', outcome === 'defeat' ? '-80deg' : '0deg'] }) },
  ]
  const enemyTransform = [
    {
      translateX: Animated.add(
        Animated.add(
          enemyShake.interpolate({ inputRange: [-1, 1], outputRange: [-enemySize, enemySize] }),
          enemyLunge.interpolate({ inputRange: [-1, 1], outputRange: [reach * 0.7, -reach * 0.7] }),
        ),
        idle.interpolate({ ...FLINCH_X, outputRange: FLINCH_X.outputRange.map((v) => v * enemySize) }),
      ),
    },
    { translateY: finale.interpolate({ inputRange: [0, 1], outputRange: [0, outcome === 'victory' ? enemySize * 0.2 : 0] }) },
    { rotate: finale.interpolate({ inputRange: [0, 1], outputRange: ['0deg', outcome === 'victory' ? '80deg' : '0deg'] }) },
    { scaleY: idle.interpolate(BREATHE) },
  ]

  return (
    <View onLayout={onLayout} style={[styles.stage, { height, backgroundColor: palette.surface }]}>
      {/* Brillo del escenario */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: palette.glow,
            width: height * 1.4,
            height: height * 1.4,
            borderRadius: height,
            top: height * 0.1,
            right: -height * 0.3,
          },
        ]}
      />

      {/* Colinas lejanas */}
      <Animated.View style={[styles.hills, { bottom: groundHeight, transform: [{ translateX: hillsX }] }]}>
        {Array.from({ length: hillCount }, (_, i) => (
          <View
            key={i}
            style={{
              width: i % 2 ? 44 : 76,
              height: i % 2 ? 26 : 44,
              marginLeft: i % 2 ? -14 : -10,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              backgroundColor: palette.frameDark,
              opacity: i % 2 ? 0.45 : 0.6,
            }}
          />
        ))}
      </Animated.View>

      {/* Suelo */}
      <View style={[styles.ground, { height: groundHeight, borderTopColor: palette.frameLight }]}>
        <Animated.View style={[styles.tiles, { transform: [{ translateX: groundX }] }]}>
          {Array.from({ length: tiles }, (_, i) => (
            <View key={i} style={{ width: TILE, height: '100%', backgroundColor: palette.frameDark, opacity: i % 2 ? 0.7 : 1 }} />
          ))}
        </Animated.View>
      </View>

      {/* HUD */}
      <View style={styles.hud}>
        <View style={[styles.badge, { backgroundColor: boss ? palette.secondary : palette.frameDark }]}>
          <PixelText size={7} style={{ color: boss ? '#000' : palette.secondary }}>
            {boss ? '♛ JEFE' : '⚔ SUBJEFE'}
          </PixelText>
        </View>
        <View style={{ flex: 1, maxWidth: '62%', alignItems: 'flex-end' }}>
          <PixelText size={9} numberOfLines={1} style={{ color: palette.primary }}>
            {enemyName}
          </PixelText>
          <View style={{ alignSelf: 'stretch', marginTop: 4 }}>
            <HpBar current={hp} max={maxHp} compact segments={boss ? 20 : 10} />
          </View>
        </View>
      </View>

      {width > 0 && (
        <>
          {/* Héroe */}
          <View style={{ position: 'absolute', left: heroLeft, bottom: groundHeight - 2, width: heroSize, height: heroSize }}>
            <View style={[styles.shadow, { width: heroSize * 0.7, left: heroSize * 0.15 }]} />
            <Animated.View
              style={{
                transform: heroTransform,
                opacity: finale.interpolate({ inputRange: [0, 1], outputRange: [1, outcome === 'defeat' ? 0.5 : 1] }),
              }}
            >
              <PixelSprite rows={heroRows} size={heroSize} />
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.float,
                {
                  opacity: heartFloat.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
                  transform: [{ translateY: heartFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -36] }) }],
                },
              ]}
            >
              <PixelText size={12} tone="blood">
                −1 ♥
              </PixelText>
            </Animated.View>
          </View>

          {/* Enemigo */}
          <View style={{ position: 'absolute', left: enemyLeft, bottom: groundHeight - 4, width: enemySize, height: enemySize }}>
            <View style={[styles.shadow, { width: enemySize * 0.7, left: enemySize * 0.15 }]} />
            <Animated.View
              style={{
                transform: enemyTransform,
                opacity: Animated.multiply(
                  enemyBlink,
                  finale.interpolate({ inputRange: [0, 1], outputRange: [1, outcome === 'victory' ? 0.45 : 1] }),
                ),
              }}
            >
              <EncounterPortrait
                url={enemyImage}
                size={enemySize}
                fallback={<PixelSprite rows={enemySprite} size={enemySize} muted={outcome === 'victory'} />}
              />
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.slash,
                {
                  borderTopColor: '#fff',
                  borderRightColor: palette.secondary,
                  opacity: slash.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 0] }),
                  transform: [
                    { rotate: slash.interpolate({ inputRange: [0, 1, 2], outputRange: ['-35deg', '10deg', '40deg'] }) },
                    { scale: slash.interpolate({ inputRange: [0, 1, 2], outputRange: [0.6, 1, 1.1] }) },
                  ],
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.float,
                {
                  opacity: damageFloat.interpolate({ inputRange: [0, 0.05, 1], outputRange: [0, 1, 0] }),
                  transform: [
                    { translateY: damageFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) },
                    { scale: damageFloat.interpolate({ inputRange: [0, 0.2, 1], outputRange: [1.4, 1, 1] }) },
                  ],
                },
              ]}
            >
              {event?.kind === 'attack' && event.damage ? (
                <PixelText size={14} tone="gold">
                  −{event.damage}
                </PixelText>
              ) : null}
            </Animated.View>
          </View>
        </>
      )}

      {/* Destello rojo al recibir un golpe */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(220, 38, 38, 0.35)', opacity: flash }]}
      />

      {!fighting && (
        <View pointerEvents="none" style={[styles.banner, { bottom: height * 0.3 }]}>
          <PixelText size={14} tone={outcome === 'victory' ? 'gold' : 'blood'}>
            {outcome === 'victory' ? '¡Victoria!' : 'Derrota'}
          </PixelText>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  stage: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  glow: { position: 'absolute', opacity: 0.18 },
  hills: { position: 'absolute', left: 0, flexDirection: 'row', alignItems: 'flex-end' },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 3, backgroundColor: '#000', overflow: 'hidden' },
  tiles: { flexDirection: 'row', height: '100%' },
  hud: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  badge: { borderWidth: 2, borderColor: '#000', paddingHorizontal: 6, paddingVertical: 3 },
  shadow: { position: 'absolute', bottom: -4, height: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.45)' },
  float: { position: 'absolute', top: -6, left: 0, right: 0, alignItems: 'center' },
  slash: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    right: '15%',
    bottom: '10%',
    borderRadius: 999,
    borderTopWidth: 6,
    borderRightWidth: 3,
    borderColor: 'transparent',
  },
  banner: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
})

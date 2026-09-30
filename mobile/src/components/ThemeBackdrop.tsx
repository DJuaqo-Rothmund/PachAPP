import { memo, useEffect, useRef } from 'react'
import { AccessibilityInfo, Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native'
import Svg, { Circle, Defs, Line, Path, Pattern, Rect } from 'react-native-svg'
import type { ThemeMotif } from '@shared/data/classes'

interface Tile {
  w: number
  h: number
  /** Desplazamiento por ciclo de animación (0 = estático). */
  dx?: number
  dy?: number
  duration?: number
  opacity: number
  draw: (color: string) => React.ReactNode
}

// Los mismos motivos que la web (src/index.css), simplificados a una baldosa SVG.
const TILES: Record<ThemeMotif, Tile> = {
  water: {
    w: 160, h: 48, dx: -160, duration: 9000, opacity: 0.14,
    draw: (c) => <Path d="M0 24 Q20 12 40 24 T80 24 T120 24 T160 24" stroke={c} strokeWidth={1.6} fill="none" />,
  },
  arcane: {
    w: 80, h: 80, opacity: 0.2,
    draw: (c) => (
      <>
        <Circle cx={10} cy={12} r={1.4} fill={c} />
        <Circle cx={52} cy={46} r={1} fill={c} />
        <Circle cx={30} cy={70} r={0.8} fill={c} />
      </>
    ),
  },
  soil: {
    w: 46, h: 46, opacity: 0.16,
    draw: (c) => (
      <>
        <Circle cx={4} cy={4} r={1.5} fill={c} />
        <Circle cx={27} cy={21} r={1} fill={c} />
      </>
    ),
  },
  harvest: {
    w: 110, h: 110, opacity: 0.14,
    draw: (c) => (
      <>
        <Circle cx={8} cy={8} r={3} fill={c} />
        <Circle cx={63} cy={78} r={2} fill={c} />
      </>
    ),
  },
  circuit: {
    w: 44, h: 44, opacity: 0.1,
    draw: (c) => (
      <>
        <Line x1={0} y1={0.5} x2={44} y2={0.5} stroke={c} strokeWidth={1} />
        <Line x1={0.5} y1={0} x2={0.5} y2={44} stroke={c} strokeWidth={1} />
        <Circle cx={0.5} cy={0.5} r={2} fill={c} />
      </>
    ),
  },
  bubbles: {
    w: 96, h: 120, dy: -120, duration: 14000, opacity: 0.18,
    draw: (c) => (
      <>
        <Circle cx={10} cy={10} r={5} stroke={c} strokeWidth={1} fill="none" />
        <Circle cx={58} cy={70} r={3} stroke={c} strokeWidth={1} fill="none" />
      </>
    ),
  },
  furrow: {
    w: 28, h: 28, opacity: 0.1,
    draw: (c) => <Line x1={0} y1={0} x2={28} y2={28} stroke={c} strokeWidth={2} />,
  },
  forest: {
    w: 120, h: 120, dy: 120, duration: 24000, opacity: 0.12,
    draw: (c) => (
      <Path d="M30 20 C40 10 52 14 54 26 C44 30 34 30 30 20Z M90 80 C98 70 110 74 110 86 C100 88 94 88 90 80Z" fill={c} />
    ),
  },
}

/** Fondo decorativo de la skin de clase, detrás del contenido de cada pantalla. */
export const ThemeBackdrop = memo(function ThemeBackdrop({ motif, color }: { motif: ThemeMotif; color: string }) {
  const tile = TILES[motif]
  const { width, height } = useWindowDimensions()
  const progress = useRef(new Animated.Value(0)).current
  const animated = Boolean(tile.dx || tile.dy)

  useEffect(() => {
    if (!animated) return
    let loop: Animated.CompositeAnimation | null = null
    let cancelled = false
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce || cancelled) return
      progress.setValue(0)
      loop = Animated.loop(
        Animated.timing(progress, { toValue: 1, duration: tile.duration, easing: Easing.linear, useNativeDriver: true }),
      )
      loop.start()
    })
    return () => {
      cancelled = true
      loop?.stop()
    }
  }, [animated, progress, tile.duration])

  // Negativo: se desliza hacia la izquierda/arriba; positivo: parte corrido y vuelve a 0.
  const range = (d = 0) => (d < 0 ? [0, d] : [-d, 0])
  const translate = [
    { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: range(tile.dx) }) },
    { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: range(tile.dy) }) },
  ]

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: tile.opacity, transform: translate }]}>
      <Svg width={width + tile.w} height={height + tile.h}>
        <Defs>
          <Pattern id={`motif-${motif}`} width={tile.w} height={tile.h} patternUnits="userSpaceOnUse">
            {tile.draw(color)}
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#motif-${motif})`} />
      </Svg>
    </Animated.View>
  )
})

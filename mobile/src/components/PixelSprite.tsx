import { memo } from 'react'
import Svg, { Rect } from 'react-native-svg'
import { PALETTE, spriteRuns } from '@shared/components/pixel/sprites'

interface PixelSpriteProps {
  rows: string[]
  size: number
  /** Dibuja el sprite en gris (emblemas bloqueados, jefes derrotados). */
  muted?: boolean
}

/** Sprite pixel art como SVG nítido. Usa las mismas matrices que la web. */
export const PixelSprite = memo(function PixelSprite({ rows, size, muted = false }: PixelSpriteProps) {
  const width = rows[0]?.length ?? 0
  const height = rows.length

  return (
    <Svg width={size} height={(size * height) / Math.max(width, 1)} viewBox={`0 0 ${width} ${height}`} opacity={muted ? 0.35 : 1}>
      {spriteRuns(rows).map(({ x, y, length, ch }) => (
        <Rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={length + 0.02}
          height={1.02}
          fill={muted ? '#6b7280' : (PALETTE[ch] ?? '#ff00ff')}
        />
      ))}
    </Svg>
  )
})

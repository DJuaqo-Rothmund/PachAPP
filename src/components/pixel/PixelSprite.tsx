import { memo } from 'react'
import { PALETTE } from './sprites'

interface PixelSpriteProps {
  rows: string[]
  className?: string
  title?: string
}

/** Dibuja un sprite pixel art como SVG nítido a cualquier tamaño. */
export const PixelSprite = memo(function PixelSprite({ rows, className, title }: PixelSpriteProps) {
  const width = rows[0]?.length ?? 0
  const height = rows.length

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PALETTE[ch] ?? '#ff00ff'} />,
        ),
      )}
    </svg>
  )
})

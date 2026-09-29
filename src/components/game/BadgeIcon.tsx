import { PixelSprite } from '../pixel/PixelSprite'
import { BADGE_SPRITES } from '../pixel/sprites'

interface BadgeIconProps {
  icon: string
  locked?: boolean
  className?: string
}

export function BadgeIcon({ icon, locked = false, className = 'h-12 w-12' }: BadgeIconProps) {
  const rows = BADGE_SPRITES[icon] ?? BADGE_SPRITES.book
  return (
    <div className={`${className} ${locked ? 'opacity-30 grayscale' : ''}`}>
      <PixelSprite rows={rows} className="h-full w-full" />
    </div>
  )
}

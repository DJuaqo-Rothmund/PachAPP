import { RPG_CLASSES, type RpgClassId } from '../../data/classes'
import { PixelSprite } from '../pixel/PixelSprite'
import { CLASS_SPRITES } from '../pixel/sprites'

interface ClassAvatarProps {
  rpgClass: RpgClassId | null
  className?: string
}

export function ClassAvatar({ rpgClass, className = 'h-12 w-12' }: ClassAvatarProps) {
  const cls = RPG_CLASSES.find((c) => c.id === rpgClass)
  if (!cls) {
    return <div className={`${className} rounded bg-stone`} aria-hidden />
  }
  return <PixelSprite rows={CLASS_SPRITES[cls.id]} className={className} title={cls.name} />
}

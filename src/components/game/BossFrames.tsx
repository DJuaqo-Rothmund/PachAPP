import type { ReactNode } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { bossSprite, subbossSprite } from '../pixel/sprites'

interface FrameProps {
  name: string
  title?: string
  defeated?: boolean
  /** Clave para reiniciar la animación de golpe. */
  hitKey?: number
  /** Número de daño flotante. */
  damage?: number
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

/**
 * Jefe cooperativo: marco dorado y carmesí con remaches, aura pulsante y sello
 * "JEFE COOPERATIVO". Es el enemigo que toda la comunidad golpea a la vez.
 */
export function CoopBossFrame({
  bossId,
  name,
  title,
  defeated,
  hitKey = 0,
  damage,
  size = 'lg',
  children,
}: FrameProps & { bossId: string }) {
  const box = { sm: 'h-16 w-16', md: 'h-28 w-28', lg: 'h-36 w-36 sm:h-44 sm:w-44' }[size]
  const sprite = { sm: 'h-14 w-14', md: 'h-24 w-24', lg: 'h-32 w-32 sm:h-40 sm:w-40' }[size]
  return (
    <div className="boss-frame boss-frame--coop">
      <span className="boss-frame__seal">♛ Jefe cooperativo</span>
      <div className="flex items-center gap-4">
        <div className={`boss-frame__stage boss-aura relative flex shrink-0 items-center justify-center ${box}`}>
          <div key={hitKey} className={hitKey > 0 ? 'animate-hit' : ''}>
            <PixelSprite
              rows={bossSprite(bossId)}
              title={name}
              className={`${sprite} ${defeated ? 'rotate-12 opacity-40 grayscale' : ''}`}
            />
          </div>
          {hitKey > 0 && damage ? (
            <span key={`dmg-${hitKey}`} className="animate-float-up pixel-title absolute top-1 text-sm text-gold">
              −{damage}
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={`boss-frame__name title-pixel ${size === 'sm' ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>{name}</h2>
          {title && <p className="font-title mt-1 text-lg leading-none text-gold/80">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Subjefe: marco de piedra y acero, más compacto, con sello "SUBJEFE".
 * Es un duelo individual: su HP es solo tuyo.
 */
export function SubbossFrame({
  submoduleId,
  name,
  title,
  defeated,
  hitKey = 0,
  damage,
  size = 'md',
  children,
}: FrameProps & { submoduleId: string }) {
  const box = { sm: 'h-14 w-14', md: 'h-24 w-24', lg: 'h-32 w-32' }[size]
  const sprite = { sm: 'h-12 w-12', md: 'h-20 w-20', lg: 'h-28 w-28' }[size]
  return (
    <div className="boss-frame boss-frame--sub">
      <span className="boss-frame__seal">⚔ Subjefe</span>
      <div className="flex items-center gap-4">
        <div className={`boss-frame__stage relative flex shrink-0 items-center justify-center ${box}`}>
          <div key={hitKey} className={hitKey > 0 ? 'animate-hit' : ''}>
            <PixelSprite
              rows={subbossSprite(submoduleId)}
              title={name}
              className={`${sprite} ${defeated ? 'opacity-40 grayscale' : ''}`}
            />
          </div>
          {hitKey > 0 && damage ? (
            <span key={`dmg-${hitKey}`} className="animate-float-up pixel-title absolute top-0 text-xs text-gold">
              −{damage}
            </span>
          ) : null}
          {defeated && (
            <span className="pixel-title absolute -bottom-1 -right-1 rounded bg-gold px-1 text-[8px] text-void">✓</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`boss-frame__name title-pixel ${size === 'sm' ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>{name}</h3>
          {title && <p className="font-title mt-1 text-base leading-none text-mist">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}

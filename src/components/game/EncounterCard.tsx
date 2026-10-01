import { useState, type CSSProperties, type ReactNode } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { isBgTheme, type EncounterStyle } from '../../data/encounters'

export type EncounterTier = 'boss' | 'subboss'

interface EncounterCardProps {
  tier: EncounterTier
  /** Estilo del encuentro (de src/data/encounters.ts). */
  encounter: EncounterStyle
  name: string
  title?: string
  /** Imagen de la base de datos; si es null se usa la del config, y si tampoco hay, el sprite pixel. */
  spriteUrl?: string | null
  /** Fondo de la base de datos; si es null o desconocido se usa el del config. */
  bgTheme?: string | null
  /** Sprite pixel de respaldo (matriz de PALETTE). */
  fallbackSprite: string[]
  defeated?: boolean
  /** Clave para reiniciar la animación de golpe y número de daño flotante. */
  hitKey?: number
  damage?: number
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

const STAGE_SIZE = {
  boss: { sm: 'h-20 w-20', md: 'h-32 w-32', lg: 'h-40 w-40 sm:h-48 sm:w-48' },
  subboss: { sm: 'h-16 w-16', md: 'h-24 w-24', lg: 'h-32 w-32' },
}
const NAME_SIZE = {
  boss: { sm: 'text-2xl', md: 'text-3xl', lg: 'text-3xl sm:text-4xl' },
  subboss: { sm: 'text-xl', md: 'text-2xl', lg: 'text-2xl sm:text-3xl' },
}

/**
 * Tarjeta universal de encuentro (jefe cooperativo o subjefe) al estilo RPG de 16 bits.
 *
 * Estructura: marco texturizado (.frame-*) → interior oscuro con bisel → escenario de
 * batalla (.bg-*) con el retrato del enemigo. Volumen 3D con sombras sólidas y bordes
 * rectos; nada de bordes web modernos.
 *
 * Jefe: marco grueso, remaches, sello "Jefe cooperativo" y aura que late.
 * Subjefe: mismo material del módulo en versión menor (marco delgado, sin aura).
 */
export function EncounterCard({
  tier,
  encounter,
  name,
  title,
  spriteUrl,
  bgTheme,
  fallbackSprite,
  defeated = false,
  hitKey = 0,
  damage,
  size = tier === 'boss' ? 'lg' : 'md',
  children,
}: EncounterCardProps) {
  const boss = tier === 'boss'
  const { palette } = encounter
  const image = spriteUrl ?? encounter.spriteUrl
  const background = isBgTheme(bgTheme) ? bgTheme : encounter.bgTheme
  // Si la imagen no carga (aún no se sube), se vuelve al sprite pixel.
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image) && !imageFailed

  const vars = {
    '--enc-primary': palette.primary,
    '--enc-secondary': palette.secondary,
    '--enc-glow': palette.glow,
    '--enc-frame-light': palette.frameLight,
    '--enc-frame-dark': palette.frameDark,
    '--enc-surface': palette.surface,
  } as CSSProperties

  return (
    <div
      style={vars}
      data-tier={tier}
      className={`encounter frame-${encounter.frame} relative ${
        boss ? 'p-[7px] shadow-[6px_6px_0_0_rgba(0,0,0,1)]' : 'p-[4px] shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
      } outline-2 outline-black`}
    >
      {/* Sello del rango */}
      <span
        className={`font-pixel absolute -top-3 left-4 z-10 border-2 border-black px-2 py-1 text-[8px] uppercase tracking-wider shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${
          boss ? 'bg-[var(--enc-secondary)] text-black' : 'bg-[var(--enc-frame-dark)] text-[var(--enc-secondary)]'
        }`}
      >
        {boss ? '♛ Jefe cooperativo' : '⚔ Subjefe'}
      </span>

      {/* Remaches del jefe */}
      {boss && <span aria-hidden className="encounter__rivets" />}

      <div
        className="relative flex items-center gap-4 bg-[var(--enc-surface)] px-4 pb-4 pt-6 shadow-[inset_3px_3px_0_0_rgba(255,255,255,0.08),inset_-3px_-3px_0_0_rgba(0,0,0,0.6)]"
      >
        {/* Escenario de batalla con el retrato */}
        <div
          className={`${background} encounter__stage relative flex shrink-0 items-center justify-center overflow-hidden border-[3px] border-black ${
            STAGE_SIZE[tier][size]
          } ${boss && !defeated ? 'encounter__stage--aura' : ''}`}
        >
          <div key={hitKey} className={`relative h-full w-full ${hitKey > 0 ? 'animate-hit' : ''}`}>
            {showImage ? (
              <img
                src={image!}
                alt={name}
                onError={() => setImageFailed(true)}
                className={`h-full w-full object-contain [image-rendering:pixelated] ${defeated ? 'opacity-40 grayscale' : ''}`}
              />
            ) : (
              <PixelSprite
                rows={fallbackSprite}
                title={name}
                className={`h-full w-full p-1.5 ${defeated ? (boss ? 'rotate-12 opacity-40 grayscale' : 'opacity-40 grayscale') : ''}`}
              />
            )}
          </div>
          {hitKey > 0 && damage ? (
            <span key={`dmg-${hitKey}`} className="animate-float-up font-title absolute top-1 text-3xl leading-none text-gold [text-shadow:2px_2px_0_#000]">
              −{damage}
            </span>
          ) : null}
          {defeated && (
            <span className="font-pixel absolute bottom-1 right-1 border-2 border-black bg-gold px-1 text-[8px] text-black">✓</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {boss ? (
            <h2 className={`title-pixel ${NAME_SIZE.boss[size]} text-[var(--enc-primary)]`}>{name}</h2>
          ) : (
            <h3 className={`title-pixel ${NAME_SIZE.subboss[size]} text-[var(--enc-primary)]`}>{name}</h3>
          )}
          {title && <p className="font-title mt-1 text-lg leading-none text-[var(--enc-secondary)] opacity-90">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { EncounterCard } from './EncounterCard'
import { bossSprite, subbossSprite } from '../pixel/sprites'
import { encounterForBoss, encounterForSubmodule } from '../../data/encounters'

interface FrameProps {
  name: string
  title?: string
  defeated?: boolean
  /** Clave para reiniciar la animación de golpe. */
  hitKey?: number
  /** Número de daño flotante. */
  damage?: number
  size?: 'sm' | 'md' | 'lg'
  /** Imagen y fondo desde la base de datos (sprite_url / bg_theme). */
  spriteUrl?: string | null
  bgTheme?: string | null
  children?: ReactNode
}

/** Jefe cooperativo: EncounterCard con el estilo de su módulo. */
export function CoopBossFrame({ bossId, size = 'lg', ...props }: FrameProps & { bossId: string }) {
  return <EncounterCard tier="boss" encounter={encounterForBoss(bossId)} fallbackSprite={bossSprite(bossId)} size={size} {...props} />
}

/** Subjefe: EncounterCard menor con el material del módulo al que pertenece. */
export function SubbossFrame({ submoduleId, size = 'md', ...props }: FrameProps & { submoduleId: string }) {
  return (
    <EncounterCard
      tier="subboss"
      encounter={encounterForSubmodule(submoduleId)}
      fallbackSprite={subbossSprite(submoduleId)}
      size={size}
      {...props}
    />
  )
}

import { useState, type CSSProperties } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { CLASS_SPRITES } from '../pixel/sprites'
import { HpBar } from './HpBar'
import { isBgTheme, type EncounterStyle } from '../../data/encounters'
import type { RpgClassId } from '../../data/classes'
import type { StageEvent, StageOutcome } from '../../lib/game/stage'

interface BattleStageProps {
  tier: 'boss' | 'subboss'
  encounter: EncounterStyle
  heroClass: RpgClassId | null
  enemyName: string
  enemySprite: string[]
  enemyImage?: string | null
  bgTheme?: string | null
  hp: number
  maxHp: number
  event: StageEvent | null
  outcome?: StageOutcome
}

/**
 * Escenario de batalla "idle" para el tercio superior de los combates: el héroe (sprite
 * de su clase) camina sobre un suelo que avanza y lanza tajos al enemigo. Cada respuesta
 * dispara una animación: acierto = embestida y tajo con daño; error = el enemigo ataca.
 */
export function BattleStage({
  tier,
  encounter,
  heroClass,
  enemyName,
  enemySprite,
  enemyImage,
  bgTheme,
  hp,
  maxHp,
  event,
  outcome = 'fighting',
}: BattleStageProps) {
  const { palette } = encounter
  const background = isBgTheme(bgTheme) ? bgTheme : encounter.bgTheme
  const image = enemyImage ?? encounter.spriteUrl
  const [imageFailed, setImageFailed] = useState(false)
  const boss = tier === 'boss'
  const heroRows = CLASS_SPRITES[heroClass ?? ''] ?? CLASS_SPRITES.cultivador
  const attack = event?.kind === 'attack' ? event : null
  const hurt = event?.kind === 'hurt' ? event : null

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
      data-outcome={outcome}
      className={`battle-stage ${background} relative h-[34vh] min-h-[200px] max-h-[340px] overflow-hidden border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]`}
    >
      {/* Paisaje: colinas lejanas y suelo que avanzan mientras el héroe camina */}
      <div aria-hidden className="battle-stage__hills" />
      <div aria-hidden className="battle-stage__ground" />

      {/* HUD: nombre y vida del enemigo */}
      <div className="absolute inset-x-2 top-2 z-20 flex items-start justify-between gap-3">
        <span
          className={`font-pixel shrink-0 border-2 border-black px-2 py-1 text-[8px] uppercase tracking-wider shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${
            boss ? 'bg-[var(--enc-secondary)] text-black' : 'bg-[var(--enc-frame-dark)] text-[var(--enc-secondary)]'
          }`}
        >
          {boss ? '♛ Jefe' : '⚔ Subjefe'}
        </span>
        <div className="w-full max-w-[60%] text-right">
          <p className="title-pixel truncate text-xl leading-none text-[var(--enc-primary)] [text-shadow:2px_2px_0_#000] sm:text-2xl">
            {enemyName}
          </p>
          <div className="mt-1">
            <HpBar current={hp} max={maxHp} size="sm" segments={boss ? 20 : 10} />
          </div>
        </div>
      </div>

      {/* Héroe */}
      <div className="battle-stage__hero absolute bottom-[14%] left-[12%] z-10 aspect-square h-[38%]">
        <div
          key={`hero-${event?.key ?? 0}-${event?.kind ?? ''}`}
          className={`h-full w-full ${attack ? 'battle-hero--attack' : hurt ? 'battle-hero--hurt' : ''}`}
        >
          <div className="battle-hero__body h-full w-full">
            <PixelSprite rows={heroRows} className="h-full w-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]" />
          </div>
        </div>
        <span aria-hidden className="battle-stage__shadow" />
        {hurt && (
          <span
            key={`hurt-${hurt.key}`}
            className="animate-float-up font-title absolute inset-x-0 -top-2 text-center text-3xl leading-none text-blood [text-shadow:2px_2px_0_#000]"
          >
            −1 ♥
          </span>
        )}
      </div>

      {/* Enemigo */}
      <div className={`battle-stage__enemy absolute bottom-[12%] right-[8%] z-10 aspect-square ${boss ? 'h-[60%]' : 'h-[48%]'}`}>
        <div
          key={`enemy-${event?.key ?? 0}-${event?.kind ?? ''}`}
          className={`h-full w-full ${attack ? 'battle-enemy--hit' : hurt ? 'battle-enemy--lunge' : ''}`}
        >
          <div className="battle-enemy__body h-full w-full">
            {image && !imageFailed ? (
              <img
                src={image}
                alt={enemyName}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-contain [image-rendering:pixelated]"
              />
            ) : (
              <PixelSprite
                rows={enemySprite}
                title={enemyName}
                className="h-full w-full drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)]"
              />
            )}
          </div>
        </div>
        <span aria-hidden className="battle-stage__shadow" />
        {attack && <span key={`slash-${attack.key}`} aria-hidden className="battle-slash" />}
        {attack?.damage ? (
          <span
            key={`dmg-${attack.key}`}
            className="battle-damage font-title absolute inset-x-0 top-0 text-center text-4xl leading-none text-gold [text-shadow:2px_2px_0_#000]"
          >
            −{attack.damage}
          </span>
        ) : null}
      </div>

      {/* Destello rojo al recibir un golpe */}
      {hurt && <div key={`flash-${hurt.key}`} aria-hidden className="battle-stage__flash" />}

      {outcome !== 'fighting' && (
        <div className="absolute inset-x-0 bottom-[30%] z-20 text-center">
          <p
            className={`title-pixel text-3xl [text-shadow:3px_3px_0_#000] sm:text-4xl ${outcome === 'victory' ? 'text-gold' : 'text-blood'}`}
          >
            {outcome === 'victory' ? '¡Victoria!' : 'Derrota'}
          </p>
        </div>
      )}
    </div>
  )
}

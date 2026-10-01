import { PixelSprite } from '../pixel/PixelSprite'
import { formatLivesCountdown } from '../../lib/game/lives'
import type { LivesStatus } from '../../lib/game'

const HEART = ['.RR.RR.', 'RXRRRRR', 'RRRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...']
const HEART_EMPTY = ['.tt.tt.', 't..t..t', 't.....t', 't.....t', '.t...t.', '..t.t..', '...t...']
const HEART_MASTER = ['.YY.YY.', 'YyYYYYY', 'YYYYYYY', 'YYYYYYY', '.YYYYY.', '..YYY..', '...Y...']

interface LivesHeartsProps {
  lives: LivesStatus | null
  /** Muestra el tiempo que falta para recuperar vidas. */
  showCountdown?: boolean
  size?: 'sm' | 'lg'
}

/** Vidas del día como corazones pixel. En modo maestro los corazones son dorados (∞). */
export function LivesHearts({ lives, showCountdown = false, size = 'sm' }: LivesHeartsProps) {
  if (!lives) return null
  const box = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
  const label = lives.unlimited ? 'Vidas ilimitadas (modo maestro)' : `${lives.lives} de ${lives.maxLives} vidas`

  return (
    <div className="flex items-center gap-2" title={label} aria-label={label}>
      <div className="flex gap-0.5">
        {Array.from({ length: lives.maxLives }, (_, i) => (
          <PixelSprite
            key={i}
            rows={lives.unlimited ? HEART_MASTER : i < lives.lives ? HEART : HEART_EMPTY}
            className={`${box} ${!lives.unlimited && i >= lives.lives ? 'opacity-60' : ''}`}
          />
        ))}
      </div>
      {lives.unlimited && <span className="pixel-title text-[9px] text-gold">∞</span>}
      {showCountdown && !lives.unlimited && lives.lives < lives.maxLives && (
        <span className="text-[11px] text-mist">recarga {formatLivesCountdown(lives.resetsAt)}</span>
      )}
    </div>
  )
}

/** Pantalla de "sin vidas" con cuenta regresiva hasta las 00:00. */
export function OutOfLives({ lives }: { lives: LivesStatus | null }) {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <LivesHearts lives={lives} size="lg" />
      </div>
      <p className="pixel-title mt-4 text-xs text-blood">Sin vidas por hoy</p>
      <p className="mt-3 text-sm text-mist">
        Te equivocaste 3 veces. Tus vidas vuelven a las 00:00 (hora de Chile)
        {lives ? `, ${formatLivesCountdown(lives.resetsAt)}` : ''}. Mientras tanto puedes repasar el Códice o entrenar: el
        entrenamiento no gasta vidas.
      </p>
    </div>
  )
}

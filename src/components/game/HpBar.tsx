import { useEffect, useState } from 'react'

interface HpBarProps {
  current: number
  max: number
  /** lg: barra gruesa con marco pesado (combates). sm: versión compacta (tarjetas). */
  size?: 'sm' | 'lg'
  /** Cantidad de segmentos visibles. Por defecto 20 en lg y 10 en sm. */
  segments?: number
  label?: string
}

/** Color de la vida según cuánto queda: rojo sangre → brasa → oro. */
function fillColors(pct: number): [string, string] {
  if (pct > 50) return ['#f0574a', '#a3241b']
  if (pct > 20) return ['#f59a3c', '#b4521a']
  return ['#f7d14d', '#b8860b']
}

/**
 * Barra de HP segmentada y encajada en un marco de hierro, como en los juegos de
 * pelea clásicos. Al recibir daño, un "rastro" claro baja con retraso para que
 * el golpe se note.
 */
export function HpBar({ current, max, size = 'lg', segments, label = 'HP' }: HpBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const count = segments ?? (size === 'lg' ? 20 : 10)
  const [trail, setTrail] = useState(pct)
  const [from, to] = fillColors(pct)
  const lg = size === 'lg'

  // El rastro de daño alcanza a la vida real después de un instante.
  useEffect(() => {
    if (pct >= trail) {
      setTrail(pct)
      return
    }
    const t = window.setTimeout(() => setTrail(pct), 450)
    return () => window.clearTimeout(t)
  }, [pct, trail])

  return (
    <div>
      {lg && (
        <div className="mb-1 flex items-end justify-between">
          <span className="font-title text-xl leading-none text-blood" style={{ textShadow: '2px 2px 0 #000' }}>
            {label}
          </span>
          <span className="font-title text-xl leading-none text-bone" style={{ textShadow: '2px 2px 0 #000' }}>
            {current.toLocaleString('es-CL')} / {max.toLocaleString('es-CL')}
          </span>
        </div>
      )}
      {/* Marco pesado de hierro */}
      <div
        className={lg ? 'p-[3px]' : 'p-[2px]'}
        style={{
          background: 'linear-gradient(180deg, #6b5e52, #3b332c)',
          boxShadow: '0 0 0 2px #0a0907, inset 1px 1px 0 rgb(255 255 255 / 0.2), inset -1px -1px 0 rgb(0 0 0 / 0.5)',
        }}
      >
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-label={`${label} del jefe`}
          className={`relative overflow-hidden ${lg ? 'h-6' : 'h-3'}`}
          style={{ background: '#0d0b09', boxShadow: 'inset 2px 2px 0 rgb(0 0 0 / 0.7)' }}
        >
          {/* Rastro del daño reciente */}
          <div className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out" style={{ width: `${trail}%`, background: '#fff3c4' }} />
          {/* Vida actual */}
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%`, background: `linear-gradient(180deg, ${from} 0%, ${from} 45%, ${to} 100%)` }}
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-white/35" />
          </div>
          {/* Separadores de segmentos */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `repeating-linear-gradient(90deg, transparent 0, transparent calc(100% / ${count} - 2px), #0d0b09 calc(100% / ${count} - 2px), #0d0b09 calc(100% / ${count}))`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

interface HpBarProps {
  current: number
  max: number
  size?: 'sm' | 'lg'
}

export function HpBar({ current, max, size = 'lg' }: HpBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const color = pct > 50 ? 'bg-blood' : pct > 20 ? 'bg-orange-500' : 'bg-gold'

  return (
    <div>
      {size === 'lg' && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="pixel-title text-blood">HP</span>
          <span className="pixel-title text-bone">
            {current} / {max}
          </span>
        </div>
      )}
      <div
        className={`overflow-hidden rounded border border-rune bg-stone ${size === 'lg' ? 'h-5' : 'h-2'}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-label="HP del jefe"
      >
        <div className={`h-full ${color} transition-[width] duration-700 ease-out`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

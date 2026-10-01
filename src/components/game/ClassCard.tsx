import type { RpgClass } from '../../data/classes'
import type { ClassUnlockState } from '../../data/classes'
import { skinScope } from '../../lib/skin'
import { ClassAvatar } from './ClassAvatar'

interface ClassCardProps {
  cls: RpgClass
  unlock: ClassUnlockState
  selected: boolean
  onSelect: () => void
}

/**
 * Tarjeta de clase con su propia skin: `skinScope()` inyecta las variables
 * (--skin-accent, --skin-border, --skin-glow…) solo en esta tarjeta, así cada una
 * se pinta con los colores de su clase aunque el jugador tenga otra activa.
 * El CSS de `.class-card[data-skin=…]` agrega detalles propios de cada skin.
 */
export function ClassCard({ cls, unlock, selected, onSelect }: ClassCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!unlock.selectable}
      aria-pressed={selected}
      {...skinScope(cls.id, cls.theme)}
      className="panel class-card text-left transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="class-card__stage well relative flex h-40 items-end justify-center pb-2">
        <span className="class-card__badge font-title absolute left-2 top-2 px-1.5 pt-0.5 text-base leading-none">{cls.specialty}</span>
        {selected && <span className="font-title absolute right-2 top-2 text-lg leading-none text-[var(--skin-accent)]">✦ Elegida</span>}
        <ClassAvatar rpgClass={cls.id} className="relative h-28 w-28 drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]" />
      </div>
      <h2 className="title-pixel mt-4 text-3xl text-[var(--skin-accent)]">{cls.name}</h2>
      <p className="mt-2 text-sm text-mist">{cls.description}</p>
      {unlock.requirement && (
        <p className="well mt-3 px-2 py-1 text-xs text-mist">
          {unlock.earned ? '🔓 Recompensa obtenida' : `🔒 Recompensa: ${unlock.requirement}`}
          {!unlock.earned && unlock.selectable && <span className="text-gold"> · libre durante la beta</span>}
        </p>
      )}
    </button>
  )
}

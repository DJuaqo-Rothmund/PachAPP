import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Badge } from '../data/types'
import { BadgeIcon } from '../components/game/BadgeIcon'
import { loadBadgeCatalog } from '../lib/game/badgeCatalog'

interface Toast {
  id: number
  badge: Badge
}

interface ToastContextValue {
  /** Muestra una notificación de "¡Loot obtenido!" por cada emblema nuevo. */
  announceBadges: (badgeIds: string[]) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const announceBadges = useCallback((badgeIds: string[]) => {
    if (badgeIds.length === 0) return
    loadBadgeCatalog()
      .then((catalog) => {
        const fresh = badgeIds
          .map((id) => catalog.find((b) => b.id === id))
          .filter((b): b is Badge => Boolean(b))
          .map((badge) => ({ id: nextId++, badge }))
        setToasts((t) => [...t, ...fresh])
        for (const toast of fresh) {
          setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toast.id)), 5000)
        }
      })
      .catch(() => {
        // Sin catálogo no hay notificación; el emblema igual queda en el perfil.
      })
  }, [])

  return (
    <ToastContext.Provider value={{ announceBadges }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end">
        {toasts.map(({ id, badge }) => (
          <div
            key={id}
            role="status"
            className="panel pointer-events-auto flex w-full max-w-sm items-center gap-3 border-gold/60 py-3"
          >
            <BadgeIcon icon={badge.icon} className="h-10 w-10" />
            <div>
              <p className="pixel-title text-[10px] text-gold">¡Loot obtenido!</p>
              <p className="mt-1 text-sm font-semibold">{badge.name}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

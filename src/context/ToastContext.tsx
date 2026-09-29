import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { BADGES } from '../data/seed'
import { BadgeIcon } from '../components/game/BadgeIcon'

interface Toast {
  id: number
  badgeId: string
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
    const fresh = badgeIds.map((badgeId) => ({ id: nextId++, badgeId }))
    setToasts((t) => [...t, ...fresh])
    for (const toast of fresh) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toast.id)), 5000)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ announceBadges }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end">
        {toasts.map((t) => {
          const badge = BADGES.find((b) => b.id === t.badgeId)
          if (!badge) return null
          return (
            <div
              key={t.id}
              role="status"
              className="panel pointer-events-auto flex w-full max-w-sm items-center gap-3 border-gold/60 py-3"
            >
              <BadgeIcon icon={badge.icon} className="h-10 w-10" />
              <div>
                <p className="pixel-title text-[10px] text-gold">¡Loot obtenido!</p>
                <p className="mt-1 text-sm font-semibold">{badge.name}</p>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

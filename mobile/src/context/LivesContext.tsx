import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { gameApi, type LivesStatus } from '@/lib/game'
import { useProfile } from './ProfileContext'

interface LivesContextValue {
  lives: LivesStatus | null
  refresh: () => Promise<void>
  /** Actualiza las vidas con lo que devolvió una respuesta, sin otra llamada al servidor. */
  setLivesLeft: (left: number) => void
}

const LivesContext = createContext<LivesContextValue | null>(null)

export function LivesProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile()
  const [lives, setLives] = useState<LivesStatus | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLives(await gameApi.getLives())
    } catch {
      // Sin vidas visibles no se rompe nada: el servidor igual las exige.
    }
  }, [])

  // Recarga al cambiar de cuenta o de modo maestro.
  const profileId = profile?.id
  const isTester = profile?.isTester
  useEffect(() => {
    if (profileId) void refresh()
    else setLives(null)
  }, [refresh, profileId, isTester])

  // Al pasar las 00:00 vuelven las vidas.
  useEffect(() => {
    if (!lives || lives.unlimited) return
    const ms = new Date(lives.resetsAt).getTime() - Date.now()
    if (ms > 2 ** 31 - 1) return
    const timer = setTimeout(() => void refresh(), Math.max(1000, ms + 1000))
    return () => clearTimeout(timer)
  }, [lives, refresh])

  const setLivesLeft = useCallback((left: number) => {
    setLives((current) => (current ? { ...current, lives: current.unlimited ? current.lives : left } : current))
  }, [])

  return <LivesContext.Provider value={{ lives, refresh, setLivesLeft }}>{children}</LivesContext.Provider>
}

export function useLives(): LivesContextValue {
  const ctx = useContext(LivesContext)
  if (!ctx) throw new Error('useLives debe usarse dentro de <LivesProvider>')
  return ctx
}

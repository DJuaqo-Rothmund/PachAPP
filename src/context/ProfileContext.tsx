import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { gameApi, type Profile } from '../lib/game'
import { useAuth } from './AuthContext'

interface ProfileContextValue {
  profile: Profile | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, demoMode } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const canLoad = demoMode || Boolean(user)
  // Cuenta para la que se cargó el perfil. Al restaurar la sesión hay un render en que ya
  // hay usuario pero su perfil aún no se pide: sin esto la app creía que no tenía clase
  // y lo mandaba a elegirla en cada inicio.
  const accountKey = demoMode ? 'demo' : (user?.id ?? null)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!canLoad) {
      setProfile(null)
      setLoading(false)
      return
    }
    try {
      setProfile(await gameApi.getProfile())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoadedFor(accountKey)
      setLoading(false)
    }
  }, [canLoad, accountKey])

  useEffect(() => {
    setLoading(true)
    void refresh()
  }, [refresh, user?.id])

  const pending = accountKey !== null && loadedFor !== accountKey
  return (
    <ProfileContext.Provider value={{ profile, loading: loading || pending, error, refresh }}>{children}</ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile debe usarse dentro de <ProfileProvider>')
  return ctx
}

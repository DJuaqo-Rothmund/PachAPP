import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import * as Linking from 'expo-linking'
import { Loader } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { completeAuthFromUrl } from '@/lib/auth'

/**
 * Destino del enlace pachapp://auth-callback. Normalmente el login ya se completó
 * en signInWithGoogle(); esta ruta cubre el caso en que Android reabre la app
 * desde el enlace (por ejemplo, si el sistema cerró la app durante el login).
 */
export default function AuthCallbackScreen() {
  const url = Linking.useURL()
  const { user, demoMode } = useAuth()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!url) {
      const timer = setTimeout(() => setDone(true), 1500)
      return () => clearTimeout(timer)
    }
    let cancelled = false
    completeAuthFromUrl(url)
      .catch(() => {
        // Si falla no hay sesión, y se vuelve al login.
      })
      .finally(() => {
        if (!cancelled) setDone(true)
      })
    return () => {
      cancelled = true
    }
  }, [url])

  // Se navega cuando la sesión ya está reflejada en las guardias de la navegación:
  // una ruta protegida no acepta la navegación si la guardia aún no la permite.
  useEffect(() => {
    if (done) router.replace(user || demoMode ? '/' : '/login')
  }, [done, user, demoMode])

  return <Loader />
}

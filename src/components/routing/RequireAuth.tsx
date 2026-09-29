import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import { ErrorPanel } from '../ui/ErrorPanel'
import { FullScreenLoader } from '../ui/FullScreenLoader'

/** Protege rutas de juego. En modo demo (sin Supabase) deja pasar. */
export function RequireAuth() {
  const { user, loading, demoMode } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (!user && !demoMode) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

/** Obliga a elegir clase RPG antes de jugar. */
export function RequireClass() {
  const { profile, loading, error, refresh } = useProfile()
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <ErrorPanel error={error} onRetry={() => void refresh()} />
      </div>
    )
  }
  if (!profile?.rpgClass && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}

/** Protege /admin. No se muestra en la navegación; responde 404 a no-admins. */
export function RequireAdmin() {
  const { isAdmin, loading } = useAuth()

  if (loading) return <FullScreenLoader />
  if (!isAdmin) return <Navigate to="/404" replace />
  return <Outlet />
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FullScreenLoader } from '../ui/FullScreenLoader'

/** Protege rutas de juego. En modo demo (sin Supabase) deja pasar. */
export function RequireAuth() {
  const { user, loading, demoMode } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (!user && !demoMode) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

/** Protege /admin. No se muestra en la navegación; responde 404 a no-admins. */
export function RequireAdmin() {
  const { isAdmin, loading } = useAuth()

  if (loading) return <FullScreenLoader />
  if (!isAdmin) return <Navigate to="/404" replace />
  return <Outlet />
}

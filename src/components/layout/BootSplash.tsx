import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import { gameApi } from '../../lib/game'

/** Tiempo mínimo que se ve el logo al abrir la app (se usa para precargar). */
export const BOOT_MIN_MS = 2500
const FADE_MS = 350

/** Pantallas que se descargan mientras se ve el logo, para que después abran al instante. */
function preloadScreens() {
  void import('../../pages/DashboardPage')
  void import('../../pages/ModulePage')
  void import('../../pages/SubmodulePage')
  void import('../../pages/SubbossBattlePage')
  void import('../../pages/BossRaidPage')
  void import('../../pages/ProfilePage')
  void import('../../pages/OnboardingPage')
  void import('../../pages/LeaderboardPage')
}

/**
 * Logo a pantalla completa al iniciar: se queda al menos BOOT_MIN_MS (aunque todo ya
 * haya cargado) y, si la sesión o el perfil tardan más, hasta que estén listos.
 */
export function BootSplash() {
  const { loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [minDone, setMinDone] = useState(() => performance.now() >= BOOT_MIN_MS)
  const [hidden, setHidden] = useState(false)
  const ready = minDone && !authLoading && !profileLoading

  useEffect(() => {
    preloadScreens()
    const left = BOOT_MIN_MS - performance.now()
    if (left <= 0) return
    const t = window.setTimeout(() => setMinDone(true), left)
    return () => window.clearTimeout(t)
  }, [])

  // Con el perfil listo, se adelantan los datos del mapa (calienta la conexión con el servidor).
  const profileId = profile?.id
  useEffect(() => {
    if (profileId) void gameApi.getCampaign().catch(() => undefined)
  }, [profileId])

  useEffect(() => {
    if (!ready) return
    const t = window.setTimeout(() => setHidden(true), FADE_MS)
    return () => window.clearTimeout(t)
  }, [ready])

  if (hidden) return null
  return (
    <div
      aria-hidden={ready}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-void transition-opacity ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <img src="/brand/logo.webp" alt="Pachapp" width={320} height={320} className="w-[min(320px,78vw)]" />
      <p className="font-pixel animate-pulse text-xs text-gold">Cargando...</p>
    </div>
  )
}

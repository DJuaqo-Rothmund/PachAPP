import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import { levelFromXp } from '../../lib/game/level'
import { ClassAvatar } from '../game/ClassAvatar'
import { LivesHearts } from '../game/LivesHearts'
import { useLives } from '../../context/LivesContext'

const NAV_ITEMS = [
  { to: '/', label: 'Mapa', end: true },
  { to: '/leaderboard', label: 'Ranking', end: false },
  { to: '/perfil', label: 'Perfil', end: false },
]

export function AppShell() {
  const { user, demoMode, signOut } = useAuth()
  const { profile } = useProfile()
  const { lives } = useLives()

  return (
    <div className="flex min-h-screen flex-col">
      {demoMode && (
        <div className="bg-gold/10 px-4 py-2 text-center text-xs text-gold">
          Modo demo: configura <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en{' '}
          <code>.env.local</code> para activar login y datos reales.
        </div>
      )}

      <header className="sticky top-0 z-10 border-b border-rune bg-void/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/icons/pachapp.svg" alt="" className="pixelated h-8 w-8" />
            <span className="pixel-title text-sm text-moss">Pachapp</span>
          </NavLink>

          <nav className="hidden gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition ${
                    isActive ? 'bg-stone text-moss' : 'text-mist hover:text-bone'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {profile && <LivesHearts lives={lives} />}
            {profile?.isTester && (
              <span className="pixel-title hidden rounded bg-gold/15 px-2 py-1 text-[8px] text-gold sm:inline" title="Modo maestro activo">
                Maestro
              </span>
            )}
            {profile && (
              <NavLink to="/perfil" className="flex items-center gap-2" aria-label="Mi perfil">
                <div className="text-right leading-tight">
                  <p className="pixel-title text-[9px] text-gold">Nv {levelFromXp(profile.totalXp).level}</p>
                  <p className="text-xs text-mist">{profile.totalXp} XP</p>
                </div>
                <ClassAvatar rpgClass={profile.rpgClass} className="h-9 w-9" />
              </NavLink>
            )}
            {user && (
              <button type="button" onClick={signOut} className="btn-ghost px-3 py-1.5 text-sm">
                Salir
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:pb-6">
        <Outlet />
      </main>

      {/* Navegación inferior para móvil (PWA) */}
      <nav className="fixed inset-x-0 bottom-0 flex border-t border-rune bg-crypt sm:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 py-3 text-center text-xs ${isActive ? 'text-moss' : 'text-mist'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <footer className="hidden border-t border-rune py-4 text-center text-xs text-mist sm:block">
        Pachapp · by DJuaqo
      </footer>
    </div>
  )
}

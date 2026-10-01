import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { ClassAvatar } from '../components/game/ClassAvatar'
import { BadgeIcon } from '../components/game/BadgeIcon'
import { RPG_CLASSES } from '../data/classes'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { useLives } from '../context/LivesContext'
import { LivesHearts } from '../components/game/LivesHearts'
import { MasterPanel } from '../components/game/MasterPanel'
import { useAsync } from '../hooks/useAsync'
import { gameApi } from '../lib/game'
import { resetDemo } from '../lib/game/demoApi'
import { loadBadgeCatalog } from '../lib/game/badgeCatalog'
import { levelFromXp } from '../lib/game/level'

export default function ProfilePage() {
  const { user, demoMode, isAdmin } = useAuth()
  const { profile, refresh } = useProfile()
  const { lives, refresh: refreshLives } = useLives()
  const [leavingMaster, setLeavingMaster] = useState(false)
  const { data, error, reload } = useAsync(() => Promise.all([loadBadgeCatalog(), gameApi.getMyBadges()]), [])
  const [catalog, earned] = data ?? [[], []]

  if (!profile) return null

  const cls = RPG_CLASSES.find((c) => c.id === profile.rpgClass)
  const level = levelFromXp(profile.totalXp)
  const earnedMap = new Map((earned ?? []).map((b) => [b.badgeId, b.earnedAt]))

  const handleDeactivateMaster = async () => {
    setLeavingMaster(true)
    try {
      await gameApi.deactivateMasterMode()
      await Promise.all([refresh(), refreshLives()])
    } finally {
      setLeavingMaster(false)
    }
  }

  const handleResetDemo = () => {
    if (!window.confirm('¿Borrar todo tu progreso de la demo?')) return
    resetDemo()
    window.location.assign('/')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Perfil" subtitle={user?.email ?? 'Modo demo'} />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section className="panel text-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-xl bg-stone">
            <ClassAvatar rpgClass={profile.rpgClass} className="h-28 w-28" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">{profile.displayName}</h2>
          <p className="text-sm text-moss">{cls?.name}</p>
          <p className="mt-1 text-xs text-mist">{cls?.specialty}</p>
          {profile.isTester && (
            <p className="pixel-title mx-auto mt-3 w-fit rounded bg-gold/15 px-2 py-1 text-[9px] text-gold">🔮 Modo maestro</p>
          )}

          <div className="mt-4 flex items-center justify-between rounded-lg bg-stone px-3 py-2">
            <span className="text-xs text-mist">Vidas de hoy</span>
            <LivesHearts lives={lives} showCountdown />
          </div>

          <div className="mt-6 text-left">
            <div className="flex items-baseline justify-between">
              <span className="pixel-title text-xs text-gold">Nivel {level.level}</span>
              <span className="text-xs text-mist">{profile.totalXp} XP total</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-stone">
              <div className="h-full bg-gold" style={{ width: `${level.pct}%` }} />
            </div>
            <p className="mt-1 text-right text-[11px] text-mist">{level.toNext} XP para el nivel {level.level + 1}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link to="/onboarding" className="btn-ghost text-sm">
              Cambiar clase
            </Link>
            {isAdmin && (
              <Link to="/admin" className="btn-ghost text-sm text-gold">
                Panel Admin
              </Link>
            )}
            {profile.isTester && (
              <button type="button" onClick={() => void handleDeactivateMaster()} disabled={leavingMaster} className="btn-ghost text-sm text-gold">
                {leavingMaster ? 'Desactivando…' : 'Desactivar modo maestro'}
              </button>
            )}
            {demoMode && (
              <button type="button" onClick={handleResetDemo} className="btn-ghost text-sm text-blood">
                Reiniciar demo
              </button>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="flex items-baseline justify-between">
            <h2 className="pixel-title text-xs text-bone">Emblemas</h2>
            <span className="text-xs text-mist">
              {earnedMap.size} / {catalog.length}
            </span>
          </div>
          {error ? (
            <div className="mt-4">
              <ErrorPanel error={error} onRetry={reload} />
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {catalog.map((badge) => {
                const earnedAt = earnedMap.get(badge.id)
                return (
                  <li
                    key={badge.id}
                    className={`rounded-lg border p-3 text-center ${earnedAt ? 'border-gold/40 bg-gold/5' : 'border-rune'}`}
                  >
                    <BadgeIcon icon={badge.icon} locked={!earnedAt} className="mx-auto h-12 w-12" />
                    <p className={`mt-2 text-sm font-medium ${earnedAt ? '' : 'text-mist'}`}>{badge.name}</p>
                    <p className="mt-1 text-[11px] text-mist">{badge.description}</p>
                    {earnedAt && (
                      <p className="mt-1 text-[10px] text-gold">
                        {new Date(earnedAt).toLocaleDateString('es-CL')}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4">
        <MasterPanel />
      </div>
    </div>
  )
}

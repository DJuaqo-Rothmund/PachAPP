import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { ClassAvatar } from '../components/game/ClassAvatar'
import { BadgeIcon } from '../components/game/BadgeIcon'
import { RPG_CLASSES } from '../data/classes'
import { BADGES } from '../data/seed'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi } from '../lib/game'
import { resetDemo } from '../lib/game/demoApi'
import { levelFromXp } from '../lib/game/level'

export default function ProfilePage() {
  const { user, demoMode } = useAuth()
  const { profile } = useProfile()
  const { data: earned, error, reload } = useAsync(() => gameApi.getMyBadges(), [])

  if (!profile) return null

  const cls = RPG_CLASSES.find((c) => c.id === profile.rpgClass)
  const level = levelFromXp(profile.totalXp)
  const earnedMap = new Map((earned ?? []).map((b) => [b.badgeId, b.earnedAt]))

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
              {earnedMap.size} / {BADGES.length}
            </span>
          </div>
          {error ? (
            <div className="mt-4">
              <ErrorPanel error={error} onRetry={reload} />
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BADGES.map((badge) => {
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
    </div>
  )
}

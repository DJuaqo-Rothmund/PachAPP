import { PageHeader } from '../components/ui/PageHeader'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { ClassAvatar } from '../components/game/ClassAvatar'
import { RPG_CLASSES } from '../data/classes'
import { useProfile } from '../context/ProfileContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi } from '../lib/game'

const MEDALS = ['text-gold', 'text-bone', 'text-orange-400']

export default function LeaderboardPage() {
  const { profile } = useProfile()
  const { data: rows, error, loading, reload } = useAsync(() => gameApi.getLeaderboard(), [])
  const monthName = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Ranking mensual" subtitle={`XP ganada en ${monthName}. Se reinicia cada mes.`} />

      {error ? (
        <ErrorPanel error={error} onRetry={reload} />
      ) : loading || !rows ? (
        <div className="panel h-64 animate-pulse" />
      ) : rows.length === 0 ? (
        <div className="panel text-sm text-mist">Aún no hay aventureros en el ranking este mes. ¡Sé el primero!</div>
      ) : (
        <ol className="panel divide-y divide-rune p-0">
          {rows.map((row) => {
            const isMe = row.userId === profile?.id
            const cls = RPG_CLASSES.find((c) => c.id === row.rpgClass)
            return (
              <li key={row.userId} className={`flex items-center gap-4 px-5 py-3 ${isMe ? 'bg-moss/10' : ''}`}>
                <span className={`pixel-title w-10 text-sm ${MEDALS[row.rank - 1] ?? 'text-mist'}`}>#{row.rank}</span>
                <ClassAvatar rpgClass={row.rpgClass} className="h-10 w-10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {row.displayName}
                    {isMe && <span className="ml-2 text-xs text-moss">(tú)</span>}
                  </p>
                  <p className="text-xs text-mist">{cls?.name ?? 'Sin clase'}</p>
                </div>
                <span className="title-pixel text-3xl text-gold">{row.monthlyXp} XP</span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

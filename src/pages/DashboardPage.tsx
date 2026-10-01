import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { BossCard, raidAction } from '../components/game/BossCard'
import { MasterPanel } from '../components/game/MasterPanel'
import { useProfile } from '../context/ProfileContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi, type CampaignModule } from '../lib/game'
import { levelFromXp } from '../lib/game/level'

export default function DashboardPage() {
  const { profile } = useProfile()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([gameApi.getCampaign(), gameApi.getLeaderboard(), gameApi.getMyBadges()]),
    [],
  )

  if (error) return <ErrorPanel error={error} onRetry={reload} />

  const [campaign, leaderboard, badges] = data ?? [null, null, null]
  const myRow = leaderboard?.find((r) => r.userId === profile?.id)
  const level = levelFromXp(profile?.totalXp ?? 0)

  const kpis = [
    { label: 'XP del mes', value: myRow ? String(myRow.monthlyXp) : '0' },
    { label: 'Nivel', value: String(level.level), hint: `${level.toNext} XP para subir` },
    { label: 'Emblemas', value: badges ? String(badges.length) : '—' },
    { label: 'Ranking', value: myRow ? `#${myRow.rank}` : '—' },
  ]

  return (
    <div>
      <PageHeader
        title="Mapa de campaña"
        subtitle="Estudia cada Códice, vence a los subjefes y únete a la comunidad contra el jefe cooperativo."
      />

      <MasterPanel compact />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="panel">
            <p className="text-xs uppercase tracking-wide text-mist">{kpi.label}</p>
            <p className="title-pixel mt-2 text-5xl text-gold">{loading ? '…' : kpi.value}</p>
            {kpi.hint && <p className="mt-2 text-xs text-mist">{kpi.hint}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {loading || !campaign
          ? [0, 1, 2].map((i) => <div key={i} className="panel h-64 animate-pulse" />)
          : campaign.map((m) => <ModuleCard key={m.id} module={m} />)}
      </div>
    </div>
  )
}

function ModuleCard({ module: m }: { module: CampaignModule }) {
  const { profile } = useProfile()
  const hasTree = m.subbossesTotal > 0

  return (
    <div className={`panel flex flex-col ${m.unlocked ? '' : 'opacity-50 grayscale-[40%]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-pixel text-[8px] uppercase tracking-wider text-mist">Módulo {m.id}</p>
          <h2 className="title-pixel mt-2 text-3xl text-bone">{m.title}</h2>
        </div>
        {m.codexRead && <span className="font-title shrink-0 bg-moss/15 px-2 py-0.5 text-lg leading-none text-moss">Códice leído</span>}
      </div>
      <p className="mt-2 flex-1 text-sm text-mist">{m.summary}</p>

      {m.unlocked && hasTree && (
        <div className="mt-4">
          <div className="font-title flex justify-between text-lg leading-none text-mist">
            <span>Subjefes</span>
            <span>
              {m.subbossesDefeated}/{m.subbossesTotal}
            </span>
          </div>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: m.subbossesTotal }, (_, i) => (
              <div key={i} className={`well h-2.5 flex-1 ${i < m.subbossesDefeated ? '!bg-gold' : ''}`} />
            ))}
          </div>
        </div>
      )}

      {m.boss && (
        <div className="mt-5">
          <BossCard module={m} tester={Boolean(profile?.isTester)} variant="compact" />
        </div>
      )}

      {m.unlocked && (
        <div className="mt-2 flex flex-wrap gap-3">
          {hasTree ? (
            <Link to={`/modulos/${m.id}`} className={raidAction(m, Boolean(profile?.isTester)).kind === 'join' ? 'btn-ghost' : 'btn-primary'}>
              Entrar al módulo
            </Link>
          ) : (
            <>
              <Link to={`/modulos/${m.id}/codice`} className="btn-ghost">
                Códice
              </Link>
              <Link to={`/modulos/${m.id}/entrenar`} className="btn-ghost">
                Entrenar
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

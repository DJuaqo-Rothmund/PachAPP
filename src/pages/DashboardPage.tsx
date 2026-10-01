import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { HpBar } from '../components/game/HpBar'
import { CoopBossFrame } from '../components/game/BossFrames'
import { MasterPanel } from '../components/game/MasterPanel'
import { useProfile } from '../context/ProfileContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi, type CampaignModule } from '../lib/game'
import { levelFromXp } from '../lib/game/level'
import { formatRaidReset } from '../lib/game/raid'

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
            <p className="pixel-title mt-3 text-xl text-gold">{loading ? '…' : kpi.value}</p>
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
  const boss = m.boss
  const { profile } = useProfile()
  const progress = m.questionCount > 0 ? (m.answeredCount / m.questionCount) * 100 : 0
  const hasTree = m.subbossesTotal > 0
  const raidGated = hasTree && m.subbossesDefeated < m.subbossesTotal && !profile?.isTester

  return (
    <div className={`panel flex flex-col ${m.unlocked ? '' : 'opacity-50'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-mist">Módulo {m.id}</p>
          <h2 className="mt-1 font-semibold">{m.title}</h2>
        </div>
        {m.codexRead && (
          <span className="shrink-0 whitespace-nowrap rounded bg-moss/15 px-2 py-0.5 text-[11px] text-moss">Códice leído</span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm text-mist">{m.summary}</p>

      {boss && (
        <div className="mt-5">
          <CoopBossFrame bossId={boss.id} name={boss.name} defeated={boss.defeated} size="sm">
            {boss.defeated ? (
              <p className="pixel-title mt-1 text-[9px] text-gold">Derrotado</p>
            ) : (
              <div className="mt-1.5">
                <HpBar current={boss.currentHp} max={boss.maxHp} size="sm" />
                <p className="mt-1 text-[11px] text-mist">
                  {boss.currentHp} / {boss.maxHp} HP
                </p>
              </div>
            )}
          </CoopBossFrame>
        </div>
      )}

      {m.unlocked && hasTree && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-mist">
            <span>Subjefes</span>
            <span>
              {m.subbossesDefeated}/{m.subbossesTotal}
            </span>
          </div>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: m.subbossesTotal }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-sm ${i < m.subbossesDefeated ? 'bg-gold' : 'bg-rune'}`} />
            ))}
          </div>
        </div>
      )}

      {m.unlocked && !hasTree && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-mist">
            <span>Tu progreso</span>
            <span>
              {m.answeredCount}/{m.questionCount}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded bg-stone">
            <div className="h-full bg-moss" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {m.unlocked &&
        boss &&
        (raidGated ? (
          <p className="mt-3 text-xs text-mist">🔒 Derrota a los {m.subbossesTotal} subjefes para unirte al Boss Raid</p>
        ) : (
          <RaidStatusLine module={m} />
        ))}

      <div className="mt-4 flex flex-wrap gap-2">
        {!m.unlocked ? (
          <span className="text-sm text-mist">🔒 Derrota al jefe anterior para desbloquear</span>
        ) : hasTree ? (
          <>
            <Link to={`/modulos/${m.id}`} className="btn-primary text-sm">
              Entrar al módulo
            </Link>
            {!raidGated && (m.raid.status === 'available' || m.raid.status === 'in_progress') && (
              <Link to={`/modulos/${m.id}/raid`} className="btn-ghost text-sm">
                {m.raid.status === 'in_progress' ? 'Continuar raid' : 'Boss Raid'}
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to={`/modulos/${m.id}/codice`} className="btn-ghost text-sm">
              Códice
            </Link>
            <Link to={`/modulos/${m.id}/entrenar`} className="btn-ghost text-sm">
              Entrenar
            </Link>
            {(m.raid.status === 'available' || m.raid.status === 'in_progress') && (
              <Link to={`/modulos/${m.id}/raid`} className="btn-primary text-sm">
                {m.raid.status === 'in_progress' ? 'Continuar raid' : 'Boss Raid'}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function RaidStatusLine({ module: m }: { module: CampaignModule }) {
  const { status, answered, total, nextResetAt } = m.raid
  const text: Record<typeof status, string> = {
    available: `⚔ Batalla semanal disponible · ${total} preguntas`,
    in_progress: `⚔ Batalla en curso · ${answered}/${total} respondidas`,
    done: `⏳ Ya combatiste esta semana · vuelve el ${formatRaidReset(nextResetAt)}`,
    defeated: '🏆 La comunidad derrotó a este jefe',
    none: '',
  }
  const tone = status === 'done' || status === 'none' ? 'text-mist' : 'text-gold'
  return <p className={`mt-3 text-xs ${tone}`}>{text[status]}</p>
}

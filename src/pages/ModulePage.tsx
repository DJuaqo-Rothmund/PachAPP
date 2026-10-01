import { Link, useParams } from 'react-router-dom'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'
import { HpBar } from '../components/game/HpBar'
import { CoopBossFrame, SubbossFrame } from '../components/game/BossFrames'
import { LivesHearts } from '../components/game/LivesHearts'
import { useLives } from '../context/LivesContext'
import { useProfile } from '../context/ProfileContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi, type CampaignModule, type SubmoduleNode } from '../lib/game'
import { formatRaidReset } from '../lib/game/raid'
import NotFoundPage from './NotFoundPage'

/** Árbol del módulo: Submódulos (Códice + Subjefe) → Jefe Cooperativo. */
export default function ModulePage() {
  const moduleId = Number(useParams().moduleId)
  const { lives } = useLives()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([gameApi.getCampaign(), gameApi.getModuleTree(moduleId)]),
    [moduleId],
  )

  if (loading) return <FullScreenLoader />
  if (error) return <ErrorPanel error={error} onRetry={reload} />

  const [campaign, tree] = data!
  const module = campaign.find((m) => m.id === moduleId)
  if (!module) return <NotFoundPage />

  if (!module.unlocked) {
    return (
      <div className="panel mx-auto max-w-lg text-center">
        <p className="pixel-title text-xs text-mist">🔒 Módulo sellado</p>
        <p className="mt-4 text-sm text-mist">La comunidad debe derrotar al jefe anterior para abrir este módulo.</p>
        <Link to="/" className="btn-ghost mt-6">
          Volver al mapa
        </Link>
      </div>
    )
  }

  const defeated = tree.filter((n) => n.subboss.defeated).length

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="text-xs text-mist hover:text-bone">
        ← Mapa de campaña
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-mist">Módulo {module.id}</p>
          <h1 className="pixel-title mt-1 text-sm text-bone sm:text-base">{module.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-mist">{module.summary}</p>
        </div>
        <LivesHearts lives={lives} showCountdown size="lg" />
      </div>

      {tree.length > 0 && (
        <div className="mt-5">
          <div className="flex justify-between text-[11px] text-mist">
            <span>Subjefes derrotados</span>
            <span>
              {defeated}/{tree.length}
            </span>
          </div>
          <div className="mt-1 flex gap-1">
            {tree.map((n) => (
              <div
                key={n.id}
                className={`h-2 flex-1 rounded-sm ${n.subboss.defeated ? 'bg-gold' : n.unlocked ? 'bg-moss/40' : 'bg-rune'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sendero de submódulos */}
      <ol className="relative mt-8 space-y-6 before:absolute before:bottom-0 before:left-5 before:top-0 before:w-1 before:rounded before:bg-rune">
        {tree.map((node) => (
          <SubmoduleStep key={node.id} moduleId={module.id} node={node} />
        ))}
        <BossStep module={module} ready={tree.length === 0 || defeated === tree.length} />
      </ol>
    </div>
  )
}

function StepMarker({ label, tone }: { label: string; tone: 'done' | 'open' | 'locked' | 'boss' }) {
  const styles = {
    done: 'bg-gold text-void',
    open: 'bg-moss text-void',
    locked: 'bg-stone text-mist',
    boss: 'bg-blood text-bone',
  }[tone]
  return (
    <span
      className={`pixel-title absolute left-0 top-4 z-[1] flex h-11 w-11 items-center justify-center rounded-lg border-2 border-void text-[10px] ${styles}`}
    >
      {label}
    </span>
  )
}

function SubmoduleStep({ moduleId, node }: { moduleId: number; node: SubmoduleNode }) {
  const { profile } = useProfile()
  const tester = Boolean(profile?.isTester)
  const base = `/modulos/${moduleId}/submodulos/${node.id}`
  const tone = node.subboss.defeated ? 'done' : node.unlocked ? 'open' : 'locked'

  return (
    <li className={`relative pl-16 ${node.unlocked ? '' : 'opacity-55'}`}>
      <StepMarker label={node.subboss.defeated ? '✓' : String(node.order)} tone={tone} />
      <div className="panel">
        <p className="text-[11px] uppercase tracking-wide text-mist">Submódulo {node.order}</p>
        <h2 className="mt-1 font-semibold">{node.title}</h2>
        <p className="mt-1 text-sm text-mist">{node.description}</p>

        <div className="mt-5">
          <SubbossFrame
            submoduleId={node.id}
            name={node.subboss.name}
            title={node.subboss.title}
            defeated={node.subboss.defeated}
            size="sm"
          >
            <div className="mt-2">
              <HpBar current={node.subboss.hp} max={node.subboss.maxHp} size="sm" />
              <p className="mt-1 text-[11px] text-mist">
                {node.subboss.defeated ? 'Derrotado' : `${node.subboss.hp} / ${node.subboss.maxHp} HP`} · duelo individual
              </p>
            </div>
          </SubbossFrame>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!node.unlocked ? (
            <span className="text-sm text-mist">🔒 Derrota al subjefe anterior</span>
          ) : (
            <>
              <Link to={base} className={node.codexRead ? 'btn-ghost text-sm' : 'btn-primary text-sm'}>
                📜 {node.codexRead ? 'Repasar Códice' : 'Leer Códice'}
              </Link>
              {(node.codexRead || tester) && (!node.subboss.defeated || tester) && (
                <Link to={`${base}/combate`} className="btn-primary text-sm">
                  {node.subboss.defeated ? '⚔ Repetir combate' : '⚔ Combatir'}
                </Link>
              )}
              {node.checkpointsTotal > 0 && (
                <span className="text-[11px] text-mist">
                  Checkpoints {node.checkpointsPassed}/{node.checkpointsTotal}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  )
}

function BossStep({ module, ready }: { module: CampaignModule; ready: boolean }) {
  const { profile } = useProfile()
  const boss = module.boss
  if (!boss) return null
  const tester = Boolean(profile?.isTester)
  const canRaid =
    (ready || tester) &&
    (module.raid.status === 'available' || module.raid.status === 'in_progress' || (tester && module.raid.status === 'done'))

  return (
    <li className="relative pl-16">
      <StepMarker label="♛" tone={boss.defeated ? 'done' : 'boss'} />
      <CoopBossFrame bossId={boss.id} name={boss.name} title={boss.title} defeated={boss.defeated} size="md">
        <div className="mt-3">
          <HpBar current={boss.currentHp} max={boss.maxHp} size="sm" />
          <p className="mt-1 text-[11px] text-mist">
            {boss.defeated ? 'Derrotado por la comunidad' : `${boss.currentHp} / ${boss.maxHp} HP · toda la comunidad lo golpea`}
          </p>
        </div>
      </CoopBossFrame>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {boss.defeated ? (
          <span className="text-sm text-gold">🏆 La comunidad derrotó a este jefe</span>
        ) : !ready && !tester ? (
          <span className="text-sm text-mist">🔒 Derrota a todos los subjefes para unirte al Boss Raid</span>
        ) : canRaid ? (
          <Link to={`/modulos/${module.id}/raid`} className="btn-primary text-sm">
            {module.raid.status === 'in_progress' ? '⚔ Continuar Boss Raid' : '⚔ Unirse al Boss Raid'}
          </Link>
        ) : module.raid.status === 'done' ? (
          <span className="text-sm text-mist">
            ⏳ Ya combatiste esta semana · vuelve el {formatRaidReset(module.raid.nextResetAt)}
          </span>
        ) : null}
        {!ready && tester && !boss.defeated && <span className="text-[11px] text-gold">Modo maestro: acceso anticipado</span>}
        {module.questionCount > 0 && (
          <Link to={`/modulos/${module.id}/entrenar`} className="btn-ghost text-sm">
            Entrenar
          </Link>
        )}
      </div>
    </li>
  )
}

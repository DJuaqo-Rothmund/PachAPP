import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'
import { HpBar } from '../components/game/HpBar'
import { PixelSprite } from '../components/pixel/PixelSprite'
import { bossSprite } from '../components/pixel/sprites'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi, type AnswerResult, type BossState, type CampaignModule, type PlayQuestion } from '../lib/game'
import { formatRaidReset } from '../lib/game/raid'
import NotFoundPage from './NotFoundPage'

/** raid: batalla semanal (máx. 15 preguntas, daña al jefe). training: todas las preguntas, solo XP. */
type Mode = 'raid' | 'training'

export default function BossRaidPage({ mode = 'raid' }: { mode?: Mode }) {
  const moduleId = Number(useParams().moduleId)
  const { data: campaign, error, loading, reload } = useAsync(() => gameApi.getCampaign(), [moduleId, mode])

  if (loading) return <FullScreenLoader />
  if (error) return <ErrorPanel error={error} onRetry={reload} />

  const module = campaign?.find((m) => m.id === moduleId)
  if (!module || !module.boss) return <NotFoundPage />

  if (!module.unlocked) {
    return (
      <Gate title="🔒 Módulo bloqueado" text="La comunidad debe derrotar al jefe anterior para abrir este módulo.">
        <Link to="/" className="btn-ghost">
          Volver al mapa
        </Link>
      </Gate>
    )
  }

  if (!module.codexRead) {
    return (
      <Gate title="📜 Primero, el Códice" text="Ningún aventurero enfrenta a un jefe sin estudiar. Lee el Códice del módulo para entrar a la batalla.">
        <Link to={`/modulos/${module.id}/codice`} className="btn-primary">
          Leer el Códice
        </Link>
      </Gate>
    )
  }

  if (mode === 'raid' && module.raid.status === 'done') {
    return (
      <Gate
        title="⏳ Ya combatiste esta semana"
        text={`Cada aventurero tiene una batalla semanal contra ${module.boss.name}. Vuelve el ${formatRaidReset(module.raid.nextResetAt)}. Mientras tanto, entrena para llegar preparado.`}
      >
        <TrainingLinks moduleId={module.id} />
      </Gate>
    )
  }

  if (mode === 'raid' && module.raid.status === 'defeated') {
    const next = campaign!.find((m) => m.id === module.boss!.unlocksModuleId)
    return (
      <Gate title="🏆 Jefe derrotado" text={`La comunidad ya derrotó a ${module.boss.name}. Puedes seguir entrenando este módulo para ganar XP.`}>
        <div className="flex flex-wrap justify-center gap-3">
          {next && (
            <Link to={`/modulos/${next.id}/codice`} className="btn-primary">
              Ir al Módulo {next.id}: {next.title}
            </Link>
          )}
          <Link to={`/modulos/${module.id}/entrenar`} className="btn-ghost">
            Entrenar
          </Link>
        </div>
      </Gate>
    )
  }

  return <Raid key={`${module.id}-${mode}`} module={module} boss={module.boss} campaign={campaign!} mode={mode} />
}

function Gate({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div className="panel mx-auto max-w-lg text-center">
      <p className="pixel-title text-xs text-gold">{title}</p>
      <p className="mt-4 text-sm text-mist">{text}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function TrainingLinks({ moduleId }: { moduleId: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Link to={`/modulos/${moduleId}/entrenar`} className="btn-primary">
        Entrenar
      </Link>
      <Link to="/" className="btn-ghost">
        Volver al mapa
      </Link>
    </div>
  )
}

interface RaidProps {
  module: CampaignModule
  boss: BossState
  campaign: CampaignModule[]
  mode: Mode
}

interface QuestionSet {
  questions: PlayQuestion[]
  /** Solo en batalla: id, total de preguntas y cuántas se respondieron antes de esta visita. */
  raid: { id: number; total: number; answeredBefore: number } | null
}

function Raid({ module, boss, campaign, mode }: RaidProps) {
  const { refresh } = useProfile()
  const { demoMode } = useAuth()
  const { announceBadges } = useToast()
  const isRaid = mode === 'raid'

  const [hp, setHp] = useState(boss.currentHp)
  const [defeated, setDefeated] = useState(boss.defeated)
  const [hitKey, setHitKey] = useState(0)
  const [lastDamage, setLastDamage] = useState(0)
  const [unlockedModuleId, setUnlockedModuleId] = useState<number | null>(null)

  // HP en vivo: los golpes de toda la comunidad llegan por Realtime.
  // El HP solo baja, así que un evento atrasado nunca "cura" al jefe.
  useEffect(
    () =>
      gameApi.subscribeBoss(boss.id, (b) => {
        setHp((current) => Math.min(current, b.currentHp))
        if (b.defeated) setDefeated(true)
      }),
    [boss.id],
  )

  // En entrenamiento, "practicar todas" vuelve a mostrar las ya acertadas.
  const [practice, setPractice] = useState(false)
  const { data, error, loading, reload } = useAsync<QuestionSet>(async () => {
    if (isRaid) {
      const session = await gameApi.startRaid(module.id)
      return { questions: session.questions, raid: { id: session.id, total: session.total, answeredBefore: session.answered } }
    }
    const questions = await gameApi.getQuestions(module.id)
    return { questions: practice ? questions : questions.filter((q) => !q.alreadyAnswered), raid: null }
  }, [module.id, isRaid, practice])
  const queue = useMemo(() => data?.questions ?? [], [data])
  const raid = data?.raid ?? null

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [stats, setStats] = useState({ answered: 0, correct: 0, xp: 0, damage: 0 })

  const current = queue[index]
  const finished = !loading && data !== null && index >= queue.length

  const submit = async (option: string) => {
    if (!current || result || submitting) return
    setPicked(option)
    setSubmitting(true)
    setAnswerError(null)
    try {
      const r = await gameApi.answer(current.id, option, raid?.id)
      setResult(r)
      setStats((s) => ({
        answered: s.answered + 1,
        correct: s.correct + (r.correct ? 1 : 0),
        xp: s.xp + r.xpGained,
        damage: s.damage + r.damageDealt,
      }))
      if (r.damageDealt > 0) {
        setHp((h) => Math.min(h, r.bossHp))
        setLastDamage(r.damageDealt)
        setHitKey((k) => k + 1)
      }
      if (r.bossDefeated) setDefeated(true)
      if (r.unlockedModuleId !== null) setUnlockedModuleId(r.unlockedModuleId)
      announceBadges(r.newBadges)
      if (r.xpGained > 0) void refresh()
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : 'No se pudo enviar la respuesta')
      setPicked(null)
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    setIndex((i) => i + 1)
    setPicked(null)
    setResult(null)
  }

  const startPractice = () => {
    setPractice(true)
    setIndex(0)
    setPicked(null)
    setResult(null)
  }

  const unlockedModule = campaign.find((m) => m.id === (unlockedModuleId ?? (defeated ? boss.unlocksModuleId : null)))
  const questionNumber = (raid?.answeredBefore ?? 0) + index + 1
  const questionTotal = raid?.total ?? queue.length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* Jefe */}
      <section className="panel h-fit">
        <p className="text-xs text-mist">
          {isRaid ? 'Boss Raid semanal' : 'Entrenamiento'} · Módulo {module.id} · {module.title}
        </p>
        {/* En móvil: sprite y nombre en fila para que la pregunta quede a la vista */}
        <div className="mt-4 flex items-center gap-4 lg:block">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-stone lg:mx-auto lg:h-40 lg:w-40">
            <div key={hitKey} className={hitKey > 0 ? 'animate-hit' : ''}>
              <PixelSprite
                rows={bossSprite(boss.id)}
                title={boss.name}
                className={`h-20 w-20 lg:h-32 lg:w-32 ${defeated ? 'rotate-12 opacity-40 grayscale' : ''}`}
              />
            </div>
            {hitKey > 0 && (
              <span key={`dmg-${hitKey}`} className="animate-float-up pixel-title absolute top-1 text-sm text-gold">
                −{lastDamage}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="pixel-title text-[11px] leading-relaxed text-blood lg:mt-4 lg:text-center lg:text-sm">
              {boss.name}
            </h1>
            <p className="mt-1 text-sm text-mist lg:text-center">{boss.title}</p>
          </div>
        </div>
        <div className="mt-4">
          <HpBar current={hp} max={boss.maxHp} />
        </div>
        <p className="mt-3 hidden text-center text-xs text-mist sm:block">
          {isRaid
            ? `Una batalla por semana de ${questionTotal} preguntas. Cada acierto de cualquier aventurero resta HP; si llega a 0, la comunidad desbloquea el siguiente módulo.`
            : 'El entrenamiento no daña al jefe, pero cada primer acierto suma XP. Tu batalla semanal está en Boss Raid.'}
        </p>
        {demoMode && isRaid && (
          <p className="mt-2 text-center text-[11px] text-gold/80">
            Demo: una comunidad simulada ya dejó al jefe malherido, así que puedes derrotarlo tú solo.
          </p>
        )}

        {defeated && (
          <div className="mt-4 rounded-lg border border-gold/50 bg-gold/10 p-4 text-center">
            <p className="pixel-title text-[10px] text-gold">¡Jefe derrotado!</p>
            {unlockedModule ? (
              <Link to={`/modulos/${unlockedModule.id}/codice`} className="btn-primary mt-3 text-sm">
                Abrir Módulo {unlockedModule.id}: {unlockedModule.title}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-mist">Sigue respondiendo para ganar XP.</p>
            )}
          </div>
        )}
      </section>

      {/* Preguntas */}
      <section className="panel">
        {error ? (
          <ErrorPanel error={error} onRetry={reload} />
        ) : loading || !data ? (
          <p className="animate-pulse text-sm text-mist">Invocando preguntas…</p>
        ) : finished ? (
          isRaid ? (
            <RaidSummary stats={stats} moduleId={module.id} nextResetAt={module.raid.nextResetAt} />
          ) : (
            <TrainingSummary stats={stats} nothingPending={stats.answered === 0 && !practice} onPractice={startPractice} />
          )
        ) : current ? (
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-mist">
              <span>
                Pregunta {questionNumber} de {questionTotal}
                {practice && ' · práctica'}
              </span>
              <span className="text-gold">
                +{stats.xp} XP{isRaid && ` · −${stats.damage} HP`}
              </span>
            </div>

            {current.isBossFinal && (
              <p className="pixel-title mt-4 inline-block rounded bg-blood/15 px-2 py-1 text-[9px] text-blood">
                ⚔ Ataque especial del jefe
              </p>
            )}
            <h2 className="mt-4 text-lg font-semibold leading-snug">{current.prompt}</h2>

            <div className="mt-6 grid gap-3">
              {current.options.map((option, i) => (
                <OptionButton
                  key={option}
                  label={option}
                  letter={String.fromCharCode(65 + i)}
                  state={optionState(option, picked, result)}
                  disabled={Boolean(result) || submitting}
                  onClick={() => void submit(option)}
                />
              ))}
            </div>

            {answerError && <p className="mt-4 text-sm text-blood">{answerError}</p>}

            {result && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Feedback result={result} bossName={boss.name} isRaid={isRaid} />
                <button type="button" onClick={next} className="btn-primary">
                  {index + 1 < queue.length ? 'Siguiente' : 'Ver resultado'}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

type OptionState = 'idle' | 'picked' | 'correct' | 'wrong' | 'dim'

function optionState(option: string, picked: string | null, result: AnswerResult | null): OptionState {
  if (!result) return option === picked ? 'picked' : 'idle'
  if (option === result.correctAnswer) return 'correct'
  if (option === picked) return 'wrong'
  return 'dim'
}

const OPTION_STYLES: Record<OptionState, string> = {
  idle: 'border-rune hover:border-moss hover:bg-stone',
  picked: 'border-moss bg-stone animate-pulse',
  correct: 'border-moss bg-moss/15 text-bone',
  wrong: 'border-blood bg-blood/15 text-bone',
  dim: 'border-rune opacity-40',
}

function OptionButton({
  label,
  letter,
  state,
  disabled,
  onClick,
}: {
  label: string
  letter: string
  state: OptionState
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition disabled:cursor-default ${OPTION_STYLES[state]}`}
    >
      <span className="pixel-title flex h-7 w-7 shrink-0 items-center justify-center rounded bg-void text-[10px] text-mist">
        {letter}
      </span>
      <span className="text-sm">{label}</span>
    </button>
  )
}

function Feedback({ result, bossName, isRaid }: { result: AnswerResult; bossName: string; isRaid: boolean }) {
  if (result.finalBlow) {
    return (
      <p className="text-sm text-gold">
        ¡GOLPE FINAL! Derrotaste a {bossName}. +{result.xpGained} XP
      </p>
    )
  }
  if (!result.correct) {
    return <p className="text-sm text-blood">Fallaste. La respuesta correcta está marcada en verde.</p>
  }
  const parts = [
    result.awarded ? `+${result.xpGained} XP` : 'sin XP (ya la habías acertado)',
    ...(result.damageDealt > 0 ? [`−${result.damageDealt} HP al jefe`] : []),
  ]
  return (
    <p className="text-sm text-moss">
      {isRaid ? '¡Golpe certero!' : '¡Correcto!'} {parts.join(' · ')}
    </p>
  )
}

type Stats = { answered: number; correct: number; xp: number; damage: number }

function StatTiles({ stats, showDamage }: { stats: Stats; showDamage: boolean }) {
  return (
    <div className={`mt-6 grid gap-3 ${showDamage ? 'grid-cols-2' : 'grid-cols-1'}`}>
      <div className="rounded-lg bg-stone p-4">
        <p className="text-xs text-mist">XP ganada</p>
        <p className="pixel-title mt-2 text-lg text-gold">+{stats.xp}</p>
      </div>
      {showDamage && (
        <div className="rounded-lg bg-stone p-4">
          <p className="text-xs text-mist">Daño al jefe</p>
          <p className="pixel-title mt-2 text-lg text-blood">−{stats.damage}</p>
        </div>
      )}
    </div>
  )
}

function RaidSummary({ stats, moduleId, nextResetAt }: { stats: Stats; moduleId: number; nextResetAt: string }) {
  return (
    <div className="text-center">
      <p className="pixel-title text-xs text-moss">Batalla semanal terminada</p>
      <p className="mt-4 text-sm text-mist">
        {stats.answered > 0 ? `Acertaste ${stats.correct} de ${stats.answered} preguntas. ` : ''}
        Tu próxima batalla estará disponible el {formatRaidReset(nextResetAt)}.
      </p>
      {stats.answered > 0 && <StatTiles stats={stats} showDamage />}
      <div className="mt-6">
        <TrainingLinks moduleId={moduleId} />
      </div>
    </div>
  )
}

function TrainingSummary({ stats, nothingPending, onPractice }: { stats: Stats; nothingPending: boolean; onPractice: () => void }) {
  return (
    <div className="text-center">
      <p className="pixel-title text-xs text-moss">{nothingPending ? 'Módulo dominado' : 'Entrenamiento terminado'}</p>
      <p className="mt-4 text-sm text-mist">
        {nothingPending
          ? 'Ya acertaste todas las preguntas de este módulo. Puedes practicarlas de nuevo, pero no sumarán XP.'
          : `Acertaste ${stats.correct} de ${stats.answered} preguntas.`}
      </p>
      {!nothingPending && <StatTiles stats={stats} showDamage={false} />}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onPractice} className="btn-ghost">
          Practicar todas
        </button>
        <Link to="/" className="btn-primary">
          Volver al mapa
        </Link>
      </div>
    </div>
  )
}

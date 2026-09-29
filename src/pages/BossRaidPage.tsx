import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'
import { HpBar } from '../components/game/HpBar'
import { PixelSprite } from '../components/pixel/PixelSprite'
import { BOSS_SPRITE } from '../components/pixel/sprites'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi, type AnswerResult, type BossState, type CampaignModule } from '../lib/game'
import NotFoundPage from './NotFoundPage'

export default function BossRaidPage() {
  const moduleId = Number(useParams().moduleId)
  const { data: campaign, error, loading, reload } = useAsync(() => gameApi.getCampaign(), [moduleId])

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

  return <Raid key={module.id} module={module} boss={module.boss} campaign={campaign!} />
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

interface RaidProps {
  module: CampaignModule
  boss: BossState
  campaign: CampaignModule[]
}

function Raid({ module, boss, campaign }: RaidProps) {
  const { refresh } = useProfile()
  const { demoMode } = useAuth()
  const { announceBadges } = useToast()

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

  const [practice, setPractice] = useState(false)
  const { data: questions, error, loading, reload } = useAsync(() => gameApi.getQuestions(module.id), [module.id, practice])
  const queue = useMemo(
    () => (questions ? (practice ? questions : questions.filter((q) => !q.alreadyAnswered)) : []),
    [questions, practice],
  )

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [stats, setStats] = useState({ answered: 0, correct: 0, xp: 0, damage: 0 })

  const current = queue[index]
  const finished = !loading && questions !== null && index >= queue.length

  const submit = async (option: string) => {
    if (!current || result || submitting) return
    setPicked(option)
    setSubmitting(true)
    setAnswerError(null)
    try {
      const r = await gameApi.answer(current.id, option)
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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* Jefe */}
      <section className="panel h-fit">
        <p className="text-xs text-mist">
          Boss Raid · Módulo {module.id} · {module.title}
        </p>
        {/* En móvil: sprite y nombre en fila para que la pregunta quede a la vista */}
        <div className="mt-4 flex items-center gap-4 lg:block">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-stone lg:mx-auto lg:h-40 lg:w-40">
            <div key={hitKey} className={hitKey > 0 ? 'animate-hit' : ''}>
              <PixelSprite
                rows={BOSS_SPRITE}
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
          Cada acierto de cualquier aventurero resta HP. Si llega a 0, la comunidad desbloquea el siguiente módulo.
        </p>
        {demoMode && (
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
        ) : loading || !questions ? (
          <p className="animate-pulse text-sm text-mist">Invocando preguntas…</p>
        ) : finished ? (
          <Summary
            stats={stats}
            nothingPending={stats.answered === 0 && !practice}
            onPractice={startPractice}
          />
        ) : current ? (
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-mist">
              <span>
                Pregunta {index + 1} de {queue.length}
                {practice && ' · práctica'}
              </span>
              <span className="text-gold">
                +{stats.xp} XP · −{stats.damage} HP
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
                <Feedback result={result} bossName={boss.name} />
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

function Feedback({ result, bossName }: { result: AnswerResult; bossName: string }) {
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
  if (!result.awarded) {
    return <p className="text-sm text-moss">Correcto. Ya la habías acertado antes, así que no suma XP.</p>
  }
  return (
    <p className="text-sm text-moss">
      ¡Golpe certero! +{result.xpGained} XP
      {result.damageDealt > 0 && ` · −${result.damageDealt} HP al jefe`}
    </p>
  )
}

function Summary({
  stats,
  nothingPending,
  onPractice,
}: {
  stats: { answered: number; correct: number; xp: number; damage: number }
  nothingPending: boolean
  onPractice: () => void
}) {
  return (
    <div className="text-center">
      <p className="pixel-title text-xs text-moss">{nothingPending ? 'Módulo dominado' : 'Batalla terminada'}</p>
      <p className="mt-4 text-sm text-mist">
        {nothingPending
          ? 'Ya acertaste todas las preguntas de este módulo. Puedes practicar, pero no sumará XP ni daño.'
          : `Acertaste ${stats.correct} de ${stats.answered} preguntas.`}
      </p>
      {!nothingPending && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-stone p-4">
            <p className="text-xs text-mist">XP ganada</p>
            <p className="pixel-title mt-2 text-lg text-gold">+{stats.xp}</p>
          </div>
          <div className="rounded-lg bg-stone p-4">
            <p className="text-xs text-mist">Daño al jefe</p>
            <p className="pixel-title mt-2 text-lg text-blood">−{stats.damage}</p>
          </div>
        </div>
      )}
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

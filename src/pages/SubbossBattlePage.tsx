import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'
import { HpBar } from '../components/game/HpBar'
import { SubbossFrame } from '../components/game/BossFrames'
import { AnswerOption, optionState } from '../components/game/AnswerOption'
import { LivesHearts, OutOfLives } from '../components/game/LivesHearts'
import { useLives } from '../context/LivesContext'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi, type SubbossAnswerResult, type SubmoduleNode } from '../lib/game'
import NotFoundPage from './NotFoundPage'

/** Duelo individual contra el subjefe de un submódulo. Cada error gasta una vida. */
export default function SubbossBattlePage() {
  const params = useParams()
  const moduleId = Number(params.moduleId)
  const submoduleId = params.submoduleId ?? ''
  const [round, setRound] = useState(0)
  const { data: tree, error, loading, reload } = useAsync(() => gameApi.getModuleTree(moduleId), [moduleId])

  if (loading) return <FullScreenLoader />
  if (error) return <ErrorPanel error={error} onRetry={reload} />

  const node = tree?.find((n) => n.id === submoduleId)
  if (!tree || !node) return <NotFoundPage />
  const back = `/modulos/${moduleId}`

  if (!node.unlocked || !node.codexRead) {
    return (
      <div className="panel mx-auto max-w-lg text-center">
        <p className="pixel-title text-xs text-gold">📜 Primero, el Códice</p>
        <p className="mt-4 text-sm text-mist">
          Ningún aventurero enfrenta a un subjefe sin estudiar. Lee el Códice del submódulo.
        </p>
        <Link to={node.unlocked ? `${back}/submodulos/${node.id}` : back} className="btn-primary mt-6">
          {node.unlocked ? 'Leer el Códice' : 'Volver al módulo'}
        </Link>
      </div>
    )
  }

  const nextNode = tree.find((n) => n.order === node.order + 1) ?? null
  return (
    <Fight
      key={`${node.id}-${round}`}
      moduleId={moduleId}
      node={node}
      nextNode={nextNode}
      onRetry={() => setRound((r) => r + 1)}
    />
  )
}

interface FightProps {
  moduleId: number
  node: SubmoduleNode
  nextNode: SubmoduleNode | null
  onRetry: () => void
}

function Fight({ moduleId, node, nextNode, onRetry }: FightProps) {
  const { refresh } = useProfile()
  const { lives, setLivesLeft, refresh: refreshLives } = useLives()
  const { announceBadges } = useToast()
  const back = `/modulos/${moduleId}`

  const { data: fight, error, loading, reload } = useAsync(() => gameApi.startSubboss(node.id), [node.id])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [result, setResult] = useState<SubbossAnswerResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [hp, setHp] = useState<number | null>(null)
  const [hitKey, setHitKey] = useState(0)
  const [lastDamage, setLastDamage] = useState(0)
  const [over, setOver] = useState<SubbossAnswerResult | null>(null)

  const outOfLives = Boolean(lives && !lives.unlimited && lives.lives <= 0)
  const startFailedForLives = error?.message.includes('Sin vidas')

  if (outOfLives && !over && !result) {
    return (
      <div className="panel mx-auto max-w-lg">
        <OutOfLives lives={lives} />
        <div className="mt-6 flex justify-center gap-3">
          <Link to={`${back}/submodulos/${node.id}`} className="btn-ghost">
            Repasar Códice
          </Link>
          <Link to={back} className="btn-primary">
            Volver al módulo
          </Link>
        </div>
      </div>
    )
  }
  if (error) {
    return startFailedForLives ? (
      <div className="panel mx-auto max-w-lg">
        <OutOfLives lives={lives} />
      </div>
    ) : (
      <ErrorPanel error={error} onRetry={reload} />
    )
  }
  if (loading || !fight) return <FullScreenLoader />

  const questions = fight.questions
  const current = questions[index]
  const currentHp = hp ?? fight.hp
  const questionNumber = fight.answered + index + 1

  const submit = async (option: string) => {
    if (!current || result || submitting) return
    setPicked(option)
    setSubmitting(true)
    setAnswerError(null)
    try {
      const r = await gameApi.answerSubboss(node.id, current.id, option)
      setResult(r)
      setHp(r.subbossHp)
      setLivesLeft(r.livesLeft)
      if (r.damageDealt > 0) {
        setLastDamage(r.damageDealt)
        setHitKey((k) => k + 1)
      }
      announceBadges(r.newBadges)
      if (r.xpGained > 0) void refresh()
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : 'No se pudo enviar la respuesta')
      setPicked(null)
      void refreshLives()
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    if (result?.fightOver || index + 1 >= questions.length) {
      setOver(result)
      if (result?.subbossDefeated) void refresh()
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setResult(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <section className="h-fit space-y-4">
        <Link to={back} className="text-xs text-mist hover:text-bone">
          ← Volver al módulo
        </Link>
        <SubbossFrame
          submoduleId={node.id}
          name={node.subboss.name}
          title={node.subboss.title}
          defeated={Boolean(over?.subbossDefeated)}
          hitKey={hitKey}
          damage={lastDamage}
          size="lg"
        >
          <div className="mt-3">
            <HpBar current={currentHp} max={fight.maxHp} />
          </div>
        </SubbossFrame>
        <div className="panel flex items-center justify-between gap-3 py-3">
          <span className="text-xs text-mist">Vidas de hoy</span>
          <LivesHearts lives={lives} size="lg" />
        </div>
        <p className="text-xs text-mist">
          Duelo individual: solo tú dañas a este subjefe. Tienes {fight.total} preguntas para bajar su HP a 0; cada error gasta
          una vida y las vidas vuelven a las 00:00.
        </p>
      </section>

      <section className="panel">
        {over || (!current && questions.length === 0) ? (
          <FightSummary
            result={over}
            node={node}
            nextNode={nextNode}
            moduleId={moduleId}
            onRetry={onRetry}
            canRetry={!lives || lives.unlimited || lives.lives > 0}
          />
        ) : current ? (
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-mist">
              <span>
                Pregunta {questionNumber} de {fight.total}
              </span>
              <span className="text-gold">
                {currentHp}/{fight.maxHp} HP
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold leading-snug">{current.prompt}</h2>
            <div className="mt-6 grid gap-3">
              {current.options.map((option, i) => (
                <AnswerOption
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
                <p className={`text-sm ${result.correct ? 'text-moss' : 'text-blood'}`}>
                  {result.correct
                    ? `¡Golpe certero! −${result.damageDealt} HP${result.awarded ? ` · +${result.xpGained} XP` : ''}`
                    : `Fallaste: pierdes una vida${lives?.unlimited ? ' (modo maestro: ∞)' : ''}.`}
                </p>
                <button type="button" onClick={next} className="btn-primary">
                  {result.fightOver || index + 1 >= questions.length ? 'Ver resultado' : 'Siguiente'}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

function FightSummary({
  result,
  node,
  nextNode,
  moduleId,
  onRetry,
  canRetry,
}: {
  result: SubbossAnswerResult | null
  node: SubmoduleNode
  nextNode: SubmoduleNode | null
  moduleId: number
  onRetry: () => void
  canRetry: boolean
}) {
  const back = `/modulos/${moduleId}`
  if (result?.subbossDefeated) {
    return (
      <div className="text-center">
        <p className="pixel-title text-xs text-gold">¡Subjefe derrotado!</p>
        <p className="mt-4 text-sm text-mist">
          {node.subboss.name} cae.{' '}
          {nextNode
            ? `Se abre el submódulo ${nextNode.order}: ${nextNode.title}.`
            : 'Ya puedes unirte al Boss Raid cooperativo del módulo.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {nextNode ? (
            <Link to={`${back}/submodulos/${nextNode.id}`} className="btn-primary">
              📜 Siguiente Códice
            </Link>
          ) : (
            <Link to={back} className="btn-primary">
              ♛ Ir al Jefe Cooperativo
            </Link>
          )}
          <Link to={back} className="btn-ghost">
            Volver al módulo
          </Link>
        </div>
      </div>
    )
  }

  const noLives = result && result.livesLeft <= 0 && !canRetry
  return (
    <div className="text-center">
      <p className="pixel-title text-xs text-blood">{noLives ? 'Sin vidas por hoy' : 'El subjefe resistió'}</p>
      <p className="mt-4 text-sm text-mist">
        {noLives
          ? 'Te quedaste sin vidas. Vuelven a las 00:00 (hora de Chile): repasa el Códice mientras tanto.'
          : `${node.subboss.name} sigue en pie. Repasa el Códice y vuelve a intentarlo: el duelo se reinicia con su HP completo.`}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {canRetry && (
          <button type="button" onClick={onRetry} className="btn-primary">
            ⚔ Reintentar
          </button>
        )}
        <Link to={`${back}/submodulos/${node.id}`} className="btn-ghost">
          Repasar Códice
        </Link>
      </div>
    </div>
  )
}

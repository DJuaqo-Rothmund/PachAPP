import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'
import { SubbossFrame } from '../components/game/BossFrames'
import { AnswerOption, optionState } from '../components/game/AnswerOption'
import { useToast } from '../context/ToastContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi } from '../lib/game'
import type { CodexCheckpoint } from '../data/types'
import NotFoundPage from './NotFoundPage'

/** Códice de un submódulo: texto, video (cuando exista) y checkpoints de control. */
export default function SubmodulePage() {
  const params = useParams()
  const moduleId = Number(params.moduleId)
  const submoduleId = params.submoduleId ?? ''
  const navigate = useNavigate()
  const { announceBadges } = useToast()
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState<string | null>(null)
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([gameApi.getModuleTree(moduleId), gameApi.getSubmoduleCodex(submoduleId)]),
    [moduleId, submoduleId],
  )
  const [passed, setPassed] = useState<string[]>([])

  if (loading) return <FullScreenLoader />
  if (error) return <ErrorPanel error={error} onRetry={reload} />

  const [tree, codex] = data!
  const node = tree.find((n) => n.id === submoduleId)
  if (!node) return <NotFoundPage />
  const back = `/modulos/${moduleId}`

  if (!node.unlocked) {
    return (
      <div className="panel mx-auto max-w-lg text-center">
        <p className="title-pixel text-3xl text-mist">🔒 Códice sellado</p>
        <p className="mt-4 text-sm text-mist">Derrota al subjefe anterior para abrir este submódulo.</p>
        <Link to={back} className="btn-ghost mt-6">
          Volver al módulo
        </Link>
      </div>
    )
  }

  const goToFight = async () => {
    setMarking(true)
    setMarkError(null)
    try {
      if (!node.codexRead) announceBadges(await gameApi.markSubmoduleCodexRead(submoduleId))
      navigate(node.subboss.defeated ? back : `${back}/submodulos/${submoduleId}/combate`)
    } catch (e) {
      setMarkError(e instanceof Error ? e.message : 'No se pudo registrar la lectura')
      setMarking(false)
    }
  }

  const onPassed = (id: string) => {
    setPassed((p) => (p.includes(id) ? p : [...p, id]))
    void gameApi.passCheckpoint(submoduleId, id).catch(() => undefined)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={back} className="text-xs text-mist hover:text-bone">
        ← Volver al módulo
      </Link>
      <div className="mt-3">
        <p className="text-xs text-mist">Submódulo {node.order} · Códice</p>
        <h1 className="title-pixel mt-1 text-4xl text-moss">{codex.title}</h1>
      </div>

      {codex.videoUrl && <CodexVideo url={codex.videoUrl} />}

      <article className="panel-parchment mt-6 space-y-8">
        {codex.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="title-pixel text-3xl text-gold">{section.heading}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-parchment-ink/90">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {codex.checkpoints.length > 0 && (
        <section className="mt-6 space-y-4">
          <h2 className="title-pixel text-3xl text-gold">Checkpoints de control</h2>
          {codex.checkpoints.map((cp) => (
            <Checkpoint key={cp.id} checkpoint={cp} onPassed={() => onPassed(cp.id)} />
          ))}
          <p className="text-xs text-mist">
            Los checkpoints son práctica: no gastan vidas ni dan XP.{' '}
            {passed.length > 0 && `Superaste ${passed.length} en esta lectura.`}
          </p>
        </section>
      )}

      <div className="mt-8">
        <SubbossFrame
          submoduleId={node.id}
          spriteUrl={node.spriteUrl}
          bgTheme={node.bgTheme}
          name={node.subboss.name}
          title={node.subboss.title}
          defeated={node.subboss.defeated}
          size="sm"
        >
          <p className="mt-2 text-xs text-mist">
            {node.subboss.defeated ? 'Ya lo derrotaste.' : `Te espera al final de este Códice · ${node.subboss.maxHp} HP`}
          </p>
        </SubbossFrame>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        {markError && <p className="text-sm text-blood">{markError}</p>}
        <button type="button" onClick={goToFight} disabled={marking} className="btn-primary">
          {node.subboss.defeated
            ? 'Volver al módulo'
            : node.codexRead
              ? '⚔ Enfrentar al subjefe'
              : 'He leído el Códice: ⚔ enfrentar al subjefe'}
        </button>
      </div>
    </div>
  )
}

function CodexVideo({ url }: { url: string }) {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-rune bg-black">
      {youtube ? (
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtube[1]}`}
          title="Video del Códice"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video className="aspect-video w-full" src={url} controls preload="metadata" />
      )}
    </div>
  )
}

function Checkpoint({ checkpoint, onPassed }: { checkpoint: CodexCheckpoint; onPassed: () => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const correctAnswer = checkpoint.options[checkpoint.correctIndex]
  const result = picked ? { correctAnswer } : null
  const correct = picked === correctAnswer

  const pick = (option: string) => {
    if (picked) return
    setPicked(option)
    if (option === correctAnswer) onPassed()
  }

  return (
    <div className="panel">
      <p className="text-[11px] uppercase tracking-wide text-gold">
        ◆ Checkpoint
        {checkpoint.timestampSeconds > 0
          ? ` · min ${Math.floor(checkpoint.timestampSeconds / 60)}:${String(checkpoint.timestampSeconds % 60).padStart(2, '0')}`
          : ''}
      </p>
      <h3 className="mt-2 font-semibold leading-snug">{checkpoint.prompt}</h3>
      <div className="mt-4 grid gap-2">
        {checkpoint.options.map((option, i) => (
          <AnswerOption
            key={option}
            label={option}
            letter={String.fromCharCode(65 + i)}
            state={optionState(option, picked, result)}
            disabled={Boolean(picked)}
            onClick={() => pick(option)}
          />
        ))}
      </div>
      {picked && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className={`text-sm ${correct ? 'text-moss' : 'text-blood'}`}>
            {correct ? '¡Correcto! ' : 'No es esa. '}
            <span className="text-mist">{checkpoint.explanation}</span>
          </p>
          {!correct && (
            <button type="button" className="btn-ghost text-sm" onClick={() => setPicked(null)}>
              Reintentar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

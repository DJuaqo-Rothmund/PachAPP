import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { ErrorPanel } from '../components/ui/ErrorPanel'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'
import { useToast } from '../context/ToastContext'
import { useAsync } from '../hooks/useAsync'
import { gameApi } from '../lib/game'
import NotFoundPage from './NotFoundPage'

export default function CodexPage() {
  const moduleId = Number(useParams().moduleId)
  const navigate = useNavigate()
  const { announceBadges } = useToast()
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState<string | null>(null)
  const { data: campaign, error, loading, reload } = useAsync(() => gameApi.getCampaign(), [])

  if (loading) return <FullScreenLoader />
  if (error) return <ErrorPanel error={error} onRetry={reload} />

  const module = campaign?.find((m) => m.id === moduleId)
  if (!module) return <NotFoundPage />

  if (!module.unlocked) {
    return (
      <div className="panel mx-auto max-w-lg text-center">
        <p className="title-pixel text-3xl text-mist">🔒 Códice sellado</p>
        <p className="mt-4 text-sm text-mist">La comunidad debe derrotar al jefe anterior para abrir este módulo.</p>
        <Link to="/" className="btn-ghost mt-6">
          Volver al mapa
        </Link>
      </div>
    )
  }

  const goToRaid = async () => {
    setMarking(true)
    setMarkError(null)
    try {
      if (!module.codexRead) {
        announceBadges(await gameApi.markCodexRead(module.id))
      }
      navigate(`/modulos/${module.id}/raid`)
    } catch (e) {
      setMarkError(e instanceof Error ? e.message : 'No se pudo registrar la lectura')
      setMarking(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="El Códice" subtitle={`Módulo ${module.id} · ${module.title}`} />

      <article className="panel-parchment space-y-8">
        {module.codex.map((section) => (
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

      <div className="mt-6 flex items-center justify-end gap-4">
        {markError && <p className="text-sm text-blood">{markError}</p>}
        <button type="button" onClick={goToRaid} disabled={marking} className="btn-primary">
          {module.codexRead ? 'Ir al Boss Raid' : 'He leído el Códice: ir al Boss Raid'}
        </button>
      </div>
    </div>
  )
}

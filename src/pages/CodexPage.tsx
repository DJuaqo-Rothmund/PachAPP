import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { getModule } from '../data/seed'
import NotFoundPage from './NotFoundPage'

export default function CodexPage() {
  const { moduleId } = useParams()
  const module = getModule(Number(moduleId))

  if (!module) return <NotFoundPage />

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="El Códice" subtitle={`Módulo ${module.id} · ${module.title}`} />

      <article className="panel space-y-8">
        {module.codex.map((section) => (
          <section key={section.heading}>
            <h2 className="pixel-title text-xs text-moss">{section.heading}</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-bone/90">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* TODO(hito lógica): registrar la lectura del Códice antes de habilitar el Raid. */}
      <div className="mt-6 flex justify-end">
        <Link to={`/modulos/${module.id}/raid`} className="btn-primary">
          Estoy listo: ir al Boss Raid
        </Link>
      </div>
    </div>
  )
}

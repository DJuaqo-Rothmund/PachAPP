import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'

export default function CodexPage() {
  const { moduleId } = useParams()

  return (
    <div>
      <PageHeader title="El Códice" subtitle={`Módulo ${moduleId} · Texto de estudio`} />
      <article className="panel text-mist">El texto de estudio se cargará desde el seed / Supabase.</article>
    </div>
  )
}

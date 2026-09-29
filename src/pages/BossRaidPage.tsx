import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'

export default function BossRaidPage() {
  const { moduleId } = useParams()

  return (
    <div>
      <PageHeader title="Boss Raid" subtitle={`Módulo ${moduleId} · Cada acierto de la comunidad resta 10 HP`} />
      <div className="panel">
        <div className="flex items-center justify-between text-xs">
          <span className="pixel-title text-blood">HP</span>
          <span className="pixel-title text-bone">1000 / 1000</span>
        </div>
        <div className="mt-2 h-4 overflow-hidden rounded bg-stone">
          <div className="h-full w-full bg-blood" />
        </div>
      </div>
    </div>
  )
}

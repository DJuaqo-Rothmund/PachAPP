import { PageHeader } from '../components/ui/PageHeader'

export default function LeaderboardPage() {
  return (
    <div>
      <PageHeader title="Ranking mensual" subtitle="Usuarios con más XP este mes" />
      <div className="panel text-mist">Aún no hay aventureros en el ranking.</div>
    </div>
  )
}

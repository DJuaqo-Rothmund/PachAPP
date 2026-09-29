import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/ui/PageHeader'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div>
      <PageHeader title="Perfil" subtitle={user?.email ?? 'Aventurero anónimo (modo demo)'} />
      <div className="panel">
        <h2 className="text-sm font-semibold text-mist">Emblemas (loot)</h2>
        <p className="mt-2 text-sm text-mist">Todavía no has ganado emblemas.</p>
      </div>
    </div>
  )
}

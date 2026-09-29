import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'

// Placeholder: en el hito de datos se reemplaza por los módulos del seed / Supabase.
const PLACEHOLDER_MODULES = [
  { id: 0, title: 'Fundamentos Agronómicos', locked: false },
  { id: 1, title: 'Cranberry', locked: false },
  { id: 2, title: 'Frambuesa', locked: true },
]

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Mapa de campaña" subtitle="Lee el Códice, responde y derrota al jefe para avanzar." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'XP del mes', value: '0' },
          { label: 'Emblemas', value: '0' },
          { label: 'Ranking', value: '—' },
        ].map((kpi) => (
          <div key={kpi.label} className="panel">
            <p className="text-xs uppercase tracking-wide text-mist">{kpi.label}</p>
            <p className="pixel-title mt-3 text-xl text-gold">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLACEHOLDER_MODULES.map((m) => (
          <div key={m.id} className={`panel ${m.locked ? 'opacity-50' : ''}`}>
            <p className="text-xs text-mist">Módulo {m.id}</p>
            <h2 className="mt-1 font-semibold">{m.title}</h2>
            <div className="mt-4 flex gap-2">
              {m.locked ? (
                <span className="text-sm text-mist">🔒 Bloqueado</span>
              ) : (
                <>
                  <Link to={`/modulos/${m.id}/codice`} className="btn-ghost text-sm">
                    Códice
                  </Link>
                  <Link to={`/modulos/${m.id}/raid`} className="btn-primary text-sm">
                    Boss Raid
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

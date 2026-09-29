import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { MODULES } from '../data/seed'

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

      {/* TODO(hito lógica): el estado de desbloqueo vendrá de los jefes derrotados en Supabase. */}
      <div className="grid gap-4 md:grid-cols-3">
        {MODULES.map((m) => {
          const locked = !m.initiallyUnlocked
          return (
            <div key={m.id} className={`panel flex flex-col ${locked ? 'opacity-50' : ''}`}>
              <p className="text-xs text-mist">Módulo {m.id}</p>
              <h2 className="mt-1 font-semibold">{m.title}</h2>
              <p className="mt-2 flex-1 text-sm text-mist">{m.summary}</p>
              <p className="mt-3 text-xs text-mist">
                {m.questions.length} preguntas · Jefe: <span className="text-blood">{m.boss.name}</span>
              </p>
              <div className="mt-4 flex gap-2">
                {locked ? (
                  <span className="text-sm text-mist">🔒 Derrota al jefe anterior para desbloquear</span>
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
          )
        })}
      </div>
    </div>
  )
}

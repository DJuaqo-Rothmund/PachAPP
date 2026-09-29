import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { OverviewTab } from '../components/admin/OverviewTab'
import { ModulesTab } from '../components/admin/ModulesTab'
import { QuestionsTab } from '../components/admin/QuestionsTab'
import { BossesTab } from '../components/admin/BossesTab'
import { useAuth } from '../context/AuthContext'

const TABS = [
  { id: 'resumen', label: 'Resumen', Component: OverviewTab },
  { id: 'modulos', label: 'Módulos', Component: ModulesTab },
  { id: 'preguntas', label: 'Preguntas', Component: QuestionsTab },
  { id: 'jefes', label: 'Jefes', Component: BossesTab },
] as const

export default function AdminPage() {
  const { demoMode } = useAuth()
  const [params, setParams] = useSearchParams()
  const active = TABS.find((t) => t.id === params.get('tab')) ?? TABS[0]

  return (
    <div>
      <PageHeader
        title="Panel Admin"
        subtitle={
          demoMode
            ? 'Modo demo: los cambios se guardan solo en este navegador.'
            : 'Los cambios se aplican de inmediato para todos los jugadores.'
        }
      />

      <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto border-b border-rune">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active.id}
            onClick={() => setParams({ tab: t.id }, { replace: true })}
            className={`-mb-px border-b-2 px-4 py-2 text-sm whitespace-nowrap transition ${
              t.id === active.id ? 'border-moss text-moss' : 'border-transparent text-mist hover:text-bone'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <active.Component />
    </div>
  )
}

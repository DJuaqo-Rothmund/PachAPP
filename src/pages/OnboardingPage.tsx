import { useState } from 'react'
import { RPG_CLASSES, type RpgClassId } from '../data/classes'
import { PageHeader } from '../components/ui/PageHeader'

// TODO(hito lógica): persistir la clase en `profiles.rpg_class` y redirigir al mapa.
export default function OnboardingPage() {
  const [selected, setSelected] = useState<RpgClassId | null>(null)

  return (
    <div>
      <PageHeader title="Elige tu clase" subtitle="Tu clase define tu avatar y tu especialidad inicial." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RPG_CLASSES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c.id)}
            className={`panel text-left transition hover:border-moss ${
              selected === c.id ? 'border-moss ring-2 ring-moss/40' : ''
            }`}
          >
            <div className="flex h-24 items-center justify-center rounded-lg bg-stone text-xs text-mist">
              avatar pixel
            </div>
            <h2 className="pixel-title mt-4 text-[11px] text-bone">{c.name}</h2>
            <p className="mt-2 text-xs font-semibold text-moss">{c.specialty}</p>
            <p className="mt-2 text-sm text-mist">{c.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" className="btn-primary" disabled={!selected}>
          Confirmar clase
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RPG_CLASSES, type RpgClassId } from '../data/classes'
import { PageHeader } from '../components/ui/PageHeader'
import { ClassAvatar } from '../components/game/ClassAvatar'
import { useProfile } from '../context/ProfileContext'
import { gameApi } from '../lib/game'

export default function OnboardingPage() {
  const { profile, refresh } = useProfile()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<RpgClassId | null>(profile?.rpgClass ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isChange = Boolean(profile?.rpgClass)

  const confirm = async () => {
    if (!selected) return
    setSaving(true)
    setError(null)
    try {
      await gameApi.setRpgClass(selected)
      await refresh()
      navigate('/', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la clase')
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={isChange ? 'Cambiar de clase' : 'Elige tu clase'}
        subtitle="Tu clase define tu avatar y tu especialidad. Puedes cambiarla después desde tu perfil."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RPG_CLASSES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c.id)}
            aria-pressed={selected === c.id}
            className={`panel text-left transition hover:border-moss ${
              selected === c.id ? 'border-moss ring-2 ring-moss/40' : ''
            }`}
          >
            <div className="flex h-32 items-center justify-center rounded-lg bg-stone">
              <ClassAvatar rpgClass={c.id} className="h-24 w-24" />
            </div>
            <h2 className="pixel-title mt-4 text-[11px] text-bone">{c.name}</h2>
            <p className="mt-2 text-xs font-semibold text-moss">{c.specialty}</p>
            <p className="mt-2 text-sm text-mist">{c.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        {error && <p className="text-sm text-blood">{error}</p>}
        <button type="button" className="btn-primary" disabled={!selected || saving} onClick={confirm}>
          {saving ? 'Guardando…' : 'Confirmar clase'}
        </button>
      </div>
    </div>
  )
}

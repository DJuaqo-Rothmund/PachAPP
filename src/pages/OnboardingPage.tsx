import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { classTheme, RPG_CLASSES, type RpgClassId } from '../data/classes'
import { PageHeader } from '../components/ui/PageHeader'
import { ClassAvatar } from '../components/game/ClassAvatar'
import { useProfile } from '../context/ProfileContext'
import { applyClassTheme } from '../components/layout/ClassThemeController'
import { useAsync } from '../hooks/useAsync'
import { gameApi } from '../lib/game'
import { classUnlocks } from '../lib/game/classUnlocks'

export default function OnboardingPage() {
  const { profile, refresh } = useProfile()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<RpgClassId | null>(profile?.rpgClass ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isChange = Boolean(profile?.rpgClass)
  const { data: campaign } = useAsync(() => gameApi.getCampaign(), [])
  const unlocks = useMemo(() => classUnlocks(profile?.totalXp ?? 0, campaign ?? null), [profile?.totalXp, campaign])

  // Vista previa de la skin de la clase seleccionada; al salir vuelve la del perfil.
  const savedClass = profile?.rpgClass ?? null
  useEffect(() => applyClassTheme(classTheme(selected ?? savedClass)), [selected, savedClass])
  useEffect(() => () => applyClassTheme(classTheme(savedClass)), [savedClass])

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RPG_CLASSES.map((c) => {
          const unlock = unlocks[c.id]
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              disabled={!unlock.selectable}
              aria-pressed={selected === c.id}
              className={`panel text-left transition hover:border-moss disabled:cursor-not-allowed disabled:opacity-50 ${
                selected === c.id ? 'border-moss ring-2 ring-moss/40' : ''
              }`}
            >
              <div
                className="flex h-32 items-center justify-center rounded-lg bg-stone"
                style={{ backgroundImage: `radial-gradient(circle at 50% 60%, ${c.theme.accent}26, transparent 70%)` }}
              >
                <ClassAvatar rpgClass={c.id} className="h-24 w-24" />
              </div>
              <h2 className="pixel-title mt-4 text-[11px] text-bone">{c.name}</h2>
              <p className="mt-2 text-xs font-semibold" style={{ color: c.theme.accent }}>
                {c.specialty}
              </p>
              <p className="mt-2 text-sm text-mist">{c.description}</p>
              {unlock.requirement && (
                <p className="mt-3 rounded-md bg-stone px-2 py-1 text-xs text-mist">
                  {unlock.earned ? '🔓 Recompensa obtenida' : `🔒 Recompensa: ${unlock.requirement}`}
                  {!unlock.earned && unlock.selectable && <span className="text-gold"> · libre durante la beta</span>}
                </p>
              )}
            </button>
          )
        })}
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

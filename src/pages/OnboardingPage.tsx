import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { classTheme, RPG_CLASSES, type RpgClassId } from '../data/classes'
import { PageHeader } from '../components/ui/PageHeader'
import { ClassAvatar } from '../components/game/ClassAvatar'
import { useProfile } from '../context/ProfileContext'
import { applyClassTheme } from '../components/layout/ClassThemeController'
import { useAsync } from '../hooks/useAsync'
import { gameApi } from '../lib/game'
import { classUnlocks } from '../lib/game/classUnlocks'
import { MasterCodeModal } from '../components/game/MasterCodeModal'

/** Toques seguidos sobre el Brujo Fitosanitario que abren la clave del modo maestro. */
const MASTER_TAPS = 5
const MASTER_TAP_WINDOW_MS = 1500

export default function OnboardingPage() {
  const { profile, refresh } = useProfile()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<RpgClassId | null>(profile?.rpgClass ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isChange = Boolean(profile?.rpgClass)
  const { data: campaign } = useAsync(() => gameApi.getCampaign(), [])
  const [masterOpen, setMasterOpen] = useState(false)
  const taps = useRef({ count: 0, last: 0 })
  const unlocks = useMemo(() => classUnlocks(profile?.totalXp ?? 0, campaign ?? null), [profile?.totalXp, campaign])

  // Vista previa de la skin de la clase seleccionada; al salir vuelve la del perfil.
  const savedClass = profile?.rpgClass ?? null
  useEffect(() => applyClassTheme(classTheme(selected ?? savedClass)), [selected, savedClass])
  useEffect(() => () => applyClassTheme(classTheme(savedClass)), [savedClass])

  // 5 toques seguidos al Brujo (sin tocar otra clase entre medio) piden la clave.
  const onCardTap = (id: RpgClassId) => {
    setSelected(id)
    const now = Date.now()
    const t = taps.current
    t.count = id === 'brujo' && now - t.last < MASTER_TAP_WINDOW_MS ? t.count + 1 : id === 'brujo' ? 1 : 0
    t.last = now
    if (t.count >= MASTER_TAPS) {
      t.count = 0
      setMasterOpen(true)
    }
  }

  const selectedClass = RPG_CLASSES.find((c) => c.id === selected)

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
        actions={
          <div className="flex items-center gap-3">
            {selectedClass && (
              <span className="hidden text-sm text-mist sm:inline">
                Elegida: <span style={{ color: selectedClass.theme.accent }}>{selectedClass.name}</span>
              </span>
            )}
            <button type="button" className="btn-primary" disabled={!selected || saving} onClick={confirm}>
              {saving ? 'Guardando…' : 'Confirmar clase'}
            </button>
          </div>
        }
      />
      {error && <p className="-mt-3 mb-4 text-right text-sm text-blood">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RPG_CLASSES.map((c) => {
          const unlock = unlocks[c.id]
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onCardTap(c.id)}
              disabled={!unlock.selectable}
              aria-pressed={selected === c.id}
              style={{ '--class-accent': c.theme.accent } as CSSProperties}
              className="panel class-card text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="class-card__stage relative flex h-36 items-end justify-center rounded-lg pb-2">
                <span
                  className="pixel-title absolute left-2 top-2 rounded px-1.5 py-0.5 text-[8px]"
                  style={{ background: c.theme.accentDim, color: c.theme.accent }}
                >
                  {c.specialty}
                </span>
                <ClassAvatar rpgClass={c.id} className="h-28 w-28" />
              </div>
              <h2 className="pixel-title mt-4 text-[11px]" style={{ color: c.theme.accent }}>
                {c.name}
              </h2>
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

      {masterOpen && <MasterCodeModal onClose={() => setMasterOpen(false)} />}

    </div>
  )
}

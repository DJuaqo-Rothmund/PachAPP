import { useState, type FormEvent } from 'react'
import { ErrorPanel } from '../ui/ErrorPanel'
import { Modal } from '../ui/Modal'
import { HpBar } from '../game/HpBar'
import { PixelSprite } from '../pixel/PixelSprite'
import { BOSS_SPRITE } from '../pixel/sprites'
import { FormFooter, errorMessage } from './FormFooter'
import { useAsync } from '../../hooks/useAsync'
import { adminApi, type AdminBoss, type AdminModule } from '../../lib/game'

export function BossesTab() {
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([adminApi.listBosses(), adminApi.listModules()]),
    [],
  )
  const [editing, setEditing] = useState<{ boss: AdminBoss; isNew: boolean } | null>(null)

  if (error) return <ErrorPanel error={error} onRetry={reload} />
  if (loading || !data) return <div className="panel h-64 animate-pulse" />

  const [bosses, modules] = data
  const moduleTitle = (id: number | null) => modules.find((m) => m.id === id)?.title ?? '—'
  const withoutBoss = modules.filter((m) => !bosses.some((b) => b.moduleId === m.id))

  const run = async (action: () => Promise<void>) => {
    try {
      await action()
      reload()
    } catch (e) {
      window.alert(errorMessage(e))
    }
  }

  const handleReset = (b: AdminBoss) => {
    if (!window.confirm(`¿Reiniciar a ${b.name} con ${b.maxHp} HP?\n\nEl módulo que ya desbloqueó sigue abierto.`)) return
    void run(() => adminApi.resetBoss(b.id))
  }

  const handleDelete = (b: AdminBoss) => {
    if (!window.confirm(`¿Borrar a ${b.name}? El módulo quedará sin Boss Raid.`)) return
    void run(() => adminApi.deleteBoss(b.id))
  }

  const handleCreate = (m: AdminModule) =>
    setEditing({
      isNew: true,
      boss: {
        id: `boss-m${m.id}`,
        moduleId: m.id,
        name: '',
        title: '',
        maxHp: 1000,
        currentHp: 1000,
        damagePerHit: 10,
        unlocksModuleId: modules.find((x) => x.id > m.id)?.id ?? null,
        defeatedAt: null,
      },
    })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bosses.map((b) => (
          <section key={b.id} className="panel">
            <div className="flex items-center gap-3">
              <PixelSprite
                rows={BOSS_SPRITE}
                className={`h-14 w-14 shrink-0 ${b.defeatedAt ? 'opacity-40 grayscale' : ''}`}
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-blood">{b.name}</p>
                <p className="truncate text-xs text-mist">{b.title}</p>
                <p className="text-xs text-mist">
                  Módulo {b.moduleId} · {moduleTitle(b.moduleId)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <HpBar current={b.currentHp} max={b.maxHp} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <dt className="text-mist">Daño por acierto</dt>
              <dd className="text-right">{b.damagePerHit}</dd>
              <dt className="text-mist">Desbloquea</dt>
              <dd className="truncate text-right">
                {b.unlocksModuleId === null ? '—' : `${b.unlocksModuleId} · ${moduleTitle(b.unlocksModuleId)}`}
              </dd>
              <dt className="text-mist">Estado</dt>
              <dd className={`text-right ${b.defeatedAt ? 'text-gold' : ''}`}>
                {b.defeatedAt ? `Derrotado ${new Date(b.defeatedAt).toLocaleDateString('es-CL')}` : 'En pie'}
              </dd>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setEditing({ boss: b, isNew: false })} className="btn-ghost px-3 py-1.5 text-sm">
                Editar
              </button>
              <button type="button" onClick={() => handleReset(b)} className="btn-ghost px-3 py-1.5 text-sm">
                Reiniciar HP
              </button>
              <button type="button" onClick={() => handleDelete(b)} className="btn-danger ml-auto">
                Borrar
              </button>
            </div>
          </section>
        ))}
      </div>

      {withoutBoss.length > 0 && (
        <section className="panel">
          <h2 className="font-semibold">Módulos sin jefe</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {withoutBoss.map((m) => (
              <button key={m.id} type="button" onClick={() => handleCreate(m)} className="btn-ghost text-sm">
                + Crear jefe para {m.id} · {m.title}
              </button>
            ))}
          </div>
        </section>
      )}

      {editing && (
        <BossForm
          initial={editing.boss}
          isNew={editing.isNew}
          modules={modules}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}
    </div>
  )
}

interface BossFormProps {
  initial: AdminBoss
  isNew: boolean
  modules: AdminModule[]
  onClose: () => void
  onSaved: () => void
}

function BossForm({ initial, isNew, modules, onClose, onSaved }: BossFormProps) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof AdminBoss>(key: K, value: AdminBoss[K]) => setForm((f) => ({ ...f, [key]: value }))

  const validate = (): string | null => {
    if (!form.name.trim()) return 'El nombre es obligatorio'
    if (!Number.isInteger(form.maxHp) || form.maxHp <= 0) return 'El HP máximo debe ser un entero mayor que 0'
    if (!Number.isInteger(form.currentHp) || form.currentHp < 0 || form.currentHp > form.maxHp)
      return 'El HP actual debe estar entre 0 y el HP máximo'
    if (!Number.isInteger(form.damagePerHit) || form.damagePerHit <= 0) return 'El daño por acierto debe ser mayor que 0'
    if (form.unlocksModuleId === form.moduleId) return 'Un jefe no puede desbloquear su propio módulo'
    return null
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validate()
    if (problem) return setError(problem)
    setSaving(true)
    setError(null)
    try {
      await adminApi.saveBoss({ ...form, name: form.name.trim(), title: form.title.trim() })
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  const numberField = (key: 'maxHp' | 'currentHp' | 'damagePerHit', label: string) => (
    <div>
      <label className="label" htmlFor={`bf-${key}`}>
        {label}
      </label>
      <input
        id={`bf-${key}`}
        type="number"
        min={0}
        className="input"
        value={form[key]}
        onChange={(e) => set(key, Number(e.target.value))}
      />
    </div>
  )

  return (
    <Modal title={isNew ? `Nuevo jefe · Módulo ${initial.moduleId}` : `Editar ${initial.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="bf-name">
              Nombre
            </label>
            <input id="bf-name" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="bf-title">
              Título
            </label>
            <input id="bf-title" className="input" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {numberField('maxHp', 'HP máximo')}
          {numberField('currentHp', 'HP actual')}
          {numberField('damagePerHit', 'Daño por acierto')}
        </div>
        <div>
          <label className="label" htmlFor="bf-unlocks">
            Al ser derrotado desbloquea
          </label>
          <select
            id="bf-unlocks"
            className="input"
            value={form.unlocksModuleId ?? ''}
            onChange={(e) => set('unlocksModuleId', e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">Ningún módulo</option>
            {modules
              .filter((m) => m.id !== form.moduleId)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} · {m.title}
                </option>
              ))}
          </select>
        </div>
        <p className="text-xs text-mist">
          Poner el HP actual en 0 marca al jefe como derrotado, pero no desbloquea módulos: para abrir uno a mano, usa
          “Desbloqueado” en la pestaña Módulos.
        </p>
        <FormFooter error={error} saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  )
}

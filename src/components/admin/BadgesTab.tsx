import { useState, type FormEvent } from 'react'
import { ErrorPanel } from '../ui/ErrorPanel'
import { Modal } from '../ui/Modal'
import { BadgeIcon } from '../game/BadgeIcon'
import { BADGE_SPRITES } from '../pixel/sprites'
import { FormFooter, errorMessage } from './FormFooter'
import { useAsync } from '../../hooks/useAsync'
import { adminApi, type AdminBadge, type AdminModule } from '../../lib/game'
import { invalidateBadgeCatalog } from '../../lib/game/badgeCatalog'
import type { Badge, BadgeCriterion } from '../../data/types'

type CriterionType = BadgeCriterion['type']

const CRITERION_LABELS: Record<CriterionType, string> = {
  codex_read: 'Leer N Códices',
  correct_streak: 'Racha de N aciertos seguidos',
  module_completed: 'Acertar todas las preguntas de un módulo',
  boss_defeated: 'Participar en la derrota de un jefe',
  final_blow: 'Dar el golpe final a cualquier jefe',
}

function describeCriterion(c: BadgeCriterion, modules: AdminModule[]): string {
  const moduleName = (id: number) => {
    const m = modules.find((x) => x.id === id)
    return m ? `módulo ${m.id} (${m.title})` : `módulo ${id} (no existe)`
  }
  switch (c.type) {
    case 'codex_read':
      return c.count === 1 ? 'Leer 1 Códice' : `Leer ${c.count} Códices`
    case 'correct_streak':
      return `${c.count} aciertos seguidos`
    case 'module_completed':
      return `Acertar todo el ${moduleName(c.moduleId)}`
    case 'boss_defeated':
      return `Dañar al jefe del ${moduleName(c.moduleId)} y que caiga`
    case 'final_blow':
      return 'Dar el golpe final a un jefe'
  }
}

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export function BadgesTab() {
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([adminApi.listBadges(), adminApi.listModules()]),
    [],
  )
  const [editing, setEditing] = useState<{ badge: Badge; isNew: boolean } | null>(null)

  if (error) return <ErrorPanel error={error} onRetry={reload} />
  if (loading || !data) return <div className="panel h-64 animate-pulse" />

  const [badges, modules] = data

  const afterChange = () => {
    invalidateBadgeCatalog()
    reload()
  }

  const handleDelete = async (b: AdminBadge) => {
    const holders = b.holders > 0 ? `\n\n${b.holders} jugador(es) lo perderán de su perfil.` : ''
    if (!window.confirm(`¿Borrar el emblema "${b.name}"?${holders}`)) return
    try {
      await adminApi.deleteBadge(b.id)
      afterChange()
    } catch (e) {
      window.alert(errorMessage(e))
    }
  }

  return (
    <section className="panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">Emblemas</h2>
          <p className="mt-1 text-xs text-mist">
            Se otorgan automáticamente en la siguiente acción del jugador (leer un Códice o responder) que cumpla la regla.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary shrink-0 text-sm"
          onClick={() =>
            setEditing({
              isNew: true,
              badge: { id: '', name: '', description: '', icon: 'trophy', criterion: { type: 'codex_read', count: 1 } },
            })
          }
        >
          + Nuevo emblema
        </button>
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {badges.map((b) => (
          <li key={b.id} className="flex gap-3 rounded-lg border border-rune p-3">
            <BadgeIcon icon={b.icon} className="h-12 w-12 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{b.name}</p>
              <p className="text-xs text-mist">{b.description}</p>
              <p className="mt-2 text-xs text-gold">Regla: {describeCriterion(b.criterion, modules)}</p>
              <p className="mt-1 text-xs text-mist">
                {b.holders === 1 ? '1 jugador lo tiene' : `${b.holders} jugadores lo tienen`}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing({ badge: b, isNew: false })}
                  className="btn-ghost px-3 py-1.5 text-sm"
                >
                  Editar
                </button>
                <button type="button" onClick={() => void handleDelete(b)} className="btn-danger">
                  Borrar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <BadgeForm
          initial={editing.badge}
          isNew={editing.isNew}
          existingIds={badges.map((b) => b.id)}
          modules={modules}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            afterChange()
          }}
        />
      )}
    </section>
  )
}

interface BadgeFormProps {
  initial: Badge
  isNew: boolean
  existingIds: string[]
  modules: AdminModule[]
  onClose: () => void
  onSaved: () => void
}

function BadgeForm({ initial, isNew, existingIds, modules, onClose, onSaved }: BadgeFormProps) {
  const [form, setForm] = useState(initial)
  const [idTouched, setIdTouched] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const c = form.criterion

  const setName = (name: string) =>
    setForm((f) => ({ ...f, name, id: idTouched ? f.id : slugify(name) }))

  const setCriterionType = (type: CriterionType) => {
    const firstModule = modules[0]?.id ?? 0
    const next: BadgeCriterion =
      type === 'codex_read' || type === 'correct_streak'
        ? { type, count: 'count' in c ? c.count : type === 'codex_read' ? 1 : 10 }
        : type === 'module_completed' || type === 'boss_defeated'
          ? { type, moduleId: 'moduleId' in c ? c.moduleId : firstModule }
          : { type: 'final_blow' }
    setForm((f) => ({ ...f, criterion: next }))
  }

  const validate = (): string | null => {
    if (!form.name.trim()) return 'El nombre es obligatorio'
    if (!/^[a-z0-9-]+$/.test(form.id)) return 'El ID solo admite minúsculas, números y guiones'
    if (isNew && existingIds.includes(form.id)) return `Ya existe un emblema con ID "${form.id}"`
    if ('count' in c && (!Number.isInteger(c.count) || c.count < 1)) return 'La cantidad debe ser un entero ≥ 1'
    if ('moduleId' in c && !modules.some((m) => m.id === c.moduleId)) return 'Elige un módulo existente'
    return null
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validate()
    if (problem) return setError(problem)
    setSaving(true)
    setError(null)
    try {
      await adminApi.saveBadge({ ...form, name: form.name.trim(), description: form.description.trim() })
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Modal title={isNew ? 'Nuevo emblema' : `Editar ${initial.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="bdg-name">
              Nombre
            </label>
            <input id="bdg-name" className="input" value={form.name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="bdg-id">
              ID
            </label>
            <input
              id="bdg-id"
              className="input"
              value={form.id}
              disabled={!isNew}
              onChange={(e) => {
                setIdTouched(true)
                setForm((f) => ({ ...f, id: e.target.value.toLowerCase() }))
              }}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="bdg-desc">
            Descripción (se muestra en el perfil)
          </label>
          <input
            id="bdg-desc"
            className="input"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <fieldset>
          <legend className="label">Ícono</legend>
          <div className="flex flex-wrap gap-2">
            {Object.keys(BADGE_SPRITES).map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm((f) => ({ ...f, icon }))}
                aria-label={`Ícono ${icon}`}
                aria-pressed={form.icon === icon}
                className={`rounded-lg border p-2 transition ${
                  form.icon === icon ? 'border-gold bg-gold/10' : 'border-rune hover:border-mist'
                }`}
              >
                <BadgeIcon icon={icon} className="h-8 w-8" />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <div>
            <label className="label" htmlFor="bdg-type">
              Regla para ganarlo
            </label>
            <select
              id="bdg-type"
              className="input"
              value={c.type}
              onChange={(e) => setCriterionType(e.target.value as CriterionType)}
            >
              {Object.entries(CRITERION_LABELS).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {'count' in c && (
            <div>
              <label className="label" htmlFor="bdg-count">
                Cantidad (N)
              </label>
              <input
                id="bdg-count"
                type="number"
                min={1}
                className="input"
                value={c.count}
                onChange={(e) => setForm((f) => ({ ...f, criterion: { ...c, count: Number(e.target.value) } }))}
              />
            </div>
          )}
          {'moduleId' in c && (
            <div>
              <label className="label" htmlFor="bdg-module">
                Módulo
              </label>
              <select
                id="bdg-module"
                className="input"
                value={c.moduleId}
                onChange={(e) => setForm((f) => ({ ...f, criterion: { ...c, moduleId: Number(e.target.value) } }))}
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} · {m.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <FormFooter error={error} saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  )
}

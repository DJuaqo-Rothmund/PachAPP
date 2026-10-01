import { useState, type FormEvent } from 'react'
import { ErrorPanel } from '../ui/ErrorPanel'
import { Modal } from '../ui/Modal'
import { FormFooter, errorMessage } from './FormFooter'
import { useAsync } from '../../hooks/useAsync'
import { adminApi, type AdminModule } from '../../lib/game'
import { CoopBossFrame } from '../game/BossFrames'
import { DEFAULT_ENCOUNTER, ENCOUNTERS, encounterForModule } from '../../data/encounters'

/** Fondos de batalla disponibles (uno por módulo más el de mazmorra). */
const BG_THEMES = [...new Set([...Object.values(ENCOUNTERS).map((e) => e.bgTheme), DEFAULT_ENCOUNTER.bgTheme])]

export function ModulesTab() {
  const { data: modules, error, loading, reload } = useAsync(() => adminApi.listModules(), [])
  const [editing, setEditing] = useState<{ module: AdminModule; isNew: boolean } | null>(null)

  const handleNew = () => {
    const nextId = modules && modules.length > 0 ? Math.max(...modules.map((m) => m.id)) + 1 : 0
    setEditing({
      isNew: true,
      module: {
        id: nextId,
        slug: '',
        title: '',
        summary: '',
        initiallyUnlocked: false,
        unlocked: false,
        codex: [{ heading: '', body: [''] }],
        spriteUrl: null,
        bgTheme: null,
      },
    })
  }

  const handleDelete = async (m: AdminModule) => {
    const ok = window.confirm(
      `¿Borrar el módulo ${m.id} "${m.title}"?\n\nSe borrarán también sus preguntas, su jefe y las respuestas de los jugadores. No se puede deshacer.`,
    )
    if (!ok) return
    try {
      await adminApi.deleteModule(m.id)
      reload()
    } catch (e) {
      window.alert(errorMessage(e))
    }
  }

  if (error) return <ErrorPanel error={error} onRetry={reload} />

  return (
    <section className="panel">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold">Módulos</h2>
        <button type="button" onClick={handleNew} className="btn-primary text-sm" disabled={loading}>
          + Nuevo módulo
        </button>
      </div>

      {loading || !modules ? (
        <div className="mt-4 h-40 animate-pulse rounded bg-stone" />
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-mist">
              <tr className="border-b border-rune">
                <th className="py-2 pr-3 font-medium">ID</th>
                <th className="py-2 pr-3 font-medium">Título</th>
                <th className="py-2 pr-3 font-medium">Estado</th>
                <th className="py-2 pr-3 font-medium">Códice</th>
                <th className="py-2 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} className="border-b border-rune/60">
                  <td className="py-2 pr-3 tabular-nums text-mist">{m.id}</td>
                  <td className="py-2 pr-3">
                    <p className="font-medium">{m.title}</p>
                    <p className="text-xs text-mist">/{m.slug}</p>
                  </td>
                  <td className="py-2 pr-3">
                    <StatusChip module={m} />
                  </td>
                  <td className="py-2 pr-3 text-mist">{m.codex.length} secciones</td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <button type="button" onClick={() => setEditing({ module: m, isNew: false })} className="btn-ghost mr-2 px-3 py-1.5 text-sm">
                      Editar
                    </button>
                    <button type="button" onClick={() => void handleDelete(m)} className="btn-danger">
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ModuleForm
          initial={editing.module}
          isNew={editing.isNew}
          existingIds={modules?.map((m) => m.id) ?? []}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}
    </section>
  )
}

function StatusChip({ module: m }: { module: AdminModule }) {
  if (m.initiallyUnlocked) return <span className="rounded bg-moss/15 px-2 py-0.5 text-xs text-moss">Abierto desde el inicio</span>
  if (m.unlocked) return <span className="rounded bg-gold/15 px-2 py-0.5 text-xs text-gold">Desbloqueado</span>
  return <span className="rounded bg-stone px-2 py-0.5 text-xs text-mist">Bloqueado</span>
}

interface ModuleFormProps {
  initial: AdminModule
  isNew: boolean
  existingIds: number[]
  onClose: () => void
  onSaved: () => void
}

/** En el formulario, cada sección tiene su cuerpo como texto; los párrafos se separan con una línea en blanco. */
interface SectionDraft {
  heading: string
  text: string
}

function ModuleForm({ initial, isNew, existingIds, onClose, onSaved }: ModuleFormProps) {
  const [form, setForm] = useState(initial)
  const [sections, setSections] = useState<SectionDraft[]>(
    initial.codex.map((s) => ({ heading: s.heading, text: s.body.join('\n\n') })),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof AdminModule>(key: K, value: AdminModule[K]) => setForm((f) => ({ ...f, [key]: value }))
  const setSection = (i: number, patch: Partial<SectionDraft>) =>
    setSections((ss) => ss.map((s, j) => (j === i ? { ...s, ...patch } : s)))

  const validate = (): string | null => {
    if (!Number.isInteger(form.id) || form.id < 0) return 'El ID debe ser un entero ≥ 0'
    if (isNew && existingIds.includes(form.id)) return `Ya existe un módulo con ID ${form.id}`
    if (!/^[a-z0-9-]+$/.test(form.slug)) return 'El slug solo admite minúsculas, números y guiones'
    if (!form.title.trim()) return 'El título es obligatorio'
    if (sections.length === 0) return 'El Códice necesita al menos una sección'
    if (sections.some((s) => !s.heading.trim() || !s.text.trim())) return 'Cada sección del Códice necesita título y texto'
    return null
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validate()
    if (problem) return setError(problem)
    setSaving(true)
    setError(null)
    try {
      await adminApi.saveModule({
        ...form,
        title: form.title.trim(),
        summary: form.summary.trim(),
        codex: sections.map((s) => ({
          heading: s.heading.trim(),
          body: s.text
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean),
        })),
      })
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Modal title={isNew ? 'Nuevo módulo' : `Editar módulo ${initial.id}`} onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[6rem_1fr_1fr]">
          <div>
            <label className="label" htmlFor="m-id">
              ID
            </label>
            <input
              id="m-id"
              type="number"
              min={0}
              className="input"
              value={form.id}
              disabled={!isNew}
              onChange={(e) => set('id', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label" htmlFor="m-title">
              Título
            </label>
            <input id="m-title" className="input" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="m-slug">
              Slug
            </label>
            <input
              id="m-slug"
              className="input"
              placeholder="ej: arandano"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value.toLowerCase())}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="m-summary">
            Resumen (se muestra en el mapa)
          </label>
          <input id="m-summary" className="input" value={form.summary} onChange={(e) => set('summary', e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.initiallyUnlocked}
              onChange={(e) => set('initiallyUnlocked', e.target.checked)}
            />
            Abierto desde el inicio
          </label>
          <label className={`flex items-center gap-2 text-sm ${form.initiallyUnlocked ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              checked={form.unlocked || form.initiallyUnlocked}
              disabled={form.initiallyUnlocked}
              onChange={(e) => set('unlocked', e.target.checked)}
            />
            Desbloqueado (por la comunidad o manualmente)
          </label>
        </div>

        <fieldset className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <legend className="label">Aspecto del jefe cooperativo</legend>
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="m-sprite">
                Imagen del jefe (sprite_url): URL de Supabase Storage o ruta /encounters/…
              </label>
              <input
                id="m-sprite"
                className="input"
                placeholder="Vacío = sprite pixel de respaldo"
                value={form.spriteUrl ?? ''}
                onChange={(e) => set('spriteUrl', e.target.value || null)}
              />
            </div>
            <div>
              <label className="label" htmlFor="m-bg">
                Fondo de batalla (bg_theme)
              </label>
              <select id="m-bg" className="input" value={form.bgTheme ?? ''} onChange={(e) => set('bgTheme', e.target.value || null)}>
                <option value="">Predeterminado del módulo ({encounterForModule(form.id).bgTheme})</option>
                {BG_THEMES.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p className="label">Vista previa</p>
            <CoopBossFrame
              bossId={`boss-${form.slug}`}
              name={form.title || 'Jefe del módulo'}
              spriteUrl={form.spriteUrl}
              bgTheme={form.bgTheme}
              size="sm"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Códice (separa los párrafos con una línea en blanco)</legend>
          <div className="space-y-3">
            {sections.map((s, i) => (
              <div key={i} className="rounded-lg border border-rune bg-stone/40 p-3">
                <div className="flex gap-2">
                  <input
                    className="input"
                    placeholder={`Título de la sección ${i + 1}`}
                    aria-label={`Título de la sección ${i + 1}`}
                    value={s.heading}
                    onChange={(e) => setSection(i, { heading: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-danger shrink-0"
                    onClick={() => setSections((ss) => ss.filter((_, j) => j !== i))}
                    aria-label={`Quitar sección ${i + 1}`}
                  >
                    Quitar
                  </button>
                </div>
                <textarea
                  className="input mt-2 min-h-32 leading-relaxed"
                  placeholder="Texto de estudio…"
                  aria-label={`Texto de la sección ${i + 1}`}
                  value={s.text}
                  onChange={(e) => setSection(i, { text: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn-ghost mt-3 text-sm"
            onClick={() => setSections((ss) => [...ss, { heading: '', text: '' }])}
          >
            + Agregar sección
          </button>
        </fieldset>

        <FormFooter error={error} saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  )
}

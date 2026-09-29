import { useEffect, useState, type FormEvent } from 'react'
import { ErrorPanel } from '../ui/ErrorPanel'
import { Modal } from '../ui/Modal'
import { FormFooter, errorMessage } from './FormFooter'
import { useAsync } from '../../hooks/useAsync'
import { adminApi, type AdminQuestion } from '../../lib/game'

export function QuestionsTab() {
  const modulesQuery = useAsync(() => adminApi.listModules(), [])
  const [moduleId, setModuleId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<{ question: AdminQuestion; isNew: boolean } | null>(null)

  useEffect(() => {
    if (moduleId === null && modulesQuery.data?.length) setModuleId(modulesQuery.data[0].id)
  }, [modulesQuery.data, moduleId])

  const questionsQuery = useAsync(
    () => (moduleId === null ? Promise.resolve([]) : adminApi.listQuestions(moduleId)),
    [moduleId],
  )
  const questions = questionsQuery.data ?? []
  const term = search.trim().toLowerCase()
  const visible = term
    ? questions.filter((q) => [q.prompt, q.correct, ...q.distractors].some((t) => t.toLowerCase().includes(term)))
    : questions

  const handleNew = () => {
    if (moduleId === null) return
    const maxOrder = Math.max(0, ...questions.filter((q) => !q.isBossFinal).map((q) => q.sortOrder))
    setEditing({
      isNew: true,
      question: {
        id: `m${moduleId}-${Date.now().toString(36)}`,
        moduleId,
        prompt: '',
        correct: '',
        distractors: ['', '', ''],
        isBossFinal: false,
        sortOrder: maxOrder + 1,
      },
    })
  }

  const handleDelete = async (q: AdminQuestion) => {
    if (!window.confirm(`¿Borrar la pregunta?\n\n"${q.prompt}"\n\nTambién se borrarán las respuestas registradas.`)) return
    try {
      await adminApi.deleteQuestion(q.id)
      questionsQuery.reload()
    } catch (e) {
      window.alert(errorMessage(e))
    }
  }

  if (modulesQuery.error) return <ErrorPanel error={modulesQuery.error} onRetry={modulesQuery.reload} />

  return (
    <section className="panel">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1 sm:flex-none">
          <label className="label" htmlFor="q-module">
            Módulo
          </label>
          <select
            id="q-module"
            className="input"
            value={moduleId ?? ''}
            onChange={(e) => setModuleId(Number(e.target.value))}
          >
            {modulesQuery.data?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} · {m.title}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-48 flex-1">
          <label className="label" htmlFor="q-search">
            Buscar
          </label>
          <input
            id="q-search"
            className="input"
            placeholder="Texto de pregunta o respuesta"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleNew} className="btn-primary text-sm" disabled={moduleId === null}>
          + Nueva pregunta
        </button>
      </div>

      {questionsQuery.error ? (
        <div className="mt-4">
          <ErrorPanel error={questionsQuery.error} onRetry={questionsQuery.reload} />
        </div>
      ) : questionsQuery.loading ? (
        <div className="mt-4 h-40 animate-pulse rounded bg-stone" />
      ) : (
        <>
          <p className="mt-4 text-xs text-mist">
            {visible.length} de {questions.length} preguntas
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-mist">
                <tr className="border-b border-rune">
                  <th className="py-2 pr-3 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Pregunta</th>
                  <th className="py-2 pr-3 font-medium">Correcta</th>
                  <th className="py-2 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((q) => (
                  <tr key={q.id} className="border-b border-rune/60 align-top">
                    <td className="py-2 pr-3 tabular-nums text-mist">{q.isBossFinal ? '⚔' : q.sortOrder}</td>
                    <td className="py-2 pr-3">
                      {q.isBossFinal && <span className="mr-2 rounded bg-blood/15 px-1.5 py-0.5 text-[10px] text-blood">JEFE</span>}
                      {q.prompt}
                    </td>
                    <td className="py-2 pr-3 text-moss">{q.correct}</td>
                    <td className="py-2 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setEditing({ question: q, isNew: false })}
                        className="btn-ghost mr-2 px-3 py-1.5 text-sm"
                      >
                        Editar
                      </button>
                      <button type="button" onClick={() => void handleDelete(q)} className="btn-danger">
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <QuestionForm
          initial={editing.question}
          isNew={editing.isNew}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            questionsQuery.reload()
          }}
        />
      )}
    </section>
  )
}

interface QuestionFormProps {
  initial: AdminQuestion
  isNew: boolean
  onClose: () => void
  onSaved: () => void
}

function QuestionForm({ initial, isNew, onClose, onSaved }: QuestionFormProps) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setDistractor = (i: number, value: string) =>
    setForm((f) => {
      const d = [...f.distractors] as [string, string, string]
      d[i] = value
      return { ...f, distractors: d }
    })

  const validate = (): string | null => {
    const options = [form.correct, ...form.distractors].map((o) => o.trim())
    if (!form.prompt.trim()) return 'La pregunta es obligatoria'
    if (options.some((o) => !o)) return 'Completa la respuesta correcta y las 3 falsas'
    if (new Set(options.map((o) => o.toLowerCase())).size !== 4) return 'Las 4 alternativas deben ser distintas'
    if (!Number.isInteger(form.sortOrder)) return 'El orden debe ser un número entero'
    return null
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validate()
    if (problem) return setError(problem)
    setSaving(true)
    setError(null)
    try {
      await adminApi.saveQuestion({
        ...form,
        prompt: form.prompt.trim(),
        correct: form.correct.trim(),
        distractors: form.distractors.map((d) => d.trim()) as [string, string, string],
      })
      onSaved()
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Modal title={isNew ? 'Nueva pregunta' : 'Editar pregunta'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="qf-prompt">
            Pregunta
          </label>
          <textarea
            id="qf-prompt"
            className="input min-h-20"
            value={form.prompt}
            onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
          />
        </div>
        <div>
          <label className="label text-moss" htmlFor="qf-correct">
            Respuesta correcta
          </label>
          <input
            id="qf-correct"
            className="input border-moss/50"
            value={form.correct}
            onChange={(e) => setForm((f) => ({ ...f, correct: e.target.value }))}
          />
        </div>
        {form.distractors.map((d, i) => (
          <div key={i}>
            <label className="label" htmlFor={`qf-d${i}`}>
              Alternativa falsa {i + 1}
            </label>
            <input id={`qf-d${i}`} className="input" value={d} onChange={(e) => setDistractor(i, e.target.value)} />
          </div>
        ))}
        <div className="flex flex-wrap items-end gap-6">
          <div className="w-28">
            <label className="label" htmlFor="qf-order">
              Orden
            </label>
            <input
              id="qf-order"
              type="number"
              className="input"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={form.isBossFinal}
              onChange={(e) => setForm((f) => ({ ...f, isBossFinal: e.target.checked }))}
            />
            Pregunta del jefe (ataque especial: +50 XP, daño ×5)
          </label>
        </div>
        <p className="text-xs text-mist">Las alternativas se barajan automáticamente para cada jugador.</p>
        <FormFooter error={error} saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  )
}

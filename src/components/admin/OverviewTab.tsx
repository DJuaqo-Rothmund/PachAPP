import { ErrorPanel } from '../ui/ErrorPanel'
import { useAsync } from '../../hooks/useAsync'
import { adminApi } from '../../lib/game'

export function OverviewTab() {
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([adminApi.getOverview(), adminApi.getQuestionStats()]),
    [],
  )

  if (error) return <ErrorPanel error={error} onRetry={reload} />
  if (loading || !data) return <div className="panel h-64 animate-pulse" />

  const [overview, stats] = data
  const accuracy = overview.answers > 0 ? Math.round((overview.correctAnswers / overview.answers) * 100) : null
  const answered = stats.filter((s) => s.attempts > 0)
  const hardest = [...answered].sort((a, b) => a.correct / a.attempts - b.correct / b.attempts).slice(0, 10)
  const unanswered = stats.length - answered.length

  const kpis = [
    { label: 'Jugadores', value: overview.players },
    { label: 'Respuestas', value: overview.answers },
    { label: '% de acierto', value: accuracy === null ? '—' : `${accuracy}%` },
    { label: 'Jefes derrotados', value: `${overview.bossesDefeated} / ${overview.bossesTotal}` },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="panel">
            <p className="text-xs uppercase tracking-wide text-mist">{k.label}</p>
            <p className="pixel-title mt-3 text-lg text-gold">{k.value}</p>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold">Preguntas más difíciles</h2>
          <p className="text-xs text-mist">
            {stats.length} preguntas · {unanswered} aún sin respuestas
          </p>
        </div>
        <p className="mt-1 text-xs text-mist">
          Menor tasa de acierto primero. Una tasa muy baja puede indicar una pregunta ambigua o mal redactada.
        </p>

        {hardest.length === 0 ? (
          <p className="mt-6 text-sm text-mist">Todavía no hay respuestas registradas.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-mist">
                <tr className="border-b border-rune">
                  <th className="py-2 pr-3 font-medium">Mód.</th>
                  <th className="py-2 pr-3 font-medium">Pregunta</th>
                  <th className="py-2 pr-3 text-right font-medium">Intentos</th>
                  <th className="w-40 py-2 font-medium">Acierto</th>
                </tr>
              </thead>
              <tbody>
                {hardest.map((s) => {
                  const pct = Math.round((s.correct / s.attempts) * 100)
                  return (
                    <tr key={s.questionId} className="border-b border-rune/60">
                      <td className="py-2 pr-3 text-mist">{s.moduleId}</td>
                      <td className="py-2 pr-3">{s.prompt}</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-mist">{s.attempts}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded bg-stone">
                            <div
                              className={`h-full ${pct < 40 ? 'bg-blood' : pct < 70 ? 'bg-gold' : 'bg-moss'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-10 text-right tabular-nums text-xs">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

import { useState } from 'react'
import { useLives } from '../../context/LivesContext'
import { useProfile } from '../../context/ProfileContext'
import { gameApi, type TesterResetScope } from '../../lib/game'

const ACTIONS: { scope: TesterResetScope; label: string; confirm: string; danger?: boolean }[] = [
  { scope: 'lives', label: '❤ Recargar mis vidas', confirm: '¿Recargar tus 3 vidas de hoy?' },
  {
    scope: 'progress',
    label: '↺ Reiniciar mi progreso y XP',
    confirm: 'Se borrarán tu XP, respuestas, lecturas de Códices, raids, subjefes derrotados y emblemas. ¿Continuar?',
  },
  {
    scope: 'bosses',
    label: '♛ Restaurar HP de todos los jefes',
    confirm:
      'Todos los jefes vuelven a su HP completo y se vuelven a bloquear los módulos que abrió la comunidad. Esto afecta a TODOS los jugadores. ¿Continuar?',
    danger: true,
  },
  {
    scope: 'all',
    label: '⚠ Reiniciar todo',
    confirm: 'Se reinician tu progreso, tus vidas y el HP de todos los jefes (afecta a TODOS los jugadores). ¿Continuar?',
    danger: true,
  },
]

/** Herramientas de prueba visibles solo en modo maestro. */
export function MasterPanel({ compact = false }: { compact?: boolean }) {
  const { profile } = useProfile()
  const { refresh: refreshLives } = useLives()
  const [busy, setBusy] = useState<TesterResetScope | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  if (!profile?.isTester) return null

  const run = async (scope: TesterResetScope, confirmText: string) => {
    if (!window.confirm(confirmText)) return
    setBusy(scope)
    setMessage(null)
    try {
      await gameApi.testerReset(scope)
      await refreshLives()
      // Recarga la página para que mapa, jefes y perfil muestren el estado nuevo.
      window.location.reload()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'No se pudo reiniciar')
      setBusy(null)
    }
  }

  return (
    <section className={`panel border-gold/40 bg-gold/5 ${compact ? 'mb-6' : ''}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="pixel-title text-[10px] text-gold">🔮 Panel del modo maestro</h2>
        <span className="text-xs text-mist">Todo desbloqueado · vidas ilimitadas · raids sin límite</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((a) => (
          <button
            key={a.scope}
            type="button"
            disabled={busy !== null}
            onClick={() => void run(a.scope, a.confirm)}
            className={`${a.danger ? 'btn-danger' : 'btn-ghost'} justify-center text-sm`}
          >
            {busy === a.scope ? 'Reiniciando…' : a.label}
          </button>
        ))}
      </div>
      {message && <p className="mt-3 text-sm text-blood">{message}</p>}
    </section>
  )
}

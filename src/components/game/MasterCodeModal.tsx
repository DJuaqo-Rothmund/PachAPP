import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { useLives } from '../../context/LivesContext'
import { useProfile } from '../../context/ProfileContext'
import { gameApi } from '../../lib/game'

/** Pide la clave del modo maestro (cuenta de pruebas sin límites). */
export function MasterCodeModal({ onClose }: { onClose: () => void }) {
  const { refresh } = useProfile()
  const { refresh: refreshLives } = useLives()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!code || busy) return
    setBusy(true)
    setError(null)
    try {
      const ok = await gameApi.activateMasterMode(code)
      if (!ok) {
        setError('Clave incorrecta.')
        setCode('')
        return
      }
      await Promise.all([refresh(), refreshLives()])
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo activar el modo maestro')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="🔮 Modo maestro" onClose={onClose}>
      {done ? (
        <div className="text-center">
          <p className="title-pixel text-3xl text-gold">Modo maestro activo</p>
          <p className="mt-4 text-sm text-mist">
            Vidas ilimitadas, todos los submódulos y jefes abiertos y Boss Raid sin límite semanal. El daño que hagas sí cuenta para los jefes de la
            comunidad. Puedes desactivarlo desde tu perfil.
          </p>
          <button type="button" className="btn-primary mt-6" onClick={onClose}>
            Entendido
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="text-sm text-mist">Ingresa la clave de pruebas para desbloquear todo el contenido.</p>
          <label className="label mt-4" htmlFor="master-code">
            Clave
          </label>
          <input
            id="master-code"
            className="input"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <p className="mt-3 text-sm text-blood">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={!code || busy}>
              {busy ? 'Verificando…' : 'Activar'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

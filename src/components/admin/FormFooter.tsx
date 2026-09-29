interface FormFooterProps {
  error: string | null
  saving: boolean
  onCancel: () => void
}

export function FormFooter({ error, saving, onCancel }: FormFooterProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-rune pt-4">
      {error && <p className="mr-auto text-sm text-blood">{error}</p>}
      <button type="button" onClick={onCancel} className="btn-ghost text-sm">
        Cancelar
      </button>
      <button type="submit" disabled={saving} className="btn-primary text-sm">
        {saving ? 'Guardando…' : 'Guardar'}
      </button>
    </div>
  )
}

/** Mensaje legible para errores de Supabase o de validación. */
export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message)
  return 'Error desconocido'
}

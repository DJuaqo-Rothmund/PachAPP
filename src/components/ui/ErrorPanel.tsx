interface ErrorPanelProps {
  error: Error
  onRetry?: () => void
}

export function ErrorPanel({ error, onRetry }: ErrorPanelProps) {
  return (
    <div className="panel border-blood/50">
      <p className="text-sm text-blood">Algo salió mal: {error.message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost mt-4 text-sm">
          Reintentar
        </button>
      )}
    </div>
  )
}

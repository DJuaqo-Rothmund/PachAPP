/** Pantalla de carga: el logo de Pachapp con un aviso que late. */
export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <img src="/brand/logo.webp" alt="Pachapp" width={320} height={320} className="w-[min(320px,78vw)]" />
      <p className="pixel-title animate-pulse text-xs text-gold">Cargando...</p>
    </div>
  )
}

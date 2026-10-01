import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, demoMode, signInWithGoogle } = useAuth()
  const [error, setError] = useState<string | null>(null)

  if (user || demoMode) return <Navigate to="/" replace />

  const handleLogin = async () => {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel w-full max-w-sm text-center">
        <img src="/brand/logo.webp" alt="Pachapp" width={280} height={280} className="mx-auto w-full max-w-[280px]" />
        <h1 className="sr-only">Pachapp</h1>
        <p className="mt-2 text-sm text-mist">Aprende agronomía. Derrota jefes. Gana loot.</p>

        <button type="button" onClick={handleLogin} className="btn-primary mt-8 w-full">
          Entrar con Google
        </button>
        {error && <p className="mt-4 text-sm text-blood">{error}</p>}

        <p className="mt-8 text-xs text-mist">by DJuaqo</p>
      </div>
    </div>
  )
}

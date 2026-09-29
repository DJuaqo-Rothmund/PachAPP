import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="pixel-title text-3xl text-blood">404</p>
      <p className="mt-4 text-mist">Te perdiste en la niebla del huerto.</p>
      <Link to="/" className="btn-ghost mt-6">
        Volver al mapa
      </Link>
    </div>
  )
}

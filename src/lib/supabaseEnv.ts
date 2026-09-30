/**
 * Limpia los valores de conexión a Supabase copiados desde el panel: espacios,
 * comillas, barra final y sufijos de endpoint (`/rest/v1`, `/auth/v1`). Si la URL
 * trae un sufijo, supabase-js arma rutas como `/rest/v1/auth/v1/authorize` y el
 * login con Google termina en "No API key found in request".
 */
export function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  let url = raw.trim().replace(/^['"]|['"]$/g, '')
  url = url.replace(/\/+$/, '').replace(/\/(rest|auth)\/v1$/i, '').replace(/\/+$/, '')
  return url || undefined
}

export function normalizeSupabaseKey(raw: string | undefined): string | undefined {
  const key = raw?.trim().replace(/^['"]|['"]$/g, '')
  return key || undefined
}

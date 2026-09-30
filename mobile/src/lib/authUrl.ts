/**
 * Extrae los parámetros que Supabase devuelve al volver del login con Google:
 * tokens en el fragmento (#access_token=…, flujo implicit), `code` en la query
 * (flujo PKCE) o `error` / `error_description` si algo falló.
 */
export function parseAuthParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const hashIndex = url.indexOf('#')
  const beforeHash = hashIndex === -1 ? url : url.slice(0, hashIndex)
  const queryIndex = beforeHash.indexOf('?')
  const parts = [
    queryIndex === -1 ? '' : beforeHash.slice(queryIndex + 1),
    hashIndex === -1 ? '' : url.slice(hashIndex + 1),
  ]
  for (const part of parts) {
    for (const pair of part.split('&')) {
      if (!pair) continue
      const eq = pair.indexOf('=')
      const key = decodeURIComponent((eq === -1 ? pair : pair.slice(0, eq)).replace(/\+/g, ' '))
      const value = eq === -1 ? '' : decodeURIComponent(pair.slice(eq + 1).replace(/\+/g, ' '))
      params[key] = value
    }
  }
  return params
}

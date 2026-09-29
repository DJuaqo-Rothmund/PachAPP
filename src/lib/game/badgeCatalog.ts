import type { Badge } from '../../data/types'
import { gameApi } from '.'

let cache: Promise<Badge[]> | null = null

/** Catálogo de emblemas, pedido una sola vez y compartido por toda la app. */
export function loadBadgeCatalog(): Promise<Badge[]> {
  cache ??= gameApi.getBadges().catch((e: unknown) => {
    cache = null
    throw e
  })
  return cache
}

/** Llamar después de editar emblemas en el panel admin. */
export function invalidateBadgeCatalog() {
  cache = null
}

import type { Badge } from '@shared/data/types'
import { gameApi } from './game'

let cache: Promise<Badge[]> | null = null

/** Catálogo de emblemas, pedido una sola vez y compartido por toda la app. */
export function loadBadgeCatalog(): Promise<Badge[]> {
  cache ??= gameApi.getBadges().catch((e: unknown) => {
    cache = null
    throw e
  })
  return cache
}

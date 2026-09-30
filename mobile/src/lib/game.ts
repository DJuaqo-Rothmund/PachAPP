// Reutiliza la capa de juego de la web: mismas reglas, tipos y datos.
import { createDemoApi } from '@shared/lib/game/demoApi'
import { createSupabaseApi } from '@shared/lib/game/supabaseApi'
import type { GameApi } from '@shared/lib/game/types'
import { supabase } from './supabase'

export const gameApi: GameApi = supabase ? createSupabaseApi(supabase) : createDemoApi()

export type * from '@shared/lib/game/types'
export { levelFromXp } from '@shared/lib/game/level'
export { resetDemo } from '@shared/lib/game/demoApi'

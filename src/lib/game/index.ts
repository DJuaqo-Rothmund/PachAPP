import { supabase } from '../supabase'
import { createDemoApi } from './demoApi'
import { createSupabaseApi } from './supabaseApi'
import type { GameApi } from './types'

export const gameApi: GameApi = supabase ? createSupabaseApi(supabase) : createDemoApi()

export * from './types'

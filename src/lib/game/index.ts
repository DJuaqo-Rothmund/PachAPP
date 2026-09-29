import { supabase } from '../supabase'
import { createDemoAdminApi, createDemoApi } from './demoApi'
import { createSupabaseAdminApi } from './supabaseAdminApi'
import { createSupabaseApi } from './supabaseApi'
import type { AdminApi, GameApi } from './types'

export const gameApi: GameApi = supabase ? createSupabaseApi(supabase) : createDemoApi()
export const adminApi: AdminApi = supabase ? createSupabaseAdminApi(supabase) : createDemoAdminApi()

export * from './types'

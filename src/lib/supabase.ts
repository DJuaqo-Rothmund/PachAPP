import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { normalizeSupabaseKey, normalizeSupabaseUrl } from './supabaseEnv'

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined)
const anonKey = normalizeSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)

export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * Cliente único de Supabase. Es `null` mientras no existan las variables
 * de entorno, lo que permite navegar la app en "modo demo" sin backend.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

const adminEmails = ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

/** Solo decide qué UI mostrar; la autorización real la aplican las políticas RLS. */
export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && adminEmails.includes(email.toLowerCase()))
}

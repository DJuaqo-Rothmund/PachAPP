import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { parseAuthParams } from './authUrl'
import { supabase } from './supabase'

/**
 * Enlace al que Supabase devuelve la sesión tras el login con Google.
 * En el APK es `pachapp://auth-callback`; debe estar en Supabase →
 * Authentication → URL Configuration → Redirect URLs.
 */
export const AUTH_REDIRECT_URL = Linking.createURL('auth-callback')

const handledUrls = new Set<string>()

/**
 * Crea la sesión a partir del enlace de retorno. Es idempotente: el mismo enlace
 * puede llegar por el navegador de login y por la ruta /auth-callback.
 * Devuelve true si inició sesión.
 */
export async function completeAuthFromUrl(url: string): Promise<boolean> {
  if (!supabase || handledUrls.has(url)) return false
  handledUrls.add(url)

  const params = parseAuthParams(url)
  if (params.error || params.error_description) {
    throw new Error(params.error_description || params.error)
  }
  if (params.access_token && params.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    })
    if (error) throw error
    return true
  }
  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code)
    if (error) throw error
    return true
  }
  return false
}

/**
 * Login con Google en una pestaña segura del navegador (Custom Tabs). Google no
 * permite el login dentro de un WebView, y así no se necesitan credenciales de
 * Android en Google Cloud: se reutiliza el proveedor Google configurado en Supabase.
 * Devuelve false si el usuario cerró el navegador sin terminar.
 */
export async function signInWithGoogle(): Promise<boolean> {
  if (!supabase) throw new Error('Supabase no está configurado')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: AUTH_REDIRECT_URL, skipBrowserRedirect: true },
  })
  if (error) throw error

  const result = await WebBrowser.openAuthSessionAsync(data.url, AUTH_REDIRECT_URL)
  if (result.type !== 'success') return false
  return completeAuthFromUrl(result.url)
}

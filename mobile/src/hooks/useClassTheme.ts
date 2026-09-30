import { classTheme, type ClassTheme } from '@shared/data/classes'
import { useProfile } from '@/context/ProfileContext'

/** Skin de la clase del jugador (acento y fondo decorativo). */
export function useClassTheme(): ClassTheme {
  const { profile } = useProfile()
  return classTheme(profile?.rpgClass)
}

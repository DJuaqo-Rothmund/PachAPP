import { useEffect } from 'react'
import { classTheme, type ClassTheme, type RpgClassId } from '../../data/classes'
import { useProfile } from '../../context/ProfileContext'
import { skinVars } from '../../lib/skin'

/** Aplica la skin de una clase a toda la app: variables de acento, fondo decorativo y `html[data-skin]`. */
export function applyClassTheme(theme: ClassTheme, id: RpgClassId | null = null) {
  const root = document.documentElement
  for (const [name, value] of Object.entries(skinVars(theme))) root.style.setProperty(name, value)
  root.dataset.motif = theme.motif
  root.dataset.skin = id ?? 'default'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.accentDim)
}

/** Mantiene la skin sincronizada con la clase del jugador. */
export function ClassThemeController() {
  const { profile } = useProfile()
  const rpgClass = profile?.rpgClass ?? null
  useEffect(() => applyClassTheme(classTheme(rpgClass), rpgClass), [rpgClass])
  return null
}

import { useEffect } from 'react'
import { classTheme, type ClassTheme } from '../../data/classes'
import { useProfile } from '../../context/ProfileContext'

/** Aplica la skin de una clase: acento (reemplaza los tokens moss) y fondo decorativo. */
export function applyClassTheme(theme: ClassTheme) {
  const root = document.documentElement
  root.style.setProperty('--color-moss', theme.accent)
  root.style.setProperty('--color-moss-dim', theme.accentDim)
  root.style.setProperty('--motif-color', theme.motifColor)
  root.dataset.motif = theme.motif
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.accentDim)
}

/** Mantiene la skin sincronizada con la clase del jugador. */
export function ClassThemeController() {
  const { profile } = useProfile()
  const rpgClass = profile?.rpgClass ?? null
  useEffect(() => applyClassTheme(classTheme(rpgClass)), [rpgClass])
  return null
}

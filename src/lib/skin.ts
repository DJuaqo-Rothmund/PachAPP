import type { CSSProperties } from 'react'
import type { ClassTheme, RpgClassId } from '../data/classes'

/**
 * Variables CSS de una skin de clase. Todo lo que pinta acentos (paneles, botones,
 * marcos, brillos) lee estas variables, así que basta con inyectarlas en un
 * contenedor para cambiar su aspecto:
 *
 *   --skin-accent / --color-moss        color principal (botones, selección)
 *   --skin-accent-dim / --color-moss-dim versión oscura (bordes, fondos)
 *   --skin-glow                          brillo translúcido del acento
 *   --skin-border                        borde de los bloques de piedra teñido
 *   --motif-color                        color del fondo decorativo
 */
export function skinVars(theme: ClassTheme): Record<string, string> {
  return {
    '--color-moss': theme.accent,
    '--color-moss-dim': theme.accentDim,
    '--skin-accent': theme.accent,
    '--skin-accent-dim': theme.accentDim,
    '--skin-glow': `color-mix(in srgb, ${theme.accent} 35%, transparent)`,
    '--skin-border': `color-mix(in srgb, ${theme.accentDim} 55%, var(--color-rune))`,
    '--motif-color': theme.motifColor,
  }
}

/** Props para inyectar una skin en un subárbol: `<div {...skinScope(id, theme)}>`. */
export function skinScope(id: RpgClassId | 'default', theme: ClassTheme): { style: CSSProperties; 'data-skin': string } {
  return { style: skinVars(theme) as CSSProperties, 'data-skin': id }
}

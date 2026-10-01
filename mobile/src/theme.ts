/** Tokens de diseño Pachapp: los mismos de la web (src/index.css). Estética de mazmorra: piedra oscura y pergamino. */
export const colors = {
  void: '#12110e',
  crypt: '#1d1b16',
  stone: '#2a2620',
  rune: '#3d372d',
  mist: '#b3a78f',
  bone: '#f4ead3',
  parchment: '#fdf6e3',
  leather: '#2b2216',
  moss: '#7fbf4d',
  mossDim: '#3f5f23',
  gold: '#f5c542',
  blood: '#e0453a',
  mana: '#5ab0f0',
  arcane: '#b07cf5',
  orange: '#f2802c',
  /** Contorno negro de todo lo pixelado. */
  ink: '#0a0907',
  /** Bisel de los bloques de piedra: luz arriba-izquierda, sombra abajo-derecha. */
  bevelLight: '#4d463b',
  bevelDark: '#0f0d0a',
  rust: '#8b4a26',
  rustLight: '#c26a35',
} as const

export const fonts = {
  pixel: 'PressStart2P_400Regular',
  /** Títulos pixel legibles: jefes, subjefes, clases y botones. */
  title: 'VT323_400Regular',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const

/** Pixel art: casi sin curvas. */
export const radius = { sm: 0, md: 2, lg: 3 } as const
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const

/** Mezcla dos colores hex (t = peso de `a`). Sirve para teñir la piedra con el color de la clase. */
export function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * t + ((pb >> shift) & 255) * (1 - t))
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`
}

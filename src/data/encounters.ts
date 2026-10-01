/**
 * encountersConfig: estilo visual de cada encuentro (jefe cooperativo y subjefes)
 * por módulo, en clave "D&D Agrícola 16-bits".
 *
 * - frame:    estilo del marco del retrato (textura del borde). Ver `.frame-*` en src/index.css.
 * - bgTheme:  fondo temático de la batalla. Ver `.bg-*` en src/index.css.
 * - palette:  colores del marco, el brillo y los títulos del encuentro.
 * - spriteUrl: imagen pixel art del jefe. null = usar el sprite pixel de respaldo.
 *             La base de datos (modules.sprite_url / submodules.sprite_url) tiene prioridad,
 *             así se pueden conectar imágenes sin volver a publicar la app.
 *
 * Los subjefes heredan el marco y el fondo de su módulo en versión "menor"
 * (sin remaches ni aura) para que se lean claramente como enemigos de menor rango.
 */

export type FrameStyle =
  | 'packed-clay'
  | 'salt-crystal'
  | 'black-ice'
  | 'ancient-root'
  | 'vine-lattice'
  | 'tangled-wood'
  | 'peat-bog'
  | 'thorn-ice'
  | 'scrap-tech'
  | 'feather-grain'
  | 'fungal'
  | 'flesh-crest'
  | 'dry-rock'
  | 'stone'

export type BgTheme =
  | 'bg-clay-pit'
  | 'bg-salt-flats'
  | 'bg-black-frost'
  | 'bg-ancient-roots'
  | 'bg-geometric-grove'
  | 'bg-overgrown-canopy'
  | 'bg-red-swamp'
  | 'bg-thorn-frost'
  | 'bg-greenhouse'
  | 'bg-wheat-storm'
  | 'bg-spore-crypt'
  | 'bg-mutant-coop'
  | 'bg-dry-steppe'
  | 'bg-dungeon'

export interface EncounterPalette {
  /** Color principal del encuentro (nombre del jefe, acentos). */
  primary: string
  /** Color secundario (detalles, sellos). */
  secondary: string
  /** Brillo/aura alrededor del retrato. */
  glow: string
  /** Borde iluminado y borde en sombra del marco. */
  frameLight: string
  frameDark: string
  /** Fondo del interior de la tarjeta. */
  surface: string
}

export interface EncounterStyle {
  moduleId: number
  bossId: string
  /** Temática en una línea (para el equipo de arte). */
  theme: string
  frame: FrameStyle
  bgTheme: BgTheme
  palette: EncounterPalette
  spriteUrl: string | null
}

export const ENCOUNTERS: Record<number, EncounterStyle> = {
  1: {
    moduleId: 1,
    bossId: 'boss-edafologia',
    theme: 'Arcilla compactada, capas de suelo y raíces retorcidas',
    frame: 'packed-clay',
    bgTheme: 'bg-clay-pit',
    palette: { primary: '#e8955a', secondary: '#f2c48d', glow: '#c2562f', frameLight: '#b0703f', frameDark: '#3e2414', surface: '#1e140d' },
    spriteUrl: null,
  },
  2: {
    moduleId: 2,
    bossId: 'boss-fertilidad',
    theme: 'Sal y cristales corrosivos',
    frame: 'salt-crystal',
    bgTheme: 'bg-salt-flats',
    palette: { primary: '#e6fbff', secondary: '#7fd8e8', glow: '#9ef0ff', frameLight: '#d8eef2', frameDark: '#4a6670', surface: '#121a1d' },
    spriteUrl: null,
  },
  3: {
    moduleId: 3,
    bossId: 'boss-agrometeorologia',
    theme: 'Hielo oscuro y viento',
    frame: 'black-ice',
    bgTheme: 'bg-black-frost',
    palette: { primary: '#9fc4ff', secondary: '#5b6f9e', glow: '#6aa5ff', frameLight: '#6d7fa8', frameDark: '#141a2b', surface: '#0d111c' },
    spriteUrl: null,
  },
  4: {
    moduleId: 4,
    bossId: 'boss-fisiologia',
    theme: 'Raíces nudosas y magia antigua',
    frame: 'ancient-root',
    bgTheme: 'bg-ancient-roots',
    palette: { primary: '#d9b3ff', secondary: '#a7854f', glow: '#9b5cf0', frameLight: '#8a6a3c', frameDark: '#2a1c0f', surface: '#17111a' },
    spriteUrl: null,
  },
  5: {
    moduleId: 5,
    bossId: 'boss-botanica',
    theme: 'Hojas y enredaderas geométricas',
    frame: 'vine-lattice',
    bgTheme: 'bg-geometric-grove',
    palette: { primary: '#9ef07a', secondary: '#e9f5a0', glow: '#4ade80', frameLight: '#5e9c3a', frameDark: '#1a3312', surface: '#0f1a0d' },
    spriteUrl: null,
  },
  6: {
    moduleId: 6,
    bossId: 'boss-fruticultura',
    theme: 'Ramas caóticas y madera densa',
    frame: 'tangled-wood',
    bgTheme: 'bg-overgrown-canopy',
    palette: { primary: '#f0b35a', secondary: '#88b04b', glow: '#d97706', frameLight: '#8c5a2b', frameDark: '#2b170a', surface: '#17110a' },
    spriteUrl: null,
  },
  7: {
    moduleId: 7,
    bossId: 'boss-cranberry',
    theme: 'Pantano de turba rojo',
    frame: 'peat-bog',
    bgTheme: 'bg-red-swamp',
    palette: { primary: '#ff5a6e', secondary: '#7c9c3c', glow: '#e11d48', frameLight: '#7a2a2a', frameDark: '#240a0c', surface: '#170b0c' },
    spriteUrl: null,
  },
  8: {
    moduleId: 8,
    bossId: 'boss-frambuesa',
    theme: 'Espinas y hielo',
    frame: 'thorn-ice',
    bgTheme: 'bg-thorn-frost',
    palette: { primary: '#ff7fb0', secondary: '#bfe9ff', glow: '#ec4899', frameLight: '#a4c8de', frameDark: '#3a1730', surface: '#140d14' },
    spriteUrl: null,
  },
  9: {
    moduleId: 9,
    bossId: 'boss-horticultura',
    theme: 'Ciberpunk rústico: ventiladores, sensores y cañerías',
    frame: 'scrap-tech',
    bgTheme: 'bg-greenhouse',
    palette: { primary: '#5cf2c8', secondary: '#f2c94c', glow: '#10b981', frameLight: '#7d8a86', frameDark: '#1d2422', surface: '#0d1513' },
    spriteUrl: null,
  },
  10: {
    moduleId: 10,
    bossId: 'boss-aves',
    theme: 'Plumas y cereales',
    frame: 'feather-grain',
    bgTheme: 'bg-wheat-storm',
    palette: { primary: '#ffd166', secondary: '#c97b3d', glow: '#f59e0b', frameLight: '#c9a04f', frameDark: '#3d2a10', surface: '#1a140a' },
    spriteUrl: null,
  },
  11: {
    moduleId: 11,
    bossId: 'boss-hongos',
    theme: 'Esporas bioluminiscentes y descomposición',
    frame: 'fungal',
    bgTheme: 'bg-spore-crypt',
    palette: { primary: '#c58bff', secondary: '#7cf2d0', glow: '#a855f7', frameLight: '#5d4a63', frameDark: '#1a1220', surface: '#120d16' },
    spriteUrl: null,
  },
  12: {
    moduleId: 12,
    bossId: 'boss-avicola',
    theme: 'Mutación avícola',
    frame: 'flesh-crest',
    bgTheme: 'bg-mutant-coop',
    palette: { primary: '#ff4d4d', secondary: '#ffd0a8', glow: '#ef4444', frameLight: '#b0544a', frameDark: '#3a1210', surface: '#1a0d0c' },
    spriteUrl: null,
  },
  13: {
    moduleId: 13,
    bossId: 'boss-caprinos',
    theme: 'Secano, cuernos y rocas',
    frame: 'dry-rock',
    bgTheme: 'bg-dry-steppe',
    palette: { primary: '#f2d6a2', secondary: '#c9b9a0', glow: '#d6a35c', frameLight: '#a08a6a', frameDark: '#3a2f22', surface: '#1b1610' },
    spriteUrl: null,
  },
}

/** Estilo por defecto (módulos nuevos o jefes creados desde el admin). */
export const DEFAULT_ENCOUNTER: EncounterStyle = {
  moduleId: 0,
  bossId: '',
  theme: 'Mazmorra',
  frame: 'stone',
  bgTheme: 'bg-dungeon',
  palette: { primary: '#e0453a', secondary: '#f5c542', glow: '#e0453a', frameLight: '#6d665a', frameDark: '#24211c', surface: '#1d1b16' },
  spriteUrl: null,
}

export function encounterForModule(moduleId: number | null | undefined): EncounterStyle {
  return (moduleId != null && ENCOUNTERS[moduleId]) || DEFAULT_ENCOUNTER
}

export function encounterForBoss(bossId: string | null | undefined): EncounterStyle {
  return Object.values(ENCOUNTERS).find((e) => e.bossId === bossId) ?? DEFAULT_ENCOUNTER
}

/** Módulo de un submódulo a partir de su id (`m{n}-s{orden}`). */
export function moduleIdOfSubmodule(submoduleId: string): number | null {
  const match = /^m(\d+)-s\d+$/.exec(submoduleId)
  return match ? Number(match[1]) : null
}

export function encounterForSubmodule(submoduleId: string): EncounterStyle {
  return encounterForModule(moduleIdOfSubmodule(submoduleId))
}

/** Valida un bg_theme que viene de la base de datos. */
export function isBgTheme(value: string | null | undefined): value is BgTheme {
  if (!value) return false
  return value === DEFAULT_ENCOUNTER.bgTheme || Object.values(ENCOUNTERS).some((e) => e.bgTheme === value)
}

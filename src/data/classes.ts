export type RpgClassId =
  | 'brujo'
  | 'paladin'
  | 'druida'
  | 'picaro'
  | 'artifice'
  | 'alquimista'
  | 'cultivador'
  | 'guardian'

/** Fondo decorativo de la skin de cada clase (ver `[data-motif]` en src/index.css). */
export type ThemeMotif = 'arcane' | 'water' | 'soil' | 'harvest' | 'circuit' | 'bubbles' | 'furrow' | 'forest'

/** Skin de interfaz que se aplica al elegir la clase. */
export interface ClassTheme {
  /** Color principal: botones, acentos y selección (reemplaza al verde musgo). */
  accent: string
  /** Versión oscura del acento para fondos y bordes suaves. */
  accentDim: string
  /** Color del fondo decorativo. */
  motifColor: string
  motif: ThemeMotif
}

/**
 * Regla para desbloquear una clase. Todavía no se exige (ver CLASS_UNLOCKS_ENFORCED):
 * queda lista para cuando se definan las condiciones finales.
 */
export type ClassUnlockRule =
  | { type: 'starter' }
  | { type: 'level'; level: number }
  | { type: 'boss_defeated'; bossId: string }

export interface RpgClass {
  id: RpgClassId
  name: string
  specialty: string
  description: string
  theme: ClassTheme
  unlock: ClassUnlockRule
}

export const RPG_CLASSES: RpgClass[] = [
  {
    id: 'brujo',
    name: 'Brujo Fitosanitario',
    specialty: 'Plagas y enfermedades',
    description: 'Domina los umbrales de daño y conjura el MIP contra hongos, insectos y malezas.',
    theme: { accent: '#d946ef', accentDim: '#5b1a6b', motifColor: '#a21caf', motif: 'arcane' },
    unlock: { type: 'starter' },
  },
  {
    id: 'paladin',
    name: 'Paladín del Riego',
    specialty: 'Agua y clima',
    description: 'Guardián del Kc y la ETc. Defiende el huerto de heladas y del déficit hídrico.',
    theme: { accent: '#22d3ee', accentDim: '#0e5567', motifColor: '#06b6d4', motif: 'water' },
    unlock: { type: 'starter' },
  },
  {
    id: 'druida',
    name: 'Druida de Suelos',
    specialty: 'Suelo y nutrición',
    description: 'Lee texturas, CIC y pH como runas antiguas. La Ley del Mínimo es su credo.',
    theme: { accent: '#8fb34a', accentDim: '#7a3a1d', motifColor: '#c2562f', motif: 'soil' },
    unlock: { type: 'starter' },
  },
  {
    id: 'picaro',
    name: 'Pícaro de Cosecha',
    specialty: 'Cosecha y postcosecha',
    description: 'Veloz con el pre-frío y la cadena de frío. Ningún fruto se le pudre en la mano.',
    theme: { accent: '#fb7185', accentDim: '#881337', motifColor: '#e11d48', motif: 'harvest' },
    unlock: { type: 'starter' },
  },
  {
    id: 'cultivador',
    name: 'Guerrero del Surco',
    specialty: 'Cultivos y rotaciones',
    description: 'Planifica siembras, rotaciones y densidades. Cada surco es una línea de batalla.',
    theme: { accent: '#facc15', accentDim: '#713f12', motifColor: '#ca8a04', motif: 'furrow' },
    unlock: { type: 'starter' },
  },
  {
    id: 'guardian',
    name: 'Guardián Ambiental',
    specialty: 'Medio ambiente',
    description: 'Protege la biodiversidad, cuida el agua y reconoce aves y hongos a primera vista.',
    theme: { accent: '#2dd4bf', accentDim: '#134e4a', motifColor: '#10b981', motif: 'forest' },
    unlock: { type: 'boss_defeated', bossId: 'boss-aves' },
  },
  {
    id: 'artifice',
    name: 'Artífice de Precisión',
    specialty: 'Agricultura de precisión',
    description: 'Vuela drones, lee mapas NDVI y calibra sensores. Donde otros ven un potrero, ve datos.',
    theme: { accent: '#fb923c', accentDim: '#7c2d12', motifColor: '#14b8a6', motif: 'circuit' },
    unlock: { type: 'level', level: 5 },
  },
  {
    id: 'alquimista',
    name: 'Alquimista Fisiólogo',
    specialty: 'Fisiología y fenología',
    description: 'Destila hormonas, cuenta horas frío y lee la fenología de la planta como un grimorio vivo.',
    theme: { accent: '#fde047', accentDim: '#854d0e', motifColor: '#2dd4bf', motif: 'bubbles' },
    unlock: { type: 'boss_defeated', bossId: 'boss-fisiologia' },
  },
]

/** Skin por defecto (sin clase elegida): la paleta original de Pachapp. */
export const DEFAULT_THEME: ClassTheme = { accent: '#7fbf4d', accentDim: '#3f5f23', motifColor: '#7fbf4d', motif: 'soil' }

/**
 * Mientras sea false todas las clases se pueden elegir; las reglas `unlock` solo
 * se muestran como información. Al activarlo, hay que exigir la misma regla en
 * el servidor (política de update de profiles.rpg_class).
 */
export const CLASS_UNLOCKS_ENFORCED = false

export interface ClassUnlockProgress {
  level: number
  defeatedBossIds: string[]
}

export interface ClassUnlockState {
  /** Cumple la regla (independiente de si se exige). */
  earned: boolean
  /** Se puede elegir ahora. */
  selectable: boolean
  /** Descripción de la regla, para mostrar en la interfaz. */
  requirement: string | null
}

export function classTheme(id: RpgClassId | null | undefined): ClassTheme {
  return RPG_CLASSES.find((c) => c.id === id)?.theme ?? DEFAULT_THEME
}

export function describeUnlock(rule: ClassUnlockRule, bossNames: Record<string, string> = {}): string | null {
  switch (rule.type) {
    case 'starter':
      return null
    case 'level':
      return `Alcanza el nivel ${rule.level}`
    case 'boss_defeated':
      return `Derrota a ${bossNames[rule.bossId] ?? 'un jefe de la campaña'}`
  }
}

export function classUnlockState(
  cls: RpgClass,
  progress: ClassUnlockProgress,
  bossNames: Record<string, string> = {},
): ClassUnlockState {
  const rule = cls.unlock
  const earned =
    rule.type === 'starter' ||
    (rule.type === 'level' && progress.level >= rule.level) ||
    (rule.type === 'boss_defeated' && progress.defeatedBossIds.includes(rule.bossId))
  return { earned, selectable: earned || !CLASS_UNLOCKS_ENFORCED, requirement: describeUnlock(rule, bossNames) }
}

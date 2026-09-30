export type RpgClassId = 'brujo' | 'paladin' | 'druida' | 'picaro' | 'artifice' | 'alquimista'

export interface RpgClass {
  id: RpgClassId
  name: string
  specialty: string
  description: string
  /** Color de acento (token de Tailwind) usado en tarjetas y avatar. */
  accent: string
}

export const RPG_CLASSES: RpgClass[] = [
  {
    id: 'brujo',
    name: 'Brujo Fitosanitario',
    specialty: 'Plagas y enfermedades',
    description: 'Domina los umbrales de daño y conjura el MIP contra hongos, insectos y malezas.',
    accent: 'arcane',
  },
  {
    id: 'paladin',
    name: 'Paladín del Riego',
    specialty: 'Agua y clima',
    description: 'Guardián del Kc y la ETc. Defiende el huerto de heladas y del déficit hídrico.',
    accent: 'mana',
  },
  {
    id: 'druida',
    name: 'Druida de Suelos',
    specialty: 'Suelo y nutrición',
    description: 'Lee texturas, CIC y pH como runas antiguas. La Ley del Mínimo es su credo.',
    accent: 'moss',
  },
  {
    id: 'picaro',
    name: 'Pícaro de Cosecha',
    specialty: 'Cosecha y postcosecha',
    description: 'Veloz con el pre-frío y la cadena de frío. Ningún fruto se le pudre en la mano.',
    accent: 'gold',
  },
  {
    id: 'artifice',
    name: 'Artífice de Precisión',
    specialty: 'Agricultura de precisión',
    description: 'Vuela drones, lee mapas NDVI y calibra sensores. Donde otros ven un potrero, ve datos.',
    accent: 'gold',
  },
  {
    id: 'alquimista',
    name: 'Alquimista Fisiólogo',
    specialty: 'Fisiología y fenología',
    description: 'Destila hormonas, cuenta horas frío y lee la fenología de la planta como un grimorio vivo.',
    accent: 'mana',
  },
]

import type { Badge, CodexSection, Module, Question, Submodule } from './types'
import { EDAFOLOGIA_BOSS_FINAL, EDAFOLOGIA_SUBMODULES } from './campaign/m01-edafologia.ts'
import { FERTILIDAD_BOSS_FINAL, FERTILIDAD_SUBMODULES } from './campaign/m02-fertilidad.ts'
import { AGROMETEOROLOGIA_BOSS_FINAL, AGROMETEOROLOGIA_SUBMODULES } from './campaign/m03-agrometeorologia.ts'
import { FISIOLOGIA_BOSS_FINAL, FISIOLOGIA_SUBMODULES } from './campaign/m04-fisiologia.ts'
import { BOTANICA_BOSS_FINAL, BOTANICA_SUBMODULES } from './campaign/m05-botanica.ts'
import { FRUTICULTURA_BOSS_FINAL, FRUTICULTURA_SUBMODULES } from './campaign/m06-fruticultura.ts'
import { CRANBERRY_SUBMODULES } from './campaign/m07-cranberry.ts'
import { FRAMBUESA_SUBMODULES } from './campaign/m08-frambuesa.ts'
import { HORTICULTURA_BOSS_FINAL, HORTICULTURA_SUBMODULES } from './campaign/m09-horticultura.ts'
import { AVES_BOSS_FINAL, AVES_SUBMODULES } from './campaign/m10-aves.ts'
import { HONGOS_BOSS_FINAL, HONGOS_SUBMODULES } from './campaign/m11-hongos.ts'
import { AVICOLA_BOSS_FINAL, AVICOLA_SUBMODULES } from './campaign/m12-avicola.ts'
import { CAPRINOS_BOSS_FINAL, CAPRINOS_SUBMODULES } from './campaign/m13-caprinos.ts'

/** HP de los jefes cooperativos semanales (5 veces el de la primera campaña). */
export const COOP_BOSS_HP = 5000

/**
 * Preguntas finales de Cranberry y Frambuesa: conservan su id de la campaña
 * anterior (cuando eran los módulos 1 y 2) para no perder su historial.
 */
const CRANBERRY_BOSS_FINAL: Question = {
  id: 'm1-q99',
  prompt: '¿Cómo se llama el mecanismo por el que las abejas extraen el polen en tétradas de la flor del Cranberry?',
  correct: 'Polinización vibratoria (Buzz pollination)',
  distractors: ['Anemófila estricta', 'Nectarización', 'Autopolinización'],
}

const FRAMBUESA_BOSS_FINAL: Question = {
  id: 'm2-q99',
  prompt: 'Para evitar toxicidad en frambuesa, ¿qué fertilizante potásico hay que evitar?',
  correct: 'Muriato de Potasio (KCl)',
  distractors: ['Sulfato de Potasio', 'Nitrato de Potasio', 'Tiosulfato de Potasio'],
}

// ---------------------------------------------------------------------------
// Campaña de 13 módulos
// ---------------------------------------------------------------------------

/** Códice del módulo armado con los Códices de sus submódulos (para la vista actual). */
function codexFromSubmodules(moduleId: number, submodules: Submodule[]): CodexSection[] {
  return submodules.flatMap((sm) =>
    sm.codex.sections.map((section) => ({ heading: `${moduleId}.${sm.order} · ${section.heading}`, body: section.body })),
  )
}

interface ModuleSpec {
  id: number
  slug: string
  title: string
  summary: string
  boss: { name: string; title: string }
}

const LAST_MODULE_ID = 13

/** Módulos abiertos desde el inicio: Edafología, Cranberry y Frambuesa. El resto se abre en cadena. */
const INITIALLY_UNLOCKED = new Set([1, 7, 8])

/** Módulo con submódulos: sus preguntas y su Códice salen de los submódulos. */
function moduleWithSubmodules(spec: ModuleSpec, submodules: Submodule[], finalQuestion: Question | null): Module {
  return {
    ...spec,
    initiallyUnlocked: INITIALLY_UNLOCKED.has(spec.id),
    codex: codexFromSubmodules(spec.id, submodules),
    questions: submodules.flatMap((sm) => sm.questions),
    submodules,
    boss: coopBoss(spec, finalQuestion),
  }
}

function coopBoss(spec: ModuleSpec, finalQuestion: Question | null): Module['boss'] {
  return {
    id: `boss-${spec.slug}`,
    name: spec.boss.name,
    title: spec.boss.title,
    maxHp: COOP_BOSS_HP,
    damagePerHit: 10,
    finalQuestion,
    unlocksModuleId: spec.id < LAST_MODULE_ID ? spec.id + 1 : null,
  }
}

const SPECS: ModuleSpec[] = [
  {
    id: 1,
    slug: 'edafologia',
    title: 'Edafología y Física de Suelos',
    summary: 'Textura, estructura, agua del suelo, compactación, erosión y lectura de perfiles.',
    boss: { name: 'El Gólem de Arcilla Compactada', title: 'Señor del Pie de Arado' },
  },
  {
    id: 2,
    slug: 'fertilidad',
    title: 'Fertilidad y Nutrición Vegetal',
    summary: 'CIC, pH, macro y micronutrientes, diagnóstico foliar y programas de fertilización.',
    boss: { name: 'El Titán de la Salinidad Residual', title: 'Señor de la Conductividad Eléctrica' },
  },
  {
    id: 3,
    slug: 'agrometeorologia',
    title: 'Agrometeorología y Clima',
    summary: 'Balance de radiación, heladas, horas frío, grados día y evapotranspiración.',
    boss: { name: 'La Tempestad de Escarcha Negra', title: 'Heraldo de la Inversión Térmica' },
  },
  {
    id: 4,
    slug: 'fisiologia',
    title: 'Fisiología Vegetal y Relaciones Hídricas',
    summary: 'Fotosíntesis, transpiración, potencial hídrico, hormonas y fenología.',
    boss: { name: 'La Raíz Senescente Ancestral', title: 'Devoradora de Turgencia' },
  },
  {
    id: 5,
    slug: 'botanica',
    title: 'Botánica Agrícola y Silvestre',
    summary: 'Morfología, taxonomía, flora nativa y reconocimiento de malezas.',
    boss: { name: 'El Filotaxista Ancestral', title: 'Custodio del Herbario Prohibido' },
  },
  {
    id: 6,
    slug: 'fruticultura',
    title: 'Fruticultura General',
    summary: 'Portainjertos, sistemas de conducción, poda, polinización y cuaja.',
    boss: { name: 'El Patriarca del Canopio Desbocado', title: 'Tirano del Vigor Excesivo' },
  },
  {
    id: 7,
    slug: 'cranberry',
    title: 'Cranberry',
    summary: 'Acidófila de raíz superficial, heladas por aspersión y cosecha en agua.',
    boss: { name: 'Deformidad de los Verticales', title: 'Señora de los Floats' },
  },
  {
    id: 8,
    slug: 'frambuesa',
    title: 'Frambuesa',
    summary: 'Primocane vs floricane, camellones, conducción en V y pre-frío.',
    boss: { name: 'Señor de las Cañas', title: 'Guardián del Pre-frío' },
  },
  {
    id: 9,
    slug: 'horticultura',
    title: 'Horticultura e Invernaderos',
    summary: 'Manejo de hortalizas, ambiente protegido, clima del invernadero y fertirriego.',
    boss: { name: 'El Climatizador Desbocado', title: 'Amo del Déficit de Presión de Vapor' },
  },
  {
    id: 10,
    slug: 'aves',
    title: 'Reconocimiento de Aves',
    summary: 'Identificación de aves de Chile, su rol en el agroecosistema y el manejo de daños.',
    boss: { name: 'El Tirano de la Espiga', title: 'Rey de la Bandada Granívora' },
  },
  {
    id: 11,
    slug: 'hongos',
    title: 'Reconocimiento y Biología de Hongos',
    summary: 'Morfología, ciclos de vida, hongos benéficos, fitopatógenos y setas silvestres.',
    boss: { name: 'El Micelio Nigromante', title: 'Tejedor de Hifas Oscuras' },
  },
  {
    id: 12,
    slug: 'avicola',
    title: 'Producción Avícola',
    summary: 'Razas, nutrición, sanidad, bienestar y manejo de galpones.',
    boss: { name: 'El Barón de la Cresta Hipertrófica', title: 'Señor del Galpón sin Ventilar' },
  },
  {
    id: 13,
    slug: 'caprinos',
    title: 'Producción Caprina y Rumiantes Menores',
    summary: 'Manejo reproductivo, alimentación en secano, sanidad y productos lácteos.',
    boss: { name: 'El Macho Cabrío del Rastrojo Salino', title: 'Rumiante del Secano Indómito' },
  },
]

const spec = (id: number) => SPECS.find((s) => s.id === id)!

export const MODULES: Module[] = [
  moduleWithSubmodules(spec(1), EDAFOLOGIA_SUBMODULES, EDAFOLOGIA_BOSS_FINAL),
  moduleWithSubmodules(spec(2), FERTILIDAD_SUBMODULES, FERTILIDAD_BOSS_FINAL),
  moduleWithSubmodules(spec(3), AGROMETEOROLOGIA_SUBMODULES, AGROMETEOROLOGIA_BOSS_FINAL),
  moduleWithSubmodules(spec(4), FISIOLOGIA_SUBMODULES, FISIOLOGIA_BOSS_FINAL),
  moduleWithSubmodules(spec(5), BOTANICA_SUBMODULES, BOTANICA_BOSS_FINAL),
  moduleWithSubmodules(spec(6), FRUTICULTURA_SUBMODULES, FRUTICULTURA_BOSS_FINAL),
  moduleWithSubmodules(spec(7), CRANBERRY_SUBMODULES, CRANBERRY_BOSS_FINAL),
  moduleWithSubmodules(spec(8), FRAMBUESA_SUBMODULES, FRAMBUESA_BOSS_FINAL),
  moduleWithSubmodules(spec(9), HORTICULTURA_SUBMODULES, HORTICULTURA_BOSS_FINAL),
  moduleWithSubmodules(spec(10), AVES_SUBMODULES, AVES_BOSS_FINAL),
  moduleWithSubmodules(spec(11), HONGOS_SUBMODULES, HONGOS_BOSS_FINAL),
  moduleWithSubmodules(spec(12), AVICOLA_SUBMODULES, AVICOLA_BOSS_FINAL),
  moduleWithSubmodules(spec(13), CAPRINOS_SUBMODULES, CAPRINOS_BOSS_FINAL),
]

// ---------------------------------------------------------------------------
// Emblemas (loot)
// ---------------------------------------------------------------------------

export const BADGES: Badge[] = [
  {
    id: 'lector-del-codice',
    name: 'Lector del Códice',
    description: 'Leíste tu primer Códice.',
    icon: 'book',
    criterion: { type: 'codex_read', count: 1 },
  },
  {
    id: 'sobreviviente-de-heladas',
    name: 'Sobreviviente de Heladas',
    description: 'Participaste en la caída de la Tempestad de Escarcha Negra.',
    icon: 'snowflake',
    criterion: { type: 'boss_defeated', moduleId: 3 },
  },
  {
    id: 'senor-de-la-turbera',
    name: 'Señor de la Turbera',
    description: 'Completaste el módulo Cranberry.',
    icon: 'berry-red',
    criterion: { type: 'module_completed', moduleId: 7 },
  },
  {
    id: 'cazador-de-suzukii',
    name: 'Cazador de Suzukii',
    description: 'Completaste el módulo Frambuesa.',
    icon: 'berry-pink',
    criterion: { type: 'module_completed', moduleId: 8 },
  },
  {
    id: 'racha-perfecta',
    name: 'Racha Perfecta',
    description: '10 respuestas correctas seguidas.',
    icon: 'flame',
    criterion: { type: 'correct_streak', count: 10 },
  },
  {
    id: 'golpe-final',
    name: 'Golpe Final',
    description: 'Diste el último golpe a un jefe.',
    icon: 'sword',
    criterion: { type: 'final_blow' },
  },
]

export function getModule(id: number): Module | undefined {
  return MODULES.find((m) => m.id === id)
}

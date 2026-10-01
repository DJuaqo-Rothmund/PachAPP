import type { Badge, CodexSection, Module, Question, Submodule } from './types'
import { EDAFOLOGIA_BOSS_FINAL, EDAFOLOGIA_SUBMODULES } from './campaign/m01-edafologia.ts'

/**
 * Crea una pregunta con id estable `m{n}-q{k}`. Las de Cranberry y Frambuesa usan
 * la numeración antigua (m1-, m2-) aunque hoy sean los módulos 7 y 8: así conservan
 * su historial de respuestas.
 */
function q(
  moduleId: number,
  n: number,
  prompt: string,
  correct: string,
  distractors: [string, string, string],
): Question {
  return { id: `m${moduleId}-q${n}`, prompt, correct, distractors }
}

/** Id fijo de la pregunta final de cada jefe. */
const BOSS_Q = 99

/** HP de los jefes cooperativos semanales (5 veces el de la primera campaña). */
export const COOP_BOSS_HP = 5000

// ---------------------------------------------------------------------------
// MÓDULO 7 · Cranberry (antes módulo 1)
// ---------------------------------------------------------------------------

const cranberry: Module = {
  id: 7,
  slug: 'cranberry',
  title: 'Cranberry',
  summary: 'Acidófila de raíz superficial, heladas por aspersión y cosecha en agua.',
  initiallyUnlocked: true,
  codex: [
    {
      heading: 'Manejo Especializado de Cranberry',
      body: [
        'Especie acidófila (pH 4,0-5,5) ineficiente absorbiendo nitratos (exige N amoniacal).',
        'Posee tallos rastreros (runners) y verticales (uprights) donde fructifica en yemas apicales (ideal 400-600 uprights/pie²). Su sistema radicular superficial (10-15 cm) es muy susceptible a Phytophthora cinnamomi.',
      ],
    },
    {
      heading: 'Manejo térmico y cosecha',
      body: [
        'Toleran hasta -18 °C en invierno profundo por deshidratación y antocianinas.',
        'En primavera, se defienden de heladas con aspersión, aprovechando el calor latente de congelación (si el hielo se ve opaco y seco, la tasa de agua es insuficiente).',
        'Cosecha en agua (water-harvest) para industria, donde las batidoras desprenden la fruta que flota por sus cámaras de aire.',
      ],
    },
  ],
  questions: [
    q(1, 1, '¿Cuál es el pH óptimo de suelo para el Cranberry?', '4,0 - 5,5', ['5,5 - 6,5', '6,5 - 7,5', '3,0 - 3,5']),
    q(1, 2, '¿Qué forma de nitrógeno exige el Cranberry?', 'Amoniacal (NH₄⁺)', ['Nítrica', 'Urea foliar', 'Nitrito']),
    q(1, 3, '¿Cuál es el método de control activo de heladas?', 'Aspersión continua (calor latente)', ['Hélices', 'Calefactores', 'Plásticos']),
    q(1, 4, '¿Cuál es el objetivo del sanding (aplicación de arena)?', 'Estimular el enraizamiento y rejuvenecer', ['Subir el pH', 'Retener agua en verano', 'Aportar sílice']),
    q(1, 5, '¿Cuál es el destino de la fruta cosechada en agua (water-harvest)?', 'Industria', ['Mercado fresco', 'Exportación aérea', 'Mercado orgánico']),
    q(1, 6, '¿Qué patógeno se asocia al mal drenaje?', 'Phytophthora cinnamomi', ['Botrytis', 'Oidium', 'Agrobacterium']),
    q(1, 7, '¿Qué gatilla la síntesis de antocianinas en la fruta?', 'Frío nocturno', ['Restricción hídrica', 'Exceso de nitrógeno', 'Giberelinas']),
    q(1, 8, '¿Cuándo se monitorea Cranberry fruitworm?', 'Post-cuaja', ['En receso', 'En pinta de color', 'En floración']),
    q(1, 9, '¿Cómo se asegura la polinización obligatoria?', 'Colmenas de abejas/abejorros', ['Por viento', 'Polinización manual', 'Aplicación de auxinas']),
    q(1, 10, '¿Cuál es la maleza parásita enredadera más problemática?', 'Cuscuta', ['Chufa', 'Correhuela', 'Ballica']),
    q(1, 11, '¿Dónde produce fruta el Cranberry?', 'En yemas apicales de uprights formadas el año anterior', ['En los runners', 'En la raíz', 'En brotes desde el suelo']),
    q(1, 12, '¿Para qué se usan peinadoras en primavera?', 'Alinear runners para la cosecha', ['Cortar flores', 'Romper la costra del suelo', 'Espantar insectos']),
    q(1, 13, '¿Qué es el daño por Sunscald?', 'Daño fisiológico por alta radiación y temperatura', ['Daño por agua caliente', 'Daño por herbicida', 'Daño por trips']),
    q(1, 14, '¿Cuál es la variedad histórica más productiva?', 'Stevens', ['Duke', 'Chandler', 'Heritage']),
    q(1, 15, '¿Qué provoca el exceso de nitrógeno?', 'Emboscamiento y fruta blanda', ['Fruta gigante', 'Clorosis', 'Muerte de raíces']),
    q(1, 16, '¿Por qué la fruta cosechada en agua tiene vida postcosecha corta?', 'Entran patógenos por la cicatriz y el daño de la batidora', ['Pierde color', 'Absorbe sal', 'Pierde sus ceras']),
    q(1, 17, '¿A qué profundidad están las raíces absorbentes?', '10 a 15 cm', ['50 cm', '1 m', '2 m']),
    q(1, 18, '¿A qué tensión se riega con tensiómetro en suelos de arena?', '20 a 30 cbars', ['60 cbars', '10 cbars', '100 cbars']),
    q(1, 19, '¿Qué deficiencia provoca un pH mayor a 6,5?', 'Hierro (clorosis intervenal en brote nuevo)', ['Calcio', 'Fósforo', 'Nitrógeno']),
    q(1, 20, '¿Qué indica ver hielo opaco y seco durante la aspersión contra heladas?', 'Tasa de agua insuficiente: la planta se congela', ['Control perfecto', 'Exceso de sales', 'Humedad al 100%']),
    q(1, 21, '¿Qué daño causa Dasineura oxycoccana?', 'Mata las yemas apicales de uprights tiernos', ['Perfora la fruta', 'Come raíces', 'Transmite virus']),
    q(1, 22, '¿Cómo se manifiesta el Fairy Ring (Psilocybe)?', 'Manchas circulares expansivas de parras muertas', ['Agallas rojas', 'Fruta vacía', 'Moho harinoso']),
    q(1, 23, '¿Qué efecto tiene un pruning severo?', 'Caída temporal del rendimiento y aumento de calibre', ['Aumento explosivo del rendimiento', 'Muerte de uprights', 'Retraso del color']),
    q(1, 24, '¿Qué mide el valor T-Ac?', 'Antocianinas totales', ['Acidez', 'Brix', 'Firmeza']),
    q(1, 25, '¿Cómo actúa el hongo Cottonball?', 'Infecta la flor y la baya se llena de una masa algodonosa', ['Destruye la raíz', 'Causa defoliación', 'Mancha la epidermis']),
  ],
  boss: {
    id: 'boss-cranberry',
    name: 'Deformidad de los Verticales',
    title: 'Señora de los Floats',
    maxHp: COOP_BOSS_HP,
    damagePerHit: 10,
    finalQuestion: q(
      1,
      BOSS_Q,
      '¿Cómo se llama el mecanismo por el que las abejas extraen el polen en tétradas de la flor del Cranberry?',
      'Polinización vibratoria (Buzz pollination)',
      ['Anemófila estricta', 'Nectarización', 'Autopolinización'],
    ),
    unlocksModuleId: 8,
  },
  submodules: [],
}

// ---------------------------------------------------------------------------
// MÓDULO 8 · Frambuesa (antes módulo 2)
// ---------------------------------------------------------------------------

const frambuesa: Module = {
  id: 8,
  slug: 'frambuesa',
  title: 'Frambuesa',
  summary: 'Primocane vs floricane, camellones, conducción en V y pre-frío.',
  initiallyUnlocked: true,
  codex: [
    {
      heading: 'Manejo Avanzado de Frambuesa',
      body: [
        'Arbusto de raíces perennes y cañas bianuales. Remontantes dan fruta en otoño (primocane) y no remontantes en verano (floricane, exige horas frío y muere postcosecha).',
        'Su sensibilidad extrema a Phytophthora exige plantación en camellones.',
      ],
    },
    {
      heading: 'Conducción y postcosecha',
      body: [
        'El manejo en "V" (T-trellis) abre la canopia y previene Botrytis. El raleo temprano de primocanes evita competencia con la floricane.',
        'Tienen altísima tasa respiratoria postcosecha, requiriendo túneles de pre-frío (0 °C) en menos de 4 horas o atmósferas modificadas.',
      ],
    },
  ],
  questions: [
    q(2, 1, '¿Qué diferencia a una variedad remontante de una no remontante?', 'La remontante da en caña del año (otoño); la no remontante, en caña de segundo año (verano)', ['La remontante no tiene espinas', 'La remontante es de secano', 'La remontante da fruta azul']),
    q(2, 2, '¿Qué plaga deja larvas blancas dentro del fruto blando?', 'Drosophila suzukii', ['Ceratitis', 'Trips', 'Burrito']),
    q(2, 3, '¿Por qué se planta en camellones elevados?', 'La raíz es hipersensible a la asfixia y a Phytophthora', ['Para permitir cosecha mecánica', 'Para evitar heladas', 'Para proteger del viento']),
    q(2, 4, '¿Qué se hace con la caña floricane después de cosecha?', 'Cortarla a ras y eliminarla', ['Podar solo las puntas', 'Dejarla para que engrose', 'Acodarla']),
    q(2, 5, '¿Qué hongo causa pudrición en una floración húmeda?', 'Botrytis cinerea', ['Oidio', 'Verticillium', 'Agrobacterium']),
    q(2, 6, '¿Qué sistema de conducción mejora la aireación?', 'V o cruceta (T-trellis)', ['Eje central', 'Parronal', 'Vaso abierto']),
    q(2, 7, '¿Qué nutriente se asocia a la firmeza del fruto?', 'Potasio', ['Nitrógeno', 'Fósforo', 'Cloro']),
    q(2, 8, '¿Qué plaga prolifera en bordes de camino polvorientos?', 'Arañita roja', ['Pulgón', 'Escama', 'Gusano tebo']),
    q(2, 9, '¿Qué causa el desgrane (crumbly berry)?', 'Virus RBDV o mala polinización', ['Exceso de potasio', 'Helada', 'Falta de poda']),
    q(2, 10, '¿Qué produce agallas leñosas en el cuello?', 'Agrobacterium tumefaciens', ['Nematodos', 'Armillaria', 'Fusarium']),
    q(2, 11, '¿Cuál es el sistema ideal de riego y fertirrigación?', 'Goteo con doble cinta', ['Surco', 'Aspersión foliar', 'Pivote']),
    q(2, 12, '¿Qué estructura hace invasiva a la frambuesa al brotar?', 'Raíces gemíferas (hijuelos)', ['Semillas', 'Estolones aéreos', 'Bulbos']),
    q(2, 13, '¿A qué hora conviene cosechar para mercado fresco?', 'Mañana temprano, sin calor de campo', ['Al mediodía, con fruta seca', 'En la tarde-noche', 'A cualquier hora']),
    q(2, 14, '¿Cuál es el objetivo del raleo de cañas (primocanes)?', 'Mejorar la luz, la aireación y el vuelo de abejas', ['Retrasar la cosecha', 'Dar más raíz', 'Producir fruta en invierno']),
    q(2, 15, '¿Cuál es la acción postcosecha crítica en las primeras 2-4 horas?', 'Túnel de pre-frío inmediato a 0 °C', ['Lavar con agua', 'Dejar al sol para subir el brix', 'Empacar al vacío']),
    q(2, 16, '¿Qué efecto tiene la polinización por abejas?', 'Es altamente atractiva y mejora la cuaja (más drupéolas)', ['Se poliniza por viento', 'Es partenocárpica', 'Repele a los insectos']),
    q(2, 17, '¿Qué diferencia botánica tiene la frambuesa con la mora?', 'La frambuesa deja el receptáculo en la planta (queda hueca)', ['La mora no tiene espinas', 'La mora es un árbol', 'La frambuesa es climatérica']),
    q(2, 18, '¿Cómo se reconoce el Spur blight (tizón de la yema)?', 'Zonas oscuras (púrpura) en los nudos de la caña en otoño/invierno', ['Grietas blancas', 'Agallas en la base', 'Hongos con forma de paraguas']),
    q(2, 19, '¿Cuál es el daño letal de Aegorhinus (burrito)?', 'La larva barrena la corona y las raíces principales', ['Inyecta una toxina en la flor', 'La ninfa transmite virus', 'El macho come yemas']),
    q(2, 20, '¿Qué requiere la floricane para brotar?', 'Acumular horas frío (600-1000) en receso', ['Poda a ras en invierno', 'Estrés hídrico en abril', 'Aplicación de giberelinas']),
    q(2, 21, '¿Qué tipo de nematodo es Pratylenchus?', 'Endoparásito migratorio (destruye tejido al moverse)', ['Ectoparásito adherido a la raíz', 'Fijador de nitrógeno', 'Ataca estolones']),
    q(2, 22, '¿Cuál es el vector del virus del mosaico?', 'Pulgones', ['Viento', 'Tijera de poda', 'Arañita']),
    q(2, 23, '¿Por qué el calcio foliar aplicado post-cuaja llega poco al fruto?', 'Viaja por xilema hacia las hojas que transpiran', ['La raíz es impermeable', 'Ahuyenta a la mosca', 'Se transforma en yeso']),
    q(2, 24, '¿Qué causa el White Drupelet Disorder?', 'Radiación UV directa y altas temperaturas', ['Botrytis temprana', 'Falta de magnesio', 'Picadura de mosca']),
    q(2, 25, '¿Qué riesgo tiene un raleo de primocanes muy tardío?', 'El segundo flujo de cañas no alcanza vigor para el año siguiente', ['La fruta cuaja de color blanco', 'Mueren las raíces', 'Se compacta el suelo']),
  ],
  boss: {
    id: 'boss-frambuesa',
    name: 'Señor de las Cañas',
    title: 'Guardián del Pre-frío',
    maxHp: COOP_BOSS_HP,
    damagePerHit: 10,
    finalQuestion: q(
      2,
      BOSS_Q,
      'Para evitar toxicidad en frambuesa, ¿qué fertilizante potásico hay que evitar?',
      'Muriato de Potasio (KCl)',
      ['Sulfato de Potasio', 'Nitrato de Potasio', 'Tiosulfato de Potasio'],
    ),
    unlocksModuleId: 9,
  },
  submodules: [],
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

/** Módulo con submódulos: sus preguntas y su Códice salen de los submódulos. */
function moduleWithSubmodules(spec: ModuleSpec, submodules: Submodule[], finalQuestion: Question | null): Module {
  return {
    ...spec,
    initiallyUnlocked: spec.id === 1,
    codex: codexFromSubmodules(spec.id, submodules),
    questions: submodules.flatMap((sm) => sm.questions),
    submodules,
    boss: coopBoss(spec, finalQuestion),
  }
}

/** Módulo cuyo contenido aún no se carga: bloqueado y con un aviso en su Códice. */
function upcomingModule(spec: ModuleSpec): Module {
  return {
    ...spec,
    initiallyUnlocked: false,
    codex: [{ heading: 'En preparación', body: ['Los submódulos, Códices y subjefes de este módulo llegarán pronto.'] }],
    questions: [],
    submodules: [],
    boss: coopBoss(spec, null),
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
  { id: 1, slug: 'edafologia', title: 'Edafología y Física de Suelos', summary: 'Textura, estructura, agua del suelo, compactación, erosión y lectura de perfiles.', boss: { name: 'El Gólem de Arcilla Compactada', title: 'Señor del Pie de Arado' } },
  { id: 2, slug: 'fertilidad', title: 'Fertilidad y Nutrición Vegetal', summary: 'CIC, pH, macro y micronutrientes, diagnóstico foliar y programas de fertilización.', boss: { name: 'El Titán de la Salinidad Residual', title: 'Señor de la Conductividad Eléctrica' } },
  { id: 3, slug: 'agrometeorologia', title: 'Agrometeorología y Clima', summary: 'Balance de radiación, heladas, horas frío, grados día y evapotranspiración.', boss: { name: 'La Tempestad de Escarcha Negra', title: 'Heraldo de la Inversión Térmica' } },
  { id: 4, slug: 'fisiologia', title: 'Fisiología Vegetal y Relaciones Hídricas', summary: 'Fotosíntesis, transpiración, potencial hídrico, hormonas y fenología.', boss: { name: 'La Raíz Senescente Ancestral', title: 'Devoradora de Turgencia' } },
  { id: 5, slug: 'botanica', title: 'Botánica Agrícola y Silvestre', summary: 'Morfología, taxonomía, flora nativa y reconocimiento de malezas.', boss: { name: 'El Filotaxista Ancestral', title: 'Custodio del Herbario Prohibido' } },
  { id: 6, slug: 'fruticultura', title: 'Fruticultura General', summary: 'Portainjertos, sistemas de conducción, poda, polinización y cuaja.', boss: { name: 'El Patriarca del Canopio Desbocado', title: 'Tirano del Vigor Excesivo' } },
  { id: 9, slug: 'horticultura', title: 'Horticultura e Invernaderos', summary: 'Manejo de hortalizas, ambiente protegido, clima del invernadero y fertirriego.', boss: { name: 'El Climatizador Desbocado', title: 'Amo del Déficit de Presión de Vapor' } },
  { id: 10, slug: 'aves', title: 'Reconocimiento de Aves', summary: 'Identificación de aves de Chile, su rol en el agroecosistema y el manejo de daños.', boss: { name: 'El Tirano de la Espiga', title: 'Rey de la Bandada Granívora' } },
  { id: 11, slug: 'hongos', title: 'Reconocimiento y Biología de Hongos', summary: 'Morfología, ciclos de vida, hongos benéficos, fitopatógenos y setas silvestres.', boss: { name: 'El Micelio Nigromante', title: 'Tejedor de Hifas Oscuras' } },
  { id: 12, slug: 'avicola', title: 'Producción Avícola', summary: 'Razas, nutrición, sanidad, bienestar y manejo de galpones.', boss: { name: 'El Barón de la Cresta Hipertrófica', title: 'Señor del Galpón sin Ventilar' } },
  { id: 13, slug: 'caprinos', title: 'Producción Caprina y Rumiantes Menores', summary: 'Manejo reproductivo, alimentación en secano, sanidad y productos lácteos.', boss: { name: 'El Macho Cabrío del Rastrojo Salino', title: 'Rumiante del Secano Indómito' } },
]

const spec = (id: number) => SPECS.find((s) => s.id === id)!

export const MODULES: Module[] = [
  moduleWithSubmodules(spec(1), EDAFOLOGIA_SUBMODULES, EDAFOLOGIA_BOSS_FINAL),
  ...[2, 3, 4, 5, 6].map((id) => upcomingModule(spec(id))),
  cranberry,
  frambuesa,
  ...[9, 10, 11, 12, 13].map((id) => upcomingModule(spec(id))),
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

import type { Badge, Module, Question } from './types'

/** Crea una pregunta con id estable `m{módulo}-q{n}`. */
function q(
  moduleId: number,
  n: number,
  prompt: string,
  correct: string,
  distractors: [string, string, string],
): Question {
  return { id: `m${moduleId}-q${n}`, prompt, correct, distractors }
}

// ---------------------------------------------------------------------------
// MÓDULO 0 · Fundamentos Agronómicos
// ---------------------------------------------------------------------------

const module0: Module = {
  id: 0,
  slug: 'fundamentos',
  title: 'Fundamentos Agronómicos',
  summary: 'Suelo, nutrición, clima de Chile y Manejo Integrado de Plagas.',
  initiallyUnlocked: true,
  codex: [
    {
      heading: 'Suelo y Nutrición',
      body: [
        'El suelo es un sistema vivo: una mezcla de minerales, materia orgánica, agua, aire y millones de organismos que reciclan nutrientes. Entenderlo es el primer paso de cualquier decisión agronómica.',
        'La textura describe la proporción de arena, limo y arcilla. Los suelos arenosos drenan rápido y retienen poca agua; los arcillosos tienen partículas finísimas con enorme superficie específica, por lo que presentan la mayor Capacidad de Campo (agua retenida tras drenar) y también el mayor Punto de Marchitez Permanente (agua que la planta ya no puede extraer). Los francos equilibran ambas fracciones.',
        'La Capacidad de Intercambio Catiónico (CIC) mide cuántos cationes (Ca²⁺, Mg²⁺, K⁺, NH₄⁺) puede retener el suelo. Los aportes principales vienen de la arcilla y de la materia orgánica; la arena prácticamente no aporta.',
        'La Ley del Mínimo de Liebig dice que el rendimiento queda limitado por el nutriente que está en menor proporción respecto de lo que el cultivo necesita, como el agua de un barril que se escapa por su duela más corta. Fertilizar en exceso lo que ya sobra no sube el techo productivo.',
        'En el sur de Chile dominan los Trumaos (Andisoles derivados de cenizas volcánicas). Son porosos y ricos en materia orgánica, pero sus alófanos retienen y fijan el fósforo con enorme fuerza, lo que obliga a planificar la fertilización fosforada con cuidado. Suelen ser además ácidos.',
      ],
    },
    {
      heading: 'Clima y agua en Chile',
      body: [
        'Chile es un laboratorio climático: del desierto del norte a los bosques lluviosos del sur. El Norte Chico (Coquimbo) tiene inviernos templados y alta luminosidad, lo que permite producir primicias, como las cerezas más tempranas del país. Hacia el sur, más frío y lluvia desplazan las cosechas.',
        'Las heladas pueden ser de dos tipos. La helada advectiva llega con una masa de aire polar y viento. La helada radiativa ocurre en noches despejadas y sin viento: el suelo y las plantas irradian su calor al cielo y el aire frío se acumula en las zonas bajas. Es la más frecuente en los valles agrícolas y la que se combate con aspersión, hélices o calefactores.',
        'Muchos frutales necesitan acumular frío invernal para brotar de forma pareja. Una Hora Frío tradicional es una hora con temperatura entre 0 °C y 7,2 °C.',
        'La demanda de agua de un cultivo se estima como ETc = ET₀ × Kc. El coeficiente de cultivo Kc es bajo en receso y brotación, y alcanza su máximo en pleno verano, cuando la canopia está totalmente desarrollada.',
      ],
    },
    {
      heading: 'Manejo Integrado de Plagas (MIP)',
      body: [
        'El MIP combina monitoreo, control cultural, biológico y químico para mantener las plagas bajo niveles que no causen pérdidas económicas, reduciendo el uso de pesticidas.',
        'El criterio central es el Umbral de Daño Económico: se aplica un insecticida solo cuando la población de la plaga lo supera, es decir, cuando el costo del daño esperado supera el costo del control. No se aplica por calendario ni al ver el primer insecto.',
        'En malezas, la selectividad importa. Un herbicida graminicida controla gramíneas de hoja angosta (como la ballica) sin dañar cultivos de hoja ancha.',
      ],
    },
  ],
  questions: [
    q(0, 1, '¿Qué clase textural tiene la mayor Capacidad de Campo y el mayor Punto de Marchitez?', 'Arcillosa', ['Arenosa', 'Franca', 'Franco-limosa']),
    q(0, 2, 'Suelos Trumaos (sur de Chile): ¿qué los hace complejos para fertilizar?', 'Alta retención y fijación de Fósforo', ['Alta salinidad', 'Exceso de carbonatos', 'pH muy alcalino']),
    q(0, 3, '¿Cuándo alcanza su máximo el coeficiente de cultivo (Kc)?', 'Pleno verano con máximo desarrollo de canopia', ['Receso invernal', 'Inicio de brotación', 'Caída de hojas']),
    q(0, 4, '¿Qué caracteriza a una helada de radiación?', 'Noches despejadas sin viento, el suelo pierde calor', ['Llegada de una masa de aire polar', 'Viento congelado', 'Exceso de riego']),
    q(0, 5, '¿Cuál es la macrozona primicia para cerezas en Chile?', 'Norte Chico/Coquimbo', ['Araucanía', 'Chiloé', "O'Higgins central"]),
    q(0, 6, 'En MIP, ¿cuándo corresponde aplicar un insecticida?', 'Cuando la plaga supera el Umbral de Daño Económico', ['Al ver el primer insecto', 'Por calendario', 'Cuando el daño ya es irreversible']),
    q(0, 7, '¿Qué plantea la Ley del Mínimo (Liebig)?', 'El rendimiento está limitado por el nutriente en menor proporción', ['Usar la menor cantidad de agua posible', 'Solo el nitrógeno importa', 'La planta crece hasta un tamaño mínimo']),
    q(0, 8, '¿Qué malezas controla un herbicida graminicida?', 'Hoja angosta (ballica)', ['Hoja ancha', 'Ciperáceas', 'Toda planta joven']),
    q(0, 9, '¿Qué rango define una Hora Frío tradicional?', 'Entre 0 °C y 7,2 °C', ['Bajo 0 °C', 'Horas con neblina', 'Horas de sombra en verano']),
    q(0, 10, '¿Qué componentes aportan principalmente a la CIC del suelo?', 'Arcilla y Materia Orgánica', ['Arena', 'Carbonatos', 'Fertilizantes']),
  ],
  boss: {
    id: 'boss-m0',
    name: 'Archimago de Terrones',
    title: 'Consultor de Panguipulli',
    maxHp: 1000,
    damagePerHit: 10,
    finalQuestion: q(
      0,
      99,
      'Proyecto en Panguipulli: suelo Andisol, pH 5,6 y agua justa para cubrir la ETc. ¿Por qué fracasará el Cranberry?',
      'Déficit hídrico para el control activo de heladas en primavera',
      ['pH tóxico', 'Asfixia por materia orgánica', 'Bloqueo de nitrógeno'],
    ),
    unlocksModuleId: 1,
  },
}

// ---------------------------------------------------------------------------
// MÓDULO 1 · Cranberry
// ---------------------------------------------------------------------------

const module1: Module = {
  id: 1,
  slug: 'cranberry',
  title: 'Cranberry',
  summary: 'Enredadera acidófila, cosecha en agua y control de heladas.',
  initiallyUnlocked: false,
  codex: [
    {
      heading: 'Cranberry (Vaccinium macrocarpon)',
      body: [
        'Enredadera acidófila (pH 4-5,5). Cosecha en agua (floats). Susceptible a asfixia radicular en verano. Requiere control de heladas por aspersión.',
      ],
    },
  ],
  questions: [
    q(1, 1, '¿Cuál es el pH óptimo de suelo para el Cranberry?', '4,0 - 5,5', ['5,5 - 6,5', '6,5 - 7,5', '3,0 - 3,5']),
    q(1, 2, '¿Qué forma de nitrógeno se recomienda en Cranberry?', 'Amoniacal (NH₄⁺)', ['Nítrica', 'Urea foliar', 'Nitrito']),
    q(1, 3, '¿Cuál es el método de control de heladas en Cranberry?', 'Aspersión continua', ['Hélices', 'Calefactores', 'Plásticos']),
    q(1, 4, '¿Para qué se hace el sanding (aplicación de arena)?', 'Estimular el enraizamiento y rejuvenecer', ['Subir el pH', 'Retener agua', 'Aportar sílice']),
    q(1, 5, '¿Cuál es el destino de la fruta cosechada en agua?', 'Industria', ['Mercado fresco', 'Exportación en fresco', 'Mercado orgánico']),
    q(1, 6, '¿Qué patógeno se asocia al mal drenaje?', 'Phytophthora cinnamomi', ['Botrytis', 'Oidium', 'Agrobacterium']),
    q(1, 7, '¿Qué gatilla el color rojo de la fruta?', 'Bajas temperaturas nocturnas', ['Restricción de riego', 'Aplicación de nitrógeno', 'Giberelinas']),
    q(1, 8, '¿Por qué es crítico el drenaje en verano?', 'Es susceptible a asfixia radicular', ['Para mantener la napa limpia', 'Para aprovechar el agua lluvia', 'Para alejar a los pájaros']),
    q(1, 9, '¿Cuándo se monitorea Cranberry fruitworm?', 'Post-cuaja', ['En receso', 'En pinta de color', 'En floración']),
    q(1, 10, '¿Cómo se asegura la polinización?', 'Colmenas de abejas/abejorros', ['Por viento', 'Polinización manual', 'Aplicación de auxinas']),
    q(1, 11, '¿Cuál es la maleza parásita más problemática?', 'Cuscuta', ['Chufa', 'Correhuela', 'Ballica']),
    q(1, 12, '¿Dónde se produce la fruta?', 'Yemas apicales de uprights del año anterior', ['Runners', 'Raíz', 'Brotes nuevos']),
    q(1, 13, '¿Para qué se usan peinadoras en primavera?', 'Alinear runners para la cosecha', ['Cortar flores', 'Romper el suelo', 'Espantar insectos']),
    q(1, 14, '¿Qué es el Sunscald?', 'Daño fisiológico por radiación', ['Daño por agua caliente', 'Daño por herbicida', 'Daño por trips']),
    q(1, 15, '¿Cuál es la variedad histórica de referencia?', 'Stevens', ['Duke', 'Chandler', 'Heritage']),
    q(1, 16, '¿Qué causa el exceso de nitrógeno?', 'Emboscamiento y fruta blanda', ['Fruta gigante', 'Clorosis', 'Muerte de raíces']),
    q(1, 17, '¿Por qué la fruta water-harvest tiene postcosecha corta?', 'Entrada de patógenos por la cicatriz al agua', ['No tiene antocianinas', 'Absorbe sal', 'Pierde sus ceras']),
    q(1, 18, '¿A qué profundidad se concentran las raíces?', 'Primeros 10-15 cm', ['50 cm', '1 m', '2 m']),
    q(1, 19, '¿Cuál es la forma de propagación más común?', 'Esquejes sin enraizar esparcidos', ['Semillas', 'Injertos', 'Cultivo in vitro']),
    q(1, 20, '¿Cómo se previene el fruit rot?', 'Fungicidas en flor y aireación', ['Fungicida al suelo', 'Cloro', 'Bajar el pH']),
  ],
  boss: {
    id: 'boss-m1',
    name: 'Deformidad de los Verticales',
    title: 'Señora de los Floats',
    maxHp: 1000,
    damagePerHit: 10,
    finalQuestion: null,
    unlocksModuleId: 2,
  },
}

// ---------------------------------------------------------------------------
// MÓDULO 2 · Frambuesa
// ---------------------------------------------------------------------------

const module2: Module = {
  id: 2,
  slug: 'frambuesa',
  title: 'Frambuesa',
  summary: 'Cañas remontantes, Phytophthora y pre-frío postcosecha.',
  initiallyUnlocked: false,
  codex: [
    {
      heading: 'Frambuesa (Rubus idaeus)',
      body: [
        'Arbusto de caña bianual o anual (remontantes vs no remontantes). Extremadamente sensible a Phytophthora (uso de camellones). Pre-frío rápido postcosecha es clave.',
      ],
    },
  ],
  questions: [
    q(2, 1, '¿Qué diferencia a una variedad remontante de una no remontante?', 'La remontante produce en caña del año (otoño); la no remontante en caña de segundo año', ['La remontante no tiene espinas', 'La remontante no necesita agua', 'La remontante da fruta azul']),
    q(2, 2, '¿Qué plaga deja larvas blancas dentro de la fruta?', 'Drosophila suzukii', ['Ceratitis', 'Trips', 'Burrito']),
    q(2, 3, '¿Por qué los camellones son obligatorios?', 'Sensibilidad a asfixia y Phytophthora', ['Para permitir cosecha mecánica', 'Para evitar heladas', 'Para proteger del viento']),
    q(2, 4, '¿Qué se hace con la caña floricane después de cosecha?', 'Cortarla a ras y eliminarla (muere)', ['Podar solo las puntas', 'Dejarla para que engrose', 'Acodarla']),
    q(2, 5, '¿Qué hongo queda latente en una floración húmeda?', 'Botrytis cinerea', ['Oidio', 'Verticillium', 'Agrobacterium']),
    q(2, 6, '¿Cuál es el sistema de conducción más común?', 'V o cruceta', ['Eje central', 'Parronal', 'Vaso abierto']),
    q(2, 7, '¿Qué nutriente se asocia a la firmeza de la fruta?', 'Potasio', ['Nitrógeno', 'Fósforo', 'Cloro']),
    q(2, 8, '¿Qué plaga prolifera en bordes de camino secos y polvorientos?', 'Arañita roja', ['Pulgón', 'Escama', 'Gusano']),
    q(2, 9, '¿Qué causa el crumbly berry (desgrane)?', 'Virus (RBDV) o mala polinización', ['Exceso de potasio', 'Helada', 'Falta de poda']),
    q(2, 10, '¿Qué produce tumores en el cuello o la raíz?', 'Agrobacterium tumefaciens', ['Nematodos', 'Armillaria', 'Fusarium']),
    q(2, 11, '¿Cuál es el sistema de riego ideal?', 'Goteo con doble cinta', ['Surco', 'Microaspersión foliar', 'Pivote']),
    q(2, 12, '¿Qué estructura la hace invasiva?', 'Yemas en raíces (hijuelos)', ['Semillas', 'Estolones aéreos', 'Bulbos']),
    q(2, 13, '¿A qué hora conviene cosechar para mercado fresco?', 'En la mañana, antes del calor', ['Al mediodía', 'En la tarde', 'A cualquier hora']),
    q(2, 14, '¿Para qué se hace el raleo de cañas en primavera?', 'Mejorar la entrada de luz, aire e insectos', ['Retrasar la cosecha', 'Generar más raíces', 'Producir fruta en invierno']),
    q(2, 15, '¿Cuál es la acción postcosecha crítica en las primeras 2-4 horas?', 'Pre-frío rápido', ['Lavar con agua', 'Dejar al sol para subir el brix', 'Empacar al vacío']),
    q(2, 16, '¿Cómo es la polinización de la frambuesa?', 'Muy atractiva para abejas (mucho néctar)', ['Por viento', 'Partenocárpica', 'Repele a los insectos']),
    q(2, 17, '¿Para qué se usa mulch en el camellón?', 'Retener humedad y controlar malezas', ['Pintar el suelo', 'Aportar salitre', 'Quemar la paja']),
    q(2, 18, '¿Cuál es el síntoma típico de RBDV?', 'Amarillamiento y desgrane', ['Pudrición del cuello', 'Fruta gigante', 'Agallas']),
    q(2, 19, '¿Qué significa IQF?', 'Congelado rápido individual', ['Calidad interna de la fruta', 'Fruta de calidad internacional', 'Granja integrada']),
    q(2, 20, '¿Cuál es el síntoma de la polilla del brote?', 'Brote en cayado con larva y túnel', ['Telaraña de arañita', 'Moho gris de Botrytis', 'Deficiencia de calcio']),
  ],
  boss: {
    id: 'boss-m2',
    name: 'Señor de las Cañas',
    title: 'Guardián del Pre-frío',
    maxHp: 1000,
    damagePerHit: 10,
    finalQuestion: null,
    unlocksModuleId: null,
  },
}

export const MODULES: Module[] = [module0, module1, module2]

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
    description: 'Participaste en la caída del Archimago de Terrones.',
    icon: 'snowflake',
    criterion: { type: 'boss_defeated', moduleId: 0 },
  },
  {
    id: 'senor-de-la-turbera',
    name: 'Señor de la Turbera',
    description: 'Completaste el módulo Cranberry.',
    icon: 'berry-red',
    criterion: { type: 'module_completed', moduleId: 1 },
  },
  {
    id: 'cazador-de-suzukii',
    name: 'Cazador de Suzukii',
    description: 'Completaste el módulo Frambuesa.',
    icon: 'berry-pink',
    criterion: { type: 'module_completed', moduleId: 2 },
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

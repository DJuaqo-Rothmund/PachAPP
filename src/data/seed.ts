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

/** Id fijo de la pregunta final de cada jefe. */
const BOSS_Q = 99

// ---------------------------------------------------------------------------
// MÓDULO 0 · Fundamentos y Diseño
// ---------------------------------------------------------------------------

const module0: Module = {
  id: 0,
  slug: 'fundamentos',
  title: 'Fundamentos Agronómicos',
  summary: 'Suelos de Chile, dinámica hídrica, MIP y diseño experimental.',
  initiallyUnlocked: true,
  codex: [
    {
      heading: 'Dinámica Hídrica y Suelos',
      body: [
        'El suelo dicta el potencial. En Chile, va desde Entisoles norteños hasta Andisoles (trumaos) del sur.',
        'Los trumaos (dominados por arcillas alofana e imogolita) retienen mucha agua pero bloquean químicamente el Fósforo. La Capacidad de Intercambio Catiónico (CIC) depende de arcillas y materia orgánica.',
        'El riego moderno usa el Déficit de Presión de Vapor (VPD); un VPD alto cierra estomas para evitar cavitación, deteniendo la fotosíntesis.',
      ],
    },
    {
      heading: 'Sanidad y Metodología',
      body: [
        'El MIP actúa sobre el Umbral de Daño Económico.',
        'En terreno, rara vez se usa Diseño Completamente al Azar (DCA); se usa Bloques Completos al Azar (DBCA) para aislar gradientes topográficos.',
      ],
    },
  ],
  questions: [
    q(0, 1, '¿Qué clase textural tiene la mayor Capacidad de Campo y el mayor Punto de Marchitez?', 'Arcillosa', ['Arenosa', 'Franca', 'Franco-limosa']),
    q(0, 2, '¿Cuál es el reto principal al fertilizar suelos Trumaos?', 'Alta fijación de Fósforo', ['Alta salinidad', 'Exceso de carbonatos', 'pH alcalino']),
    q(0, 3, '¿Cuándo alcanza su máximo el coeficiente de cultivo (Kc)?', 'Pleno verano con canopia completa', ['Receso invernal', 'Brotación', 'Caída de hojas']),
    q(0, 4, '¿Qué caracteriza a una helada de radiación?', 'Noche despejada, pérdida de calor del suelo', ['Llegada de una masa polar', 'Lluvia congelada', 'Exceso de riego']),
    q(0, 5, '¿Cuál es la macrozona primicia para cerezas en Chile?', 'Norte Chico/Coquimbo', ['Araucanía', 'Chiloé', "O'Higgins"]),
    q(0, 6, 'En MIP, ¿cuándo corresponde aplicar un insecticida?', 'Cuando la plaga supera el Umbral de Daño Económico', ['Al ver el primer insecto', 'Por calendario cada 15 días', 'Cuando el daño ya es irreversible']),
    q(0, 7, '¿Qué plantea la Ley de Liebig?', 'El rendimiento está limitado por el nutriente más escaso', ['Usar la menor cantidad de agua', 'Solo importa el nitrógeno', 'La planta crece hasta un tamaño mínimo']),
    q(0, 8, '¿Qué malezas controla un herbicida graminicida?', 'Hoja angosta', ['Hoja ancha', 'Ciperáceas', 'Toda maleza']),
    q(0, 9, '¿Qué rango de temperatura define una Hora Frío tradicional?', 'Entre 0 °C y 7,2 °C', ['Bajo 0 °C', 'Horas con neblina', 'Horas de sombra en verano']),
    q(0, 10, '¿Qué componentes aportan principalmente a la CIC del suelo?', 'Arcilla y Materia Orgánica', ['Arena', 'Carbonatos', 'Fertilizantes']),
    q(0, 11, '¿En qué se diferencian la densidad aparente y la densidad real del suelo?', 'La aparente incluye los poros; la real, solo los sólidos', ['La real cambia con la labranza', 'Ambas miden la materia orgánica', 'Son iguales']),
    q(0, 12, '¿Qué es una inversión térmica?', 'Una capa fría asentada bajo una capa cálida en altura', ['El suelo más caliente que el aire', 'El choque de un frente polar', 'El congelamiento del agua de riego']),
    q(0, 13, '¿Por qué tejido se transportan los fotoasimilados?', 'Floema', ['Xilema', 'Estomas', 'Cambium']),
    q(0, 14, '¿En qué se diferencia un suelo salino de uno sódico?', 'Salino: alta CE; sódico: alto PSI que destruye la estructura', ['El salino retiene y el sódico repele agua', 'El sódico está en el sur y el salino en el norte', 'Son sinónimos']),
    q(0, 15, 'En un test de Tukey, dos tratamientos con letras "a" y "ab" indican que…', 'No hay diferencia estadística significativa', ['Uno rinde el doble', 'Hay que eliminar un tratamiento', 'El tratamiento "a" es superior']),
    q(0, 16, '¿Cuál es la eficiencia típica del riego por goteo?', '90% a 95%', ['50% a 60%', '70% a 75%', '100%']),
    q(0, 17, '¿Qué deficiencia aparece primero en las hojas viejas?', 'Nitrógeno', ['Calcio', 'Boro', 'Hierro']),
    q(0, 18, '¿Para qué se usan los Días Grado en MIP?', 'Predecir el desarrollo fenológico del insecto según el calor acumulado', ['Medir el daño en hojas', 'Estimar la degradación del pesticida', 'Fijar la fecha de cosecha']),
    q(0, 19, '¿Qué es la capacidad tampón (buffer) del suelo?', 'Su resistencia a cambiar de pH', ['Su retención de agua', 'Su infiltración de lluvia', 'Su resistencia a la compactación']),
    q(0, 20, '¿Qué consecuencia tiene el cierre estomático por un VPD alto?', 'Aumento de la temperatura foliar y cese de la asimilación de CO₂', ['La planta absorbe más nitrógeno', 'Se abren las acuaporinas', 'La fotosíntesis se duplica']),
    q(0, 21, '¿Qué arcillas amorfas dominan en los Trumaos?', 'Alofana e Imogolita', ['Montmorillonita y Caolinita', 'Ilita y Vermiculita', 'Cuarzo']),
    q(0, 22, '¿Qué indica un valor de NDVI de 0,2 (muy bajo)?', 'Baja densidad de biomasa o suelo desnudo', ['Exceso de clorofila', 'Deficiencia de Zinc', 'Alta humedad']),
  ],
  boss: {
    id: 'boss-m0',
    name: 'Archimago de Terrones',
    title: 'Consultor de Panguipulli',
    maxHp: 1000,
    damagePerHit: 10,
    finalQuestion: q(
      0,
      BOSS_Q,
      'Proyecto en Panguipulli: suelo Andisol, pH 5,6 y agua justa para cubrir la ETc. ¿Por qué fracasará el Cranberry?',
      'Déficit hídrico para la aspersión contra heladas',
      ['pH tóxico', 'Asfixia por materia orgánica', 'Bloqueo de nitrógeno'],
    ),
    unlocksModuleId: 1,
  },
}

// ---------------------------------------------------------------------------
// MÓDULO 1 · Manejo Especializado de Cranberry
// ---------------------------------------------------------------------------

const module1: Module = {
  id: 1,
  slug: 'cranberry',
  title: 'Cranberry',
  summary: 'Acidófila de raíz superficial, heladas por aspersión y cosecha en agua.',
  initiallyUnlocked: false,
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
    id: 'boss-m1',
    name: 'Deformidad de los Verticales',
    title: 'Señora de los Floats',
    maxHp: 1000,
    damagePerHit: 10,
    finalQuestion: q(
      1,
      BOSS_Q,
      '¿Cómo se llama el mecanismo por el que las abejas extraen el polen en tétradas de la flor del Cranberry?',
      'Polinización vibratoria (Buzz pollination)',
      ['Anemófila estricta', 'Nectarización', 'Autopolinización'],
    ),
    unlocksModuleId: 2,
  },
}

// ---------------------------------------------------------------------------
// MÓDULO 2 · Manejo Avanzado de Frambuesa
// ---------------------------------------------------------------------------

const module2: Module = {
  id: 2,
  slug: 'frambuesa',
  title: 'Frambuesa',
  summary: 'Primocane vs floricane, camellones, conducción en V y pre-frío.',
  initiallyUnlocked: false,
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
    id: 'boss-m2',
    name: 'Señor de las Cañas',
    title: 'Guardián del Pre-frío',
    maxHp: 1000,
    damagePerHit: 10,
    finalQuestion: q(
      2,
      BOSS_Q,
      'Para evitar toxicidad en frambuesa, ¿qué fertilizante potásico hay que evitar?',
      'Muriato de Potasio (KCl)',
      ['Sulfato de Potasio', 'Nitrato de Potasio', 'Tiosulfato de Potasio'],
    ),
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

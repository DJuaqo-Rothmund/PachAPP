import { campaignModule } from './helpers.ts'

/** Módulo 5 · Botánica Agrícola y Silvestre. */
const { submodule, bossFinal } = campaignModule(5)

export const BOTANICA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Raíz, Tallo y Hoja',
    description:
      'La morfología vegetativa: tipos de raíz, tallos modificados y las partes de la hoja que sirven para identificar.',
    subboss: { name: 'El Meristema Bifurcado', title: 'Arquitecto de Raíz, Tallo y Hoja' },
    codexTitle: 'Morfología Vegetativa',
    sections: [
      {
        heading: 'Raíces',
        body: [
          'Las dicotiledóneas suelen tener raíz pivotante: un eje principal que profundiza (alfalfa, zanahoria). Las monocotiledóneas tienen raíces fasciculadas, un haz de raíces finas de igual grosor (trigo, maíz, pastos).',
          'Hay raíces adventicias, que nacen de tallos u hojas (estacas, raíces de anclaje del maíz), y raíces reservantes engrosadas (betarraga, camote).',
        ],
      },
      {
        heading: 'Tallos y sus modificaciones',
        body: [
          'El tallo tiene nudos, donde nacen hojas y yemas, y entrenudos. Muchas especies lo modifican: el rizoma es un tallo subterráneo horizontal (correhuela, chépica); el tubérculo es un tallo subterráneo engrosado con yemas u "ojos" (papa); el bulbo es un tallo corto rodeado de hojas carnosas (cebolla, ajo).',
          'El estolón es un tallo rastrero que enraíza en los nudos (frutilla). Los zarcillos de la vid y las espinas de la zarzamora o del espino también son estructuras modificadas.',
          'La papa es un tallo y no una raíz: sus "ojos" son yemas en nudos, y por eso brota de ellos.',
        ],
      },
      {
        heading: 'La hoja',
        body: [
          'Partes: lámina, pecíolo y, en algunas, estípulas. Las monocotiledóneas suelen tener nervaduras paralelas y vaina que abraza el tallo; las dicotiledóneas, nervaduras reticuladas.',
          'Una hoja es simple si tiene una sola lámina y compuesta si se divide en folíolos (el nogal, la rosa). La filotaxis describe cómo se ordenan en el tallo: alterna, opuesta o verticilada.',
          'En las gramíneas, la lígula y las aurículas en la unión de la vaina con la lámina permiten identificar especies incluso sin flor.',
        ],
      },
    ],
    checkpoint: {
      at: 100,
      prompt: '¿Por qué la papa se considera un tallo y no una raíz?',
      options: [
        'Porque crece bajo tierra',
        'Porque tiene yemas en nudos ("ojos")',
        'Porque acumula almidón',
        'Porque no tiene pelos radicales',
      ],
      correctIndex: 1,
      explanation:
        'El tubérculo de papa es un tallo modificado: sus ojos son yemas ubicadas en nudos, desde donde brotan las nuevas plantas.',
    },
    questions: [
      ['¿Qué tipo de raíz tienen las gramíneas como el trigo?', 'Fasciculada', ['Pivotante', 'Reservante', 'Tuberosa']],
      ['¿Qué estructura es un tallo subterráneo horizontal?', 'Rizoma', ['Bulbo', 'Raíz pivotante', 'Zarcillo']],
      [
        '¿Qué es el estolón de la frutilla?',
        'Un tallo rastrero que enraíza en los nudos',
        ['Una raíz aérea que nace del tallo', 'Una hoja modificada para trepar', 'Un tallo subterráneo con hojas carnosas'],
      ],
      [
        '¿Qué describe la filotaxis?',
        'El orden de las hojas en el tallo',
        ['El color de las flores', 'La forma del fruto', 'La profundidad de raíces'],
      ],
      [
        '¿Qué estructuras ayudan a identificar gramíneas sin flor?',
        'La lígula y las aurículas',
        ['Los zarcillos', 'Las espinas', 'Los estolones'],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'Flor, Fruto y Semilla',
    description: 'Las partes de la flor, la polinización y los tipos de fruto, de la baya al pomo.',
    subboss: { name: 'Flor de Sépalos Caducos', title: 'Bruja del Ovario Ínfero' },
    codexTitle: 'Morfología Reproductiva',
    sections: [
      {
        heading: 'La flor',
        body: [
          'Una flor completa tiene cáliz (sépalos), corola (pétalos), androceo (estambres, con anteras que producen polen) y gineceo (pistilo: estigma, estilo y ovario).',
          'El ovario es súpero si se ubica sobre la inserción de las otras piezas (cerezo, tomate) e ínfero si queda bajo ellas, fusionado al receptáculo (manzano, peral, zapallo).',
          'Las flores pueden ser hermafroditas o unisexuales. Una especie es monoica si tiene flores masculinas y femeninas en la misma planta (maíz, nogal) y dioica si están en plantas distintas (kiwi, espárrago).',
        ],
      },
      {
        heading: 'Del óvulo al fruto',
        body: [
          'La polinización lleva el polen al estigma; la fecundación ocurre cuando el tubo polínico llega al óvulo. En las angiospermas es doble: un núcleo forma el embrión y otro el endosperma.',
          'El fruto es el ovario desarrollado y la semilla, el óvulo fecundado. Si el fruto se desarrolla sin fecundación es partenocárpico (plátano, algunas mandarinas).',
        ],
      },
      {
        heading: 'Tipos de fruto',
        body: [
          'Carnosos: la drupa tiene un carozo leñoso (durazno, cereza, aceituna); la baya es carnosa con semillas en la pulpa (uva, tomate, arándano); el pomo es un falso fruto donde la parte comestible es el receptáculo (manzana, pera); el hesperidio es la baya de los cítricos.',
          'Secos: la legumbre se abre por dos suturas (poroto, arveja); la cariopsis es el grano de los cereales, con la semilla soldada al pericarpio; la nuez es seca e indehiscente.',
          'Frutos agregados vienen de varios pistilos de una flor (frambuesa, frutilla) y los múltiples, de varias flores (piña, mora de árbol).',
        ],
      },
    ],
    checkpoint: {
      at: 140,
      prompt: '¿Qué tipo de fruto es la manzana?',
      options: ['Drupa', 'Baya', 'Pomo', 'Legumbre'],
      correctIndex: 2,
      explanation: 'La manzana es un pomo: viene de un ovario ínfero y la parte comestible es el receptáculo floral engrosado.',
    },
    questions: [
      ['¿Qué tipo de fruto es la cereza?', 'Drupa', ['Pomo', 'Cariopsis', 'Legumbre']],
      [
        '¿Qué significa que una especie sea dioica?',
        'Flores masculinas y femeninas en plantas distintas',
        ['Flores de ambos sexos en la misma planta', 'Flores sin pétalos', 'Que se autopoliniza'],
      ],
      ['¿Qué parte de la flor se transforma en fruto?', 'El ovario', ['El estambre', 'El pétalo', 'El estigma']],
      [
        '¿Qué es un fruto partenocárpico?',
        'Uno que se desarrolla sin fecundación',
        ['Uno con muchas semillas', 'Uno de dos flores', 'Uno que madura en el árbol'],
      ],
      ['¿Qué tipo de fruto es el grano de trigo?', 'Cariopsis', ['Baya', 'Drupa', 'Hesperidio']],
    ],
  }),

  submodule({
    order: 3,
    title: 'Taxonomía y Nomenclatura',
    description: 'Cómo se nombran y clasifican las plantas: binomios, familias y las familias clave de la agricultura.',
    subboss: { name: 'El Taxónomo Categórico', title: 'Juez de los Nombres Científicos' },
    codexTitle: 'Taxonomía Vegetal',
    sections: [
      {
        heading: 'El nombre científico',
        body: [
          'Linneo propuso el sistema binomial: género con mayúscula y epíteto específico con minúscula, ambos en cursiva (Solanum tuberosum). A veces se agrega el autor abreviado (L. por Linneo).',
          'Los nombres comunes cambian entre regiones (palta y aguacate, poroto y frijol); el científico es único y universal, por eso se usa en etiquetas de plaguicidas, registros y viveros.',
        ],
      },
      {
        heading: 'La jerarquía',
        body: [
          'Reino, división, clase, orden, familia, género y especie. Los nombres de familia terminan en -aceae: Rosaceae, Fabaceae, Poaceae.',
          "Bajo la especie están la subespecie, la variedad botánica y, en agricultura, el cultivar (variedad cultivada), que se escribe entre comillas simples: Malus domestica 'Gala'.",
        ],
      },
      {
        heading: 'Familias de importancia agrícola',
        body: [
          'Rosaceae: manzano, peral, cerezo, frutilla, frambuesa. Fabaceae (leguminosas): poroto, arveja, alfalfa; fijan nitrógeno con Rhizobium. Poaceae (gramíneas): trigo, maíz, arroz, praderas.',
          'Solanaceae: papa, tomate, ají, berenjena. Brassicaceae (crucíferas): repollo, brócoli, raps, rábano. Cucurbitaceae: zapallo, melón, sandía. Asteraceae: lechuga, maravilla, alcachofa.',
          'Conocer la familia orienta la rotación: cultivos de la misma familia comparten plagas y enfermedades.',
        ],
      },
    ],
    checkpoint: {
      at: 115,
      prompt: '¿Cuál es la forma correcta de escribir el nombre científico del tomate?',
      options: ['solanum lycopersicum', 'Solanum Lycopersicum', 'Solanum lycopersicum (en cursiva)', 'SOLANUM LYCOPERSICUM'],
      correctIndex: 2,
      explanation: 'Género con mayúscula, epíteto con minúscula, ambos en cursiva (o subrayados si se escribe a mano).',
    },
    questions: [
      ['¿En qué terminan los nombres de familias botánicas?', 'En -aceae', ['En -ales', 'En -ensis', 'En -inae']],
      ['¿A qué familia pertenecen la papa y el tomate?', 'Solanaceae', ['Rosaceae', 'Poaceae', 'Brassicaceae']],
      ['¿Qué familia fija nitrógeno con Rhizobium?', 'Fabaceae (leguminosas)', ['Poaceae', 'Solanaceae', 'Cucurbitaceae']],
      [
        '¿Cómo se escribe un cultivar?',
        'Entre comillas simples, después del nombre de la especie',
        [
          'En cursiva, igual que el epíteto de la especie',
          'En mayúsculas, antes del nombre del género',
          'Con el sufijo -aceae al final del nombre',
        ],
      ],
      ['¿A qué familia pertenecen el repollo y el raps?', 'Brassicaceae', ['Asteraceae', 'Fabaceae', 'Rosaceae']],
    ],
  }),

  submodule({
    order: 4,
    title: 'Flora Nativa de Chile',
    description: 'Endemismo, bosque esclerófilo, bosque templado y especies nativas con valor productivo.',
    subboss: { name: 'Cariópside Indehiscente', title: 'Fortaleza del Bosque Nativo' },
    codexTitle: 'Flora Nativa de Chile',
    sections: [
      {
        heading: 'Una isla biogeográfica',
        body: [
          'Chile está aislado por el desierto, la cordillera y el océano. Por eso tiene una proporción alta de especies endémicas, que solo crecen aquí. La zona central es un "hotspot" mundial de biodiversidad.',
          'Especies endémicas emblemáticas son la palma chilena (Jubaea chilensis), el belloto del norte, la araucaria (compartida con Argentina) y el ruil, uno de los árboles más amenazados del país.',
        ],
      },
      {
        heading: 'Bosque esclerófilo y matorral',
        body: [
          'En la zona mediterránea domina el bosque esclerófilo: hojas duras, coriáceas y perennes que resisten la sequía estival. Sus especies típicas son el peumo, el boldo, el litre, el quillay y el maitén.',
          'El espino (Vachellia caven) forma el espinal de los valles. Es una leguminosa que fija nitrógeno y crece en suelos degradados; se usa para leña y carbón, y como sombra para el ganado.',
          'El quillay produce saponinas que se exportan para la industria alimentaria, de vacunas y de cosméticos; el boldo se usa como hierba medicinal.',
        ],
      },
      {
        heading: 'Bosque templado del sur',
        body: [
          'Hacia el sur aparecen los bosques de Nothofagus (roble, raulí, coigüe, lenga), el bosque valdiviano lluvioso y los alerces (Fitzroya cupressoides), que pueden superar los 3.000 años.',
          'Productos forestales no madereros como la murta (Ugni molinae), el maqui (Aristotelia chilensis, rico en antioxidantes), el calafate y la rosa mosqueta (introducida) tienen valor comercial creciente.',
          'Proteger los remanentes de bosque nativo en los predios conserva polinizadores, controladores biológicos y fuentes de agua.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: '¿Qué característica comparten las especies del bosque esclerófilo?',
      options: [
        'Hojas grandes y caducas',
        'Hojas duras y perennes que resisten la sequía',
        'Raíces acuáticas',
        'Floración en invierno con nieve',
      ],
      correctIndex: 1,
      explanation: 'Esclerófilo significa "hoja dura": hojas coriáceas y perennes adaptadas al verano seco mediterráneo.',
    },
    questions: [
      [
        '¿Qué significa que una especie sea endémica?',
        'Que crece naturalmente solo en un territorio',
        ['Que fue introducida y se naturalizó', 'Que crece en varios continentes', 'Que solo existe en jardines botánicos'],
      ],
      ['¿Qué producto se extrae del quillay?', 'Saponinas', ['Látex', 'Caucho', 'Resina de pino']],
      ['¿Qué especie nativa del secano central es una leguminosa que fija nitrógeno?', 'Espino', ['Boldo', 'Peumo', 'Litre']],
      ['¿Qué árbol del sur de Chile puede superar los 3.000 años?', 'Alerce', ['Roble', 'Maqui', 'Quillay']],
      [
        '¿Qué fruto nativo se destaca por su alto contenido de antioxidantes?',
        'Maqui',
        ['Rosa mosqueta', 'Zarzamora', 'Membrillo'],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Reconocimiento de Malezas',
    description: 'Malezas anuales y perennes, de hoja ancha y angosta: cómo reconocerlas y por qué importa para su control.',
    subboss: { name: 'La Raíz Gemífera', title: 'Reina de los Rizomas' },
    codexTitle: 'Malezas: Biología e Identificación',
    sections: [
      {
        heading: 'Qué hace exitosa a una maleza',
        body: [
          'Una maleza compite con el cultivo por luz, agua y nutrientes, y puede hospedar plagas. Las más agresivas producen miles de semillas, con dormancia que les permite esperar años en el banco de semillas del suelo.',
          'Por su ciclo se clasifican en anuales (completan su vida en una temporada), bianuales y perennes. Las perennes con rizomas, estolones o bulbillos son las más difíciles, porque rebrotan aunque se corte la parte aérea.',
        ],
      },
      {
        heading: 'Hoja ancha y hoja angosta',
        body: [
          'Las malezas de hoja angosta son principalmente gramíneas (pasto bermuda o chépica, hualcacho, ballica) y ciperáceas (chufa o coquito, Cyperus rotundus, con tubérculos). Las de hoja ancha son dicotiledóneas: yuyo, rábano silvestre, quingüilla, correhuela, malvilla.',
          'La distinción importa porque muchos herbicidas son selectivos: los graminicidas controlan gramíneas sin dañar cultivos de hoja ancha, y las auxinas sintéticas (2,4-D, MCPA) controlan hojas anchas en cereales.',
          'Las ciperáceas se distinguen de las gramíneas por su tallo triangular y macizo ("las ciperáceas tienen aristas").',
        ],
      },
      {
        heading: 'Control integrado',
        body: [
          'Identificar la maleza en estado de plántula permite controlarla cuando es más sensible. El momento crítico de competencia es el periodo en que el cultivo debe estar limpio para no perder rendimiento.',
          'El manejo integrado combina rotación de cultivos, cultivos de cobertura, control mecánico, herbicidas de distintos modos de acción y evitar que las malezas semillen. Usar siempre el mismo herbicida selecciona biotipos resistentes, como la ballica resistente a glifosato.',
          'La cuscuta es una planta parásita sin clorofila que se enrolla en el hospedero; la correhuela (Convolvulus arvensis) es una perenne de rizomas profundos que rebrota desde varios metros de profundidad.',
        ],
      },
    ],
    checkpoint: {
      at: 135,
      prompt: 'Una maleza tiene tallo triangular y macizo, hojas angostas y pequeños tubérculos en la raíz. ¿Qué es?',
      options: ['Una gramínea como la chépica', 'Una ciperácea como la chufa', 'Una hoja ancha como el yuyo', 'Una cuscuta'],
      correctIndex: 1,
      explanation:
        'El tallo triangular y macizo es típico de las ciperáceas; la chufa (Cyperus rotundus) forma tubérculos que la hacen muy persistente.',
    },
    questions: [
      [
        '¿Qué tipo de maleza es más difícil de controlar?',
        'Las perennes con rizomas o tubérculos',
        ['Las anuales de verano', 'Las que no producen semillas', 'Las de hoja grande'],
      ],
      [
        '¿Qué controla un herbicida graminicida?',
        'Malezas gramíneas (hoja angosta)',
        ['Todas las malezas', 'Solo malezas de hoja ancha', 'Hongos del suelo'],
      ],
      [
        '¿Qué es el banco de semillas?',
        'Las semillas latentes de malezas acumuladas en el suelo',
        [
          'Un vivero de semillas certificadas del SAG',
          'Las semillas del cultivo guardadas para resembrar',
          'Un depósito de granos para la temporada siguiente',
        ],
      ],
      [
        '¿Qué favorece la aparición de malezas resistentes a herbicidas?',
        'Usar siempre el mismo modo de acción',
        ['Rotar cultivos', 'Controlar en estado de plántula', 'Usar cultivos de cobertura'],
      ],
      ['¿Qué maleza es una planta parásita sin clorofila?', 'Cuscuta', ['Correhuela', 'Chépica', 'Yuyo']],
    ],
  }),
]

/** Pregunta final del Filotaxista Ancestral. */
export const BOTANICA_BOSS_FINAL = bossFinal(
  'En un trigal aparece una maleza de hojas reticuladas, raíz pivotante y flores amarillas de cuatro pétalos en cruz. ¿Qué familia es y qué herbicida la controla sin dañar el trigo?',
  'Brassicaceae (rábano silvestre): un herbicida hormonal para hoja ancha como MCPA',
  [
    'Poaceae (ballica): un graminicida selectivo para trigo',
    'Cyperaceae (chufa): un herbicida específico para ciperáceas',
    'Fabaceae (vicia): no existe control selectivo en trigo',
  ],
)

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
    title: 'Morfología Floral',
    description: 'Las piezas de la flor, la posición del ovario, las inflorescencias y la sexualidad de las plantas.',
    subboss: { name: 'Flor de Sépalos Caducos', title: 'Bruja del Ovario Ínfero' },
    codexTitle: 'Morfología Floral',
    sections: [
      {
        heading: 'La flor',
        body: [
          'Una flor completa tiene cáliz (sépalos), corola (pétalos), androceo (estambres, con anteras que producen polen) y gineceo (pistilo: estigma, estilo y ovario). Al conjunto de cáliz y corola se le llama perianto.',
          'El ovario es súpero si se ubica sobre la inserción de las otras piezas (cerezo, tomate) e ínfero si queda bajo ellas, fusionado al receptáculo (manzano, peral, zapallo).',
          'Por su simetría, la flor es actinomorfa o radial si tiene varios planos de simetría (rosa, manzano) y zigomorfa si tiene uno solo (arveja, orquídea).',
        ],
      },
      {
        heading: 'Inflorescencias',
        body: [
          'Las flores se agrupan en inflorescencias. En el racimo cada flor tiene su pedicelo a lo largo de un eje (uva, raps); en la espiga las flores son sésiles (trigo); en la umbela todos los pedicelos salen de un mismo punto (zanahoria, cebolla); en el corimbo las flores quedan a la misma altura (peral).',
          'El capítulo de las asteráceas (girasol, lechuga) parece una flor, pero es un conjunto de muchas flores pequeñas sobre un receptáculo común.',
        ],
      },
      {
        heading: 'Sexualidad de la planta',
        body: [
          'Las flores pueden ser hermafroditas (con estambres y pistilo) o unisexuales. Una especie es monoica si tiene flores masculinas y femeninas en la misma planta (maíz, nogal, zapallo) y dioica si están en plantas distintas (kiwi, espárrago, pistacho).',
          'En especies dioicas hay que plantar machos polinizantes junto a las hembras productivas: en kiwi se usa cerca de un macho cada seis a ocho hembras.',
        ],
      },
    ],
    checkpoint: {
      at: 140,
      prompt:
        'En una flor de manzano, el ovario está bajo la inserción de los pétalos, fusionado al receptáculo. ¿Cómo se clasifica?',
      options: ['Ovario súpero', 'Ovario ínfero', 'Flor zigomorfa', 'Flor unisexual'],
      correctIndex: 1,
      explanation:
        'El ovario ínfero queda bajo las demás piezas florales; en el manzano el receptáculo que lo envuelve formará el pomo.',
    },
    questions: [
      [
        '¿Qué significa que una especie sea dioica?',
        'Flores masculinas y femeninas en plantas distintas',
        ['Flores de ambos sexos en la misma planta', 'Flores sin pétalos', 'Que se autopoliniza'],
      ],
      ['¿Qué pieza floral produce el polen?', 'La antera del estambre', ['El estigma', 'El ovario', 'El sépalo']],
      ['¿Qué tipo de inflorescencia tiene la zanahoria?', 'Umbela', ['Espiga', 'Capítulo', 'Racimo']],
      [
        '¿Qué es una flor zigomorfa?',
        'Una flor con un solo plano de simetría',
        ['Una flor sin pétalos', 'Una flor con ovario ínfero', 'Una flor con varios planos de simetría'],
      ],
      ['¿Qué especie tiene ovario súpero?', 'Cerezo', ['Manzano', 'Peral', 'Zapallo']],
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
    title: 'Frutos y Semillas',
    description: 'De la fecundación al fruto: tipos de fruto carnoso y seco, la estructura de la semilla y su dormancia.',
    subboss: { name: 'Cariópside Indehiscente', title: 'Fortaleza del Grano' },
    codexTitle: 'Frutos y Semillas',
    sections: [
      {
        heading: 'Del óvulo al fruto',
        body: [
          'La polinización lleva el polen al estigma; la fecundación ocurre cuando el tubo polínico llega al óvulo. En las angiospermas es doble: un núcleo forma el embrión y otro el endosperma.',
          'El fruto es el ovario desarrollado y la semilla, el óvulo fecundado. La pared del ovario se transforma en el pericarpio (epicarpio, mesocarpio y endocarpio). Si el fruto se desarrolla sin fecundación es partenocárpico (plátano, algunas mandarinas).',
        ],
      },
      {
        heading: 'Tipos de fruto',
        body: [
          'Carnosos: la drupa tiene un carozo leñoso (durazno, cereza, aceituna); la baya es carnosa con semillas en la pulpa (uva, tomate, arándano); el pomo es un falso fruto donde la parte comestible es el receptáculo (manzana, pera); el hesperidio es la baya de los cítricos.',
          'Secos: los dehiscentes se abren al madurar, como la legumbre, que lo hace por dos suturas (poroto, arveja). Los indehiscentes no se abren: la cariopsis es el grano de los cereales, con la semilla soldada al pericarpio; el aquenio es pequeño y con una semilla libre (girasol); la nuez tiene pared dura.',
          'Frutos agregados vienen de varios pistilos de una flor (frambuesa, frutilla) y los múltiples, de varias flores (piña, mora de árbol).',
        ],
      },
      {
        heading: 'La semilla',
        body: [
          'La semilla tiene tegumento (testa), embrión (radícula, plúmula y cotiledones) y reservas. Las monocotiledóneas tienen un cotiledón y guardan reservas en el endosperma (maíz, trigo); muchas dicotiledóneas las guardan en los cotiledones (poroto, arveja).',
          'La germinación necesita agua, oxígeno y temperatura adecuada. Algunas semillas tienen dormancia: por cubierta dura e impermeable (se rompe con escarificación) o por inhibidores internos (se rompe con estratificación en frío húmedo, como en muchas rosáceas).',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: '¿Qué tipo de fruto es la manzana?',
      options: ['Drupa', 'Baya', 'Pomo', 'Legumbre'],
      correctIndex: 2,
      explanation: 'La manzana es un pomo: viene de un ovario ínfero y la parte comestible es el receptáculo floral engrosado.',
    },
    questions: [
      ['¿Qué tipo de fruto es la cereza?', 'Drupa', ['Pomo', 'Cariopsis', 'Legumbre']],
      ['¿Qué parte de la flor se transforma en fruto?', 'El ovario', ['El estambre', 'El pétalo', 'El estigma']],
      [
        '¿Qué es un fruto partenocárpico?',
        'Uno que se desarrolla sin fecundación',
        ['Uno con muchas semillas', 'Uno de dos flores', 'Uno que madura en el árbol'],
      ],
      ['¿Qué tipo de fruto es el grano de trigo?', 'Cariopsis', ['Baya', 'Drupa', 'Hesperidio']],
      [
        '¿Cómo se rompe la dormancia de semillas con inhibidores internos, como las de muchas rosáceas?',
        'Con estratificación en frío húmedo',
        ['Con escarificación de la cubierta', 'Con secado al sol', 'Con fertilización nitrogenada'],
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

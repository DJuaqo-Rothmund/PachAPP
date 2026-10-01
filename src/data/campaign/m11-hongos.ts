import { campaignModule } from './helpers.ts'

/** Módulo 11 · Reconocimiento y Biología de Hongos. */
const { submodule, bossFinal } = campaignModule(11)

export const HONGOS_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Biología y Morfología Fúngica',
    description: 'Hifas, micelio, quitina y nutrición por absorción: qué es un hongo y por qué no es una planta.',
    subboss: { name: 'La Hifa Tabicada', title: 'Tejedora del Micelio' },
    codexTitle: 'Qué es un Hongo',
    sections: [
      {
        heading: 'Un reino propio',
        body: [
          'Los hongos no son plantas: no hacen fotosíntesis y su pared celular es de quitina, no de celulosa. Son heterótrofos que se alimentan por absorción: secretan enzimas al medio y absorben las moléculas digeridas.',
          'Según cómo obtienen su alimento son saprófitos (descomponen materia muerta), parásitos (viven de un hospedero vivo) o simbiontes mutualistas (micorrizas, líquenes).',
        ],
      },
      {
        heading: 'Hifas y micelio',
        body: [
          'El cuerpo de la mayoría de los hongos es un conjunto de filamentos llamados hifas, que en conjunto forman el micelio. Las hifas pueden ser tabicadas (con septos) o cenocíticas (sin tabiques).',
          'Lo que llamamos "callampa" o seta es solo el cuerpo fructífero, la estructura que produce esporas; el micelio vive bajo el suelo o dentro de la madera y puede ocupar grandes superficies.',
          'Las levaduras son hongos unicelulares, como Saccharomyces cerevisiae, que fermenta el pan, la cerveza y el vino.',
        ],
      },
      {
        heading: 'Grandes grupos',
        body: [
          'Los Ascomycota forman esporas dentro de sacos (ascos): incluyen levaduras, Botrytis, Penicillium, oídios y morchellas. Los Basidiomycota forman esporas en basidios: la mayoría de las setas con sombrero, royas y carbones.',
          'Los oomicetos, como Phytophthora y los mildiús, parecen hongos pero pertenecen a otro grupo (Stramenopila): su pared es de celulosa y por eso responden a fungicidas específicos.',
        ],
      },
    ],
    checkpoint: {
      at: 120,
      prompt: '¿Por qué un fungicida eficaz contra Botrytis puede no controlar a Phytophthora?',
      options: [
        'Porque Phytophthora es una bacteria',
        'Porque Phytophthora es un oomiceto, con pared de celulosa y otra biología',
        'Porque Phytophthora es un virus',
        'Porque Botrytis vive en el suelo',
      ],
      correctIndex: 1,
      explanation:
        'Los oomicetos no son hongos verdaderos: su pared de celulosa y su metabolismo distinto exigen fungicidas específicos (como fosfitos o metalaxil).',
    },
    questions: [
      ['¿De qué está formada la pared celular de los hongos?', 'Quitina', ['Celulosa', 'Lignina', 'Almidón']],
      ['¿Cómo se llama el conjunto de hifas de un hongo?', 'Micelio', ['Basidio', 'Esporangio', 'Rizoma']],
      [
        '¿Qué es la seta o callampa?',
        'El cuerpo fructífero que produce esporas',
        ['La raíz que absorbe nutrientes del suelo', 'El organismo completo del hongo', 'Una planta parásita sin clorofila'],
      ],
      ['¿A qué grupo pertenece Phytophthora?', 'Oomicetos', ['Basidiomycota', 'Bacterias', 'Levaduras']],
      [
        '¿Cómo se alimentan los hongos?',
        'Por absorción, tras secretar enzimas al medio',
        ['Por fotosíntesis', 'Por ingestión como los animales', 'Fijando nitrógeno del aire'],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'Reproducción y Ciclos de Vida',
    description: 'Esporas sexuales y asexuales, conidios, esclerocios y cómo sobreviven los hongos entre temporadas.',
    subboss: { name: 'La Espora Durmiente', title: 'Heraldo del Conidio' },
    codexTitle: 'Reproducción de los Hongos',
    sections: [
      {
        heading: 'Esporas',
        body: [
          'Los hongos se dispersan por esporas que viajan con el viento, el agua, los insectos o las herramientas. Las asexuales, como los conidios, se producen en enormes cantidades y causan las epidemias durante la temporada.',
          'Las sexuales (ascosporas, basidiosporas) aportan variabilidad genética, lo que favorece la aparición de resistencia a fungicidas y de nuevas razas.',
        ],
      },
      {
        heading: 'Ciclos de vida',
        body: [
          'La infección primaria inicia la enfermedad a partir del inóculo que sobrevivió el invierno; las infecciones secundarias la multiplican durante la temporada. Una enfermedad policíclica, como el oídio o la botritis, tiene muchos ciclos por temporada.',
          'La venturia del manzano (Venturia inaequalis) sobrevive en hojas caídas y libera ascosporas en primavera con lluvia: eliminar o triturar la hoja caída reduce el inóculo primario.',
        ],
      },
      {
        heading: 'Estructuras de supervivencia',
        body: [
          'Los esclerocios son masas compactas de micelio que sobreviven años en el suelo (Sclerotinia, Sclerotium). Las clamidosporas son esporas de pared gruesa que resisten condiciones adversas (Fusarium).',
          'Por eso la rotación de cultivos, la sanidad de los restos de cosecha y la semilla limpia son tan importantes como los fungicidas.',
        ],
      },
    ],
    checkpoint: {
      at: 135,
      prompt: 'En un huerto de manzanos con venturia, ¿qué práctica reduce el inóculo primario de la próxima primavera?',
      options: [
        'Regar más en verano',
        'Triturar o eliminar la hoja caída en otoño',
        'Podar en verano',
        'Aplicar nitrógeno en invierno',
      ],
      correctIndex: 1,
      explanation:
        'Venturia inverna en la hoja caída y desde ahí libera las ascosporas que inician las infecciones de primavera.',
    },
    questions: [
      [
        '¿Qué tipo de espora causa las epidemias dentro de la temporada?',
        'Las asexuales, como los conidios',
        ['Solo las basidiosporas', 'Las semillas', 'Los esclerocios'],
      ],
      [
        '¿Qué es un esclerocio?',
        'Una masa compacta de micelio que sobrevive en el suelo',
        [
          'Un tipo de seta comestible del bosque',
          'Una espora sexual que viaja con el viento',
          'Una raíz infectada que forma una agalla',
        ],
      ],
      [
        '¿Dónde inverna la venturia del manzano?',
        'En las hojas caídas',
        ['En la fruta guardada', 'En el agua de riego', 'En las abejas'],
      ],
      [
        '¿Qué es una enfermedad policíclica?',
        'Una con muchos ciclos de infección por temporada',
        ['Una que ataca varias especies', 'Una que dura varios años sin síntomas', 'Una causada por virus'],
      ],
      ['¿Qué estructura de resistencia forma Fusarium?', 'Clamidosporas', ['Basidios', 'Ascocarpos comestibles', 'Bulbillos']],
    ],
  }),

  submodule({
    order: 3,
    title: 'Hongos Benéficos',
    description: 'Micorrizas, Trichoderma, entomopatógenos y descomponedores: los hongos que trabajan a favor del cultivo.',
    subboss: { name: 'El Trichoderma Mercenario', title: 'Cazador de Patógenos' },
    codexTitle: 'Hongos Benéficos para la Agricultura',
    sections: [
      {
        heading: 'Micorrizas',
        body: [
          'Las micorrizas son asociaciones entre hongos y raíces. Las arbusculares (Glomeromycota) colonizan el interior de las raíces de la mayoría de los cultivos y aumentan la absorción de fósforo, agua y micronutrientes; a cambio reciben azúcares.',
          'Las ectomicorrizas envuelven las raíces de pinos, robles y Nothofagus, y muchas producen setas comestibles. Las ericoides acompañan a arándanos y cranberry.',
          'La labranza intensa, el suelo desnudo y el exceso de fósforo soluble reducen las micorrizas.',
        ],
      },
      {
        heading: 'Biocontroladores',
        body: [
          'Trichoderma compite por espacio y nutrientes, parasita a otros hongos (micoparasitismo) y produce antibióticos: se usa contra Botrytis, Rhizoctonia y pudriciones de raíz y cuello.',
          'Los hongos entomopatógenos, como Beauveria bassiana y Metarhizium, infectan insectos a través de la cutícula y se usan como bioinsecticidas.',
        ],
      },
      {
        heading: 'Descomponedores',
        body: [
          'Los hongos saprófitos son los principales descomponedores de la lignina y la celulosa: reciclan nutrientes y forman humus. Sin ellos los rastrojos se acumularían por décadas.',
          'Las hifas y la glomalina de las micorrizas pegan las partículas del suelo y estabilizan los agregados.',
        ],
      },
    ],
    checkpoint: {
      at: 145,
      prompt: 'Un productor aplica dosis muy altas de fósforo soluble cada año. ¿Qué efecto puede tener sobre las micorrizas?',
      options: [
        'Las multiplica',
        'Las reduce, porque la planta deja de "pagarles" con azúcares',
        'Las convierte en patógenos',
        'No tiene efecto',
      ],
      correctIndex: 1,
      explanation: 'Con fósforo abundante la planta invierte menos carbono en la simbiosis y la colonización micorrícica cae.',
    },
    questions: [
      ['¿Qué nutriente ayudan a absorber principalmente las micorrizas arbusculares?', 'Fósforo', ['Sodio', 'Cloro', 'Aluminio']],
      [
        '¿Qué mecanismo usa Trichoderma contra otros hongos?',
        'Micoparasitismo, competencia y antibiosis',
        ['Fotosíntesis y fijación de carbono', 'Fijación de nitrógeno en nódulos', 'Producción de etileno en la raíz'],
      ],
      [
        '¿Qué hongo se usa como bioinsecticida?',
        'Beauveria bassiana',
        ['Botrytis cinerea', 'Venturia inaequalis', 'Phytophthora cinnamomi'],
      ],
      [
        '¿Qué tipo de micorriza forman pinos y robles?',
        'Ectomicorrizas',
        ['Ericoides', 'Arbusculares exclusivamente', 'Ninguna'],
      ],
      [
        '¿Qué práctica reduce las micorrizas en el suelo?',
        'La labranza intensa',
        ['La cero labranza', 'Los cultivos de cobertura', 'La rotación con leguminosas'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Hongos Fitopatógenos',
    description: 'Botrytis, oídio, royas, pudriciones de raíz y el triángulo de la enfermedad.',
    subboss: { name: 'La Botrytis Gris', title: 'Señora de la Pudrición' },
    codexTitle: 'Enfermedades Fúngicas de los Cultivos',
    sections: [
      {
        heading: 'El triángulo de la enfermedad',
        body: [
          'Una enfermedad ocurre cuando coinciden un hospedero susceptible, un patógeno virulento y un ambiente favorable, durante el tiempo suficiente. El manejo actúa sobre los tres lados: variedades resistentes, menos inóculo y menos condiciones favorables.',
          'Muchos hongos necesitan agua libre sobre la hoja por varias horas para infectar: por eso los modelos de pronóstico usan horas de mojado y temperatura.',
        ],
      },
      {
        heading: 'Enfermedades clave',
        body: [
          'Botrytis cinerea (pudrición gris) ataca flores y frutos de uva, frutilla, frambuesa y arándano, con alta humedad. El oídio forma un polvo blanco sobre hojas y bayas y, a diferencia de la mayoría, no necesita agua libre: le basta la humedad ambiental.',
          'Las royas forman pústulas de color óxido (trigo, poroto, ajo); algunas necesitan dos hospederos distintos para completar su ciclo. Fusarium y Verticillium tapan los vasos del xilema y causan marchitez.',
        ],
      },
      {
        heading: 'Manejo',
        body: [
          'Los fungicidas preventivos (de contacto, como cobre o captan) protegen la superficie antes de la infección; los sistémicos penetran y pueden detener infecciones recientes, pero tienen alto riesgo de resistencia si se repite el mismo modo de acción.',
          'La clasificación FRAC agrupa los fungicidas por modo de acción para planificar rotaciones. La poda que ventila, la eliminación de restos enfermos y el riego que no moja el follaje completan el manejo integrado.',
        ],
      },
    ],
    checkpoint: {
      at: 155,
      prompt:
        'Una viña tiene polvo blanco sobre hojas y racimos en un verano seco, sin lluvias. ¿Qué enfermedad es más probable?',
      options: ['Botrytis', 'Oídio', 'Mildiú', 'Roya'],
      correctIndex: 1,
      explanation:
        'El oídio forma un micelio blanco superficial y no necesita agua libre para infectar: prospera en veranos secos.',
    },
    questions: [
      [
        '¿Qué tres elementos forman el triángulo de la enfermedad?',
        'Hospedero susceptible, patógeno y ambiente favorable',
        ['Agua, luz y nutrientes del suelo', 'Insecto vector, virus y bacteria', 'Raíz, tallo y hoja del hospedero'],
      ],
      ['¿Qué enfermedad no necesita agua libre sobre la hoja para infectar?', 'Oídio', ['Botrytis', 'Venturia', 'Mildiú']],
      [
        '¿Qué síntoma producen Fusarium y Verticillium?',
        'Marchitez por obstrucción del xilema',
        ['Pústulas de color óxido en hojas', 'Polvo blanco sobre hojas y frutos', 'Agallas leñosas en el cuello'],
      ],
      [
        '¿Qué agrupa la clasificación FRAC?',
        'Los fungicidas según su modo de acción',
        [
          'Los hongos comestibles según su toxicidad',
          'Las plagas de insectos según su daño',
          'Los suelos según su contenido de hongos',
        ],
      ],
      [
        '¿Qué tipo de fungicida protege la superficie antes de la infección?',
        'Preventivo o de contacto',
        ['Sistémico curativo', 'Herbicida', 'Bioestimulante'],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Setas Silvestres de Chile',
    description: 'Digüeñes, changles, loyos y callampas de pino, y las especies tóxicas que hay que aprender a reconocer.',
    subboss: { name: 'La Amanita Embustera', title: 'Imitadora Mortal' },
    codexTitle: 'Hongos Silvestres Comestibles y Tóxicos',
    sections: [
      {
        heading: 'Hongos comestibles nativos',
        body: [
          'El digüeñe (Cyttaria espinosae) es un hongo parásito del roble y el hualle: forma cuerpos fructíferos anaranjados con alvéolos en primavera. El changle (Ramaria flava) es coraloide y amarillo, y crece en bosques de Nothofagus en otoño.',
          'El loyo (Boletus loyo) es un boleto con poros en vez de láminas; el gargal (Grifola gargal) crece sobre troncos. La recolección de estas especies es un saber tradicional del pueblo mapuche y del campesinado del sur.',
        ],
      },
      {
        heading: 'Hongos de plantaciones',
        body: [
          'En las plantaciones de pino crecen Suillus luteus (callampa de pino, con poros y sombrero viscoso) y Lactarius deliciosus (exuda un látex anaranjado). Ambos son ectomicorrícicos y llegaron con los pinos.',
          'La morchella (Morchella), de sombrero alveolado, se recolecta y exporta deshidratada.',
        ],
      },
      {
        heading: 'Especies tóxicas',
        body: [
          'Amanita phalloides, introducida en Chile junto a robles y encinos europeos, contiene amatoxinas que destruyen el hígado; los síntomas aparecen 6 a 24 horas después, cuando el daño ya avanzó. Amanita muscaria, de sombrero rojo con verrugas blancas, también es tóxica.',
          'Las Amanita tienen láminas blancas, anillo y una volva (bolsa) en la base del pie: si el pie no se desentierra, la volva queda oculta. La regla es simple: nunca consumir un hongo silvestre sin identificación segura por un experto. No existen "pruebas caseras" (plata, ajo, animales) que indiquen si un hongo es comestible.',
        ],
      },
    ],
    checkpoint: {
      at: 165,
      prompt: 'Una seta tiene láminas blancas, anillo y una bolsa en la base del pie. ¿Qué conviene concluir?',
      options: [
        'Es un digüeñe comestible',
        'Tiene rasgos de Amanita: no consumir',
        'Es una callampa de pino',
        'Si no tiene mal olor, es comestible',
      ],
      correctIndex: 1,
      explanation:
        'Láminas blancas, anillo y volva son rasgos típicos del género Amanita, que incluye especies mortales como A. phalloides.',
    },
    questions: [
      [
        '¿Sobre qué árbol crece el digüeñe (Cyttaria espinosae)?',
        'Roble y hualle (Nothofagus)',
        ['Pino radiata y pino oregón', 'Eucalipto y aromo', 'Álamo y sauce'],
      ],
      [
        '¿Qué toxinas contiene Amanita phalloides?',
        'Amatoxinas que destruyen el hígado',
        ['Cafeína que acelera el corazón', 'Saponinas que irritan la piel', 'Antocianinas que tiñen la orina'],
      ],
      [
        '¿Qué estructura en la base del pie caracteriza a las Amanita?',
        'La volva',
        ['El látex anaranjado', 'Los poros', 'Los alvéolos'],
      ],
      ['¿Qué hongo de pino exuda látex anaranjado?', 'Lactarius deliciosus', ['Suillus luteus', 'Changle', 'Digüeñe']],
      [
        '¿Cuál es la regla segura para consumir hongos silvestres?',
        'Solo con identificación segura por un experto',
        ['Si un animal lo comió, es seguro', 'Si no ennegrece la plata, es seguro', 'Si huele bien, es seguro'],
      ],
    ],
  }),
]

/** Pregunta final del Micelio Nigromante. */
export const HONGOS_BOSS_FINAL = bossFinal(
  'Un parronal tuvo Botrytis severa tras aplicar siempre el mismo fungicida sistémico. ¿Qué estrategia integrada corresponde?',
  'Rotar modos de acción FRAC, sumar Trichoderma, deshojar para ventilar los racimos y eliminar restos enfermos',
  [
    'Duplicar la dosis del mismo fungicida sistémico que ya se usaba',
    'Regar por aspersión sobre los racimos para lavar las esporas',
    'Aplicar más nitrógeno para que la planta crezca y se defienda',
  ],
)

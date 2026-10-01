import { campaignModule } from './helpers.ts'

/** Módulo 12 · Producción Avícola. */
const { submodule, bossFinal } = campaignModule(12)

export const AVICOLA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Razas, Líneas y Sistemas',
    description: 'Broilers, ponedoras y gallinas de campo: líneas genéticas, sistemas productivos e índices clave.',
    subboss: { name: 'El Disparador del Fotoperiodo', title: 'Amo de las Líneas Comerciales' },
    codexTitle: 'Sistemas de Producción Avícola',
    sections: [
      {
        heading: 'Carne y huevo',
        body: [
          'La avicultura moderna usa híbridos comerciales seleccionados para un solo propósito. Los broilers (pollos de carne), como Ross o Cobb, alcanzan unos 2,5 a 3 kg en alrededor de 40-42 días. Las ponedoras comerciales, blancas o rojas (Hy-Line, Lohmann), producen más de 300 huevos por año.',
          'Las razas de doble propósito (Plymouth Rock, Rhode Island Red) y la gallina mapuche de huevos azules (collonca) se crían en sistemas campesinos de traspatio.',
        ],
      },
      {
        heading: 'Sistemas productivos',
        body: [
          'Los broilers se crían en galpones sobre cama (viruta o paja). Las ponedoras se crían en jaulas convencionales, jaulas enriquecidas, sistemas libres de jaula en piso o aviario, o al aire libre con acceso a pastoreo (free range).',
          'La tendencia del mercado y de la regulación es hacia sistemas libres de jaula, que mejoran el bienestar pero exigen más espacio y manejo sanitario.',
        ],
      },
      {
        heading: 'Índices productivos',
        body: [
          'En carne, el índice clave es la conversión alimenticia: kilos de alimento por kilo de peso vivo, cercana a 1,5-1,7 en broilers modernos. También se miden ganancia diaria, mortalidad y uniformidad del lote.',
          'En postura se miden el porcentaje de postura (huevos por gallina por día), el peso del huevo, la calidad de cáscara y los kilos de alimento por docena de huevos.',
        ],
      },
    ],
    checkpoint: {
      at: 115,
      prompt:
        'Un lote de broilers consumió 4.200 kg de alimento y produjo 2.800 kg de peso vivo. ¿Cuál es la conversión alimenticia?',
      options: ['0,67', '1,5', '2,8', '4,2'],
      correctIndex: 1,
      explanation: 'Conversión = alimento / peso producido = 4.200 / 2.800 = 1,5 kg de alimento por kg de peso vivo.',
    },
    questions: [
      [
        '¿Cuántos días tarda aproximadamente un broiler moderno en llegar a peso de faena?',
        'Alrededor de 40 a 42 días',
        ['Alrededor de 6 meses', '10 días', 'Un año'],
      ],
      [
        '¿Qué mide la conversión alimenticia?',
        'Kilos de alimento por kilo de peso producido',
        ['Huevos puestos por gallina en un día', 'Litros de agua por kilo de alimento', 'Aves alojadas por metro cuadrado'],
      ],
      ['¿Qué gallina tradicional chilena pone huevos azules?', 'La collonca', ['La Leghorn', 'La Ross', 'La Cobb']],
      ['¿Qué sistema de postura es libre de jaula?', 'Aviario o piso', ['Jaula convencional', 'Jaula enriquecida', 'Batería']],
      ['¿Cuántos huevos al año puede poner una ponedora comercial?', 'Más de 300', ['Unos 50', 'Unos 100', 'Más de 1.000']],
    ],
  }),

  submodule({
    order: 2,
    title: 'Nutrición y Alimentación',
    description: 'Energía, proteína, aminoácidos y calcio: cómo se formula la dieta de cada etapa.',
    subboss: { name: 'La Tolva Segregada', title: 'Tirana de la Energía Metabolizable' },
    codexTitle: 'Nutrición de Aves',
    sections: [
      {
        heading: 'Energía y proteína',
        body: [
          'Las aves comen principalmente para cubrir su requerimiento de energía, que se expresa como energía metabolizable (kcal/kg). El maíz es la principal fuente energética y la harina de soya, la principal fuente de proteína.',
          'Más que la proteína total importan los aminoácidos esenciales: la metionina es el primer limitante en dietas maíz-soya, seguida de la lisina. Se agregan en forma sintética para no sobrecargar de proteína la dieta.',
        ],
      },
      {
        heading: 'Dietas por etapa',
        body: [
          'Los broilers reciben dietas de inicio, crecimiento y terminación, con proteína decreciente a medida que crecen. Las ponedoras pasan por recría y luego postura.',
          'La ponedora necesita mucho calcio (alrededor de 3,5 a 4,5 % de la dieta), idealmente con parte en partículas gruesas (conchilla), que se disuelven lentamente durante la noche, cuando se forma la cáscara.',
        ],
      },
      {
        heading: 'Agua y calidad del alimento',
        body: [
          'Las aves beben aproximadamente el doble de agua que el alimento que consumen, y más con calor. Una caída del consumo de agua suele ser la primera señal de enfermedad.',
          'Las micotoxinas (aflatoxinas, por ejemplo) de granos mal almacenados dañan el hígado, la inmunidad y la producción: el grano debe guardarse seco y se usan secuestrantes.',
        ],
      },
    ],
    checkpoint: {
      at: 140,
      prompt: 'Un lote de ponedoras produce huevos de cáscara delgada que se quiebran. ¿Qué revisar primero en la dieta?',
      options: ['La metionina', 'El calcio y su granulometría, junto con la vitamina D₃', 'La energía metabolizable', 'La fibra'],
      correctIndex: 1,
      explanation:
        'La cáscara es carbonato de calcio: hay que revisar el nivel de calcio, la proporción de partículas gruesas y la vitamina D₃, necesaria para absorberlo.',
    },
    questions: [
      ['¿Cuál es el primer aminoácido limitante en dietas maíz-soya para aves?', 'Metionina', ['Glicina', 'Alanina', 'Prolina']],
      [
        '¿En qué unidad se expresa la energía de la dieta avícola?',
        'Energía metabolizable (kcal/kg)',
        ['Conductividad eléctrica (dS/m)', 'Intercambio catiónico (cmol/kg)', 'Potencial hídrico (MPa)'],
      ],
      [
        '¿Para qué se da calcio en partículas gruesas a las ponedoras?',
        'Se disuelve lentamente de noche, cuando se forma la cáscara',
        [
          'Porque así las gallinas comen menos y engordan menos',
          'Porque mejora el color de la yema del huevo',
          'Porque evita que las gallinas entren en muda',
        ],
      ],
      [
        '¿Qué relación aproximada hay entre el agua y el alimento consumidos?',
        'Beben cerca del doble de agua que de alimento',
        ['Beben la mitad', 'Beben 10 veces más', 'No necesitan agua si el alimento es húmedo'],
      ],
      ['¿Qué producen los granos mal almacenados que daña a las aves?', 'Micotoxinas', ['Antocianinas', 'Saponinas', 'Etileno']],
    ],
  }),

  submodule({
    order: 3,
    title: 'Ambiente y Manejo del Galpón',
    description: 'Temperatura de crianza, ventilación, amoníaco, cama y luz: el galpón como sistema.',
    subboss: { name: 'El Centinela del Galpón', title: 'Espíritu del Amoníaco' },
    codexTitle: 'Manejo Ambiental del Galpón',
    sections: [
      {
        heading: 'Crianza y temperatura',
        body: [
          'Los pollitos no regulan bien su temperatura durante las primeras semanas: necesitan cerca de 32-35 °C al nivel del ave en la primera semana, y luego unos 3 °C menos por semana hasta llegar a 20-22 °C.',
          'El comportamiento indica si la temperatura es correcta: amontonados bajo la fuente de calor tienen frío; alejados, jadeando y con alas abiertas tienen calor; repartidos de forma pareja están cómodos.',
        ],
      },
      {
        heading: 'Ventilación y amoníaco',
        body: [
          'La ventilación saca humedad, calor, CO₂ y amoníaco. El amoníaco se forma en una cama húmeda a partir de las deyecciones: sobre unos 20-25 ppm irrita ojos y vías respiratorias y favorece enfermedades.',
          'Una cama húmeda y apelmazada además causa lesiones en las patas (pododermatitis) y en la pechuga. Bebederos sin fugas, buena ventilación y densidades adecuadas la mantienen seca.',
        ],
      },
      {
        heading: 'Luz',
        body: [
          'En ponedoras, el fotoperiodo controla la madurez sexual y la postura: se cría con días cortos y constantes, y al llegar a la edad de postura se estimula con aumentos graduales hasta unas 16 horas de luz. Nunca se debe reducir la luz durante la postura.',
          'En broilers, programas con algunas horas de oscuridad mejoran la salud de las patas y el bienestar.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: 'Al entrar al galpón de recría los pollitos están amontonados bajo las criadoras. ¿Qué indica?',
      options: ['Que tienen calor', 'Que tienen frío: falta temperatura', 'Que tienen hambre', 'Que el amoníaco es bajo'],
      correctIndex: 1,
      explanation:
        'Los pollitos se agrupan bajo la fuente de calor cuando la temperatura es insuficiente. Si tuvieran calor, se alejarían y jadearían.',
    },
    questions: [
      [
        '¿Qué temperatura necesitan los pollitos en la primera semana?',
        'Cerca de 32 a 35 °C',
        ['Cerca de 15 °C', 'Cerca de 45 °C', 'La temperatura ambiente, sin calefacción'],
      ],
      [
        '¿Sobre qué nivel de amoníaco se afecta la salud de las aves?',
        'Sobre unos 20 a 25 ppm',
        ['Sobre 1.000 ppm', 'Cualquier nivel es inocuo', 'Sobre 0,1 ppm'],
      ],
      [
        '¿Qué causa una cama húmeda y apelmazada?',
        'Amoníaco y lesiones en las patas',
        ['Mejor conversión alimenticia', 'Más postura en las gallinas', 'Menos enfermedades respiratorias'],
      ],
      ['¿Cuántas horas de luz se usan en postura?', 'Alrededor de 16 horas', ['4 horas', '24 horas siempre', '8 horas']],
      [
        '¿Qué indica ver pollos jadeando con las alas abiertas?',
        'Estrés por calor',
        ['Frío', 'Falta de luz', 'Exceso de calcio'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Sanidad y Bioseguridad',
    description: 'Influenza aviar, Newcastle, Marek, coccidiosis y las barreras que evitan que la enfermedad entre.',
    subboss: { name: 'El Vector Patógeno', title: 'Portador del Paramixovirus' },
    codexTitle: 'Sanidad Avícola',
    sections: [
      {
        heading: 'Enfermedades de importancia',
        body: [
          'La influenza aviar de alta patogenicidad y la enfermedad de Newcastle son de denuncia obligatoria al SAG: causan alta mortalidad y restricciones al comercio. Las aves silvestres migratorias pueden introducir la influenza aviar, como ocurrió en Chile en 2022-2023.',
          'La enfermedad de Marek, causada por un herpesvirus, produce tumores y parálisis; se vacuna en la incubadora o al día de edad. La bronquitis infecciosa y el Gumboro (bursitis infecciosa) también se previenen con vacunas.',
        ],
      },
      {
        heading: 'Coccidiosis',
        body: [
          'La coccidiosis la causan protozoos del género Eimeria, que dañan el intestino: diarrea, a veces con sangre, y mala conversión. Prospera en camas húmedas.',
          'Se controla con anticoccidiales en el alimento, vacunas y, sobre todo, manteniendo la cama seca.',
        ],
      },
      {
        heading: 'Bioseguridad',
        body: [
          'Es el conjunto de medidas para que los patógenos no entren ni salgan del plantel: cercos, control de visitas, cambio de ropa y calzado, pediluvios, desinfección de vehículos, control de roedores y aves silvestres, y agua potable.',
          'El sistema "todo dentro, todo fuera" cría lotes de una sola edad, y entre lotes se limpia, desinfecta y deja un vacío sanitario. Mezclar edades mantiene los patógenos circulando.',
        ],
      },
    ],
    checkpoint: {
      at: 160,
      prompt: 'En un plantel aparece mortalidad súbita y alta con signos respiratorios y nerviosos. ¿Qué corresponde?',
      options: [
        'Esperar una semana',
        'Denunciar de inmediato al SAG y aislar el plantel',
        'Vender las aves rápido',
        'Aplicar un anticoccidial',
      ],
      correctIndex: 1,
      explanation:
        'Mortalidad alta con signos respiratorios y nerviosos sugiere influenza aviar o Newcastle, enfermedades de denuncia obligatoria.',
    },
    questions: [
      [
        '¿Qué enfermedad aviar es de denuncia obligatoria al SAG?',
        'Influenza aviar de alta patogenicidad',
        ['Coccidiosis por Eimeria', 'Pododermatitis por cama húmeda', 'Picaje por exceso de luz'],
      ],
      [
        '¿Qué causa la coccidiosis?',
        'Protozoos del género Eimeria',
        ['Un herpesvirus', 'Una bacteria del suelo', 'Falta de calcio'],
      ],
      [
        '¿Cuándo se vacuna contra la enfermedad de Marek?',
        'En la incubadora o al día de edad',
        ['Al inicio de la postura', 'Solo si aparecen tumores', 'Nunca se vacuna'],
      ],
      [
        '¿Qué significa el sistema "todo dentro, todo fuera"?',
        'Criar lotes de una sola edad con vacío sanitario entre lotes',
        ['Mezclar edades para acostumbrar a las aves', 'Dejar las puertas abiertas', 'Vender huevos y carne a la vez'],
      ],
      [
        '¿Qué aves pueden introducir la influenza aviar a un plantel?',
        'Aves silvestres migratorias',
        ['Solo las gallinas de jaula', 'Los broilers vacunados', 'Ninguna: solo la transmiten las personas'],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Huevo, Calidad y Bienestar',
    description: 'Formación y calidad del huevo, la muda, el picaje y los principios de bienestar animal.',
    subboss: { name: 'La Espiral del Magno', title: 'Forjadora de Cáscaras' },
    codexTitle: 'Producción de Huevos y Bienestar Animal',
    sections: [
      {
        heading: 'Formación y calidad del huevo',
        body: [
          'El huevo tarda unas 24-26 horas en formarse en el oviducto, de las cuales cerca de 20 corresponden a la cáscara en el útero. Por eso la gallina pone aproximadamente un huevo al día.',
          'La calidad interna se mide en unidades Haugh (altura de la clara densa en relación al peso): baja con la edad del huevo y con temperaturas altas de almacenaje. El color de la yema depende de los pigmentos (xantofilas) de la dieta, no del valor nutritivo.',
          'El color de la cáscara depende de la línea genética: no cambia el valor nutritivo del huevo.',
        ],
      },
      {
        heading: 'Muda y ciclo productivo',
        body: [
          'Después de unas 70-80 semanas la postura y la calidad de cáscara bajan. La muda natural renueva plumas y el aparato reproductor; las mudas inducidas por ayuno prolongado están cuestionadas o prohibidas por razones de bienestar.',
        ],
      },
      {
        heading: 'Bienestar animal',
        body: [
          'Las cinco libertades: libres de hambre y sed; de incomodidad; de dolor, lesiones y enfermedad; libres para expresar su comportamiento normal; y libres de miedo y angustia.',
          'El picaje (las aves se picotean plumas y piel) aparece con alta densidad, exceso de luz, dietas pobres en aminoácidos azufrados, aburrimiento o falta de material para escarbar. Se previene con enriquecimiento ambiental, perchas, nidos, baños de polvo y dietas balanceadas.',
        ],
      },
    ],
    checkpoint: {
      at: 155,
      prompt: 'Un lote libre de jaula sufre picaje creciente. ¿Qué combinación ayuda a prevenirlo?',
      options: [
        'Más luz y más densidad',
        'Enriquecimiento ambiental, menos densidad y dieta con suficiente metionina',
        'Reducir el agua',
        'Quitar las perchas',
      ],
      correctIndex: 1,
      explanation:
        'El picaje se relaciona con estrés, aburrimiento y dietas pobres en aminoácidos azufrados. El enriquecimiento y una densidad adecuada lo reducen.',
    },
    questions: [
      ['¿Cuánto tarda aproximadamente en formarse un huevo?', 'Entre 24 y 26 horas', ['1 hora', '1 semana', '12 días']],
      [
        '¿Qué miden las unidades Haugh?',
        'La calidad de la clara',
        ['El color de la cáscara', 'El tamaño de la yema', 'El grosor de la cáscara en mm'],
      ],
      [
        '¿De qué depende el color de la yema?',
        'De los pigmentos de la dieta',
        ['De la raza del gallo', 'De la edad de la gallina', 'Del color de la cáscara'],
      ],
      [
        '¿Qué es el picaje?',
        'Aves que se picotean plumas y piel entre ellas',
        ['La forma en que las aves comen el grano', 'Una vacuna que se aplica en el ala', 'La muda natural de las plumas'],
      ],
      [
        '¿Cuál de estas es una de las cinco libertades del bienestar animal?',
        'Libertad para expresar su comportamiento normal',
        ['Libertad de producir más huevos', 'Libertad de comer sin límite', 'Libertad de salir del predio'],
      ],
    ],
  }),
]

/** Pregunta final del Barón de la Cresta Hipertrófica. */
export const AVICOLA_BOSS_FINAL = bossFinal(
  'Un galpón de broilers tiene olor fuerte a amoníaco, cama húmeda, diarrea con sangre y lesiones en las patas. ¿Cuál es el origen común y la corrección?',
  'Cama húmeda por mala ventilación o bebederos con fugas: secar la cama, ventilar y controlar la coccidiosis',
  [
    'Falta de luz: aumentar a 24 horas de luz y subir la densidad',
    'Exceso de calcio en la dieta: retirar la conchilla del alimento',
    'Frío excesivo: cerrar todas las ventanas y cortar la ventilación',
  ],
)

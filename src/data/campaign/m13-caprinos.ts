import { campaignModule } from './helpers.ts'

/** Módulo 13 · Producción Caprina y Rumiantes Menores. */
const { submodule, bossFinal } = campaignModule(13)

export const CAPRINOS_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Razas y Sistemas Caprinos de Chile',
    description: 'La cabra criolla, las razas lecheras y de carne, y la crianza trashumante del secano.',
    subboss: { name: 'La Cabra Criolla Trashumante', title: 'Señora de las Veranadas' },
    codexTitle: 'Sistemas de Producción Caprina',
    sections: [
      {
        heading: 'La caprinocultura en Chile',
        body: [
          'La mayor parte de las cabras de Chile está en el secano del Norte Chico, con la región de Coquimbo como principal zona caprina. Predomina la crianza campesina de cabras criollas, rústicas y adaptadas a la escasez de forraje.',
          'Muchos crianceros practican la trashumancia: en verano suben con el rebaño a las veranadas cordilleranas y en invierno vuelven a los valles y al secano costero.',
        ],
      },
      {
        heading: 'Razas',
        body: [
          'Lecheras: Saanen (blanca, la más productiva), Alpina, Toggenburg y Anglo-Nubian (orejas largas y caídas, leche con más grasa). Carne: Boer, de origen sudafricano, con gran desarrollo muscular.',
          'El cruzamiento de cabras criollas con machos de razas lecheras o Boer aumenta la producción, pero los cruzas exigen mejor alimentación y sanidad que la criolla.',
        ],
      },
      {
        heading: 'Ovinos y otros rumiantes menores',
        body: [
          'Los ovinos dominan en la Patagonia (Magallanes, con razas como Corriedale y Merino para lana y carne) y en el centro-sur con razas de carne como Suffolk.',
          'Cabras y ovejas difieren en su conducta alimentaria: la oveja pastorea pasto bajo, mientras que la cabra ramonea hojas y brotes de arbustos, lo que le permite aprovechar matorrales que otras especies no usan.',
        ],
      },
    ],
    checkpoint: {
      at: 120,
      prompt: '¿Qué es la trashumancia en la crianza caprina del Norte Chico?',
      options: [
        'La venta de cabras en ferias',
        'El traslado estacional del rebaño a veranadas cordilleranas',
        'Un tipo de queso',
        'La crianza en galpones cerrados',
      ],
      correctIndex: 1,
      explanation:
        'Los crianceros suben con el rebaño a las veranadas de la cordillera en verano, donde hay forraje, y bajan en invierno.',
    },
    questions: [
      ['¿Qué región concentra la mayor población caprina de Chile?', 'Coquimbo', ['Magallanes', 'Los Lagos', 'Metropolitana']],
      ['¿Cuál es la raza lechera caprina más productiva?', 'Saanen', ['Boer', 'Criolla', 'Suffolk']],
      ['¿Para qué se cría principalmente la raza Boer?', 'Carne', ['Leche', 'Lana', 'Fibra mohair']],
      [
        '¿Qué conducta alimentaria caracteriza a la cabra?',
        'Ramonea hojas y brotes de arbustos',
        ['Solo pastorea pasto bajo', 'Solo come grano', 'Es carnívora'],
      ],
      ['¿Qué raza caprina se reconoce por sus orejas largas y caídas?', 'Anglo-Nubian', ['Saanen', 'Toggenburg', 'Alpina']],
    ],
  }),

  submodule({
    order: 2,
    title: 'Alimentación y Rumia',
    description: 'El rumen, la fibra, la acidosis y cómo alimentar un rebaño en el secano.',
    subboss: { name: 'El Rumen Acidótico', title: 'Tirano del Almidón' },
    codexTitle: 'Nutrición de Rumiantes Menores',
    sections: [
      {
        heading: 'El rumen',
        body: [
          'Los rumiantes tienen un estómago de cuatro compartimentos: rumen, retículo, omaso y abomaso (cuajar, el estómago "verdadero"). En el rumen, bacterias, protozoos y hongos fermentan la fibra y producen ácidos grasos volátiles, la principal fuente de energía del animal.',
          'Los microorganismos también sintetizan proteína microbiana a partir del nitrógeno de la dieta, incluso de fuentes no proteicas como la urea, y vitaminas del complejo B.',
        ],
      },
      {
        heading: 'Fibra y acidosis',
        body: [
          'La fibra estimula la rumia y la saliva, que contiene bicarbonato y amortigua el pH del rumen. Una dieta con mucho grano y poca fibra fermenta rápido, acumula ácido láctico y baja el pH bajo 5,5: es la acidosis ruminal, que causa diarrea, cojeras e incluso la muerte.',
          'Los cambios de dieta deben hacerse de forma gradual, durante una o dos semanas, para que la flora ruminal se adapte.',
        ],
      },
      {
        heading: 'Alimentación en el secano',
        body: [
          'En el secano la disponibilidad de forraje sigue a las lluvias: abundante en invierno-primavera y escasa en verano-otoño. Las estrategias incluyen guardar heno, usar arbustos forrajeros como el atriplex, rastrojos de cultivos y suplementar en los periodos críticos.',
          'Los requerimientos más altos están en el último tercio de la gestación y en la lactancia: una cabra mal alimentada en esos momentos tiene crías débiles y poca leche.',
        ],
      },
    ],
    checkpoint: {
      at: 135,
      prompt:
        'Un criancero cambió de golpe a sus cabras de pastoreo a una dieta con mucha avena grano. Varias tienen diarrea y están decaídas. ¿Qué ocurrió?',
      options: [
        'Deficiencia de calcio',
        'Acidosis ruminal por exceso de grano y cambio brusco',
        'Exceso de fibra',
        'Falta de agua',
      ],
      correctIndex: 1,
      explanation:
        'El grano fermenta rápido, acumula ácido láctico y baja el pH del rumen. El cambio brusco no dejó adaptarse a la flora ruminal.',
    },
    questions: [
      ['¿Cuál es el estómago "verdadero" de los rumiantes?', 'El abomaso (cuajar)', ['El rumen', 'El retículo', 'El omaso']],
      [
        '¿Qué producen los microorganismos del rumen como fuente de energía?',
        'Ácidos grasos volátiles',
        ['Etanol', 'Glucosa pura', 'Metionina sintética'],
      ],
      [
        '¿Qué causa la acidosis ruminal?',
        'Exceso de grano y poca fibra',
        ['Exceso de heno y poco grano', 'Consumo de mucha agua fría', 'Falta de sal en la dieta'],
      ],
      [
        '¿Por qué la fibra protege el rumen?',
        'Estimula la rumia y la saliva, que amortigua el pH',
        [
          'Aporta mucho almidón de rápida fermentación',
          'Elimina las bacterias que producen ácido',
          'Sube la temperatura del rumen',
        ],
      ],
      ['¿Qué arbusto forrajero se usa en el secano para alimentar al ganado?', 'Atriplex', ['Eucalipto', 'Pino', 'Zarzamora']],
    ],
  }),

  submodule({
    order: 3,
    title: 'Reproducción y Manejo del Rebaño',
    description: 'Estacionalidad, efecto macho, gestación, partos y calostro.',
    subboss: { name: 'El Macho Estacional', title: 'Señor del Efecto Macho' },
    codexTitle: 'Reproducción Caprina',
    sections: [
      {
        heading: 'Estacionalidad',
        body: [
          'La cabra es una reproductora estacional de días cortos: su actividad sexual se concentra en otoño, cuando los días se acortan. Por eso la mayoría de los partos ocurre a fines de invierno y en primavera, cuando hay más forraje.',
          'El ciclo estral dura unos 21 días y el celo de 24 a 36 horas; la gestación dura alrededor de 150 días (cinco meses).',
        ],
      },
      {
        heading: 'Efecto macho y manejo',
        body: [
          'Si el macho se mantiene separado de las hembras y luego se reintroduce al comienzo de la temporada, su olor estimula la ovulación y sincroniza los celos: es el efecto macho. También se usan tratamientos hormonales y programas de luz para producir fuera de temporada.',
          'Un macho puede servir a unas 30 a 50 hembras en monta natural. Conviene registrar los encastes para conocer las fechas de parto.',
        ],
      },
      {
        heading: 'Parto y calostro',
        body: [
          'El cabrito debe tomar calostro en sus primeras horas de vida: es su única fuente de anticuerpos, porque la placenta no los transfiere. La capacidad del intestino para absorberlos cae rápidamente después de las primeras 12 a 24 horas.',
          'En lecherías los cabritos se separan y se crían con calostro tratado y sustituto lácteo, una práctica que también ayuda a cortar la transmisión de la artritis encefalitis caprina.',
        ],
      },
    ],
    checkpoint: {
      at: 145,
      prompt: 'Un cabrito nacido hace 30 horas no ha tomado calostro. ¿Cuál es el problema principal?',
      options: [
        'Ninguno: lo puede tomar cuando quiera',
        'Su intestino ya absorbe muy pocos anticuerpos: queda sin defensas',
        'Tendrá exceso de grasa',
        'Crecerá más rápido',
      ],
      correctIndex: 1,
      explanation:
        'La absorción de anticuerpos del calostro cae mucho tras las primeras 12-24 horas: el cabrito queda con baja inmunidad.',
    },
    questions: [
      ['¿Cuánto dura la gestación de la cabra?', 'Alrededor de 150 días', ['Unos 280 días', 'Unos 60 días', 'Unos 21 días']],
      [
        '¿En qué estación se concentra la actividad sexual de la cabra?',
        'Otoño, con días que se acortan',
        ['Verano', 'Primavera, con días largos', 'Todo el año por igual'],
      ],
      [
        '¿Qué es el efecto macho?',
        'La reintroducción del macho estimula y sincroniza los celos',
        [
          'Las peleas entre machos que definen la jerarquía',
          'El aumento de peso de los machos antes del encaste',
          'El rechazo de las hembras a un macho desconocido',
        ],
      ],
      [
        '¿Por qué el calostro es vital para el cabrito?',
        'Es su única fuente de anticuerpos al nacer',
        ['Porque tiene menos grasa que la leche', 'Porque reemplaza el agua', 'Porque evita la acidosis'],
      ],
      [
        '¿Cuánto dura aproximadamente el ciclo estral de la cabra?',
        'Unos 21 días',
        ['Unos 5 días', 'Unos 60 días', 'Unos 150 días'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Sanidad Caprina',
    description: 'Parásitos gastrointestinales, FAMACHA, CAE, linfadenitis caseosa, brucelosis y mastitis.',
    subboss: { name: 'El Vampiro del Cuajar', title: 'Haemonchus Insaciable' },
    codexTitle: 'Sanidad de Cabras y Ovejas',
    sections: [
      {
        heading: 'Parásitos gastrointestinales',
        body: [
          'Haemonchus contortus es un nematodo que vive en el abomaso y se alimenta de sangre: causa anemia, edema submandibular ("papada de botella") y muerte, sobre todo en primaveras húmedas.',
          'El método FAMACHA compara el color de la mucosa del ojo con una tarjeta: solo se desparasita a los animales pálidos. Así se reduce el uso de antiparasitarios y se frena la resistencia, que ya es un problema serio.',
        ],
      },
      {
        heading: 'Enfermedades infecciosas',
        body: [
          'La artritis encefalitis caprina (CAE) es un lentivirus que se transmite sobre todo por el calostro y la leche: causa artritis, mastitis indurada y encefalitis en cabritos. No tiene cura; se controla con diagnóstico y separación de crías.',
          'La linfadenitis caseosa (Corynebacterium pseudotuberculosis) forma abscesos en los ganglios con pus espeso; se contagia por heridas de esquila o descorne y por el pus de abscesos que se rompen.',
          'La brucelosis caprina (Brucella melitensis) causa abortos y es una zoonosis grave, transmitida a las personas por leche y quesos sin pasteurizar: es de denuncia obligatoria al SAG.',
        ],
      },
      {
        heading: 'Mastitis y manejo sanitario',
        body: [
          'La mastitis es la inflamación de la ubre, casi siempre bacteriana. El California Mastitis Test (CMT) detecta mastitis subclínica en la leche. La higiene de la ordeña y el sellado de pezones la previenen.',
          'Un calendario sanitario incluye vacunación contra clostridiales (enterotoxemia), control de parásitos con FAMACHA, cuarentena de animales nuevos y despezuñe periódico.',
        ],
      },
    ],
    checkpoint: {
      at: 155,
      prompt:
        'Varias cabras tienen la mucosa del ojo muy pálida y edema bajo la mandíbula en una primavera húmeda. ¿Qué es lo más probable?',
      options: ['Linfadenitis caseosa', 'Haemonchosis (Haemonchus contortus)', 'Acidosis ruminal', 'Mastitis'],
      correctIndex: 1,
      explanation:
        'Mucosas pálidas (anemia) y "papada de botella" son típicas de Haemonchus, que se alimenta de sangre en el abomaso.',
    },
    questions: [
      [
        '¿Qué evalúa el método FAMACHA?',
        'El color de la mucosa del ojo para detectar anemia',
        [
          'El peso vivo del animal para dosificar',
          'La calidad de la leche por su color',
          'El largo de la pezuña para despezuñar',
        ],
      ],
      [
        '¿Cómo se transmite principalmente la artritis encefalitis caprina (CAE)?',
        'Por calostro y leche',
        ['Por picadura de mosquito', 'Por el agua de riego', 'Por el viento'],
      ],
      [
        '¿Qué produce la linfadenitis caseosa?',
        'Abscesos en los ganglios con pus espeso',
        ['Clorosis en las mucosas', 'Diarrea con sangre en cabritos', 'Ceguera y caída del pelo'],
      ],
      [
        '¿Por qué la brucelosis caprina es tan importante en salud pública?',
        'Es una zoonosis transmitida por leche y quesos sin pasteurizar',
        [
          'Solo afecta a las aves y no a los rumiantes',
          'No afecta a las personas ni al comercio',
          'Se cura sola en pocos días sin tratamiento',
        ],
      ],
      [
        '¿Qué test detecta mastitis subclínica en la leche?',
        'California Mastitis Test (CMT)',
        ['Método FAMACHA', 'Test de yodo-almidón', 'Unidades Haugh'],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Leche, Quesos y Productos',
    description: 'Composición de la leche de cabra, higiene de ordeña, pasteurización y elaboración de quesos.',
    subboss: { name: 'El Cuajo Rebelde', title: 'Señor del Queso sin Pasteurizar' },
    codexTitle: 'Leche y Quesos de Cabra',
    sections: [
      {
        heading: 'La leche de cabra',
        body: [
          'Tiene glóbulos de grasa más pequeños que la de vaca y una proporción mayor de ácidos grasos de cadena media (caproico, caprílico y cáprico), responsables de su sabor característico.',
          'Las cabras transforman casi todo el betacaroteno en vitamina A: por eso su leche y sus quesos son más blancos que los de vaca. Una cabra criolla produce poca leche en lactancias cortas; una Saanen bien alimentada puede producir varios litros diarios.',
        ],
      },
      {
        heading: 'Higiene y pasteurización',
        body: [
          'La calidad se mide por el recuento de células somáticas (indicador de mastitis) y el recuento bacteriano. Una ordeña higiénica y el enfriamiento rápido de la leche son esenciales.',
          'La pasteurización (por ejemplo, 72 °C por 15 segundos o 63 °C por 30 minutos) elimina patógenos como Brucella y Listeria. El queso de leche cruda es un riesgo real de brucelosis y listeriosis.',
        ],
      },
      {
        heading: 'Elaboración de quesos',
        body: [
          'El queso se obtiene coagulando la caseína con cuajo (quimosina) o con acidez; luego se corta la cuajada, se desuera, se sala, se moldea, se prensa y, en algunos casos, se madura.',
          'El queso de cabra fresco es tradicional en el Norte Chico. La formalización de queserías campesinas con resolución sanitaria y leche pasteurizada abre mercados formales y protege la salud de los consumidores.',
        ],
      },
    ],
    checkpoint: {
      at: 160,
      prompt:
        'Una quesería campesina quiere vender quesos en el comercio formal. ¿Qué cambio es indispensable para la seguridad alimentaria?',
      options: [
        'Usar leche cruda más fresca',
        'Pasteurizar la leche y contar con resolución sanitaria',
        'Agregar más sal',
        'Madurar el queso al sol',
      ],
      correctIndex: 1,
      explanation:
        'La pasteurización elimina patógenos como Brucella y Listeria, y la resolución sanitaria es requisito para vender en el comercio formal.',
    },
    questions: [
      [
        '¿Por qué los quesos de cabra son más blancos que los de vaca?',
        'La cabra transforma el betacaroteno en vitamina A',
        [
          'Porque la leche se blanquea con cloro',
          'Porque la leche de cabra tiene más grasa',
          'Porque se elaboran solo con suero',
        ],
      ],
      [
        '¿Qué indica un recuento de células somáticas alto en la leche?',
        'Mastitis',
        ['Buena higiene', 'Exceso de grasa', 'Leche pasteurizada'],
      ],
      ['¿Qué enzima del cuajo coagula la caseína?', 'Quimosina', ['Amilasa', 'Ureasa', 'Lipasa']],
      [
        '¿Qué patógenos elimina la pasteurización?',
        'Brucella y Listeria, entre otros',
        ['Ninguno', 'Solo virus de plantas', 'Solo levaduras del pan'],
      ],
      [
        '¿Qué ácidos grasos dan el sabor característico a la leche de cabra?',
        'Caproico, caprílico y cáprico',
        ['Oleico y linoleico solamente', 'Ácido láctico', 'Ácido cítrico'],
      ],
    ],
  }),
]

/** Pregunta final del Macho Cabrío del Rastrojo Salino. */
export const CAPRINOS_BOSS_FINAL = bossFinal(
  'En un rebaño de secano aparecen abortos en el último tercio de gestación y un criancero con fiebre ondulante que consume queso de leche cruda. ¿Qué se sospecha y qué corresponde?',
  'Brucelosis caprina: denunciar al SAG, derivar a la persona a salud y pasteurizar la leche',
  [
    'Haemonchosis: desparasitar a todo el rebaño de inmediato',
    'Acidosis ruminal: retirar el grano y dar más heno',
    'Mastitis: aplicar CMT y seguir vendiendo el queso',
  ],
)

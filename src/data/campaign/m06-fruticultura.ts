import { campaignModule } from './helpers.ts'

/** Módulo 6 · Fruticultura General. */
const { submodule, bossFinal } = campaignModule(6)

export const FRUTICULTURA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Portainjertos e Injertación',
    description: 'Por qué los frutales se injertan, cómo se elige el portainjerto y qué falla cuando la unión es incompatible.',
    subboss: { name: 'El Callo Desfasado', title: 'Quebrador de la Unión' },
    codexTitle: 'Portainjertos e Injertos',
    sections: [
      {
        heading: 'Por qué injertar',
        body: [
          'La variedad (copa) se propaga sobre un portainjerto para conservar sus características: de semilla saldría una planta distinta, porque la mayoría de los frutales son heterocigotos.',
          'El portainjerto controla el vigor y el tamaño del árbol, la precocidad, la tolerancia a suelos (asfixia, caliza, salinidad) y la resistencia a plagas y enfermedades del suelo como nematodos y Phytophthora.',
        ],
      },
      {
        heading: 'Portainjertos clásicos',
        body: [
          'Manzano: la serie Malling, como el M9 (enanizante, exige soporte y suelos buenos) y el MM106 o MM111 (más vigorosos). Cerezo: Gisela 6 y Gisela 12 (enanizantes y precoces), Colt, Maxma 14 o el franco Mazzard. Vid: portainjertos americanos resistentes a filoxera, como 1103 Paulsen o Freedom.',
          'En Chile, gran parte de las vides se cultiva sobre pie franco porque el país está libre de filoxera; aun así se usan portainjertos contra nematodos, salinidad o falta de vigor.',
        ],
      },
      {
        heading: 'El injerto y su compatibilidad',
        body: [
          'Para que prenda, el cambium de ambas partes debe quedar en contacto. Las técnicas más comunes son el injerto de yema (ojo vivo o dormido, chip budding) y los de púa (hendidura, inglés).',
          'La incompatibilidad aparece cuando las especies están poco emparentadas: la unión es débil, con engrosamiento o necrosis, el árbol amarillea y puede quebrarse. Se evita con un interinjerto compatible, como en el peral sobre membrillero.',
          'El injerto también transmite virus: por eso se usa material certificado.',
        ],
      },
    ],
    checkpoint: {
      at: 120,
      prompt:
        'Se quiere un huerto de cerezos peatonal, de alta densidad y entrada rápida en producción. ¿Qué portainjerto conviene?',
      options: ['Mazzard franco', 'Gisela 6', 'Pie franco de semilla', 'Membrillero'],
      correctIndex: 1,
      explanation:
        'Gisela 6 reduce el vigor y adelanta la producción, ideal para alta densidad. El Mazzard da árboles grandes y tardíos.',
    },
    questions: [
      [
        '¿Por qué no se propagan los frutales por semilla?',
        'La planta hija no conserva las características de la variedad',
        [
          'Las semillas de frutales casi nunca germinan',
          'Los árboles de semilla nunca llegan a dar fruta',
          'La ley prohíbe plantar frutales de semilla',
        ],
      ],
      ['¿Qué portainjerto de manzano es enanizante?', 'M9', ['MM111', 'Franco de semilla', 'Mazzard']],
      [
        '¿Qué tejido debe quedar en contacto para que prenda el injerto?',
        'El cambium',
        ['La médula', 'La corteza muerta', 'El xilema central'],
      ],
      [
        '¿Qué se usa para superar la incompatibilidad del peral sobre membrillero?',
        'Un interinjerto compatible',
        ['Más fertilizante', 'Un portainjerto de cerezo', 'Poda severa'],
      ],
      [
        '¿Contra qué plaga se desarrollaron los portainjertos americanos de vid?',
        'Filoxera',
        ['Mosca de la fruta', 'Polilla del racimo', 'Oídio'],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'Sistemas de Conducción y Densidad',
    description: 'Vaso, eje central, ejes múltiples y parronales: cómo la forma del árbol administra la luz.',
    subboss: { name: 'La Lamburda Ciega', title: 'Señor de la Sombra Interior' },
    codexTitle: 'Conducción y Arquitectura del Huerto',
    sections: [
      {
        heading: 'La luz es la cosecha',
        body: [
          'Un huerto produce según la luz que intercepta. Los sistemas de conducción buscan cubrir rápido el espacio, iluminar todo el árbol y facilitar la cosecha y la aplicación de productos.',
          'La sombra interior baja la inducción floral, el color y el calibre de la fruta. Bajo un 30 % de luz plena las yemas pierden fertilidad.',
        ],
      },
      {
        heading: 'Sistemas',
        body: [
          'Vaso abierto: tres a cinco ramas desde un tronco corto, con el centro despejado; tradicional en carozos. Eje central: un líder vertical con ramas laterales cortas que decrecen hacia arriba; base de los huertos de manzano en alta densidad.',
          'Sistemas en pared o de ejes múltiples (KGB, UFO, Tall Spindle, ejes en V) forman muros frutales estrechos, fáciles de cosechar y aptos para la mecanización.',
          'La vid se conduce en espaldera (vino) o parronal español (uva de mesa), donde el follaje forma un techo que protege los racimos.',
        ],
      },
      {
        heading: 'Densidad y vigor',
        body: [
          'Las altas densidades (más de 2.000 árboles/ha en manzano) necesitan portainjertos enanizantes, soporte, riego tecnificado y mano de obra calificada, pero producen antes y con mejor calidad.',
          'La orientación norte-sur de las hileras reparte mejor la luz entre ambas caras en Chile. La distancia entre hileras debe ser mayor que la altura del árbol para evitar el sombreamiento mutuo.',
        ],
      },
    ],
    checkpoint: {
      at: 130,
      prompt: 'Las hileras tienen 3,5 m de altura y están a 2,5 m entre sí. ¿Qué problema es esperable?',
      options: [
        'Exceso de luz en la base',
        'Sombreamiento de la parte baja y pérdida de calidad',
        'Heladas por exceso de ventilación',
        'Mejor color en toda la copa',
      ],
      correctIndex: 1,
      explanation:
        'Si la altura supera la distancia entre hileras, los árboles se sombrean entre sí: la base pierde inducción, color y calibre.',
    },
    questions: [
      [
        '¿Qué sistema deja el centro del árbol despejado con 3 a 5 ramas?',
        'Vaso abierto',
        ['Eje central', 'Espaldera', 'Tall Spindle'],
      ],
      [
        '¿Qué ocurre con la fruta en zonas sombreadas del árbol?',
        'Pierde color, calibre e inducción floral',
        ['Madura antes y con más azúcar', 'Gana calibre por la menor temperatura', 'Queda protegida de plagas y del sol'],
      ],
      [
        '¿Qué orientación de hileras reparte mejor la luz en Chile?',
        'Norte-sur',
        ['Este-oeste', 'Diagonal noreste', 'No influye'],
      ],
      [
        '¿Qué exigen los huertos de alta densidad?',
        'Portainjertos enanizantes y soporte',
        ['Portainjertos vigorosos sin soporte', 'Riego por surco y poca poda', 'Pie franco y poda solo invernal'],
      ],
      [
        '¿Qué sistema de conducción es típico de la uva de mesa en Chile?',
        'Parronal español',
        ['Vaso', 'Eje central', 'Tall Spindle'],
      ],
    ],
  }),

  submodule({
    order: 3,
    title: 'Poda y Equilibrio del Árbol',
    description: 'Poda de formación, producción y verano: cómo equilibrar crecimiento y fruta sin desbocar el vigor.',
    subboss: { name: 'La Tijera Descompensada', title: 'Despertadora de Chupones' },
    codexTitle: 'Poda y Balance Vegetativo-Reproductivo',
    sections: [
      {
        heading: 'Principios de la poda',
        body: [
          'La poda invernal estimula el vigor: al quitar yemas, la reserva de la raíz se reparte entre menos puntos de crecimiento. La poda de verano, en cambio, frena el vigor y mejora la luz sobre la fruta.',
          'Despunte (rebaje) estimula brotes cerca del corte; raleo (eliminar una rama completa desde su base) abre la copa sin provocar rebrote excesivo.',
        ],
      },
      {
        heading: 'Dónde fructifica cada especie',
        body: [
          'Antes de podar hay que saber dónde está la fruta: el manzano y el peral fructifican sobre dardos y lamburdas de madera de dos años o más; el durazno, en ramillas mixtas del año anterior; el cerezo, en dardos (ramilletes de mayo) y en la base de las ramillas de un año; la vid, en brotes nacidos de cargadores o pitones de madera de un año.',
          'Una poda que elimina esa madera elimina la cosecha.',
        ],
      },
      {
        heading: 'Equilibrio y chupones',
        body: [
          'Los chupones son brotes vigorosos y verticales que consumen carbohidratos, sombrean y rara vez fructifican. Aparecen tras podas fuertes, exceso de N o ramas arqueadas.',
          'Un árbol equilibrado tiene crecimiento moderado de brotes y fruta suficiente. Exceso de vigor: poca fruta y mucha sombra. Poco vigor: fruta chica y envejecimiento de la madera.',
          'Herramientas para frenar el vigor: poda de verano, inclinar ramas, anillado, portainjertos enanizantes, riego deficitario y reguladores como la prohexadiona-calcio.',
        ],
      },
    ],
    checkpoint: {
      at: 145,
      prompt: 'Un manzano joven tiene exceso de vigor y casi no florece. ¿Qué acción ayuda a equilibrarlo?',
      options: [
        'Poda invernal fuerte de rebaje',
        'Inclinar ramas y hacer poda de verano',
        'Aplicar más nitrógeno',
        'Regar más en primavera',
      ],
      correctIndex: 1,
      explanation:
        'La poda invernal fuerte estimularía más vigor. Inclinar ramas y podar en verano frena el crecimiento y favorece la inducción floral.',
    },
    questions: [
      [
        '¿Qué efecto tiene la poda invernal fuerte?',
        'Estimula el vigor',
        ['Frena el crecimiento', 'Adelanta la cosecha', 'Elimina plagas'],
      ],
      [
        '¿Dónde fructifica principalmente el manzano?',
        'En dardos y lamburdas de madera de dos años o más',
        [
          'En chupones vigorosos y verticales del año',
          'Solo en las puntas de los brotes del año',
          'En yemas del tronco principal y de su base',
        ],
      ],
      [
        '¿Qué es un chupón?',
        'Un brote vigoroso y vertical que rara vez fructifica',
        [
          'Un brote corto que forma flores en su punta',
          'Una rama horizontal cargada de dardos',
          'Un brote de raíz que nace lejos del tronco',
        ],
      ],
      [
        '¿Qué diferencia al corte de raleo del despunte?',
        'El raleo elimina la rama desde su base sin estimular rebrote local',
        [
          'El raleo corta solo la punta y estimula brotes laterales',
          'El despunte elimina la rama completa desde su base',
          'Ambos cortes estimulan el mismo rebrote junto al corte',
        ],
      ],
      [
        '¿Qué regulador se usa para frenar el crecimiento de brotes?',
        'Prohexadiona-calcio',
        ['Ácido giberélico', 'Ácido indolbutírico', 'Citoquinina'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Polinización, Cuaja y Raleo',
    description: 'Polinizantes compatibles, abejas, cuaja y raleo de frutos para lograr calibre y evitar el añerismo.',
    subboss: { name: 'El Fruto Abortivo', title: 'Enjambre de la Cuaja Fallida' },
    codexTitle: 'Polinización, Cuaja y Raleo',
    sections: [
      {
        heading: 'Autoincompatibilidad y polinizantes',
        body: [
          'Muchas variedades de manzano, peral y cerezo son autoincompatibles: su polen no fecunda sus propias flores. Necesitan una variedad polinizante compatible, que florezca al mismo tiempo, intercalada en el huerto.',
          'En cerezo la compatibilidad depende de los alelos S: variedades con el mismo grupo S no se polinizan entre sí. Existen variedades autofértiles, como Lapins o Santina, que simplifican el diseño.',
        ],
      },
      {
        heading: 'Abejas y cuaja',
        body: [
          'Las abejas melíferas son el principal polinizador; se recomiendan del orden de 6 a 10 colmenas fuertes por hectárea en cerezo o manzano, ubicadas al inicio de la floración. Los abejorros (Bombus) trabajan con menos temperatura.',
          'La cuaja es el paso de flor a fruto en crecimiento. El clima frío y lluvioso en floración, las heladas y la falta de reservas reducen la cuaja; el periodo efectivo de polinización depende de la vida útil del óvulo.',
        ],
      },
      {
        heading: 'Raleo',
        body: [
          'Un árbol con demasiada fruta produce fruta chica, de menor azúcar y color, y puede no florecer el año siguiente (añerismo). El raleo ajusta la carga a la capacidad del árbol.',
          'Puede ser de flores o de frutos, manual o químico (ANA, BA o metamitrón en manzano). Mientras más temprano, mayor es el efecto sobre el calibre final, porque la división celular del fruto ocurre en las primeras semanas.',
        ],
      },
    ],
    checkpoint: {
      at: 160,
      prompt: 'Un huerto nuevo de cerezos se plantó solo con una variedad autoincompatible. ¿Qué se espera?',
      options: [
        'Cuaja normal gracias al viento',
        'Muy baja cuaja por falta de polinizante compatible',
        'Frutos más grandes',
        'Floración más temprana',
      ],
      correctIndex: 1,
      explanation:
        'Sin una variedad compatible que florezca a la vez, el polen disponible no fecunda los óvulos y la cuaja es muy baja.',
    },
    questions: [
      [
        '¿Qué significa que una variedad sea autoincompatible?',
        'Su propio polen no fecunda sus flores',
        ['No produce polen', 'Florece dos veces al año', 'No necesita abejas'],
      ],
      [
        '¿Qué determina la compatibilidad de polinización en cerezo?',
        'Los alelos S',
        ['El portainjerto', 'La altura del árbol', 'El color del fruto'],
      ],
      ['¿Qué variedad de cerezo es autofértil?', 'Lapins', ['Bing', 'Rainier', 'Van']],
      [
        '¿Por qué conviene ralear temprano?',
        'La división celular del fruto ocurre en las primeras semanas',
        [
          'Así todos los frutos maduran el mismo día',
          'Las abejas visitan más los árboles raleados',
          'El raleo temprano protege de las heladas',
        ],
      ],
      [
        '¿Qué consecuencia tiene una carga frutal excesiva?',
        'Fruta chica y añerismo',
        ['Fruta más dulce', 'Árbol más vigoroso al año siguiente', 'Mayor calibre'],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Madurez, Cosecha y Postcosecha',
    description: 'Índices de madurez, frutos climatéricos, cadena de frío y almacenaje en atmósfera controlada.',
    subboss: { name: 'La Yema Invernante', title: 'Guardiana de la Cámara de Frío' },
    codexTitle: 'Madurez y Postcosecha',
    sections: [
      {
        heading: 'Índices de cosecha',
        body: [
          'Se cosecha según índices objetivos: sólidos solubles (°Brix, con refractómetro), firmeza (presionómetro, en lb o kg), color de fondo y de cubrimiento, acidez titulable, test de almidón con yodo en manzana y materia seca en palta.',
          'El momento de cosecha define el potencial de guarda: una manzana cosechada muy madura no aguanta meses en frío; una muy inmadura nunca desarrolla sabor.',
        ],
      },
      {
        heading: 'Climatéricos y no climatéricos',
        body: [
          'Los frutos climatéricos (manzana, pera, kiwi, palta, durazno, tomate) tienen un alza de respiración y etileno al madurar: pueden cosecharse fisiológicamente maduros y terminar de madurar después. La palta incluso solo madura fuera del árbol.',
          'Los no climatéricos (cereza, uva, cítricos, frutilla, frambuesa) no siguen madurando tras la cosecha: hay que cosecharlos en su punto.',
        ],
      },
      {
        heading: 'Cadena de frío',
        body: [
          'Cada hora a temperatura de campo acorta la vida de la fruta. El pre-enfriado rápido (hidrocooling, aire forzado) baja la temperatura en horas; luego la fruta debe mantenerse en frío sin quiebres hasta el consumidor.',
          'La atmósfera controlada (bajo O₂ y alto CO₂) reduce la respiración y prolonga la guarda de manzanas por meses. El 1-MCP bloquea la acción del etileno.',
          'Algunas especies sufren daño por frío bajo cierta temperatura (palta, tomate, plátano, cítricos), con manchas y pardeamiento: no todas se guardan a 0 °C.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: '¿Cuál de estas frutas no sigue madurando después de cosechada?',
      options: ['Palta', 'Kiwi', 'Cereza', 'Pera'],
      correctIndex: 2,
      explanation:
        'La cereza es no climatérica: no aumenta su azúcar ni su color tras la cosecha, por eso se cosecha en su punto óptimo.',
    },
    questions: [
      ['¿Qué mide el refractómetro?', 'Sólidos solubles (°Brix)', ['Firmeza', 'Color de fondo', 'Materia seca']],
      ['¿Qué índice de madurez se usa en palta?', 'Materia seca', ['Test de almidón', 'Grados Brix', 'Color de cubrimiento']],
      [
        '¿Qué caracteriza a un fruto climatérico?',
        'Alza de respiración y etileno al madurar',
        ['No madura tras la cosecha', 'No produce etileno', 'Solo se cosecha maduro'],
      ],
      [
        '¿Qué hace la atmósfera controlada?',
        'Baja O₂ y sube CO₂ para reducir la respiración',
        [
          'Sube O₂ y baja CO₂ para acelerar la maduración',
          'Agrega etileno para uniformar el color',
          'Sube la temperatura para evitar el daño por frío',
        ],
      ],
      ['¿Qué fruta sufre daño por frío si se guarda a 0 °C?', 'Palta', ['Manzana', 'Cereza', 'Uva']],
    ],
  }),
]

/** Pregunta final del Patriarca del Canopio Desbocado. */
export const FRUTICULTURA_BOSS_FINAL = bossFinal(
  'Un huerto de manzanos en eje central tiene brotes de 1,2 m, mucha sombra interior, poca flor y fruta sin color. ¿Qué combinación de manejo corresponde?',
  'Poda de verano y raleo de ramas, inclinar ramas y reducir el nitrógeno',
  [
    'Poda invernal fuerte de rebaje y más nitrógeno',
    'Aumentar el riego y aplicar giberelinas',
    'Cambiar a vaso abierto con poda invernal severa',
  ],
)

import { campaignModule } from './helpers.ts'

/** Módulo 2 · Fertilidad y Nutrición Vegetal. */
const { submodule, bossFinal } = campaignModule(2)

export const FERTILIDAD_SUBMODULES = [
  submodule({
    order: 1,
    title: 'CIC y Coloides del Suelo',
    description: 'Arcillas, humus y la capacidad de intercambio catiónico: la despensa que retiene los nutrientes.',
    subboss: { name: 'Coloso de Adsorción', title: 'Devorador de Cationes' },
    codexTitle: 'Capacidad de Intercambio Catiónico',
    sections: [
      {
        heading: 'Los coloides: superficie con carga',
        body: [
          'Las arcillas y el humus son coloides: partículas diminutas, de enorme superficie específica y con carga eléctrica, casi siempre negativa. Sobre esa carga se adsorben cationes como Ca²⁺, Mg²⁺, K⁺, Na⁺, NH₄⁺, H⁺ y Al³⁺.',
          'La carga puede ser permanente, por sustitución isomórfica dentro de la red de la arcilla (montmorillonita, vermiculita), o variable, dependiente del pH, como en el humus, los óxidos y las arcillas alofánicas de los Trumaos.',
        ],
      },
      {
        heading: 'La CIC y la saturación de bases',
        body: [
          'La CIC es la cantidad total de cationes que el suelo puede retener e intercambiar, expresada en cmol(+)/kg. Un suelo arenoso pobre en materia orgánica puede tener menos de 5; uno arcilloso o rico en humus, más de 25. El humus aporta entre 150 y 300 cmol(+)/kg, la caolinita apenas 3 a 15.',
          'La saturación de bases es el porcentaje de la CIC ocupado por Ca, Mg, K y Na. Una saturación alta indica un suelo poco ácido y bien provisto; una baja indica que H⁺ y Al³⁺ dominan el complejo de intercambio.',
          'En un suelo agrícola equilibrado el Ca suele ocupar 60-80 % de la CIC, el Mg 10-20 % y el K 2-6 %.',
        ],
      },
      {
        heading: 'Por qué importa en el manejo',
        body: [
          'Una CIC baja significa poca "memoria" de nutrientes: conviene fertilizar en dosis fraccionadas, porque el exceso se pierde por lixiviación. Una CIC alta amortigua cambios de pH y retiene mejor el potasio y el amonio.',
          'Los aniones como el nitrato (NO₃⁻) no se retienen en la CIC y se mueven con el agua; el fosfato, en cambio, se fija químicamente a óxidos de Fe y Al o al calcio.',
          'Aumentar la materia orgánica es la forma más efectiva de subir la CIC de un suelo en el mediano plazo.',
        ],
      },
    ],
    checkpoint: {
      at: 110,
      prompt: 'Un suelo arenoso tiene CIC = 4 cmol(+)/kg. ¿Qué estrategia de fertilización potásica conviene?',
      options: [
        'Una sola dosis alta a la siembra',
        'Dosis fraccionadas durante la temporada',
        'No fertilizar: el K nunca se pierde',
        'Aplicar solo en invierno',
      ],
      correctIndex: 1,
      explanation:
        'Con poca CIC el suelo retiene poco K⁺: una dosis grande se lixivia. Fraccionar ajusta la oferta a la demanda del cultivo.',
    },
    questions: [
      ['¿En qué unidad se expresa la CIC?', 'cmol(+)/kg', ['mg/L', 'dS/m', 'g/cm³']],
      ['¿Qué coloide tiene la CIC más alta?', 'El humus', ['La caolinita', 'La arena de cuarzo', 'El limo']],
      [
        '¿Qué es la saturación de bases?',
        'El porcentaje de la CIC ocupado por Ca, Mg, K y Na',
        [
          'El porcentaje de la CIC ocupado por H y Al',
          'La cantidad de sales solubles del extracto',
          'La proporción de arcilla respecto de la arena',
        ],
      ],
      [
        '¿Por qué el nitrato se lixivia con facilidad?',
        'Es un anión y no lo retiene la CIC',
        ['Se fija a las arcillas', 'Es insoluble en agua', 'Lo absorben los óxidos de hierro'],
      ],
      [
        '¿De qué depende la carga variable de los coloides?',
        'Del pH del suelo',
        ['De la temperatura', 'Del tamaño de la arena', 'De la profundidad de la napa'],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'pH, Encalado y Disponibilidad',
    description: 'La acidez del suelo, el aluminio tóxico y cómo el pH abre o cierra la puerta a cada nutriente.',
    subboss: { name: 'Alquimista Acidófilo', title: 'Señor del Aluminio Tóxico' },
    codexTitle: 'pH del Suelo y Encalado',
    sections: [
      {
        heading: 'El pH y la disponibilidad de nutrientes',
        body: [
          'El pH es el logaritmo negativo de la actividad de H⁺: un suelo a pH 5 tiene diez veces más acidez activa que uno a pH 6. La mayoría de los cultivos rinde mejor entre pH 6,0 y 7,0, donde la disponibilidad conjunta de nutrientes es mayor.',
          'A pH ácido aumentan la solubilidad del Al, Mn y Fe (con riesgo de toxicidad) y baja la de P, Ca, Mg y Mo. A pH alcalino caen el Fe, Mn, Zn, Cu y B, y el P precipita como fosfatos de calcio.',
        ],
      },
      {
        heading: 'Acidez y aluminio en los suelos del sur',
        body: [
          'Las lluvias abundantes lixivian las bases y acidifican el suelo, proceso que acentúan los fertilizantes amoniacales. Bajo pH 5,5 aparece Al³⁺ intercambiable, que daña el ápice de la raíz y frena su crecimiento.',
          'El indicador clave es la saturación de aluminio: Al intercambiable dividido por la suma de bases más Al. Sobre 5-10 % ya afecta a especies sensibles como alfalfa y cebada; el trigo y la avena son algo más tolerantes.',
          'En Chile, los Andisoles (Trumaos) y Ultisoles (rojo arcillosos) de La Araucanía y Los Lagos son los que más requieren corrección de acidez.',
        ],
      },
      {
        heading: 'Encalado',
        body: [
          'La cal (carbonato de calcio) neutraliza la acidez: el carbonato consume H⁺ y el calcio desplaza al aluminio del complejo de intercambio. La dolomita aporta además magnesio.',
          'La eficacia depende del poder de neutralización (equivalente CaCO₃) y de la finura: las partículas finas reaccionan antes. La cal se mueve poco en el perfil, por lo que debe incorporarse o aplicarse con anticipación al cultivo.',
          'El yeso (sulfato de calcio) no corrige el pH, pero aporta calcio en profundidad y reduce la toxicidad de aluminio en el subsuelo.',
        ],
      },
    ],
    checkpoint: {
      at: 135,
      prompt: 'Un suelo de pH 5,1 tiene 18 % de saturación de aluminio y se sembrará alfalfa. ¿Qué corresponde?',
      options: [
        'Aplicar yeso para subir el pH',
        'Encalar con anticipación e incorporar la cal',
        'Aplicar urea para neutralizar el Al',
        'Sembrar sin corrección: la alfalfa tolera el Al',
      ],
      correctIndex: 1,
      explanation:
        'La alfalfa es muy sensible al Al. La cal sube el pH y desplaza el Al³⁺; como se mueve poco, conviene incorporarla antes de sembrar.',
    },
    questions: [
      ['¿Cuánta más acidez activa tiene un suelo a pH 5 que uno a pH 6?', '10 veces más', ['El doble', 'La mitad', 'Es igual']],
      ['¿Qué elemento se vuelve tóxico bajo pH 5,5?', 'Aluminio', ['Calcio', 'Molibdeno', 'Potasio']],
      ['¿Qué aporta la dolomita además de calcio?', 'Magnesio', ['Azufre', 'Nitrógeno', 'Fósforo']],
      [
        '¿Qué efecto tiene el yeso agrícola sobre el pH?',
        'No lo corrige, pero aporta Ca en profundidad',
        ['Lo sube igual que la cal', 'Lo baja fuertemente', 'Lo vuelve alcalino en una semana'],
      ],
      ['¿Qué micronutriente se vuelve menos disponible a pH alcalino?', 'Hierro', ['Molibdeno', 'Cloro', 'Aluminio']],
    ],
  }),

  submodule({
    order: 3,
    title: 'Nitrógeno, Fósforo y Potasio',
    description: 'Los tres macronutrientes primarios: su ciclo en el suelo, sus pérdidas y cómo los usa la planta.',
    subboss: { name: 'Hidra del Nitrato Lixiviado', title: 'Fugitiva del Perfil' },
    codexTitle: 'Macronutrientes Primarios',
    sections: [
      {
        heading: 'Nitrógeno: el más dinámico',
        body: [
          'La planta absorbe N como nitrato (NO₃⁻) y amonio (NH₄⁺). En el suelo, la materia orgánica se mineraliza a amonio y las bacterias nitrificantes lo oxidan a nitrato, que es móvil.',
          'Las pérdidas principales son la lixiviación de nitratos, la volatilización de amoníaco (urea aplicada en superficie sobre suelo húmedo y caluroso o alcalino) y la desnitrificación en suelos saturados, que libera N₂ y N₂O.',
          'El N es móvil dentro de la planta: su deficiencia produce clorosis primero en las hojas viejas.',
        ],
      },
      {
        heading: 'Fósforo: el más inmóvil',
        body: [
          'El fósforo se absorbe como ortofosfato (H₂PO₄⁻ y HPO₄²⁻). Se mueve muy poco en el suelo: llega a la raíz por difusión, a milímetros de distancia, por lo que la localización del fertilizante y las micorrizas son decisivas.',
          'En suelos ácidos se fija a óxidos de Fe y Al; en los Andisoles la alofana retiene fosfato con mucha fuerza, de modo que exigen dosis altas. En suelos calcáreos precipita como fosfato de calcio.',
          'Su deficiencia retrasa el crecimiento y puede dar tonos púrpura en hojas por acumulación de antocianinas.',
        ],
      },
      {
        heading: 'Potasio: el regulador',
        body: [
          'El K⁺ regula la apertura de estomas, la presión de turgencia, la activación de enzimas y el transporte de azúcares hacia frutos. Se asocia al calibre, color, firmeza y azúcar de la fruta.',
          'Su deficiencia se ve como necrosis en el borde de las hojas viejas (quemado marginal), porque es móvil en la planta.',
          'El cloruro de potasio (muriato) es la fuente más barata, pero el sulfato de potasio es preferible en cultivos sensibles al cloro, como frambuesa, palto o tabaco.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: 'Se aplicó urea en superficie sobre un suelo húmedo un día caluroso y no llovió. ¿Qué pérdida es más probable?',
      options: ['Lixiviación de nitratos', 'Volatilización de amoníaco', 'Fijación del N por la alofana', 'Desnitrificación'],
      correctIndex: 1,
      explanation:
        'La ureasa hidroliza la urea a amonio y, en superficie con calor, parte se pierde como NH₃ gaseoso. Incorporarla o regar después reduce la pérdida.',
    },
    questions: [
      [
        '¿En qué hojas aparece primero la deficiencia de nitrógeno?',
        'En las hojas viejas',
        ['En las hojas nuevas', 'Solo en los frutos', 'En la raíz'],
      ],
      [
        '¿Cómo llega principalmente el fósforo hasta la raíz?',
        'Por difusión, a muy corta distancia',
        ['Por flujo masal con el agua', 'Por intercepción de lluvia', 'Por volatilización'],
      ],
      [
        '¿Qué proceso pierde N como N₂ y N₂O en suelos saturados?',
        'Desnitrificación',
        ['Nitrificación', 'Mineralización', 'Fijación simbiótica'],
      ],
      [
        '¿Qué síntoma es típico de deficiencia de potasio?',
        'Necrosis en el borde de hojas viejas',
        ['Clorosis intervenal en brotes nuevos', 'Hojas moradas en plántulas', 'Muerte del ápice de raíces'],
      ],
      [
        '¿Por qué los Andisoles exigen dosis altas de fósforo?',
        'La alofana fija el fosfato con mucha fuerza',
        ['Su pH alcalino precipita el fosfato', 'Las lluvias lixivian todo el fósforo', 'Su materia orgánica consume el fósforo'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Secundarios y Micronutrientes',
    description: 'Calcio, magnesio y azufre, y los micronutrientes que faltan en poca cantidad pero frenan todo el cultivo.',
    subboss: { name: 'Sombras Cloróticas', title: 'Heraldos de la Carencia' },
    codexTitle: 'Nutrientes Secundarios y Micronutrientes',
    sections: [
      {
        heading: 'Calcio, magnesio y azufre',
        body: [
          'El calcio forma las paredes celulares (pectatos) y se mueve solo por el xilema con la transpiración: no se redistribuye. Por eso su falta aparece en órganos que transpiran poco, como frutos y ápices: bitter pit en manzana, pudrición apical en tomate, tip burn en lechuga.',
          'El magnesio es el átomo central de la clorofila. Es móvil, así que su deficiencia da clorosis intervenal en hojas viejas. El exceso de K o de amonio compite con su absorción.',
          'El azufre forma aminoácidos (cisteína, metionina). Se absorbe como sulfato y es poco móvil en la planta: su falta amarillea las hojas nuevas, y es frecuente en suelos del sur pobres en materia orgánica.',
        ],
      },
      {
        heading: 'Micronutrientes',
        body: [
          'Se requieren en gramos por hectárea, pero su ausencia limita el rendimiento igual que un macro (Ley del Mínimo). Los principales son Fe, Mn, Zn, Cu, B, Mo, Cl y Ni.',
          'El hierro es inmóvil: su falta da clorosis intervenal en hojas nuevas, típica en suelos calcáreos o alcalinos (clorosis férrica). Se corrige con quelatos estables a pH alto, como Fe-EDDHA.',
          'El boro participa en la germinación del polen y en la cuaja; tiene un rango muy estrecho entre deficiencia y toxicidad, y la toxicidad por B en aguas de riego es un problema en zonas del norte de Chile. El zinc es clave en la síntesis de auxinas: su falta produce hojas pequeñas y entrenudos cortos (roseta).',
        ],
      },
      {
        heading: 'Móviles e inmóviles: la clave del diagnóstico',
        body: [
          'Si el nutriente es móvil en la planta (N, P, K, Mg), la deficiencia aparece en las hojas viejas, porque la planta lo traslada a los brotes. Si es inmóvil (Ca, S, Fe, Mn, Zn, Cu, B), aparece en hojas nuevas o en frutos.',
          'Este patrón permite una primera hipótesis en terreno, que luego se confirma con análisis foliar.',
        ],
      },
    ],
    checkpoint: {
      at: 125,
      prompt:
        'Un parronal en suelo calcáreo muestra hojas nuevas amarillas con nervaduras verdes. ¿Qué deficiencia es la más probable?',
      options: ['Nitrógeno', 'Magnesio', 'Hierro', 'Potasio'],
      correctIndex: 2,
      explanation:
        'Clorosis intervenal en hojas nuevas apunta a un nutriente inmóvil; en suelo calcáreo el sospechoso clásico es el hierro (clorosis férrica).',
    },
    questions: [
      [
        '¿Qué desorden de la manzana se asocia a falta de calcio en el fruto?',
        'Bitter pit',
        ['Russet', 'Golpe de sol', 'Corazón acuoso'],
      ],
      ['¿Qué nutriente es el átomo central de la clorofila?', 'Magnesio', ['Hierro', 'Calcio', 'Zinc']],
      [
        '¿Qué quelato de hierro es estable en suelos alcalinos?',
        'Fe-EDDHA',
        ['Fe-EDTA', 'Sulfato ferroso al suelo', 'Óxido de hierro'],
      ],
      ['¿Qué micronutriente participa en la germinación del polen y la cuaja?', 'Boro', ['Cloro', 'Níquel', 'Molibdeno']],
      [
        '¿Qué síntoma causa la deficiencia de zinc?',
        'Hojas pequeñas y entrenudos cortos (roseta)',
        ['Frutos gigantes', 'Raíces moradas', 'Necrosis del borde en hojas viejas'],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Diagnóstico y Programas de Fertilización',
    description:
      'Análisis de suelo y foliar, balance de nutrientes y salinidad: cómo decidir cuánto, cuándo y con qué fertilizar.',
    subboss: { name: 'Auditor de Espectrometría', title: 'Juez de los Rangos Críticos' },
    codexTitle: 'Diagnóstico Nutricional y Fertilización',
    sections: [
      {
        heading: 'Análisis de suelo y foliar',
        body: [
          'El análisis de suelo indica lo que el suelo puede ofrecer: pH, materia orgánica, N mineral, P Olsen, K, bases intercambiables, CE y micronutrientes. Su valor depende de un buen muestreo: muchas submuestras por sector homogéneo y a la profundidad de raíces.',
          'El análisis foliar indica lo que la planta efectivamente absorbió. Se compara con rangos de suficiencia y exige respetar el tipo de hoja y la época estandarizados para cada especie: en frutales, normalmente hojas maduras del brote del año en verano.',
        ],
      },
      {
        heading: 'Cuánto fertilizar: el balance',
        body: [
          'La dosis sale de un balance: demanda del cultivo (extracción por tonelada esperada) menos el aporte del suelo, dividido por la eficiencia del fertilizante. Ningún fertilizante se aprovecha al 100 %: la eficiencia del N suele estar entre 40 y 70 %.',
          'Las "4 R" resumen la buena práctica: la fuente correcta, en la dosis correcta, en el momento correcto y en el lugar correcto.',
        ],
      },
      {
        heading: 'Salinidad y fertirriego',
        body: [
          'La conductividad eléctrica (CE, en dS/m) mide sales solubles. Cada especie tiene un umbral de CE en el extracto de saturación sobre el cual pierde rendimiento: el frijol y la frutilla son sensibles; la cebada y la remolacha, tolerantes.',
          'Los fertilizantes son sales: el índice salino indica cuánto suben la CE. En suelos o aguas salinas conviene preferir fuentes de bajo índice y regar con una fracción de lavado que arrastre las sales bajo la zona de raíces.',
          'En suelos sódicos el problema no es la CE sino el sodio intercambiable (PSI): se corrige con calcio (yeso) y lavado.',
        ],
      },
    ],
    checkpoint: {
      at: 170,
      prompt: 'El cultivo extrae 150 kg N/ha, el suelo aporta 60 y la eficiencia del fertilizante es 60 %. ¿Cuánto N aplicar?',
      options: ['90 kg/ha', '150 kg/ha', '210 kg/ha', '54 kg/ha'],
      correctIndex: 1,
      explanation: '(150 − 60) / 0,6 = 150 kg N/ha. La eficiencia corrige por lo que se pierde o no se aprovecha.',
    },
    questions: [
      [
        '¿Qué indica el análisis foliar?',
        'Lo que la planta efectivamente absorbió',
        ['Lo que el suelo puede ofrecer a la raíz', 'La dosis exacta de fertilizante a aplicar', 'La textura y la CIC del suelo'],
      ],
      ['¿En qué unidad se mide la conductividad eléctrica?', 'dS/m', ['cmol(+)/kg', 'g/cm³', 'kPa']],
      [
        '¿Qué resume el concepto de las "4 R"?',
        'Fuente, dosis, momento y lugar correctos',
        ['Riego, rotación, rastrojo y rendimiento', 'Las cuatro estaciones del año', 'Los cuatro macronutrientes'],
      ],
      [
        '¿Cómo se manejan las sales que el riego acumula en la zona de raíces?',
        'Con una fracción de lavado',
        ['Con más fertilizante potásico', 'Regando menos', 'Aplicando urea'],
      ],
      [
        '¿Qué mide el índice salino de un fertilizante?',
        'Cuánto aumenta la CE de la solución del suelo',
        [
          'Cuánto sodio aporta al complejo de intercambio',
          'Qué fracción del producto es nutriente puro',
          'Con qué rapidez se disuelve en el agua',
        ],
      ],
    ],
  }),
]

/** Pregunta final del Titán de la Salinidad Residual. */
export const FERTILIDAD_BOSS_FINAL = bossFinal(
  'Un huerto regado con agua de CE 2,5 dS/m muestra quemado de bordes en hojas viejas, CE del suelo sobre el umbral y PSI normal. ¿Cuál es el manejo correcto?',
  'Aumentar la fracción de lavado y preferir fertilizantes de bajo índice salino',
  [
    'Aplicar yeso para desplazar el sodio, aunque el PSI sea normal',
    'Encalar para subir el pH y precipitar las sales del suelo',
    'Reducir el riego para que la planta absorba menos sales',
  ],
)

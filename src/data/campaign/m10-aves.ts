import { campaignModule } from './helpers.ts'

/** Módulo 10 · Reconocimiento de Aves. */
const { submodule, bossFinal } = campaignModule(10)

export const AVES_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Anatomía e Identificación',
    description: 'Topografía del ave, forma del pico, dimorfismo y las claves para identificar en terreno.',
    subboss: { name: 'El Plumaje Engañoso', title: 'Maestro del Dimorfismo' },
    codexTitle: 'Cómo Identificar un Ave',
    sections: [
      {
        heading: 'Topografía del ave',
        body: [
          'Para describir un ave se usan zonas: corona, ceja (supercilio), lorum, garganta, pecho, vientre, dorso, rabadilla, cubiertas alares, plumas primarias y secundarias (remiges) y plumas de la cola (rectrices).',
          'Marcas como una ceja blanca, una banda alar o el color de la rabadilla suelen bastar para separar especies parecidas.',
        ],
      },
      {
        heading: 'El pico revela la dieta',
        body: [
          'Pico cónico y grueso: granívoro (chincol, diuca, gorrión). Pico fino y recto: insectívoro (cachudito, golondrina). Pico ganchudo: rapaz o carroñero (tiuque, cernícalo). Pico largo y fino: nectarívoro (picaflor). Pico ancho y aplanado: filtrador (patos).',
          'La forma de las patas también informa: garras fuertes en rapaces, patas palmeadas en aves acuáticas, dedos largos en aves que caminan sobre vegetación flotante.',
        ],
      },
      {
        heading: 'Más allá de la forma',
        body: [
          'El dimorfismo sexual puede confundir: el macho de loica tiene el pecho rojo intenso y la hembra es más pálida. Los juveniles a menudo tienen plumajes distintos a los adultos.',
          'El canto, el comportamiento (cómo vuela, si camina o salta), el hábitat y la época del año completan la identificación. Unos binoculares 8x42, una guía de campo y plataformas como eBird ayudan a registrar observaciones con valor científico.',
        ],
      },
    ],
    checkpoint: {
      at: 105,
      prompt:
        'Un ave pequeña tiene pico corto, cónico y grueso, y se alimenta en el suelo de un rastrojo. ¿Qué dieta es más probable?',
      options: ['Nectarívora', 'Granívora', 'Rapaz', 'Filtradora'],
      correctIndex: 1,
      explanation: 'El pico cónico y grueso sirve para partir semillas: es típico de granívoros como el chincol o la diuca.',
    },
    questions: [
      ['¿Qué dieta indica un pico ganchudo?', 'Rapaz o carroñera', ['Granívora', 'Nectarívora', 'Filtradora']],
      ['¿Cómo se llaman las plumas de la cola?', 'Rectrices', ['Remiges primarias', 'Cubiertas alares', 'Supercilio']],
      [
        '¿Qué es el dimorfismo sexual?',
        'Diferencias visibles entre macho y hembra',
        ['Cambio de plumaje por la edad', 'Migración estacional', 'Canto distinto entre regiones'],
      ],
      ['¿Qué ave chilena tiene pico largo y fino para alimentarse de néctar?', 'Picaflor', ['Tiuque', 'Diuca', 'Pato jergón']],
      ['¿Qué plataforma permite registrar observaciones de aves con valor científico?', 'eBird', ['Agromet', 'SII', 'FAO-56']],
    ],
  }),

  submodule({
    order: 2,
    title: 'Rapaces y Control Biológico',
    description: 'Lechuzas, cernícalos, tiuques y aguiluchos: aliados naturales contra roedores e insectos.',
    subboss: { name: 'La Lechuza Fantasma', title: 'Cazadora de la Medianoche' },
    codexTitle: 'Aves Rapaces en el Agroecosistema',
    sections: [
      {
        heading: 'Rapaces diurnas',
        body: [
          'El tiuque (Milvago chimango) es un falcónido oportunista: come insectos, larvas que deja el arado, roedores y carroña, y es muy común en potreros. El cernícalo (Falco sparverius) es un halcón pequeño que caza insectos y roedores desde perchas o suspendido en el aire.',
          'El peuco (Parabuteo unicinctus), el aguilucho (Geranoaetus polyosoma) y el águila (Geranoaetus melanoleucus) completan el gremio de rapaces diurnas de los campos chilenos.',
        ],
      },
      {
        heading: 'Rapaces nocturnas',
        body: [
          'La lechuza (Tyto alba) caza casi exclusivamente roedores: una pareja con polluelos puede consumir miles al año. Entre sus presas está el ratón colilargo, reservorio del virus Hanta.',
          'El tucúquere (Bubo magellanicus) es el búho más grande de Chile; el chuncho (Glaucidium nana) es pequeño y también caza de día.',
          'Las egagrópilas, bolos de pelos y huesos que las rapaces regurgitan, permiten estudiar su dieta sin capturarlas.',
        ],
      },
      {
        heading: 'Atraerlas al predio',
        body: [
          'Las cajas nido para lechuzas y las perchas para rapaces diurnas en huertos y viñas aumentan la presión de depredación sobre roedores.',
          'Los rodenticidas anticoagulantes son un riesgo para ellas: una rapaz que come roedores envenenados se intoxica (envenenamiento secundario). El control biológico y los cebos protegidos son la alternativa.',
          'Todas las rapaces están protegidas por la Ley de Caza: está prohibido cazarlas o capturarlas.',
        ],
      },
    ],
    checkpoint: {
      at: 130,
      prompt: 'Un huerto con problemas de roedores instaló cajas nido para lechuzas. ¿Qué práctica podría arruinar ese control?',
      options: [
        'Instalar perchas',
        'Usar rodenticidas anticoagulantes sin protección',
        'Dejar franjas de pasto nativo',
        'Mantener árboles viejos',
      ],
      correctIndex: 1,
      explanation: 'Las lechuzas comen los roedores envenenados y se intoxican: envenenamiento secundario.',
    },
    questions: [
      ['¿Qué come principalmente la lechuza (Tyto alba)?', 'Roedores', ['Semillas', 'Néctar', 'Peces']],
      [
        '¿Qué es una egagrópila?',
        'Un bolo de pelos y huesos que regurgita una rapaz',
        [
          'Un nido de ramas que construyen las rapaces',
          'Una pluma de la cola que usan para frenar',
          'Un huevo sin fecundar que queda en el nido',
        ],
      ],
      ['¿Cuál es el halcón pequeño que caza suspendido en el aire?', 'Cernícalo', ['Tiuque', 'Peuco', 'Tucúquere']],
      [
        '¿Qué riesgo tienen los rodenticidas anticoagulantes para las rapaces?',
        'Envenenamiento secundario al comer roedores intoxicados',
        [
          'Ninguno: el veneno no pasa por la cadena trófica',
          'Les cambia el color del plumaje por un tiempo',
          'Las atrae a comer los cebos directamente',
        ],
      ],
      ['¿Cuál es el búho más grande de Chile?', 'Tucúquere', ['Chuncho', 'Lechuza', 'Cernícalo']],
    ],
  }),

  submodule({
    order: 3,
    title: 'Aves de Ambientes Agrícolas',
    description: 'Las aves del potrero y el huerto: granívoras, insectívoras, polinizadoras y especies introducidas.',
    subboss: { name: 'La Bandada de Tordos', title: 'Saqueadores del Maizal' },
    codexTitle: 'Aves del Campo Chileno',
    sections: [
      {
        heading: 'Granívoras y frugívoras',
        body: [
          'El chincol (Zonotrichia capensis), la diuca (Diuca diuca) y la tórtola (Zenaida auriculata) comen semillas y pueden dañar siembras y granos. El tordo (Curaeus curaeus), negro y gregario, forma bandadas en maizales y frutales.',
          'El zorzal (Turdus falcklandii) come lombrices e insectos, pero también fruta madura como cerezas y arándanos. La rara (Phytotoma rara) corta brotes, yemas y hojas tiernas de frutales y hortalizas.',
        ],
      },
      {
        heading: 'Aliadas del agricultor',
        body: [
          'Golondrinas, cachuditos y rayaditos consumen grandes cantidades de insectos. La loica (Leistes loyca) y el queltehue (Vanellus chilensis) comen larvas e insectos del suelo en praderas; la garza boyera (Bubulcus ibis) sigue al ganado para atrapar los insectos que este levanta.',
          'El picaflor chico (Sephanoides sephaniodes) poliniza muchas plantas nativas del sur.',
        ],
      },
      {
        heading: 'Especies introducidas',
        body: [
          'El gorrión (Passer domesticus) llegó desde Europa y se asocia a construcciones humanas. La codorniz (Callipepla californica) fue introducida desde Norteamérica y hoy es especie de caza.',
          'La cotorra argentina (Myiopsitta monachus) es una especie invasora: forma grandes nidos comunales de palitos en árboles y postes de electricidad, y daña frutales y granos.',
        ],
      },
    ],
    checkpoint: {
      at: 140,
      prompt:
        'Se encuentran grandes nidos comunales de palitos en postes del tendido eléctrico cerca de un huerto. ¿Qué ave los construye?',
      options: ['Tordo', 'Cotorra argentina', 'Zorzal', 'Queltehue'],
      correctIndex: 1,
      explanation:
        'La cotorra argentina, especie invasora, es la única de estas aves que construye grandes nidos comunales de palitos.',
    },
    questions: [
      [
        '¿Qué ave nativa corta brotes y yemas de frutales y hortalizas?',
        'Rara (Phytotoma rara)',
        ['Golondrina', 'Picaflor chico', 'Lechuza'],
      ],
      ['¿Qué ave sigue al ganado para comer los insectos que levanta?', 'Garza boyera', ['Tordo', 'Diuca', 'Cotorra argentina']],
      ['¿Qué especie es una invasora en Chile?', 'Cotorra argentina', ['Loica', 'Chincol', 'Queltehue']],
      ['¿Qué ave de pecho rojo come larvas en praderas?', 'Loica', ['Zorzal', 'Diuca', 'Tórtola']],
      ['¿Qué ave consume fruta madura de cerezos y arándanos?', 'Zorzal', ['Cachudito', 'Garza boyera', 'Pato jergón']],
    ],
  }),

  submodule({
    order: 4,
    title: 'Humedales y Aves Acuáticas',
    description: 'Cisnes, taguas, patos, garzas y flamencos: los humedales y su valor para el agua y la biodiversidad.',
    subboss: { name: 'La Garza Centinela', title: 'Vigía del Humedal' },
    codexTitle: 'Humedales y Aves Acuáticas',
    sections: [
      {
        heading: 'Por qué importan los humedales',
        body: [
          'Los humedales regulan el agua (amortiguan crecidas y recargan acuíferos), filtran sedimentos y nutrientes que escurren de los campos y albergan una enorme biodiversidad.',
          'La Convención de Ramsar protege humedales de importancia internacional. El primer sitio Ramsar de Chile fue el Santuario de la Naturaleza Carlos Anwandter, en el río Cruces de Valdivia.',
        ],
      },
      {
        heading: 'Aves acuáticas',
        body: [
          'El cisne de cuello negro (Cygnus melancoryphus) se alimenta de plantas acuáticas como el luchecillo; su población del río Cruces colapsó en 2004 cuando esa vegetación desapareció por un cambio en la calidad del agua.',
          'Las taguas (Fulica) nadan y bucean entre la vegetación; el pato jergón grande (Anas georgica) es el pato más común; la garza grande (Ardea alba) y el huairavo (Nycticorax nycticorax) cazan peces y anfibios. En los salares del altiplano habita el flamenco chileno.',
        ],
      },
      {
        heading: 'Humedales y agricultura',
        body: [
          'El drenaje de vegas y ñadis, la extracción de agua y la escorrentía con fertilizantes (eutrofización) son las principales amenazas que vienen del uso agrícola.',
          'Franjas de vegetación ribereña, aplicaciones cuidadosas de agroquímicos lejos de cursos de agua y el respeto de las áreas protegidas ayudan a conservarlos.',
        ],
      },
    ],
    checkpoint: {
      at: 125,
      prompt: '¿Qué provocó el colapso de la población de cisnes de cuello negro del río Cruces en 2004?',
      options: [
        'La caza ilegal',
        'La desaparición del luchecillo, su alimento, por un cambio en la calidad del agua',
        'Una ola de frío',
        'La llegada de un depredador introducido',
      ],
      correctIndex: 1,
      explanation:
        'El cisne depende del luchecillo (Egeria densa). Su desaparición dejó a la población sin alimento, con muertes y migración masiva.',
    },
    questions: [
      [
        '¿Qué convención protege humedales de importancia internacional?',
        'Convención de Ramsar',
        ['Protocolo de Kioto', 'Convenio de Basilea', 'Tratado Antártico'],
      ],
      [
        '¿Cuál fue el primer sitio Ramsar de Chile?',
        'Santuario Carlos Anwandter',
        ['Lago Chungará', 'Laguna del Laja', 'Salar de Atacama'],
      ],
      [
        '¿De qué se alimenta principalmente el cisne de cuello negro?',
        'De plantas acuáticas como el luchecillo',
        ['De peces que captura buceando', 'De semillas de trigo en los rastrojos', 'De insectos que caza en vuelo'],
      ],
      [
        '¿Qué es la eutrofización?',
        'Exceso de nutrientes en el agua que favorece algas y baja el oxígeno',
        [
          'La desecación de un humedal por extracción de agua',
          'La acumulación de sales en suelos regados',
          'La llegada masiva de aves migratorias a un humedal',
        ],
      ],
      [
        '¿Dónde habita el flamenco chileno?',
        'En salares y lagunas del altiplano, entre otros',
        [
          'Solo en los bosques lluviosos del sur',
          'En las cumbres nevadas de la cordillera',
          'En las dunas costeras sin agua dulce',
        ],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Manejo de Daños y Conservación',
    description: 'Ley de Caza, especies protegidas y métodos para reducir el daño de aves sin dañar la biodiversidad.',
    subboss: { name: 'El Choroy Saqueador', title: 'Señor de la Bandada Verde' },
    codexTitle: 'Manejo de Daño por Aves y Conservación',
    sections: [
      {
        heading: 'El marco legal',
        body: [
          'En Chile la Ley de Caza (Ley 19.473) y su reglamento definen qué especies se pueden cazar, cuáles están protegidas y cuáles se consideran dañinas. El SAG fiscaliza y otorga permisos especiales cuando una especie protegida causa daños graves.',
          'Cazar, capturar o destruir nidos de especies protegidas sin autorización es un delito, aunque el ave esté dañando un cultivo.',
        ],
      },
      {
        heading: 'Loros nativos',
        body: [
          'El choroy (Enicognathus leptorhynchus) es un loro endémico de los bosques del centro-sur: come semillas de araucaria, cereales y fruta, y puede dañar siembras y huertos. El tricahue (Cyanoliseus patagonus) es el loro más grande de Chile y está amenazado por la pérdida de hábitat y la extracción de polluelos.',
          'Ambos son ejemplos de conflicto entre producción y conservación: la solución pasa por métodos de exclusión y ahuyentamiento, no por eliminarlos.',
        ],
      },
      {
        heading: 'Métodos de manejo',
        body: [
          'Exclusión: mallas antipájaros sobre cerezos, arándanos o viñas; es el método más eficaz y protege también contra granizo.',
          'Ahuyentamiento: cañones de gas, señales acústicas de alarma, cintas reflectantes, láser y cetrería con halcones. Las aves se acostumbran rápido, por eso hay que rotar métodos y moverlos de lugar.',
          'Manejo del cultivo: sembrar a la profundidad correcta, cosechar a tiempo y evitar dejar grano expuesto reducen la atracción para las bandadas.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: 'Una bandada de choroyes daña un huerto de cerezos. ¿Cuál es la acción correcta?',
      options: [
        'Cazarlos: están dañando el cultivo',
        'Usar mallas y ahuyentadores, y consultar al SAG si el daño es grave',
        'Envenenar el agua',
        'Destruir sus nidos en el bosque',
      ],
      correctIndex: 1,
      explanation:
        'El choroy es una especie protegida: se maneja con exclusión y ahuyentamiento; el SAG puede autorizar medidas especiales.',
    },
    questions: [
      [
        '¿Qué ley regula la caza y la protección de aves en Chile?',
        'Ley de Caza 19.473',
        ['Ley de Bosques', 'Código de Aguas', 'Ley de Pesca'],
      ],
      ['¿Qué institución fiscaliza la Ley de Caza?', 'El SAG', ['El SII', 'La DGA', 'El INE']],
      [
        '¿Cuál es el método más eficaz para proteger un huerto de cerezos de las aves?',
        'Mallas antipájaros',
        ['Cintas reflectantes solas', 'Un espantapájaros fijo', 'Regar de noche'],
      ],
      [
        '¿Por qué hay que rotar los ahuyentadores?',
        'Porque las aves se acostumbran rápido',
        ['Porque se oxidan', 'Porque la ley lo exige cada día', 'Porque atraen insectos'],
      ],
      ['¿Cuál es el loro más grande de Chile, hoy amenazado?', 'Tricahue', ['Choroy', 'Cotorra argentina', 'Cachaña']],
    ],
  }),
]

/** Pregunta final del Tirano de la Espiga. */
export const AVES_BOSS_FINAL = bossFinal(
  'Un agricultor sufre daño de tordos y choroyes en su maíz, y una plaga de roedores en el galpón. ¿Qué plan respeta la ley y la biodiversidad?',
  'Ahuyentadores rotativos y cosecha oportuna para las aves; cajas nido de lechuza y cebos protegidos para los roedores',
  [
    'Cazar los choroyes y esparcir rodenticidas al voleo en todo el predio',
    'Cebar el maíz con insecticida para envenenar a las bandadas',
    'Destruir los nidos de lechuza para que no se acerquen al galpón',
  ],
)

import type { Question } from '../types'
import { campaignModule } from './helpers.ts'

/**
 * Módulo 7 · Cranberry. Sus 25 preguntas vienen de la campaña anterior (cuando era
 * el módulo 1) y conservan su id `m1-q{n}`: así no se pierde el historial de respuestas.
 */
const { submodule } = campaignModule(7)

function legacy(n: number, prompt: string, correct: string, distractors: [string, string, string]): Question {
  return { id: `m1-q${n}`, prompt, correct, distractors }
}

export const CRANBERRY_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Biología y Suelo',
    description: 'Una ericácea de turbera: runners, uprights, raíces superficiales y un suelo ácido con nitrógeno amoniacal.',
    subboss: { name: 'Centinela de la Turba', title: 'Guardián de las Camas Ácidas' },
    codexTitle: 'Biología del Cranberry y su Suelo',
    sections: [
      {
        heading: 'Una planta de turbera',
        body: [
          'El cranberry (Vaccinium macrocarpon) es una Ericácea perenne y siempreverde, nativa de las turberas de Norteamérica. Se cultiva en "camas" planas y niveladas, sobre arena o suelos orgánicos, que pueden inundarse y drenarse.',
          'Forma tallos rastreros (runners), que cubren la cama, y tallos verticales (uprights), que son los productivos: fructifican en la yema apical formada la temporada anterior. Una cama productiva tiene del orden de 400 a 600 uprights por pie cuadrado.',
        ],
      },
      {
        heading: 'Raíces superficiales',
        body: [
          'Sus raíces son finas, sin pelos radicales, y se concentran en los primeros 10 a 15 cm. Dependen de micorrizas ericoides para absorber nutrientes.',
          'Esa raíz tan superficial la hace sensible a la sequía, a la salinidad y a la asfixia: el mal drenaje favorece a Phytophthora cinnamomi.',
        ],
      },
      {
        heading: 'pH y nitrógeno',
        body: [
          'Es una especie acidófila: su pH óptimo está entre 4,0 y 5,5. Sobre pH 6,5 bloquea la absorción de hierro y aparece clorosis intervenal en los brotes nuevos.',
          'Absorbe mal el nitrato: exige nitrógeno amoniacal (sulfato de amonio, por ejemplo), que además ayuda a mantener el suelo ácido. Las dosis de N son bajas, porque el exceso vuelve la planta vegetativa.',
        ],
      },
    ],
    checkpoint: {
      at: 100,
      prompt: 'Una cama de cranberry tiene pH 6,8 y los brotes nuevos se ven amarillos con nervaduras verdes. ¿Qué ocurre?',
      options: ['Exceso de nitrógeno amoniacal', 'Bloqueo de hierro por pH alto', 'Falta de horas frío', 'Daño por Cottonball'],
      correctIndex: 1,
      explanation:
        'Sobre pH 6,5 el hierro deja de estar disponible para esta acidófila: clorosis intervenal en hojas nuevas. Se corrige acidificando (azufre) y con fuentes amoniacales.',
    },
    questions: [
      legacy(1, '¿Cuál es el pH óptimo de suelo para el Cranberry?', '4,0 - 5,5', ['5,5 - 6,5', '6,5 - 7,5', '3,0 - 3,5']),
      legacy(2, '¿Qué forma de nitrógeno exige el Cranberry?', 'Amoniacal (NH₄⁺)', ['Nítrica', 'Urea foliar', 'Nitrito']),
      legacy(11, '¿Dónde produce fruta el Cranberry?', 'En yemas apicales de uprights formadas el año anterior', [
        'En los runners',
        'En la raíz',
        'En brotes desde el suelo',
      ]),
      legacy(17, '¿A qué profundidad están las raíces absorbentes?', '10 a 15 cm', ['50 cm', '1 m', '2 m']),
      legacy(19, '¿Qué deficiencia provoca un pH mayor a 6,5?', 'Hierro (clorosis intervenal en brote nuevo)', [
        'Calcio',
        'Fósforo',
        'Nitrógeno',
      ]),
    ],
  }),

  submodule({
    order: 2,
    title: 'Agua, Heladas y Clima',
    description: 'Riego de una raíz superficial, aspersión contra heladas, golpe de sol y el frío que colorea la fruta.',
    subboss: { name: 'Leviatán del Dique', title: 'Señor del Calor Latente' },
    codexTitle: 'Riego y Manejo Térmico',
    sections: [
      {
        heading: 'Riego',
        body: [
          'Con raíces en los primeros 15 cm, el cranberry tolera poco el déficit hídrico pero tampoco el exceso. En camas de arena se riega con tensiómetros, manteniendo la tensión entre 20 y 30 centibares.',
          'El riego por aspersión cumple tres funciones: hidratar, proteger contra heladas y enfriar la fruta en días de calor.',
        ],
      },
      {
        heading: 'Heladas',
        body: [
          'En invierno profundo, ya endurecida, la planta tolera hasta cerca de −18 °C. En primavera, con brotes y flores, la tolerancia cae a pocos grados bajo cero.',
          'El control activo es la aspersión continua: al congelarse, el agua libera calor latente y mantiene los tejidos cerca de 0 °C. Debe seguir hasta que el hielo se derrita. Si el hielo se ve opaco y seco en vez de transparente y goteando, la tasa de agua es insuficiente y la planta se está congelando.',
        ],
      },
      {
        heading: 'Calor y color',
        body: [
          'Con alta radiación y temperatura aparece el golpe de sol (sunscald): daño fisiológico en la cara expuesta de la baya. Riegos cortos de enfriamiento lo reducen.',
          'El color rojo depende de las antocianinas, cuya síntesis se gatilla con noches frías al final de la temporada.',
        ],
      },
    ],
    checkpoint: {
      at: 140,
      prompt: 'Durante una noche de helada con aspersión, el hielo sobre las plantas se ve blanco, opaco y seco. ¿Qué indica?',
      options: [
        'Protección perfecta',
        'La tasa de agua es insuficiente y el tejido se enfría',
        'Exceso de agua que hay que cortar',
        'Que ya terminó la helada',
      ],
      correctIndex: 1,
      explanation:
        'Con suficiente agua el hielo es transparente y gotea (sigue liberando calor). El hielo opaco y seco indica que falta agua: hay que aumentar la tasa.',
    },
    questions: [
      legacy(3, '¿Cuál es el método de control activo de heladas?', 'Aspersión continua (calor latente)', [
        'Hélices',
        'Calefactores',
        'Plásticos',
      ]),
      legacy(
        20,
        '¿Qué indica ver hielo opaco y seco durante la aspersión contra heladas?',
        'Tasa de agua insuficiente: la planta se congela',
        ['Control perfecto', 'Exceso de sales', 'Humedad al 100%'],
      ),
      legacy(18, '¿A qué tensión se riega con tensiómetro en suelos de arena?', '20 a 30 cbars', [
        '60 cbars',
        '10 cbars',
        '100 cbars',
      ]),
      legacy(13, '¿Qué es el daño por Sunscald?', 'Daño fisiológico por alta radiación y temperatura', [
        'Daño por agua caliente',
        'Daño por herbicida',
        'Daño por trips',
      ]),
      legacy(7, '¿Qué gatilla la síntesis de antocianinas en la fruta?', 'Frío nocturno', [
        'Restricción hídrica',
        'Exceso de nitrógeno',
        'Giberelinas',
      ]),
    ],
  }),

  submodule({
    order: 3,
    title: 'Manejo de las Camas',
    description: 'Arenado, poda de runners, peinado y nitrógeno: cómo mantener una cama productiva por décadas.',
    subboss: { name: 'Sílfide del Botón Floral', title: 'Danzante de los Uprights' },
    codexTitle: 'Manejo de Camas de Cranberry',
    sections: [
      {
        heading: 'Establecimiento y variedades',
        body: [
          'Las camas se plantan con estacas de runners presionadas en la arena; tardan 3 a 5 años en cubrir y entrar en plena producción, y pueden producir por décadas.',
          'Stevens es la variedad histórica más productiva; hoy existen variedades de alto rendimiento y color como las de la serie de Rutgers.',
        ],
      },
      {
        heading: 'Arenado (sanding)',
        body: [
          'Cada pocos años se aplica una capa delgada de arena (1 a 2,5 cm) sobre la cama, normalmente en invierno. Entierra parcialmente los runners, estimula su enraizamiento y la formación de nuevos uprights, y rejuvenece la cama.',
          'También ayuda a controlar algunos insectos y a mejorar el drenaje superficial.',
        ],
      },
      {
        heading: 'Poda, peinado y vigor',
        body: [
          'La poda de runners mantiene la cama densa en uprights; una poda severa baja temporalmente el rendimiento, pero aumenta el calibre. En primavera se usan peinadoras para alinear los runners y facilitar la cosecha.',
          'El exceso de nitrógeno produce "emboscamiento": demasiados runners y follaje, menos flores, fruta blanda y más enfermedades. El N se dosifica según el vigor observado.',
        ],
      },
    ],
    checkpoint: {
      at: 125,
      prompt: 'Una cama vieja tiene pocos uprights y runners largos sin enraizar. ¿Qué práctica la rejuvenece?',
      options: ['Más nitrógeno nítrico', 'Arenado (sanding)', 'Inundación de verano', 'Retirar las abejas'],
      correctIndex: 1,
      explanation: 'La capa de arena entierra los runners, estimula raíces nuevas y la formación de uprights productivos.',
    },
    questions: [
      legacy(4, '¿Cuál es el objetivo del sanding (aplicación de arena)?', 'Estimular el enraizamiento y rejuvenecer', [
        'Subir el pH',
        'Retener agua en verano',
        'Aportar sílice',
      ]),
      legacy(12, '¿Para qué se usan peinadoras en primavera?', 'Alinear runners para la cosecha', [
        'Cortar flores',
        'Romper la costra del suelo',
        'Espantar insectos',
      ]),
      legacy(23, '¿Qué efecto tiene un pruning severo?', 'Caída temporal del rendimiento y aumento de calibre', [
        'Aumento explosivo del rendimiento',
        'Muerte de uprights',
        'Retraso del color',
      ]),
      legacy(15, '¿Qué provoca el exceso de nitrógeno?', 'Emboscamiento y fruta blanda', [
        'Fruta gigante',
        'Clorosis',
        'Muerte de raíces',
      ]),
      legacy(14, '¿Cuál es la variedad histórica más productiva?', 'Stevens', ['Duke', 'Chandler', 'Heritage']),
    ],
  }),

  submodule({
    order: 4,
    title: 'Plagas, Enfermedades y Malezas',
    description: 'Phytophthora, fruitworm, mosquita de la yema, Fairy Ring y la cuscuta parásita.',
    subboss: { name: 'Picudo de la Corona', title: 'Plaga de las Camas' },
    codexTitle: 'Sanidad del Cranberry',
    sections: [
      {
        heading: 'Enfermedades',
        body: [
          'Phytophthora cinnamomi pudre las raíces en sectores mal drenados: aparecen manchones de plantas rojizas y débiles. La prevención es el drenaje y la nivelación de las camas.',
          'El Fairy Ring, asociado al hongo Psilocybe, forma anillos que se expanden cada año, con plantas muertas en el borde activo.',
        ],
      },
      {
        heading: 'Insectos',
        body: [
          'El cranberry fruitworm pone huevos en las bayas recién cuajadas y la larva consume su interior: se monitorea post-cuaja. La mosquita de la yema (Dasineura oxycoccana) mata las yemas apicales de uprights tiernos y reduce la floración siguiente.',
          'El manejo integrado combina monitoreo con trampas y redes, umbrales de daño y productos compatibles con las abejas, indispensables para la polinización.',
        ],
      },
      {
        heading: 'Malezas',
        body: [
          'La cuscuta es una planta parásita sin clorofila: sus tallos amarillo-anaranjados se enrollan en el cranberry y le extraen savia mediante haustorios. Se dispersa por semillas y fragmentos, y es la maleza más problemática.',
          'Pastos, juncos y helechos compiten en camas mal establecidas; mantener la cama densa es la mejor defensa.',
        ],
      },
    ],
    checkpoint: {
      at: 135,
      prompt: 'En la cama aparecen tallos amarillo-anaranjados sin hojas, enrollados sobre las plantas. ¿Qué es?',
      options: ['Fairy Ring', 'Cuscuta', 'Daño por fruitworm', 'Clorosis férrica'],
      correctIndex: 1,
      explanation: 'La cuscuta es una enredadera parásita sin clorofila que se enrolla y succiona al hospedero con haustorios.',
    },
    questions: [
      legacy(6, '¿Qué patógeno se asocia al mal drenaje?', 'Phytophthora cinnamomi', ['Botrytis', 'Oidium', 'Agrobacterium']),
      legacy(8, '¿Cuándo se monitorea Cranberry fruitworm?', 'Post-cuaja', ['En receso', 'En pinta de color', 'En floración']),
      legacy(10, '¿Cuál es la maleza parásita enredadera más problemática?', 'Cuscuta', ['Chufa', 'Correhuela', 'Ballica']),
      legacy(21, '¿Qué daño causa Dasineura oxycoccana?', 'Mata las yemas apicales de uprights tiernos', [
        'Perfora la fruta',
        'Come raíces',
        'Transmite virus',
      ]),
      legacy(22, '¿Cómo se manifiesta el Fairy Ring (Psilocybe)?', 'Manchas circulares expansivas de parras muertas', [
        'Agallas rojas',
        'Fruta vacía',
        'Moho harinoso',
      ]),
    ],
  }),

  submodule({
    order: 5,
    title: 'Polinización, Cosecha y Calidad',
    description: 'Abejas, cosecha en agua y en seco, antocianinas y los hongos que atacan la baya.',
    subboss: { name: 'El Clasificador Óptico', title: 'Juez de los Floats' },
    codexTitle: 'Polinización, Cosecha y Calidad de Fruta',
    sections: [
      {
        heading: 'Polinización',
        body: [
          'La flor del cranberry produce poco néctar y su polen se libera en tétradas desde anteras tubulares, por lo que la polinización necesita insectos. Se introducen colmenas de abejas melíferas o colonias de abejorros durante la floración.',
          'Una buena polinización aumenta el número de semillas por baya, y con ellas el tamaño del fruto.',
        ],
      },
      {
        heading: 'Cosecha en agua y en seco',
        body: [
          'Para la industria (jugos, fruta deshidratada) se cosecha en agua: se inunda la cama, batidoras desprenden las bayas y estas flotan gracias a sus cámaras de aire internas; luego se arrean con barreras flotantes.',
          'Para mercado fresco se cosecha en seco, con peinadoras mecánicas. La fruta cosechada en agua dura poco, porque los patógenos entran por la cicatriz del pedicelo y por el daño de la batidora.',
        ],
      },
      {
        heading: 'Calidad',
        body: [
          'El precio de la fruta para industria depende mucho del color, que se mide como antocianinas totales (TAcy). Cosechar después de algunas noches frías mejora el valor.',
          'El hongo Cottonball (Monilinia oxycocci) infecta flores y la baya se llena de una masa algodonosa blanca. Las pudriciones de campo se manejan con fungicidas en floración y buena ventilación de la cama.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: '¿Por qué flotan las bayas de cranberry en la cosecha en agua?',
      options: [
        'Porque tienen aceite',
        'Porque tienen cámaras de aire internas',
        'Porque se cosechan verdes',
        'Porque se les agrega sal al agua',
      ],
      correctIndex: 1,
      explanation:
        'La baya tiene cuatro cámaras de aire en su interior: flota y puede arrearse en la superficie de la cama inundada.',
    },
    questions: [
      legacy(9, '¿Cómo se asegura la polinización obligatoria?', 'Colmenas de abejas/abejorros', [
        'Por viento',
        'Polinización manual',
        'Aplicación de auxinas',
      ]),
      legacy(5, '¿Cuál es el destino de la fruta cosechada en agua (water-harvest)?', 'Industria', [
        'Mercado fresco',
        'Exportación aérea',
        'Mercado orgánico',
      ]),
      legacy(
        16,
        '¿Por qué la fruta cosechada en agua tiene vida postcosecha corta?',
        'Entran patógenos por la cicatriz y el daño de la batidora',
        ['Pierde color', 'Absorbe sal', 'Pierde sus ceras'],
      ),
      legacy(24, '¿Qué mide el valor T-Ac?', 'Antocianinas totales', ['Acidez', 'Brix', 'Firmeza']),
      legacy(25, '¿Cómo actúa el hongo Cottonball?', 'Infecta la flor y la baya se llena de una masa algodonosa', [
        'Destruye la raíz',
        'Causa defoliación',
        'Mancha la epidermis',
      ]),
    ],
  }),
]

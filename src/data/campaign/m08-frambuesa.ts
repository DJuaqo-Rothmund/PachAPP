import type { Question } from '../types'
import { campaignModule } from './helpers.ts'

/**
 * Módulo 8 · Frambuesa. Sus 25 preguntas vienen de la campaña anterior (cuando era
 * el módulo 2) y conservan su id `m2-q{n}`: así no se pierde el historial de respuestas.
 */
const { submodule } = campaignModule(8)

function legacy(n: number, prompt: string, correct: string, distractors: [string, string, string]): Question {
  return { id: `m2-q${n}`, prompt, correct, distractors }
}

export const FRAMBUESA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Biología y Tipos de Caña',
    description: 'Raíz perenne, cañas bianuales y la diferencia entre variedades remontantes y no remontantes.',
    subboss: { name: 'La Caña Bienal', title: 'Señora del Doble Ciclo' },
    codexTitle: 'Biología de la Frambuesa',
    sections: [
      {
        heading: 'Raíz perenne, cañas bianuales',
        body: [
          'La frambuesa (Rubus idaeus) es una Rosácea con raíz y corona perennes, pero sus cañas viven dos temporadas. El primer año la caña se llama primocane (crece vegetativa); el segundo, floricane (fructifica y luego muere).',
          'Brota desde yemas de la corona y desde raíces gemíferas que emiten hijuelos a distancia: por eso la plantación "camina" y puede volverse invasiva entre hileras.',
        ],
      },
      {
        heading: 'Remontantes y no remontantes',
        body: [
          'Las variedades no remontantes (floricane, como Meeker) fructifican en verano sobre la caña de segundo año, después de acumular entre 600 y 1.000 horas frío en receso.',
          'Las remontantes (primocane, como Heritage, la más plantada en Chile) fructifican en otoño en la punta de la caña del mismo año, por lo que pueden manejarse con una sola cosecha anual cortando todas las cañas en invierno, o con doble cosecha.',
        ],
      },
      {
        heading: 'Flor y fruto',
        body: [
          'La flor es muy atractiva para las abejas, que aumentan la cuaja: cada drupéolo es un pistilo fecundado, de modo que una mala polinización deja frutos deformes.',
          'El fruto es un agregado de drupéolos. A diferencia de la mora, al cosecharlo el receptáculo queda en la planta y la frambuesa sale hueca.',
        ],
      },
    ],
    checkpoint: {
      at: 110,
      prompt: 'Una plantación de Heritage se poda cortando todas las cañas a ras en invierno. ¿Cuándo cosechará?',
      options: [
        'En primavera temprana',
        'En verano, sobre floricanes',
        'En otoño, sobre las cañas nuevas del año',
        'No cosechará hasta el segundo año',
      ],
      correctIndex: 2,
      explanation: 'Heritage es remontante: fructifica en la punta de las primocanes del mismo año, en otoño.',
    },
    questions: [
      legacy(
        1,
        '¿Qué diferencia a una variedad remontante de una no remontante?',
        'La remontante da en caña del año (otoño); la no remontante, en caña de segundo año (verano)',
        ['La remontante no tiene espinas', 'La remontante es de secano', 'La remontante da fruta azul'],
      ),
      legacy(12, '¿Qué estructura hace invasiva a la frambuesa al brotar?', 'Raíces gemíferas (hijuelos)', [
        'Semillas',
        'Estolones aéreos',
        'Bulbos',
      ]),
      legacy(
        17,
        '¿Qué diferencia botánica tiene la frambuesa con la mora?',
        'La frambuesa deja el receptáculo en la planta (queda hueca)',
        ['La mora no tiene espinas', 'La mora es un árbol', 'La frambuesa es climatérica'],
      ),
      legacy(20, '¿Qué requiere la floricane para brotar?', 'Acumular horas frío (600-1000) en receso', [
        'Poda a ras en invierno',
        'Estrés hídrico en abril',
        'Aplicación de giberelinas',
      ]),
      legacy(16, '¿Qué efecto tiene la polinización por abejas?', 'Es altamente atractiva y mejora la cuaja (más drupéolas)', [
        'Se poliniza por viento',
        'Es partenocárpica',
        'Repele a los insectos',
      ]),
    ],
  }),

  submodule({
    order: 2,
    title: 'Suelo, Riego y Nutrición',
    description: 'Camellones contra la asfixia, goteo con doble cinta y una nutrición cuidadosa con el cloro y el calcio.',
    subboss: { name: 'El Camellón Anegado', title: 'Ahogador de Raíces' },
    codexTitle: 'Establecimiento, Riego y Nutrición',
    sections: [
      {
        heading: 'Suelo y camellones',
        body: [
          'La raíz de la frambuesa es muy sensible a la falta de oxígeno y a Phytophthora. Se planta en camellones elevados de 30 a 40 cm, en suelos profundos, francos y bien drenados.',
          'Antes de plantar conviene analizar nematodos: Pratylenchus, un endoparásito migratorio, destruye el tejido de la raíz al desplazarse por ella.',
        ],
      },
      {
        heading: 'Riego',
        body: [
          'El sistema más usado es el goteo con doble cinta sobre el camellón: moja la franja de raíces sin saturar y permite fertirrigar.',
          'La demanda es máxima en cosecha: el déficit en esa etapa reduce el calibre y aumenta el ablandamiento de la fruta.',
        ],
      },
      {
        heading: 'Nutrición',
        body: [
          'El potasio se asocia a la firmeza y la calidad de la fruta. Como la frambuesa es sensible al cloro, se prefiere sulfato o nitrato de potasio en vez de cloruro (muriato).',
          'El calcio aplicado al follaje después de la cuaja llega poco al fruto, porque viaja por el xilema hacia los órganos que más transpiran, las hojas.',
        ],
      },
    ],
    checkpoint: {
      at: 120,
      prompt: '¿Por qué se recomienda plantar frambuesa en camellones elevados?',
      options: [
        'Para cosechar a máquina',
        'Porque su raíz es muy sensible a la asfixia y a Phytophthora',
        'Para evitar heladas de primavera',
        'Para usar menos plantas',
      ],
      correctIndex: 1,
      explanation: 'El camellón aleja la raíz del agua acumulada: menos asfixia y menos Phytophthora.',
    },
    questions: [
      legacy(3, '¿Por qué se planta en camellones elevados?', 'La raíz es hipersensible a la asfixia y a Phytophthora', [
        'Para permitir cosecha mecánica',
        'Para evitar heladas',
        'Para proteger del viento',
      ]),
      legacy(11, '¿Cuál es el sistema ideal de riego y fertirrigación?', 'Goteo con doble cinta', [
        'Surco',
        'Aspersión foliar',
        'Pivote',
      ]),
      legacy(7, '¿Qué nutriente se asocia a la firmeza del fruto?', 'Potasio', ['Nitrógeno', 'Fósforo', 'Cloro']),
      legacy(
        23,
        '¿Por qué el calcio foliar aplicado post-cuaja llega poco al fruto?',
        'Viaja por xilema hacia las hojas que transpiran',
        ['La raíz es impermeable', 'Ahuyenta a la mosca', 'Se transforma en yeso'],
      ),
      legacy(21, '¿Qué tipo de nematodo es Pratylenchus?', 'Endoparásito migratorio (destruye tejido al moverse)', [
        'Ectoparásito adherido a la raíz',
        'Fijador de nitrógeno',
        'Ataca estolones',
      ]),
    ],
  }),

  submodule({
    order: 3,
    title: 'Conducción y Manejo de Cañas',
    description: 'Sistemas en V, raleo de primocanes y eliminación de floricanes para una hilera ventilada.',
    subboss: { name: 'El Primocane Desbocado', title: 'Señor de la Espesura' },
    codexTitle: 'Conducción y Manejo de Cañas',
    sections: [
      {
        heading: 'Conducción en V',
        body: [
          'Las cañas se conducen con alambres. El sistema en "V" o cruceta (T-trellis) separa las cañas hacia ambos lados: abre el centro de la hilera, mejora la luz y la aireación y reduce Botrytis.',
          'Una hilera densa y cerrada guarda humedad, favorece enfermedades y complica la cosecha.',
        ],
      },
      {
        heading: 'Raleo y eliminación de cañas',
        body: [
          'En variedades no remontantes, las primocanes compiten con las floricanes que están produciendo: se ralean temprano, dejando las más vigorosas. Un raleo tardío deja cañas débiles para el año siguiente.',
          'Tras la cosecha, las floricanes se cortan a ras y se sacan del huerto: ya no producirán y pueden hospedar enfermedades.',
        ],
      },
      {
        heading: 'Exposición de la fruta',
        body: [
          'Con radiación UV directa y altas temperaturas aparece el White Drupelet Disorder: drupéolos blancos que bajan la calidad. Una canopia que proteja la fruta y mallas sombra en zonas cálidas lo reducen.',
        ],
      },
    ],
    checkpoint: {
      at: 130,
      prompt: 'En una variedad floricane, las primocanes crecieron muy densas y nadie las raleó. ¿Qué se espera?',
      options: [
        'Más fruta este verano',
        'Competencia con la floricane, más Botrytis y cañas débiles para el próximo año',
        'Ningún efecto',
        'Cosecha anticipada',
      ],
      correctIndex: 1,
      explanation:
        'El exceso de primocanes sombrea y compite con la caña productiva, aumenta la humedad (Botrytis) y deja cañas débiles para la próxima temporada.',
    },
    questions: [
      legacy(4, '¿Qué se hace con la caña floricane después de cosecha?', 'Cortarla a ras y eliminarla', [
        'Podar solo las puntas',
        'Dejarla para que engrose',
        'Acodarla',
      ]),
      legacy(6, '¿Qué sistema de conducción mejora la aireación?', 'V o cruceta (T-trellis)', [
        'Eje central',
        'Parronal',
        'Vaso abierto',
      ]),
      legacy(14, '¿Cuál es el objetivo del raleo de cañas (primocanes)?', 'Mejorar la luz, la aireación y el vuelo de abejas', [
        'Retrasar la cosecha',
        'Dar más raíz',
        'Producir fruta en invierno',
      ]),
      legacy(
        25,
        '¿Qué riesgo tiene un raleo de primocanes muy tardío?',
        'El segundo flujo de cañas no alcanza vigor para el año siguiente',
        ['La fruta cuaja de color blanco', 'Mueren las raíces', 'Se compacta el suelo'],
      ),
      legacy(24, '¿Qué causa el White Drupelet Disorder?', 'Radiación UV directa y altas temperaturas', [
        'Botrytis temprana',
        'Falta de magnesio',
        'Picadura de mosca',
      ]),
    ],
  }),

  submodule({
    order: 4,
    title: 'Plagas y Enfermedades',
    description: 'Botrytis, arañita, agalla del cuello, tizón de la yema, burrito y los virus transmitidos por pulgones.',
    subboss: { name: 'El Burrito Barrenador', title: 'Devorador de Coronas' },
    codexTitle: 'Sanidad de la Frambuesa',
    sections: [
      {
        heading: 'Enfermedades',
        body: [
          'Botrytis cinerea causa pudrición gris en flores y frutos, sobre todo con lluvia en floración y cosecha. El Spur blight (tizón de la yema, Didymella applanata) deja manchas púrpura oscuras en los nudos de la caña.',
          'Agrobacterium tumefaciens forma agallas leñosas en el cuello y las raíces; entra por heridas y se evita con plantas sanas y certificadas.',
          'Virus como el RBDV causan desgrane (crumbly berry); otros, como los mosaicos, los transmiten pulgones.',
        ],
      },
      {
        heading: 'Plagas',
        body: [
          'El burrito de la frambuesa (Aegorhinus superciliosus) es un curculiónido nativo: el adulto come brotes, pero el daño letal lo hace la larva, que barrena la corona y las raíces principales.',
          'La arañita roja prolifera con calor y polvo, como en hileras junto a caminos de tierra: humedecer los caminos y conservar sus enemigos naturales ayuda a controlarla.',
        ],
      },
    ],
    checkpoint: {
      at: 140,
      prompt:
        'Plantas de frambuesa se secan de golpe y al arrancarlas aparecen larvas blancas sin patas en la corona. ¿Qué plaga es?',
      options: ['Drosophila suzukii', 'Burrito (Aegorhinus)', 'Arañita roja', 'Pulgón'],
      correctIndex: 1,
      explanation: 'Las larvas del burrito barrenan la corona y las raíces principales, provocando la muerte de la planta.',
    },
    questions: [
      legacy(5, '¿Qué hongo causa pudrición en una floración húmeda?', 'Botrytis cinerea', [
        'Oidio',
        'Verticillium',
        'Agrobacterium',
      ]),
      legacy(8, '¿Qué plaga prolifera en bordes de camino polvorientos?', 'Arañita roja', ['Pulgón', 'Escama', 'Gusano tebo']),
      legacy(10, '¿Qué produce agallas leñosas en el cuello?', 'Agrobacterium tumefaciens', [
        'Nematodos',
        'Armillaria',
        'Fusarium',
      ]),
      legacy(
        18,
        '¿Cómo se reconoce el Spur blight (tizón de la yema)?',
        'Zonas oscuras (púrpura) en los nudos de la caña en otoño/invierno',
        ['Grietas blancas', 'Agallas en la base', 'Hongos con forma de paraguas'],
      ),
      legacy(19, '¿Cuál es el daño letal de Aegorhinus (burrito)?', 'La larva barrena la corona y las raíces principales', [
        'Inyecta una toxina en la flor',
        'La ninfa transmite virus',
        'El macho come yemas',
      ]),
      legacy(22, '¿Cuál es el vector del virus del mosaico?', 'Pulgones', ['Viento', 'Tijera de poda', 'Arañita']),
    ],
  }),

  submodule({
    order: 5,
    title: 'Cosecha y Postcosecha',
    description:
      'Una fruta frágil de respiración altísima: cosecha temprana, pre-frío inmediato y la amenaza de Drosophila suzukii.',
    subboss: { name: 'La Mosca de Alas Manchadas', title: 'Reina de la Fruta Blanda' },
    codexTitle: 'Cosecha y Postcosecha',
    sections: [
      {
        heading: 'Cosecha',
        body: [
          'La frambuesa se cosecha cada 2 o 3 días durante la temporada. Para mercado fresco se cosecha temprano en la mañana, sin calor de campo, directamente al envase final para no manipularla de nuevo.',
          'Gran parte de la frambuesa chilena se congela (IQF) para exportación, lo que permite cosechar fruta más madura que para el mercado fresco.',
        ],
      },
      {
        heading: 'Pre-frío y atmósfera',
        body: [
          'Su tasa respiratoria es altísima: cada hora a temperatura ambiente acorta su vida. Debe entrar a un túnel de pre-frío (aire forzado a 0 °C) dentro de 2 a 4 horas desde la cosecha.',
          'Durante el transporte se usa atmósfera modificada con CO₂ elevado, que frena la respiración y a Botrytis.',
        ],
      },
      {
        heading: 'Drosophila suzukii',
        body: [
          'A diferencia de otras drosófilas, la hembra de D. suzukii tiene un ovipositor aserrado que corta la piel de la fruta sana en maduración. Sus larvas blancas se desarrollan dentro del fruto.',
          'Se maneja con monitoreo con trampas, cosechas frecuentes, eliminación de fruta caída o sobremadura y enfriamiento rápido.',
        ],
      },
    ],
    checkpoint: {
      at: 160,
      prompt: 'La fruta se cosechó a las 11:00 y llegó al túnel de pre-frío a las 18:00. ¿Qué problema hay?',
      options: [
        'Ninguno: lo importante es llegar el mismo día',
        'Se superó la ventana de 2-4 horas: menor vida postcosecha',
        'La fruta debió congelarse en el campo',
        'Debió lavarse antes del pre-frío',
      ],
      correctIndex: 1,
      explanation:
        'Por su respiración altísima, la frambuesa debe enfriarse antes de 2 a 4 horas. Siete horas con calor de campo acortan mucho su vida.',
    },
    questions: [
      legacy(13, '¿A qué hora conviene cosechar para mercado fresco?', 'Mañana temprano, sin calor de campo', [
        'Al mediodía, con fruta seca',
        'En la tarde-noche',
        'A cualquier hora',
      ]),
      legacy(15, '¿Cuál es la acción postcosecha crítica en las primeras 2-4 horas?', 'Túnel de pre-frío inmediato a 0 °C', [
        'Lavar con agua',
        'Dejar al sol para subir el brix',
        'Empacar al vacío',
      ]),
      legacy(2, '¿Qué plaga deja larvas blancas dentro del fruto blando?', 'Drosophila suzukii', [
        'Ceratitis',
        'Trips',
        'Burrito',
      ]),
      legacy(9, '¿Qué causa el desgrane (crumbly berry)?', 'Virus RBDV o mala polinización', [
        'Exceso de potasio',
        'Helada',
        'Falta de poda',
      ]),
      [
        '¿Qué atmósfera se usa para prolongar la vida de la frambuesa en el transporte?',
        'Atmósfera modificada con CO₂ elevado',
        ['Aire con etileno agregado', 'Atmósfera con 100 % de oxígeno', 'Aire caliente y seco'],
      ],
    ],
  }),
]

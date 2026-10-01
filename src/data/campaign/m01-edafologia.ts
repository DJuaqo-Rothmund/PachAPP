import type { Question, Submodule } from '../types'

/**
 * Módulo 1 · Edafología y Física de Suelos (piloto de la campaña de 13 módulos).
 * Cada submódulo trae su Códice (texto + checkpoint para el futuro video), su
 * subjefe individual y sus preguntas.
 */

/** Pregunta de submódulo con id estable `m1-s{submódulo}-q{n}`. */
function sq(sub: number, n: number, prompt: string, correct: string, distractors: [string, string, string]): Question {
  return { id: `m1-s${sub}-q${n}`, prompt, correct, distractors }
}

/** Preguntas del antiguo módulo Fundamentos que se reutilizan aquí: conservan su id (y su historial). */
function legacy(n: number, prompt: string, correct: string, distractors: [string, string, string]): Question {
  return { id: `m0-q${n}`, prompt, correct, distractors }
}

export const EDAFOLOGIA_SUBMODULES: Submodule[] = [
  // ---------------------------------------------------------------------------
  // 1.1 Textura y Estructura
  // ---------------------------------------------------------------------------
  {
    id: 'm1-s1',
    order: 1,
    title: 'Textura y Estructura',
    description: 'Arena, limo y arcilla: cómo se miden y cómo se agrupan en agregados que sostienen raíces, agua y aire.',
    subboss: { name: 'Densímetro de Bouyoucos', title: 'Lector de la Sedimentación', maxHp: 40, damagePerHit: 10 },
    codex: {
      id: 'codex-m1-s1',
      title: 'Textura y Estructura del Suelo',
      videoUrl: null,
      videoDurationSeconds: null,
      sections: [
        {
          heading: 'Textura: la huella mineral',
          body: [
            'La textura es la proporción de arena, limo y arcilla en la tierra fina (partículas menores a 2 mm). Según el USDA, la arena mide entre 2 y 0,05 mm, el limo entre 0,05 y 0,002 mm y la arcilla menos de 0,002 mm.',
            'Con esos porcentajes se ubica el suelo en el triángulo textural, que define 12 clases (arenosa, franca, franco-arcillosa, arcillosa, etc.). La textura condiciona la retención de agua, la aireación, la CIC y la facilidad de laboreo.',
            'A escala agronómica la textura no cambia con el manejo: es una propiedad heredada del material parental y de la meteorización. Por eso se maneja en torno a ella, no contra ella.',
          ],
        },
        {
          heading: 'Cómo se mide: el método de Bouyoucos',
          body: [
            'Se dispersa la muestra con hexametafosfato de sodio y agitación, para separar los agregados en partículas individuales, y se lleva a una probeta con agua.',
            'Las partículas sedimentan según la Ley de Stokes: las más grandes caen más rápido. A los 40 segundos la arena ya decantó, así que el hidrómetro mide limo + arcilla en suspensión; a las 2 horas solo queda arcilla en suspensión.',
            'El método de la pipeta es la referencia de laboratorio. En terreno, el "tacto" (formar una cinta con la muestra húmeda) permite una estimación rápida.',
          ],
        },
        {
          heading: 'Estructura: la arquitectura del suelo',
          body: [
            'La estructura es la forma en que las partículas se agrupan en agregados (peds). Los cementan arcillas, materia orgánica, óxidos de Fe y Al, el calcio (floculante) y la biología: raíces, hifas y la glomalina de los hongos micorrícicos.',
            'Tipos principales: granular (típica de horizontes A con buena MO), bloques angulares y subangulares, prismática, columnar (asociada a suelos sódicos) y laminar (frecuente por compactación). Sin estructura: grano simple (arenas) o masiva.',
            'El grado (débil, moderado, fuerte) indica qué tan definidos y estables son los agregados.',
          ],
        },
        {
          heading: 'Estabilidad y manejo',
          body: [
            'El sodio intercambiable (PSI alto) dispersa las arcillas: el suelo se sella, forma costras y estructura columnar. El calcio, por ejemplo aplicado como yeso, flocula y ayuda a recuperarlo.',
            'La labranza excesiva y el tránsito con suelo húmedo destruyen agregados; la materia orgánica, las raíces vivas y los cultivos de cobertura los estabilizan.',
            'La estabilidad de agregados se evalúa con tamizado en húmedo: más agregados estables significa mejor infiltración y menos erosión.',
          ],
        },
      ],
      checkpoints: [
        {
          id: 'm1-s1-cp1',
          timestampSeconds: 95,
          prompt: 'En el método de Bouyoucos, ¿qué estima la lectura del hidrómetro a los 40 segundos?',
          options: [
            'Solo la arcilla en suspensión',
            'El limo + la arcilla en suspensión',
            'La arena en suspensión',
            'La materia orgánica disuelta',
          ],
          correctIndex: 1,
          explanation:
            'Por la Ley de Stokes la arena decanta en unos 40 s; lo que sigue suspendido es limo + arcilla. La lectura de 2 horas estima solo la arcilla.',
        },
      ],
    },
    questions: [
      sq(1, 1, 'Según el USDA, ¿qué tamaño tienen las partículas de arcilla?', 'Menos de 0,002 mm', ['Entre 0,05 y 2 mm', 'Menos de 0,05 mm', 'Entre 0,002 y 0,05 mm']),
      sq(1, 2, '¿Para qué se agrega hexametafosfato de sodio en el método de Bouyoucos?', 'Para dispersar los agregados en partículas individuales', ['Para flocular la arcilla', 'Para eliminar la materia orgánica', 'Para acelerar la sedimentación de la arena']),
      sq(1, 3, '¿Qué propiedad del suelo prácticamente no cambia con el manejo agronómico?', 'La textura', ['La estructura', 'La densidad aparente', 'El contenido de materia orgánica']),
      sq(1, 4, '¿Qué tipo de estructura se asocia a suelos sódicos?', 'Columnar', ['Granular', 'Laminar', 'Grano simple']),
      legacy(14, '¿En qué se diferencia un suelo salino de uno sódico?', 'Salino: alta CE; sódico: alto PSI que destruye la estructura', ['El salino retiene y el sódico repele agua', 'El sódico está en el sur y el salino en el norte', 'Son sinónimos']),
    ],
  },

  // ---------------------------------------------------------------------------
  // 1.2 Retención y Curvas de Humedad
  // ---------------------------------------------------------------------------
  {
    id: 'm1-s2',
    order: 2,
    title: 'Retención y Curvas de Humedad',
    description: 'Capacidad de campo, punto de marchitez y la curva que une humedad con tensión: la base para decidir cuándo y cuánto regar.',
    subboss: { name: 'Olla de Presión Richards', title: 'Extractora de la Tensión Mátrica', maxHp: 40, damagePerHit: 10 },
    codex: {
      id: 'codex-m1-s2',
      title: 'Retención de Agua y Curvas de Humedad',
      videoUrl: null,
      videoDurationSeconds: null,
      sections: [
        {
          heading: 'El agua retenida y el potencial mátrico',
          body: [
            'El suelo retiene agua por adhesión a las superficies de las partículas y por capilaridad en los poros. Mientras más seco está, con más fuerza la retiene: esa fuerza se expresa como potencial mátrico (negativo), en kPa o bar.',
            'Los poros grandes se vacían primero y a tensiones bajas; los poros finos (típicos de suelos arcillosos) retienen agua a tensiones muy altas.',
          ],
        },
        {
          heading: 'Los puntos de referencia',
          body: [
            'Saturación: todos los poros llenos de agua. Capacidad de Campo (CC): humedad tras drenar el exceso por gravedad, asociada a unos −33 kPa (−1/3 bar); en suelos arenosos se usa a menudo −10 kPa.',
            'Punto de Marchitez Permanente (PMP): humedad a unos −1.500 kPa (−15 bar), donde la mayoría de los cultivos ya no recupera la turgencia.',
            'Agua disponible (AD) = CC − PMP. Los suelos arcillosos tienen la CC y el PMP más altos; los francos y franco-limosos suelen tener la mayor agua disponible; los arenosos, la menor.',
          ],
        },
        {
          heading: 'La curva característica de humedad',
          body: [
            'La curva relaciona el contenido volumétrico de agua (θ) con el potencial mátrico. Se obtiene en laboratorio con ollas y placas de presión de Richards: muestras saturadas se someten a presiones conocidas (por ejemplo 0,33 y 15 bar) hasta equilibrar y se mide el agua retenida.',
            'La curva presenta histéresis: a un mismo potencial, el suelo que se está secando retiene más agua que el que se está humedeciendo.',
          ],
        },
        {
          heading: 'De la curva al riego',
          body: [
            'Lámina de agua disponible: AD (mm) = (θCC − θPMP) × profundidad de raíces (mm). Ejemplo: θCC 30 %, θPMP 15 % y raíces a 600 mm dan 0,15 × 600 = 90 mm.',
            'No se espera a llegar al PMP: se riega al alcanzar el agotamiento permisible, típicamente 30 a 50 % del AD según el cultivo. Con 50 % en el ejemplo, se reponen 45 mm.',
            'Los tensiómetros miden en terreno entre 0 y unos −80 kPa: el rango útil para programar el riego de la mayoría de los frutales y hortalizas.',
          ],
        },
      ],
      checkpoints: [
        {
          id: 'm1-s2-cp1',
          timestampSeconds: 140,
          prompt: 'Un suelo tiene θCC = 32 % y θPMP = 17 % (volumétrico) y raíces hasta 50 cm. ¿Cuánta agua disponible total retiene?',
          options: ['75 mm', '150 mm', '7,5 mm', '245 mm'],
          correctIndex: 0,
          explanation: 'AD = (0,32 − 0,17) × 500 mm = 0,15 × 500 = 75 mm.',
        },
      ],
    },
    questions: [
      legacy(1, '¿Qué clase textural tiene la mayor Capacidad de Campo y el mayor Punto de Marchitez?', 'Arcillosa', ['Arenosa', 'Franca', 'Franco-limosa']),
      sq(2, 1, '¿A qué potencial mátrico se asocia habitualmente el Punto de Marchitez Permanente?', '−1.500 kPa (−15 bar)', ['−33 kPa (−1/3 bar)', '−10 kPa', '−100 kPa']),
      sq(2, 2, '¿Qué equipo de laboratorio se usa para construir la curva característica de humedad?', 'Ollas o placas de presión de Richards', ['Densímetro de Bouyoucos', 'Penetrómetro de cono', 'Cilindro infiltrómetro']),
      sq(2, 3, 'Con θCC = 30 %, θPMP = 14 % y raíces a 40 cm, ¿cuál es el agua disponible?', '64 mm', ['120 mm', '6,4 mm', '176 mm']),
      sq(2, 4, '¿Cuál es el rango de trabajo habitual de un tensiómetro?', 'De 0 a unos −80 kPa', ['De 0 a −1.500 kPa', 'De −100 a −1.500 kPa', 'Solo a saturación']),
    ],
  },

  // ---------------------------------------------------------------------------
  // 1.3 Aireación y Compactación
  // ---------------------------------------------------------------------------
  {
    id: 'm1-s3',
    order: 3,
    title: 'Aireación y Compactación',
    description: 'Densidad aparente, porosidad y resistencia a la penetración: cuándo el suelo deja de respirar y cómo recuperarlo.',
    subboss: { name: 'Penitente del Suelo Fisurado', title: 'Guardián del Pie de Arado', maxHp: 40, damagePerHit: 10 },
    codex: {
      id: 'codex-m1-s3',
      title: 'Aireación y Compactación',
      videoUrl: null,
      videoDurationSeconds: null,
      sections: [
        {
          heading: 'Densidad y porosidad',
          body: [
            'La densidad aparente (Da) incluye los poros; la densidad real (Dr) considera solo los sólidos y en suelos minerales ronda 2,65 g/cm³. La porosidad total se estima como 1 − Da/Dr.',
            'Valores típicos de Da: suelos arenosos 1,5–1,6 g/cm³; francos 1,3–1,4; arcillosos 1,1–1,3. Los Andisoles (trumaos) pueden bajar de 0,9 g/cm³.',
            'Los macroporos drenan y airean; los microporos retienen agua. Un buen suelo agrícola combina ambos.',
          ],
        },
        {
          heading: 'Aireación: las raíces también respiran',
          body: [
            'Las raíces y la biota consumen O₂ y liberan CO₂; el intercambio ocurre por difusión a través de los poros con aire.',
            'Se considera que bajo un 10 % de porosidad de aire (a capacidad de campo) aparece hipoxia: menor absorción de agua y nutrientes, más enfermedades de raíz y pérdidas de N por desnitrificación.',
          ],
        },
        {
          heading: 'Compactación',
          body: [
            'La compactación aumenta la Da, elimina macroporos y eleva la resistencia mecánica. Sus causas principales son el tránsito de maquinaria y el pisoteo, sobre todo con el suelo húmedo, cerca de capacidad de campo, cuando es más deformable.',
            'El pie de arado es una capa compactada que se forma justo bajo la profundidad de labranza cuando se labra siempre a la misma profundidad.',
            'Umbrales orientativos que restringen raíces: Da cercana a 1,6 g/cm³ en suelos francos, 1,45–1,5 en arcillosos y 1,75–1,8 en arenosos. Con penetrómetro de cono, sobre 2 MPa el crecimiento radicular se reduce fuertemente.',
          ],
        },
        {
          heading: 'Recuperación',
          body: [
            'Subsolar solo con el suelo friable o seco, para fracturar la capa en vez de amasarla; luego proteger el resultado con tránsito controlado (siempre por las mismas huellas).',
            'Los cultivos de cobertura con raíz pivotante (como el rábano forrajero) funcionan como "subsolado biológico", y la materia orgánica mejora la resiliencia del suelo.',
          ],
        },
      ],
      checkpoints: [
        {
          id: 'm1-s3-cp1',
          timestampSeconds: 180,
          prompt: 'Un penetrómetro marca 2,8 MPa a 25 cm en la entrehilera de un huerto. ¿Qué significa?',
          options: [
            'El suelo está bien aireado',
            'Hay una capa compactada que limita el crecimiento de raíces',
            'Falta agua y hay que regar más',
            'El suelo tiene alta materia orgánica',
          ],
          correctIndex: 1,
          explanation: 'Sobre ~2 MPa la resistencia mecánica restringe fuertemente las raíces: es una capa compactada (por ejemplo, pie de arado o huella de tránsito).',
        },
      ],
    },
    questions: [
      legacy(11, '¿En qué se diferencian la densidad aparente y la densidad real del suelo?', 'La aparente incluye los poros; la real, solo los sólidos', ['La real cambia con la labranza', 'Ambas miden la materia orgánica', 'Son iguales']),
      sq(3, 1, 'Si Da = 1,325 g/cm³ y Dr = 2,65 g/cm³, ¿cuál es la porosidad total?', '50 %', ['25 %', '75 %', '13 %']),
      sq(3, 2, '¿Qué resistencia a la penetración se considera limitante para las raíces?', 'Alrededor de 2 MPa', ['Alrededor de 0,2 MPa', 'Alrededor de 20 MPa', 'Alrededor de 0,02 MPa']),
      sq(3, 3, '¿Cuándo es más susceptible a compactarse un suelo?', 'Con humedad cercana a capacidad de campo', ['Completamente seco', 'Congelado', 'En punto de marchitez']),
      sq(3, 4, '¿Qué es el "pie de arado"?', 'Una capa compactada bajo la profundidad habitual de labranza', ['El horizonte orgánico superficial', 'Una costra salina superficial', 'Una capa natural de grava']),
    ],
  },

  // ---------------------------------------------------------------------------
  // 1.4 Erosión y Conservación
  // ---------------------------------------------------------------------------
  {
    id: 'm1-s4',
    order: 4,
    title: 'Erosión y Conservación',
    description: 'Cómo el agua y el viento arrancan el suelo, cómo estimar la pérdida con la USLE y qué prácticas la frenan.',
    subboss: { name: 'Vórtice de Acarreo', title: 'Devorador de Laderas', maxHp: 40, damagePerHit: 10 },
    codex: {
      id: 'codex-m1-s4',
      title: 'Erosión y Conservación de Suelos',
      videoUrl: null,
      videoDurationSeconds: null,
      sections: [
        {
          heading: 'El proceso: desprender, transportar, depositar',
          body: [
            'La erosión hídrica comienza con el impacto de la gota de lluvia, que desprende partículas (salpicadura) y sella la superficie. Luego el escurrimiento las transporta y las deposita aguas abajo.',
            'Formas: laminar (pérdida pareja y poco visible), en surcos o regueros (canales pequeños que la labranza borra) y cárcavas (canales profundos que la labranza normal no puede cruzar ni borrar).',
            'La erosión eólica mueve partículas por reptación, saltación y suspensión; es mayor en suelos secos, sueltos y sin cobertura.',
          ],
        },
        {
          heading: 'Estimar la pérdida: la USLE',
          body: [
            'La Ecuación Universal de Pérdida de Suelo estima la pérdida media anual: A = R · K · LS · C · P.',
            'R es la erosividad de la lluvia; K, la erodabilidad del suelo (mayor en suelos limosos o de arenas muy finas con poca materia orgánica); LS, el largo y la inclinación de la pendiente; C, la cobertura y el manejo; P, las prácticas de conservación.',
            'R, K y LS dependen del lugar; el agricultor actúa sobre C y P.',
          ],
        },
        {
          heading: 'La erosión en Chile',
          body: [
            'Según estudios de CIREN, cerca de la mitad del territorio nacional presenta algún grado de erosión, con situaciones críticas en el secano costero e interior de la zona central.',
            'La combinación de lluvias concentradas en invierno, laderas sin cobertura y suelos degradados acelera la pérdida de la capa arable, que tarda siglos en formarse.',
          ],
        },
        {
          heading: 'Prácticas de conservación',
          body: [
            'Cobertura: cultivos de cobertura, mulch, rastrojos y cero labranza (bajan el factor C).',
            'Prácticas mecánicas: cultivo en contorno, fajas, terrazas, zanjas de infiltración y control de cárcavas con diques (bajan el factor P).',
            'Contra el viento: cortinas cortaviento y mantener el suelo cubierto.',
          ],
        },
      ],
      checkpoints: [
        {
          id: 'm1-s4-cp1',
          timestampSeconds: 210,
          prompt: 'En la USLE, sembrar una cubierta vegetal entre hileras reduce principalmente el factor…',
          options: ['R (erosividad de la lluvia)', 'K (erodabilidad del suelo)', 'C (cobertura y manejo)', 'LS (topografía)'],
          correctIndex: 2,
          explanation: 'La cobertura protege del impacto de la gota y frena el escurrimiento: actúa sobre el factor C, que depende del manejo.',
        },
      ],
    },
    questions: [
      sq(4, 1, '¿Cuál es el primer paso de la erosión hídrica?', 'El desprendimiento de partículas por el impacto de la gota', ['El depósito en el fondo del valle', 'La formación de cárcavas', 'La infiltración del agua']),
      sq(4, 2, 'En la USLE, ¿qué representa el factor K?', 'La erodabilidad del suelo', ['La erosividad de la lluvia', 'El largo y la inclinación de la pendiente', 'Las prácticas de conservación']),
      sq(4, 3, '¿Qué suelos suelen ser más erodables?', 'Limosos o de arenas muy finas con poca materia orgánica', ['Arcillosos bien floculados', 'Pedregosos', 'De arenas gruesas']),
      sq(4, 4, '¿Qué práctica reduce la erosión eólica?', 'Cortinas cortaviento y suelo cubierto', ['Quemar los rastrojos', 'Labrar en el sentido de la pendiente', 'Regar por surcos en pendiente']),
      sq(4, 5, '¿Qué distingue a una cárcava de un surco de erosión?', 'Es tan profunda que la labranza normal no la borra ni la cruza', ['Solo se forma con viento', 'Es una pérdida pareja de una capa delgada', 'Aparece solo en suelos arcillosos']),
    ],
  },

  // ---------------------------------------------------------------------------
  // 1.5 Horizontes y Perfil de Suelo
  // ---------------------------------------------------------------------------
  {
    id: 'm1-s5',
    order: 5,
    title: 'Horizontes y Perfil de Suelo',
    description: 'Leer una calicata: horizontes, color, moteados y los factores que forman los suelos de Chile.',
    subboss: { name: 'Espectro de la Calicata Profunda', title: 'Guardián de los Horizontes', maxHp: 50, damagePerHit: 10 },
    codex: {
      id: 'codex-m1-s5',
      title: 'Horizontes y Perfil de Suelo',
      videoUrl: null,
      videoDurationSeconds: null,
      sections: [
        {
          heading: 'La calicata',
          body: [
            'Una calicata es un hoyo de observación de aproximadamente 1 × 1,5 m y 1,2 a 1,5 m de profundidad (o hasta la roca). Se describe la cara mejor iluminada, desde la superficie hacia abajo.',
            'Se registran: límites y espesor de cada horizonte, color Munsell (matiz, valor y croma), textura al tacto, estructura, consistencia, raíces, poros, moteados, gravas y reacción al HCl (presencia de carbonatos).',
          ],
        },
        {
          heading: 'Horizontes maestros',
          body: [
            'O: orgánico, de restos vegetales. A: mineral con materia orgánica acumulada, más oscuro. E: de eluviación, lavado de arcilla, hierro o MO, más claro. B: de acumulación o alteración (Bt arcilla iluvial, Bw cambio de color o estructura, Bk carbonatos, Bn sodio). C: material parental poco alterado. R: roca.',
            'Los sufijos agregan detalle: p (alterado por arado, como en Ap), g (gleyzación por saturación de agua), t (arcilla iluvial), k (carbonatos), n (sodio).',
          ],
        },
        {
          heading: 'Factores formadores',
          body: [
            'Jenny resumió la formación del suelo como función de cinco factores: clima, organismos, relieve, material parental y tiempo.',
            'Los moteados grises y anaranjados indican saturación de agua y condiciones reductoras alternadas con oxidación: drenaje imperfecto. Son clave para decidir drenaje y especies.',
          ],
        },
        {
          heading: 'Suelos de Chile',
          body: [
            'Andisoles (trumaos) del centro-sur, formados de cenizas volcánicas: arcillas amorfas alofana e imogolita, baja Da, alta retención de agua, alta MO y fuerte fijación de fósforo.',
            'Ñadis: andisoles hidromórficos con una capa cementada de fierrillo que impide el drenaje. Suelos rojos arcillosos (Alfisoles y Ultisoles) en el secano y la precordillera; Mollisoles en el valle central; Aridisoles y Entisoles en el norte.',
          ],
        },
      ],
      checkpoints: [
        {
          id: 'm1-s5-cp1',
          timestampSeconds: 160,
          prompt: 'En la calicata aparece a 60 cm un horizonte gris con manchas anaranjadas. ¿Qué indica?',
          options: [
            'Acumulación de carbonatos',
            'Saturación de agua prolongada (drenaje imperfecto)',
            'Un horizonte orgánico enterrado',
            'Contaminación por fertilizantes',
          ],
          correctIndex: 1,
          explanation:
            'El gris (gleyzación) y los moteados anaranjados reflejan condiciones reductoras alternadas con oxidación del hierro: el suelo pasa largos periodos saturado.',
        },
      ],
    },
    questions: [
      legacy(21, '¿Qué arcillas amorfas dominan en los Trumaos?', 'Alofana e Imogolita', ['Montmorillonita y Caolinita', 'Ilita y Vermiculita', 'Cuarzo']),
      sq(5, 1, '¿Qué horizonte acumula arcilla iluvial?', 'Bt', ['Ap', 'E', 'C']),
      sq(5, 2, '¿Qué indica el sufijo "p" en un horizonte Ap?', 'Que fue alterado por labranza o arado', ['Que es pedregoso', 'Que tiene alto pH', 'Que es permeable']),
      sq(5, 3, 'Según Jenny, ¿cuáles son los factores formadores del suelo?', 'Clima, organismos, relieve, material parental y tiempo', ['Riego, fertilización, labranza, cultivo y cosecha', 'Arena, limo, arcilla, MO y agua', 'Temperatura, lluvia, viento, sol y nieve']),
      sq(5, 4, '¿Qué caracteriza a los suelos ñadis?', 'Andisoles hidromórficos con una capa de fierrillo que impide el drenaje', ['Suelos salinos del desierto', 'Suelos rojos arcillosos del secano', 'Arenas de dunas costeras']),
    ],
  },
]

/** Pregunta final del Gólem de Arcilla Compactada (jefe cooperativo del Módulo 1). */
export const EDAFOLOGIA_BOSS_FINAL: Question = {
  id: 'm1-boss',
  prompt:
    'Un suelo franco-arcilloso tiene Da = 1,62 g/cm³ y 3 MPa de resistencia a 30 cm; la cosecha mecanizada se hace con el suelo cerca de capacidad de campo. ¿Cuál es la intervención correcta?',
  correct: 'Subsolar con el suelo friable o seco y luego controlar el tránsito',
  distractors: [
    'Subsolar de inmediato con el suelo húmedo',
    'Aumentar la frecuencia de riego',
    'Aplicar urea para ablandar la capa',
  ],
}

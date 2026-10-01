import { campaignModule } from './helpers.ts'

/** Módulo 4 · Fisiología Vegetal y Relaciones Hídricas. */
const { submodule, bossFinal } = campaignModule(4)

export const FISIOLOGIA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Fotosíntesis C3, C4 y CAM',
    description: 'Cómo la planta convierte luz en azúcares, la fotorrespiración y las tres estrategias para fijar carbono.',
    subboss: { name: 'El Rubisco Confundido', title: 'Fijador de Oxígeno' },
    codexTitle: 'Fotosíntesis y Metabolismo del Carbono',
    sections: [
      {
        heading: 'Fase luminosa y ciclo de Calvin',
        body: [
          'En los tilacoides del cloroplasto la luz rompe el agua, libera O₂ y genera ATP y NADPH. En el estroma, el ciclo de Calvin usa esa energía para fijar CO₂ en azúcares.',
          'La enzima que fija el CO₂ es la Rubisco, la proteína más abundante del planeta. Su problema: también reacciona con O₂, y esa reacción, la fotorrespiración, desperdicia carbono y energía, sobre todo con calor y estomas cerrados.',
        ],
      },
      {
        heading: 'Plantas C3, C4 y CAM',
        body: [
          'Las C3 (trigo, arroz, papa, la mayoría de los frutales) fijan el CO₂ directamente con la Rubisco; su primer producto tiene 3 carbonos. Sufren más fotorrespiración en climas cálidos.',
          'Las C4 (maíz, caña de azúcar, sorgo y muchas malezas como el pasto bermuda) fijan primero el CO₂ con la PEP carboxilasa en el mesófilo y lo concentran en la vaina del haz (anatomía Kranz). Así casi eliminan la fotorrespiración y usan mejor el agua y el nitrógeno en calor.',
          'Las CAM (cactus, piña, agave) abren estomas de noche, guardan el CO₂ como ácido málico y lo usan de día con los estomas cerrados: máxima eficiencia en el uso del agua.',
        ],
      },
      {
        heading: 'Factores limitantes',
        body: [
          'La fotosíntesis responde a la luz hasta un punto de saturación; bajo el punto de compensación, la respiración consume más de lo que la hoja fija. Las hojas sombreadas del interior de un árbol pueden quedar bajo ese punto.',
          'El CO₂, la temperatura, el agua (vía estomas) y el nitrógeno (gran parte del N de la hoja está en la Rubisco) también limitan la tasa fotosintética.',
        ],
      },
    ],
    checkpoint: {
      at: 130,
      prompt: 'En un verano caluroso y seco, ¿qué cultivo pierde menos carbono por fotorrespiración?',
      options: ['Trigo (C3)', 'Maíz (C4)', 'Papa (C3)', 'Manzano (C3)'],
      correctIndex: 1,
      explanation: 'El maíz es C4: concentra CO₂ alrededor de la Rubisco en la vaina del haz y casi elimina la fotorrespiración.',
    },
    questions: [
      ['¿Qué enzima fija el CO₂ en el ciclo de Calvin?', 'Rubisco', ['PEP carboxilasa', 'Nitrogenasa', 'Amilasa']],
      [
        '¿Qué es la fotorrespiración?',
        'La reacción de la Rubisco con O₂ que desperdicia carbono',
        [
          'La respiración nocturna de las raíces del cultivo',
          'La fijación nocturna de CO₂ en las plantas CAM',
          'La salida de vapor de agua por los estomas',
        ],
      ],
      [
        '¿Qué anatomía caracteriza a las plantas C4?',
        'Anatomía Kranz (vaina del haz)',
        ['Estomas solo en el tallo', 'Hojas sin clorofila', 'Raíces aéreas'],
      ],
      ['¿Cuándo abren los estomas las plantas CAM?', 'De noche', ['Al mediodía', 'Solo con lluvia', 'Nunca']],
      [
        '¿Qué es el punto de compensación lumínico?',
        'La luz con la que la fotosíntesis iguala a la respiración',
        [
          'La luz sobre la cual la fotosíntesis ya no aumenta',
          'La hora del día con mayor radiación incidente',
          'La luz mínima para que germine una semilla',
        ],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'Agua en la Planta: Potencial Hídrico',
    description: 'El potencial hídrico, el camino del agua del suelo a la atmósfera y cómo se mide el estrés en terreno.',
    subboss: { name: 'La Cámara de Scholander', title: 'Medidora del Potencial Xilemático' },
    codexTitle: 'Potencial Hídrico y Transporte de Agua',
    sections: [
      {
        heading: 'Potencial hídrico',
        body: [
          'El potencial hídrico (Ψ) mide la energía libre del agua y se expresa en megapascales (MPa). El agua pura libre tiene Ψ = 0; en suelo y plantas los valores son negativos, y el agua siempre fluye de potencial mayor (menos negativo) a menor (más negativo).',
          'Sus componentes son el potencial osmótico (solutos, siempre negativo), el de presión (turgencia, positivo en células vivas; tensión, negativo en el xilema) y el mátrico (adhesión a superficies, relevante en suelos y paredes).',
        ],
      },
      {
        heading: 'El continuo suelo-planta-atmósfera',
        body: [
          'El agua entra por la raíz, atraviesa la endodermis (la banda de Caspary obliga a pasar por membranas), sube por el xilema y sale por los estomas. La transpiración genera la tensión que tira de la columna de agua: es la teoría de la cohesión-tensión.',
          'El gradiente va de un suelo húmedo (−0,03 MPa) a una atmósfera seca que puede estar bajo −50 MPa. La mayor resistencia está en la raíz y en el paso de líquido a vapor en la hoja.',
        ],
      },
      {
        heading: 'Medir el estrés hídrico',
        body: [
          'La cámara de presión (de Scholander) mide el potencial xilemático: se encierra una hoja cortada y se aplica presión hasta que el agua aflora en el corte. Esa presión iguala la tensión que tenía el xilema.',
          'El potencial de tallo a mediodía, con la hoja embolsada para detener la transpiración, es el indicador más usado para riego en frutales y vides. El potencial antes del amanecer refleja el agua del suelo que explora la raíz.',
          'Otras herramientas son los dendrómetros (contracción diaria del tronco) y la termografía infrarroja (hojas estresadas se calientan).',
        ],
      },
    ],
    checkpoint: {
      at: 145,
      prompt: 'Una vid mide −0,6 MPa de potencial de tallo y otra −1,4 MPa a la misma hora. ¿Cuál tiene más estrés hídrico?',
      options: ['La de −0,6 MPa', 'La de −1,4 MPa', 'Ambas igual', 'No se puede saber con el potencial'],
      correctIndex: 1,
      explanation: 'Un potencial más negativo significa más tensión en el xilema, es decir, más estrés hídrico.',
    },
    questions: [
      ['¿Cuál es el potencial hídrico del agua pura libre?', '0 MPa', ['−1 MPa', '+1 MPa', '−1.500 kPa']],
      [
        '¿Hacia dónde fluye el agua?',
        'De potencial mayor a menor (más negativo)',
        ['De potencial menor a mayor', 'Siempre hacia arriba', 'Hacia donde hay más luz'],
      ],
      [
        '¿Qué teoría explica el ascenso del agua por el xilema?',
        'Cohesión-tensión',
        ['Presión radical exclusiva', 'Ósmosis inversa', 'Capilaridad del floema'],
      ],
      [
        '¿Qué mide la cámara de Scholander?',
        'El potencial hídrico xilemático',
        ['La fotosíntesis neta', 'El pH de la savia', 'La conductividad del suelo'],
      ],
      [
        '¿Qué estructura de la raíz obliga al agua a pasar por membranas?',
        'La banda de Caspary en la endodermis',
        ['La cofia en el ápice de la raíz', 'Los pelos radicales de la epidermis', 'El floema del cilindro central'],
      ],
    ],
  }),

  submodule({
    order: 3,
    title: 'Transpiración y Estomas',
    description: 'Cómo la planta equilibra la entrada de CO₂ con la pérdida de agua: la regulación de los estomas.',
    subboss: { name: 'El Estoma Sellado', title: 'Guardián del Ácido Abscísico' },
    codexTitle: 'Estomas y Transpiración',
    sections: [
      {
        heading: 'El dilema del estoma',
        body: [
          'Para fijar CO₂ la hoja debe abrir los estomas, pero por el mismo poro sale vapor de agua. Una planta C3 transpira cientos de litros de agua por cada kilo de materia seca que produce.',
          'La transpiración no es solo pérdida: enfría la hoja, mueve los nutrientes disueltos por el xilema (incluido el calcio) y mantiene la tensión que sube el agua.',
        ],
      },
      {
        heading: 'Cómo se abren y cierran',
        body: [
          'Dos células oclusivas rodean el poro. Cuando acumulan K⁺ y solutos, entra agua, se hinchan y el poro se abre. La luz azul, el CO₂ interno bajo y la humedad favorecen la apertura.',
          'El ácido abscísico (ABA), producido cuando el suelo se seca, provoca la salida de K⁺ y el cierre del estoma. El DPV alto, el calor extremo y el CO₂ interno alto también los cierran.',
        ],
      },
      {
        heading: 'Uso eficiente del agua',
        body: [
          'La eficiencia en el uso del agua (EUA) es el carbono fijado por unidad de agua transpirada. Es mayor en plantas CAM, luego C4 y menor en C3.',
          'El riego deficitario controlado (RDC) aprovecha que un estrés moderado en fases poco sensibles reduce el crecimiento vegetativo sin afectar mucho la producción, ahorrando agua y mejorando la calidad, por ejemplo en vides para vino.',
          'El secado parcial de raíces (PRD) alterna el riego entre ambos lados del árbol: las raíces del lado seco envían ABA y la planta cierra parcialmente estomas mientras sigue hidratada.',
        ],
      },
    ],
    checkpoint: {
      at: 110,
      prompt: 'El suelo comienza a secarse y la hoja aún está turgente, pero los estomas ya se cierran. ¿Qué señal lo explica?',
      options: ['Más auxina en la hoja', 'ABA enviado desde las raíces', 'Exceso de luz azul', 'Aumento de giberelinas'],
      correctIndex: 1,
      explanation:
        'Las raíces en suelo seco producen ácido abscísico, que viaja por el xilema y cierra los estomas antes de que la hoja pierda turgencia.',
    },
    questions: [
      ['¿Qué hormona cierra los estomas ante sequía?', 'Ácido abscísico (ABA)', ['Giberelina', 'Citoquinina', 'Auxina']],
      ['¿Qué ion se acumula en las células oclusivas para abrir el estoma?', 'Potasio (K⁺)', ['Sodio', 'Cloro solo', 'Aluminio']],
      [
        '¿Qué beneficio aporta la transpiración además de mover agua?',
        'Enfría la hoja y transporta nutrientes como el calcio',
        [
          'Fija nitrógeno del aire en las hojas',
          'Libera el oxígeno producido en la raíz',
          'Aumenta la fotorrespiración en días frescos',
        ],
      ],
      ['¿Qué tipo de planta tiene la mayor eficiencia en el uso del agua?', 'CAM', ['C3', 'C4', 'Acuáticas sumergidas']],
      [
        '¿Qué busca el riego deficitario controlado?',
        'Reducir el vigor en fases poco sensibles sin afectar mucho la producción',
        [
          'Mantener el suelo siempre a capacidad de campo',
          'Retrasar la floración hasta la temporada siguiente',
          'Estresar al cultivo en floración para aumentar la cuaja',
        ],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Hormonas Vegetales',
    description: 'Auxinas, giberelinas, citoquininas, etileno y ABA: las señales que coordinan crecimiento, cuaja y maduración.',
    subboss: { name: 'El Etileno Maduro', title: 'Señor de la Abscisión' },
    codexTitle: 'Reguladores del Crecimiento',
    sections: [
      {
        heading: 'Las promotoras',
        body: [
          'Las auxinas (ácido indolacético) se producen en ápices y semillas. Causan la dominancia apical, el enraizamiento de estacas y el crecimiento del fruto; sintéticas como el ANA se usan para enraizar y para ralear.',
          'Las giberelinas alargan tallos, rompen la latencia de algunas semillas y agrandan bayas: en uva de mesa se aplica ácido giberélico (GA₃) para alargar el racimo y aumentar el calibre.',
          'Las citoquininas, formadas en la raíz, estimulan la división celular, retrasan la senescencia y rompen la dominancia apical. El balance auxina/citoquinina decide si un tejido forma raíces o brotes.',
        ],
      },
      {
        heading: 'Etileno y ABA',
        body: [
          'El etileno es un gas que desencadena la maduración de frutos climatéricos (manzana, palta, plátano, tomate) y la abscisión de hojas y frutos. En postcosecha se controla con frío, ventilación, atmósfera controlada y el 1-MCP, que bloquea sus receptores.',
          'El ácido abscísico (ABA) induce la dormancia de yemas y semillas y cierra estomas ante sequía.',
        ],
      },
      {
        heading: 'Uso agronómico',
        body: [
          'Los reguladores se usan a dosis muy bajas y el efecto depende de la especie, la variedad, la dosis y el estado fenológico. Un mismo producto puede ralear o cuajar según el momento.',
          'Ejemplos: ethephon (libera etileno) para uniformar maduración o ralear, AVG para retrasar la caída de frutos y la maduración, prohexadiona-calcio para frenar el crecimiento de brotes.',
        ],
      },
    ],
    checkpoint: {
      at: 125,
      prompt: '¿Qué aplicación aumenta el calibre de las bayas de uva de mesa?',
      options: ['Ácido abscísico', 'Ácido giberélico (GA₃)', '1-MCP', 'Ethephon en floración'],
      correctIndex: 1,
      explanation: 'Las giberelinas estimulan la elongación celular: en uva de mesa el GA₃ agranda las bayas y elonga el raquis.',
    },
    questions: [
      ['¿Qué hormona causa la dominancia apical?', 'Auxina', ['Etileno', 'Ácido abscísico', 'Citoquinina']],
      ['¿Qué hormona es un gas?', 'Etileno', ['Giberelina', 'Auxina', 'Citoquinina']],
      [
        '¿Qué hace el 1-MCP en postcosecha?',
        'Bloquea los receptores de etileno',
        ['Acelera la maduración', 'Aporta calcio', 'Elimina hongos'],
      ],
      [
        '¿Dónde se forman principalmente las citoquininas?',
        'En la raíz',
        ['En las flores', 'En la corteza muerta', 'En el fruto maduro'],
      ],
      ['¿Qué fruto es climatérico?', 'Palta', ['Uva', 'Cereza', 'Naranja']],
    ],
  }),

  submodule({
    order: 5,
    title: 'Fenología, Dormancia y Floración',
    description: 'Los estados fenológicos, la dormancia de yemas y los factores que inducen la floración.',
    subboss: { name: 'El Durmiente Endodormido', title: 'Guardián del Receso Invernal' },
    codexTitle: 'Fenología y Desarrollo',
    sections: [
      {
        heading: 'Fenología',
        body: [
          'La fenología estudia las etapas del ciclo (brotación, floración, cuaja, pinta, cosecha, caída de hojas) y su relación con el clima. Las escalas BBCH codifican cada estado con dos dígitos para que todos hablen el mismo idioma.',
          'Programar riego, fertilización y control de plagas según el estado fenológico, y no según el calendario, es la base del manejo moderno.',
        ],
      },
      {
        heading: 'Dormancia',
        body: [
          'Paradormancia: la yema no brota porque otro órgano la inhibe (dominancia apical). Endodormancia: la inhibición está en la propia yema y solo la rompe la acumulación de frío. Ecodormancia: la yema ya está lista, pero espera temperaturas favorables.',
          'Las semillas también tienen dormancia: por cubiertas duras (se rompe por escarificación) o por inhibidores internos (se rompe por estratificación en frío húmedo).',
        ],
      },
      {
        heading: 'Inducción floral',
        body: [
          'Algunas especies florecen según la duración del día (fotoperiodo): de día largo (espinaca, avena), de día corto (crisantemo, frutilla de día corto) o neutras.',
          'La vernalización es el frío que necesitan algunos cultivos para florecer, como el trigo de invierno o la remolacha, que es bianual.',
          'En frutales la inducción floral ocurre el verano anterior, en la temporada previa a la floración. Un exceso de carga frutal inhibe la inducción y genera añerismo: un año mucha fruta, el siguiente poca.',
        ],
      },
    ],
    checkpoint: {
      at: 155,
      prompt: 'Un manzano tuvo una cosecha muy cargada y al año siguiente casi no florece. ¿Qué fenómeno ocurrió?',
      options: [
        'Vernalización insuficiente',
        'Añerismo por inhibición de la inducción floral',
        'Ecodormancia',
        'Exceso de horas frío',
      ],
      correctIndex: 1,
      explanation:
        'Las semillas de una carga alta inhiben la inducción floral del verano: el año siguiente hay pocas flores. El raleo temprano lo previene.',
    },
    questions: [
      [
        '¿Qué tipo de dormancia solo se rompe con acumulación de frío?',
        'Endodormancia',
        ['Paradormancia', 'Ecodormancia', 'Fotodormancia'],
      ],
      [
        '¿Qué es la vernalización?',
        'El frío que algunos cultivos necesitan para florecer',
        [
          'El riego de invierno que rompe la dormancia',
          'La poda de primavera que estimula la flor',
          'El calor de verano que induce la floración',
        ],
      ],
      ['¿Qué escala codifica los estados fenológicos con dos dígitos?', 'BBCH', ['USDA', 'USLE', 'FAMACHA']],
      [
        '¿Cuándo ocurre la inducción floral en la mayoría de los frutales caducos?',
        'El verano de la temporada anterior',
        ['En la misma primavera de la floración', 'En plena cosecha del mismo año', 'Solo en invierno'],
      ],
      [
        '¿Cómo se rompe la dormancia de semillas de cubierta dura?',
        'Con escarificación',
        ['Con más fertilizante', 'Con sombra', 'Con inundación permanente'],
      ],
    ],
  }),
]

/** Pregunta final de la Raíz Senescente Ancestral. */
export const FISIOLOGIA_BOSS_FINAL = bossFinal(
  'Un huerto de cerezos muestra potencial de tallo −1,6 MPa al mediodía, estomas cerrados y hojas tibias en termografía, con el suelo aún húmedo en superficie. ¿Qué es lo más probable?',
  'La raíz dañada o asfixiada no abastece la demanda y el ABA cerró los estomas',
  [
    'Exceso de giberelinas que alarga los brotes y gasta el agua',
    'Fotorrespiración nula porque el cerezo es una planta C4',
    'Endodormancia de verano por exceso de horas frío',
  ],
)

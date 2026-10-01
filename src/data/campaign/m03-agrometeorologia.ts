import { campaignModule } from './helpers.ts'

/** Módulo 3 · Agrometeorología y Clima. */
const { submodule, bossFinal } = campaignModule(3)

export const AGROMETEOROLOGIA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Radiación y Balance de Energía',
    description: 'Onda corta, onda larga, albedo y radiación neta: la energía que mueve la fotosíntesis y el clima del huerto.',
    subboss: { name: 'Prisma Solar Descalibrado', title: 'Ladrón de Onda Larga' },
    codexTitle: 'Radiación Solar y Balance de Energía',
    sections: [
      {
        heading: 'Onda corta y onda larga',
        body: [
          'El sol emite radiación de onda corta (0,3 a 3 µm). Cerca de la mitad es radiación fotosintéticamente activa (PAR, 400-700 nm), la que usan las plantas.',
          'La Tierra, las plantas y las nubes, mucho más frías, emiten radiación de onda larga (infrarrojo térmico). En noches despejadas el suelo pierde onda larga hacia el cielo sin que nada la devuelva: así se enfría y se forman las heladas radiativas.',
        ],
      },
      {
        heading: 'Albedo y radiación neta',
        body: [
          'El albedo es la fracción de la radiación de onda corta que una superficie refleja: la nieve fresca refleja 80-90 %, un cultivo verde cerca de 20-25 % y un suelo oscuro y húmedo apenas 10 %.',
          'La radiación neta es lo que queda: onda corta absorbida más onda larga recibida menos onda larga emitida. De día es positiva; de noche, negativa.',
        ],
      },
      {
        heading: 'Dónde se va la energía',
        body: [
          'La radiación neta se reparte entre calor latente (evaporar agua), calor sensible (calentar el aire) y flujo de calor al suelo. Un cultivo bien regado usa la mayor parte en evapotranspirar; un suelo seco calienta el aire.',
          'Por eso un huerto regado está más fresco que un potrero seco, y un suelo húmedo y compacto guarda más calor del día para liberarlo en la noche.',
          'Las mallas sombra y las cubiertas modifican este balance: reducen la onda corta que llega al cultivo y la onda larga que este pierde de noche.',
        ],
      },
    ],
    checkpoint: {
      at: 90,
      prompt: '¿Por qué una noche despejada y sin viento es la más peligrosa para las heladas?',
      options: [
        'Porque llega más radiación solar',
        'Porque el suelo pierde onda larga hacia el cielo sin que vuelva',
        'Porque aumenta la humedad relativa',
        'Porque el viento trae aire frío',
      ],
      correctIndex: 1,
      explanation:
        'Sin nubes que devuelvan radiación, la pérdida de onda larga es máxima y el aire en contacto con el suelo se enfría más.',
    },
    questions: [
      [
        '¿Qué rango corresponde a la radiación fotosintéticamente activa (PAR)?',
        '400 a 700 nm',
        ['100 a 300 nm', '700 a 1.000 nm', '3 a 50 µm'],
      ],
      [
        '¿Qué es el albedo?',
        'La fracción de radiación de onda corta reflejada',
        ['La radiación absorbida de noche', 'La temperatura del suelo', 'La humedad del aire'],
      ],
      ['¿Qué superficie tiene el albedo más alto?', 'Nieve fresca', ['Suelo oscuro húmedo', 'Cultivo verde', 'Agua profunda']],
      [
        '¿En qué se usa la mayor parte de la radiación neta de un cultivo bien regado?',
        'En calor latente (evapotranspiración)',
        ['En calor sensible (calentar el aire)', 'En flujo de calor hacia el suelo', 'En radiación reflejada (albedo)'],
      ],
      [
        '¿Qué tipo de radiación emiten el suelo y las plantas?',
        'Onda larga (infrarrojo térmico)',
        ['Onda corta visible (PAR)', 'Ultravioleta (UV-B)', 'Onda corta infrarroja cercana'],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'Temperatura, Grados Día y Horas Frío',
    description: 'Cómo la temperatura marca el ritmo del cultivo: sumas térmicas para crecer y frío invernal para despertar.',
    subboss: { name: 'Criomante del Meristema', title: 'Contador de Horas Frío' },
    codexTitle: 'Temperatura y Sumas Térmicas',
    sections: [
      {
        heading: 'Grados día',
        body: [
          'El desarrollo de plantas e insectos se acelera con la temperatura sobre un umbral base. Los grados día (GD) suman cada día la temperatura media menos esa base: con base 10 °C, un día de media 18 °C aporta 8 GD.',
          'Cada fase (emergencia, floración, cosecha) necesita una suma térmica más o menos constante. Por eso los GD predicen fechas de cosecha en maíz o vid, y el momento de control de plagas como la polilla de la manzana (Cydia pomonella).',
        ],
      },
      {
        heading: 'Horas frío y receso',
        body: [
          'Los frutales caducos entran en endodormancia en otoño y necesitan acumular frío para brotar parejo en primavera. Una hora frío clásica es una hora bajo 7,2 °C.',
          'El modelo Utah (unidades de frío) da peso máximo a temperaturas cercanas a 6-7 °C y resta frío con temperaturas altas. El modelo dinámico (porciones de frío) es hoy el más usado para climas templados como el chileno.',
          'Si el frío no alcanza, la brotación y la floración son tardías y desuniformes. En esos casos se usan compensadores de frío, como la cianamida hidrogenada.',
        ],
      },
      {
        heading: 'Temperaturas extremas',
        body: [
          'Sobre unos 35 °C muchas especies cierran estomas, baja la fotosíntesis y aparecen daños como golpe de sol en frutos. El calor en floración puede reducir la viabilidad del polen y la cuaja.',
          'La temperatura del aire se mide en una garita meteorológica a 1,5-2 m, ventilada y a la sombra; un termómetro al sol puede marcar varios grados más que el aire real.',
        ],
      },
    ],
    checkpoint: {
      at: 120,
      prompt: 'Con temperatura base 10 °C, ¿cuántos grados día aportan tres días de media 14, 16 y 20 °C?',
      options: ['50 GD', '20 GD', '30 GD', '16 GD'],
      correctIndex: 1,
      explanation: '(14 − 10) + (16 − 10) + (20 − 10) = 4 + 6 + 10 = 20 GD.',
    },
    questions: [
      [
        '¿Qué umbral define una hora frío en el modelo clásico?',
        'Una hora bajo 7,2 °C',
        ['Una hora bajo 0 °C', 'Una hora bajo 15 °C', 'Una hora con helada'],
      ],
      [
        '¿Qué pasa si un frutal caduco no acumula suficiente frío?',
        'Brota y florece tarde y desuniforme',
        ['Florece antes de tiempo', 'Aumenta el calibre', 'Pierde las raíces'],
      ],
      [
        '¿Qué producto se usa como compensador de frío?',
        'Cianamida hidrogenada',
        ['Urea', 'Ácido giberélico', 'Sulfato de cobre'],
      ],
      [
        '¿Para qué plaga se usan grados día en el monitoreo?',
        'Polilla de la manzana',
        ['Oídio del manzano', 'Botrytis de la vid', 'Nematodo agallador'],
      ],
      [
        '¿A qué altura se mide la temperatura del aire en una estación meteorológica?',
        'Entre 1,5 y 2 m, en garita a la sombra',
        ['A ras de suelo, en garita a la sombra', 'Entre 1,5 y 2 m, al sol directo', 'A 10 m, sobre una torre al sol'],
      ],
    ],
  }),

  submodule({
    order: 3,
    title: 'Heladas: Tipos y Control',
    description: 'Heladas radiativas y advectivas, la inversión térmica y los métodos activos y pasivos para proteger el huerto.',
    subboss: { name: 'El Inversor Térmico', title: 'Señor de la Noche Despejada' },
    codexTitle: 'Heladas y su Control',
    sections: [
      {
        heading: 'Tipos de helada',
        body: [
          'La helada radiativa ocurre en noches despejadas y calmas: el suelo pierde onda larga, el aire en contacto se enfría y se forma una inversión térmica, con aire más cálido unos metros arriba. Es la más común en los valles centrales de Chile.',
          'La helada advectiva llega con una masa de aire polar y viento: no hay inversión y el frío afecta toda la columna de aire. Es mucho más difícil de controlar.',
          'La helada blanca deposita escarcha porque el aire alcanza el punto de rocío; la helada negra ocurre con aire seco, sin escarcha visible, y suele ser más dañina porque no libera calor latente.',
        ],
      },
      {
        heading: 'Daño y temperatura crítica',
        body: [
          'El daño ocurre cuando se forma hielo dentro de los tejidos. Cada estado fenológico tiene una temperatura crítica: las flores abiertas y los frutos recién cuajados son más sensibles que las yemas dormidas.',
          'Las tablas de temperaturas críticas suelen indicar el valor que mata al 10 % y al 90 % de los órganos en cada estado.',
        ],
      },
      {
        heading: 'Métodos de control',
        body: [
          'Pasivos: elegir sitios con buen drenaje de aire frío (evitar hondonadas), mantener el suelo húmedo, compacto y sin cubierta vegetal alta para que acumule calor, y elegir variedades de floración tardía.',
          'Activos: los ventiladores (máquinas de viento) mezclan el aire cálido de la inversión con el frío de abajo, y solo sirven en heladas radiativas. La aspersión sobre el follaje libera calor latente al congelarse el agua: debe mantenerse sin interrupción hasta que el hielo se derrita. Los calefactores agregan calor directo.',
          'Si la aspersión se interrumpe o la tasa de agua es baja, la evaporación roba calor y el daño puede ser peor que sin proteger.',
        ],
      },
    ],
    checkpoint: {
      at: 160,
      prompt: 'Se anuncia una helada con viento sur de 20 km/h y cielo despejado. ¿Qué método activo servirá menos?',
      options: ['Aspersión sobre el follaje', 'Ventiladores (máquinas de viento)', 'Calefactores', 'Riego previo del suelo'],
      correctIndex: 1,
      explanation:
        'Con viento la helada es advectiva: no hay inversión térmica con aire cálido arriba, así que los ventiladores no tienen nada que mezclar.',
    },
    questions: [
      [
        '¿Qué fenómeno ocurre en una helada radiativa?',
        'Inversión térmica: aire más cálido sobre el aire frío del suelo',
        [
          'Advección: una masa de aire polar entra con viento',
          'Convección: el aire frío sube y el cálido baja',
          'Nubosidad baja que atrapa el aire frío junto al suelo',
        ],
      ],
      [
        '¿Por qué la helada negra suele ser más dañina?',
        'El aire seco no forma escarcha ni libera calor latente',
        [
          'Ocurre con viento fuerte que impide controlarla',
          'La escarcha bloquea la luz y quema las hojas',
          'Siempre viene acompañada de granizo y lluvia',
        ],
      ],
      [
        '¿Cómo protege la aspersión contra heladas?',
        'El agua libera calor latente al congelarse',
        ['Aísla con aire caliente', 'Sube la humedad del suelo a 100 %', 'Derrite la escarcha con sal'],
      ],
      [
        '¿Qué práctica pasiva ayuda contra heladas?',
        'Mantener el suelo húmedo, compacto y sin cubierta alta',
        ['Plantar en hondonadas', 'Cultivar el suelo antes de la helada', 'Dejar pasto alto entre hileras'],
      ],
      [
        '¿Qué órgano es más sensible a una helada?',
        'El fruto recién cuajado',
        ['La yema dormida', 'La madera de dos años', 'La raíz profunda'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Humedad, Viento y Evapotranspiración',
    description: 'Del vapor de agua en el aire a la ET de referencia: cuánta agua pide la atmósfera y cuánta usa el cultivo.',
    subboss: { name: 'Viento Psicrométrico', title: 'Amo de la ET₀' },
    codexTitle: 'Humedad, Viento y Evapotranspiración',
    sections: [
      {
        heading: 'Humedad del aire',
        body: [
          'La humedad relativa (HR) es el vapor presente respecto del máximo que el aire admite a esa temperatura. Como el máximo sube con la temperatura, la HR baja al mediodía y sube de noche aunque el vapor no cambie.',
          'El déficit de presión de vapor (DPV) es la diferencia entre la presión de vapor de saturación y la real: mide cuánto "tira" la atmósfera del agua de la hoja. Un DPV alto aumenta la transpiración y puede cerrar estomas.',
          'El punto de rocío es la temperatura a la que el aire se satura al enfriarse: sirve para anticipar heladas y el mojado de las hojas, que favorece enfermedades.',
        ],
      },
      {
        heading: 'ET de referencia',
        body: [
          'La evapotranspiración de referencia (ET₀) es lo que evapotranspira una pradera de referencia bien regada. La FAO la estandarizó con la ecuación de Penman-Monteith (FAO-56), que usa radiación, temperatura, humedad y viento.',
          'Un método simple es la bandeja de evaporación clase A: la evaporación medida se multiplica por un coeficiente de bandeja (Kp, alrededor de 0,7-0,8) para estimar ET₀.',
        ],
      },
      {
        heading: 'Del clima al riego',
        body: [
          'La evapotranspiración del cultivo es ETc = ET₀ × Kc. El coeficiente de cultivo (Kc) cambia con la fenología: es bajo en la etapa inicial, máximo en pleno desarrollo y baja hacia la madurez.',
          'El viento aumenta la ET porque renueva el aire húmedo junto a la hoja; también daña físicamente brotes y frutos, por eso se usan cortavientos.',
          'Las estaciones meteorológicas de la red agroclimática (Agromet en Chile) publican ET₀ diaria para programar el riego.',
        ],
      },
    ],
    checkpoint: {
      at: 140,
      prompt: 'La ET₀ del día es 6 mm y el Kc del cultivo en plena temporada es 1,1. ¿Cuál es la ETc?',
      options: ['5,5 mm', '6,6 mm', '7,1 mm', '0,18 mm'],
      correctIndex: 1,
      explanation: 'ETc = ET₀ × Kc = 6 × 1,1 = 6,6 mm/día.',
    },
    questions: [
      [
        '¿Qué ecuación estandarizó la FAO para calcular la ET₀?',
        'Penman-Monteith (FAO-56)',
        ['Ley de Stokes', 'Ecuación USLE', 'Ley de Darcy'],
      ],
      [
        '¿Cómo se calcula la evapotranspiración del cultivo?',
        'ETc = ET₀ × Kc',
        ['ETc = ET₀ + Kc', 'ETc = ET₀ / Kc', 'ETc = lluvia − ET₀'],
      ],
      [
        '¿Qué mide el déficit de presión de vapor (DPV)?',
        'Cuánto demanda agua la atmósfera a la hoja',
        ['La lluvia acumulada', 'La presión del agua de riego', 'La temperatura del suelo'],
      ],
      [
        '¿Por qué la humedad relativa baja al mediodía?',
        'El aire caliente admite más vapor',
        ['El sol destruye el vapor', 'Las plantas absorben el vapor', 'Siempre llueve de noche'],
      ],
      [
        '¿Para qué sirve conocer el punto de rocío?',
        'Para anticipar heladas y mojado de hojas',
        ['Para calcular la suma de grados día', 'Para estimar la radiación neta del día', 'Para medir la velocidad del viento'],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Clima de Chile y Riesgo Agroclimático',
    description: 'Los climas del país, El Niño y La Niña, la sequía y el cambio climático en la planificación agrícola.',
    subboss: { name: 'Autómata de la Caseta Meteorológica', title: 'Vigía del Riesgo Climático' },
    codexTitle: 'Clima de Chile y Riesgo',
    sections: [
      {
        heading: 'Los climas de Chile',
        body: [
          'El norte es desértico por el Anticiclón del Pacífico Sur y la corriente de Humboldt, que estabilizan la atmósfera; en la costa aparece la camanchaca. El centro tiene clima mediterráneo: lluvias concentradas en invierno y veranos secos, por eso la agricultura depende del riego.',
          'Hacia el sur aumentan las lluvias y disminuye la temperatura; la Patagonia es fría y ventosa. La Cordillera de los Andes guarda el agua como nieve, que alimenta los ríos en primavera y verano.',
        ],
      },
      {
        heading: 'El Niño y La Niña',
        body: [
          'El ENOS (El Niño-Oscilación del Sur) alterna fases cálidas y frías del Pacífico ecuatorial. En la zona central de Chile, El Niño suele traer inviernos más lluviosos y La Niña, inviernos más secos.',
          'Los años secos y fríos también favorecen heladas más frecuentes. Seguir los pronósticos estacionales ayuda a decidir siembras, seguros y uso del agua.',
        ],
      },
      {
        heading: 'Sequía y cambio climático',
        body: [
          'Desde 2010 la zona central vivió una megasequía con déficit de lluvias por más de una década, con menor nieve acumulada y caudales reducidos.',
          'Las tendencias apuntan a menos precipitación y más temperatura en el centro y norte, con la isoterma 0 °C más alta y menos reserva de nieve. Esto desplaza zonas aptas para cultivos hacia el sur.',
          'La adaptación combina riego tecnificado, especies y portainjertos tolerantes, cosecha de agua, seguros agrícolas y monitoreo agroclimático.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: 'Se pronostica un invierno con fase La Niña en la zona central. ¿Qué escenario es más probable?',
      options: [
        'Invierno más lluvioso que lo normal',
        'Invierno más seco y con heladas más frecuentes',
        'Sin efecto sobre las lluvias',
        'Nevazones en la costa del norte',
      ],
      correctIndex: 1,
      explanation:
        'La Niña suele asociarse a inviernos más secos en la zona central, con cielos despejados que favorecen las heladas radiativas.',
    },
    questions: [
      ['¿Qué tipo de clima tiene la zona central de Chile?', 'Mediterráneo', ['Tropical lluvioso', 'Desértico extremo', 'Polar']],
      [
        '¿Qué fase del ENOS suele traer inviernos más lluviosos a Chile central?',
        'El Niño',
        ['La Niña', 'Fase neutra', 'Ninguna'],
      ],
      [
        '¿Qué causa la aridez del norte de Chile?',
        'El Anticiclón del Pacífico y la corriente de Humboldt',
        [
          'La Cordillera de la Costa, que bloquea toda la lluvia',
          'El viento puelche que baja seco desde los Andes',
          'La corriente de El Niño, que calienta la costa',
        ],
      ],
      [
        '¿Qué efecto del cambio climático preocupa para el riego en la zona central?',
        'Menos nieve acumulada en la cordillera',
        ['Más glaciares', 'Lluvias de verano abundantes', 'Menor temperatura media'],
      ],
      [
        '¿Desde cuándo vive la zona central la llamada megasequía?',
        'Desde alrededor de 2010',
        ['Desde 1960', 'Desde 2023', 'Desde la época colonial'],
      ],
    ],
  }),
]

/** Pregunta final de la Tempestad de Escarcha Negra. */
export const AGROMETEOROLOGIA_BOSS_FINAL = bossFinal(
  'Noche despejada y calma, punto de rocío −4 °C, cerezos en plena flor y ventiladores disponibles. ¿Qué indica el pronóstico y qué conviene hacer?',
  'Riesgo de helada negra radiativa: encender los ventiladores antes de llegar a la temperatura crítica',
  [
    'Helada advectiva: no hacer nada',
    'Helada blanca leve: cubrir solo el suelo con paja',
    'Encender la aspersión y apagarla al amanecer antes del deshielo',
  ],
)

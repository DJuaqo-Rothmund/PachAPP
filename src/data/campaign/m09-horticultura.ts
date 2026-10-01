import { campaignModule } from './helpers.ts'

/** Módulo 9 · Horticultura e Invernaderos. */
const { submodule, bossFinal } = campaignModule(9)

export const HORTICULTURA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Hortalizas: Clasificación y Fisiología',
    description: 'Hortalizas de estación fría y cálida, el fotoperiodo y por qué una lechuga se "sube" o una cebolla no bulba.',
    subboss: { name: 'El Bulbo Prematuro', title: 'Señor del Fotoperiodo' },
    codexTitle: 'Fisiología de Hortalizas',
    sections: [
      {
        heading: 'Estación fría y estación cálida',
        body: [
          'Las hortalizas de estación fría (lechuga, repollo, brócoli, arveja, espinaca, ajo) crecen mejor entre 15 y 20 °C y toleran heladas suaves. Las de estación cálida (tomate, pimiento, poroto, zapallo, melón, sandía) necesitan más de 18-20 °C y no toleran heladas.',
          'Sembrar cada especie en su ventana térmica evita problemas como la emisión prematura del tallo floral o la mala cuaja.',
        ],
      },
      {
        heading: 'Fotoperiodo y vernalización',
        body: [
          'La cebolla forma bulbo cuando el día supera un largo crítico: hay cultivares de día corto (para siembras de otoño en el norte) y de día largo (para el sur o siembras de primavera). Un cultivar mal elegido no bulba o bulba antes de tiempo, con bulbos pequeños.',
          'La lechuga y la espinaca se "suben" (emiten el tallo floral) con días largos y calor, y pierden calidad. Las brassicas bianuales, como el repollo, pueden florecer prematuramente si un frío prolongado las vernaliza cuando ya son plantas grandes.',
        ],
      },
      {
        heading: 'Órganos cosechados',
        body: [
          'Se cosechan hojas (lechuga, acelga), inflorescencias (brócoli, coliflor, alcachofa), raíces (zanahoria, betarraga), tubérculos (papa), bulbos (cebolla, ajo), frutos inmaduros (pepino, zapallo italiano, poroto verde) o maduros (tomate, melón).',
          'El órgano cosechado define el manejo: las hortalizas de hoja necesitan más nitrógeno y agua constante; las de fruto, más potasio y una buena cuaja.',
        ],
      },
    ],
    checkpoint: {
      at: 115,
      prompt: 'En el sur de Chile se sembró en primavera una cebolla de día corto. ¿Qué es esperable?',
      options: [
        'Bulbos grandes en otoño',
        'Bulbificación prematura con bulbos pequeños',
        'Que nunca germine',
        'Que florezca en invierno',
      ],
      correctIndex: 1,
      explanation:
        'Los días largos del verano austral superan con creces el umbral de un cultivar de día corto: bulba muy temprano y queda pequeño.',
    },
    questions: [
      ['¿Qué hortaliza es de estación cálida?', 'Pimiento', ['Lechuga', 'Espinaca', 'Arveja']],
      [
        '¿Qué gatilla la formación de bulbo en cebolla?',
        'El largo del día (fotoperiodo)',
        ['La lluvia', 'La fertilización potásica', 'El frío del suelo'],
      ],
      [
        '¿Qué significa que una lechuga se "suba"?',
        'Que emite el tallo floral y pierde calidad',
        [
          'Que forma una cabeza compacta y firme',
          'Que crece más rápido por exceso de nitrógeno',
          'Que se pudre en el cuello por exceso de agua',
        ],
      ],
      ['¿Qué órgano se cosecha en el brócoli?', 'La inflorescencia', ['La raíz', 'El bulbo', 'El fruto maduro']],
      [
        '¿Qué necesitan especialmente las hortalizas de hoja?',
        'Nitrógeno y agua constante',
        ['Estrés hídrico', 'Poca luz', 'Mucho fósforo y sequía'],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'Almácigos y Establecimiento',
    description: 'Semillas, sustratos, bandejas y trasplante: los primeros 30 días que deciden la temporada.',
    subboss: { name: 'El Damping-off', title: 'Segador de Plántulas' },
    codexTitle: 'Almácigos y Trasplante',
    sections: [
      {
        heading: 'Siembra directa o almácigo',
        body: [
          'Algunas hortalizas se siembran directo porque su raíz no tolera el trasplante (zanahoria, rábano, arveja, poroto). Otras se producen en almácigo y se trasplantan (tomate, pimiento, lechuga, cebolla, brassicas), lo que ahorra semilla cara y acorta el tiempo en campo.',
          'Las bandejas alveoladas (speedling) producen plantas con un pan de raíces que se trasplanta casi sin estrés.',
        ],
      },
      {
        heading: 'Sustrato y ambiente',
        body: [
          'Un buen sustrato es liviano, poroso, retiene agua y está libre de patógenos y malezas: turba, fibra de coco, perlita o vermiculita. La temperatura óptima de germinación varía: el tomate germina mejor cerca de 25 °C; la lechuga se inhibe sobre unos 28 °C (termodormancia).',
          'Antes del trasplante se "endurecen" las plantas: menos riego y más exposición al exterior, para que toleren el cambio.',
        ],
      },
      {
        heading: 'Caída de plántulas',
        body: [
          'El damping-off (caída de almácigos) lo causan hongos y oomicetos del suelo como Pythium, Rhizoctonia y Fusarium: las plántulas se estrangulan en el cuello y caen.',
          'Lo favorecen el exceso de riego, la mala ventilación, sembrar muy denso y usar sustratos o bandejas contaminadas. Se previene con sustrato nuevo, bandejas desinfectadas, riego moderado y buena aireación.',
        ],
      },
    ],
    checkpoint: {
      at: 130,
      prompt: 'Un almácigo regado en exceso y muy denso muestra plántulas que se doblan en el cuello y caen. ¿Qué es?',
      options: ['Termodormancia', 'Damping-off (Pythium, Rhizoctonia)', 'Falta de nitrógeno', 'Exceso de luz'],
      correctIndex: 1,
      explanation:
        'El estrangulamiento del cuello en plántulas es el damping-off, favorecido por exceso de agua y poca ventilación.',
    },
    questions: [
      ['¿Qué hortaliza conviene sembrar directo por no tolerar el trasplante?', 'Zanahoria', ['Tomate', 'Lechuga', 'Repollo']],
      [
        '¿Qué ventaja tienen las bandejas alveoladas?',
        'Plantas con pan de raíces que se trasplantan con poco estrés',
        [
          'Plantas que no necesitan riego tras el trasplante',
          'Plantas inmunes a las plagas del campo',
          'Plantas que florecen antes de salir al campo',
        ],
      ],
      [
        '¿Qué patógenos causan el damping-off?',
        'Pythium, Rhizoctonia y Fusarium',
        ['Virus del mosaico', 'Bacterias fijadoras de N', 'Nematodos agalladores'],
      ],
      [
        '¿Qué es el endurecimiento de plántulas?',
        'Reducir riego y exponerlas al exterior antes del trasplante',
        [
          'Aplicar calcio al sustrato una semana antes',
          'Guardar las bandejas en frío hasta el trasplante',
          'Podar las raíces para que crezcan más',
        ],
      ],
      [
        '¿Qué le pasa a la semilla de lechuga sobre unos 28 °C?',
        'Entra en termodormancia y no germina',
        ['Germina más rápido', 'Produce plantas gigantes', 'Se vuelve resistente a plagas'],
      ],
    ],
  }),

  submodule({
    order: 3,
    title: 'Clima del Invernadero',
    description: 'Temperatura, humedad, DPV, CO₂ y ventilación: cómo se gobierna el ambiente protegido.',
    subboss: { name: 'La Niebla del Invernadero', title: 'Condensadora del Rocío' },
    codexTitle: 'Control del Clima en Invernadero',
    sections: [
      {
        heading: 'El efecto invernadero',
        body: [
          'La cubierta deja pasar la radiación solar y retiene parte del calor: de día sube la temperatura y de noche se pierde menos. Los plásticos térmicos (con aditivos que bloquean el infrarrojo largo) reducen el enfriamiento nocturno.',
          'En verano el problema es el exceso de calor: se maneja con ventilación cenital y lateral, mallas sombra, blanqueo de la cubierta y nebulización.',
        ],
      },
      {
        heading: 'Humedad y DPV',
        body: [
          'El déficit de presión de vapor (DPV) resume humedad y temperatura. Un DPV muy bajo (aire saturado) frena la transpiración, reduce la absorción de calcio y favorece Botrytis y mildiú; un DPV muy alto estresa y cierra estomas.',
          'Para la mayoría de los cultivos se busca un DPV aproximado de 0,5 a 1,2 kPa. Si la cubierta o las plantas se enfrían bajo el punto de rocío, el agua se condensa y gotea sobre el cultivo.',
        ],
      },
      {
        heading: 'Ventilación y CO₂',
        body: [
          'Ventilar renueva el aire, saca humedad y calor y repone el CO₂ que las plantas consumen. En un invernadero cerrado y soleado el CO₂ puede caer muy bajo y limitar la fotosíntesis; algunos productores lo enriquecen hasta 700-1.000 ppm.',
          'Las ventanas cenitales son más eficientes que las laterales porque el aire caliente sube (efecto chimenea).',
        ],
      },
    ],
    checkpoint: {
      at: 145,
      prompt:
        'Al amanecer el invernadero tiene 98 % de humedad y gotea agua desde la cubierta. ¿Qué riesgo aumenta y qué conviene hacer?',
      options: [
        'Arañita roja: cerrar todo',
        'Botrytis y mildiú: ventilar y calentar suavemente para bajar la humedad',
        'Golpe de sol: blanquear la cubierta',
        'Deficiencia de N: fertilizar',
      ],
      correctIndex: 1,
      explanation:
        'Con DPV casi nulo y agua libre sobre las hojas, los hongos germinan fácilmente. Ventilar y subir algo la temperatura reduce la humedad.',
    },
    questions: [
      [
        '¿Qué rango de DPV se busca en la mayoría de los cultivos de invernadero?',
        'Entre 0,5 y 1,2 kPa',
        ['Entre 5 y 8 kPa', 'Exactamente 0 kPa', 'Más de 3 kPa siempre'],
      ],
      [
        '¿Qué provoca un DPV muy bajo (aire saturado)?',
        'Menor transpiración y más enfermedades fúngicas',
        [
          'Cierre de estomas por sequía atmosférica',
          'Golpe de sol en los frutos expuestos',
          'Mayor absorción de calcio por los frutos',
        ],
      ],
      [
        '¿Por qué las ventanas cenitales ventilan mejor?',
        'El aire caliente sube y sale por arriba',
        ['Porque son más grandes', 'Porque entra más polvo', 'Porque bloquean el viento'],
      ],
      [
        '¿Para qué se usan los plásticos térmicos?',
        'Para reducir la pérdida de calor nocturno',
        ['Para dejar pasar más radiación UV', 'Para bajar la humedad del invernadero', 'Para atraer polinizadores al cultivo'],
      ],
      [
        '¿Hasta qué nivel suelen enriquecer CO₂ algunos invernaderos?',
        '700 a 1.000 ppm',
        ['50 ppm', '5.000 a 10.000 ppm', '0 ppm'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Fertirriego y Cultivo sin Suelo',
    description: 'Solución nutritiva, CE y pH del gotero, sustratos e hidroponía.',
    subboss: { name: 'El Gotero Obstruido', title: 'Tirano de la Conductividad' },
    codexTitle: 'Fertirriego e Hidroponía',
    sections: [
      {
        heading: 'Fertirriego',
        body: [
          'El fertirriego entrega agua y nutrientes juntos por goteo, en pequeñas dosis frecuentes. Se controla midiendo la conductividad eléctrica (CE) y el pH de la solución en el gotero y en el drenaje.',
          'Para tomate en producción se trabaja con CE cercanas a 2-3 dS/m y pH entre 5,5 y 6,5. No se deben mezclar en el mismo estanque calcio con sulfatos o fosfatos, porque precipitan y tapan goteros: se usan estanques A y B separados.',
        ],
      },
      {
        heading: 'Cultivo sin suelo',
        body: [
          'En sustratos (fibra de coco, lana de roca, perlita) o en hidroponía pura (NFT, raíz flotante) toda la nutrición depende de la solución. Las ventajas: evita patógenos del suelo, controla mejor la nutrición y logra rendimientos altos.',
          'Se riega con un porcentaje de drenaje (20 a 30 %) para evitar la acumulación de sales en la zona de raíces; si la CE del drenaje sube mucho sobre la del gotero, hay que aumentar el drenaje.',
        ],
      },
      {
        heading: 'Desórdenes nutricionales típicos',
        body: [
          'La pudrición apical del tomate y el pimiento es una deficiencia de calcio en el fruto, ligada a riego irregular, alta CE o baja transpiración, más que a falta de calcio en la solución.',
          'El tip burn de la lechuga también es falta de calcio en hojas jóvenes que transpiran poco, en cabezas que crecen muy rápido.',
        ],
      },
    ],
    checkpoint: {
      at: 150,
      prompt: 'El gotero entrega CE 2,5 dS/m y el drenaje mide 5,0 dS/m. ¿Qué indica?',
      options: [
        'Que falta fertilizante',
        'Acumulación de sales: hay que aumentar el porcentaje de drenaje',
        'Que el pH es perfecto',
        'Que la planta absorbe demasiada agua',
      ],
      correctIndex: 1,
      explanation:
        'Si el drenaje duplica la CE del gotero, las sales se están acumulando en el sustrato: se debe lavar con más drenaje.',
    },
    questions: [
      [
        '¿Por qué se usan estanques A y B separados en fertirriego?',
        'Para que el calcio no precipite con sulfatos y fosfatos',
        [
          'Para regar dos sectores del invernadero a la vez',
          'Para separar el agua fría de la temperada',
          'Para que el ácido no se mezcle con los herbicidas',
        ],
      ],
      [
        '¿Qué rango de pH se busca en la solución nutritiva?',
        'Entre 5,5 y 6,5',
        ['Entre 8 y 9', 'Entre 3 y 4', 'Exactamente 7,5'],
      ],
      [
        '¿Qué causa la pudrición apical del tomate?',
        'Falta de calcio en el fruto',
        ['Exceso de potasio', 'Un virus', 'Falta de hierro'],
      ],
      [
        '¿Qué porcentaje de drenaje suele usarse en cultivo en sustrato?',
        'Entre 20 y 30 %',
        ['0 %', '80 a 90 %', 'Exactamente 50 %'],
      ],
      [
        '¿Qué es el sistema NFT?',
        'Hidroponía con una lámina delgada de solución que circula por canales',
        [
          'Riego por goteo enterrado bajo un suelo arenoso',
          'Cultivo en fibra de coco sin drenaje',
          'Hidroponía con raíces en un estanque de agua quieta',
        ],
      ],
    ],
  }),

  submodule({
    order: 5,
    title: 'Plagas y Manejo Integrado',
    description: 'Mosquita blanca, trips, polilla del tomate y control biológico en ambiente protegido.',
    subboss: { name: 'La Mosquita Blanca Legionaria', title: 'Reina del Envés' },
    codexTitle: 'Manejo Integrado de Plagas en Hortalizas',
    sections: [
      {
        heading: 'Plagas clave',
        body: [
          'La mosquita blanca (Trialeurodes vaporariorum y Bemisia tabaci) succiona savia desde el envés, produce mielecilla donde crece fumagina y transmite virus. Los trips (Frankliniella occidentalis) dañan flores y frutos y transmiten el virus del bronceado del tomate (TSWV).',
          'La polilla del tomate (Tuta absoluta) mina hojas, tallos y frutos: es la plaga más importante del tomate en Chile.',
        ],
      },
      {
        heading: 'Monitoreo y barreras',
        body: [
          'El monitoreo con trampas adhesivas amarillas (mosquita blanca) y azules (trips), y con feromonas para Tuta absoluta, permite actuar antes de llegar al umbral de daño.',
          'Las mallas antiinsectos en ventanas, la doble puerta, la eliminación de malezas hospederas y de restos de cultivo cortan la entrada y el ciclo de las plagas.',
        ],
      },
      {
        heading: 'Control biológico',
        body: [
          'En invernadero el control biológico funciona muy bien porque el ambiente es cerrado: Encarsia formosa parasita ninfas de mosquita blanca; ácaros depredadores como Amblyseius swirskii atacan mosquita blanca y trips; Phytoseiulus persimilis controla arañita roja.',
          'El uso de insecticidas de amplio espectro mata a esos enemigos naturales; por eso el manejo integrado prioriza productos selectivos y rota modos de acción para evitar resistencia.',
        ],
      },
    ],
    checkpoint: {
      at: 160,
      prompt: 'Se liberó Encarsia formosa contra mosquita blanca y ahora aparece arañita roja. ¿Qué conviene?',
      options: [
        'Aplicar un insecticida de amplio espectro',
        'Liberar Phytoseiulus persimilis y no usar productos que dañen a Encarsia',
        'Cerrar el invernadero sin ventilar',
        'Aumentar el nitrógeno',
      ],
      correctIndex: 1,
      explanation:
        'Un amplio espectro eliminaría a Encarsia. Phytoseiulus persimilis es el depredador específico de la arañita roja.',
    },
    questions: [
      ['¿Qué color de trampa adhesiva atrae a la mosquita blanca?', 'Amarillo', ['Azul', 'Rojo', 'Negro']],
      [
        '¿Qué parasitoide controla ninfas de mosquita blanca?',
        'Encarsia formosa',
        ['Phytoseiulus persimilis', 'Trichoderma', 'Bacillus thuringiensis'],
      ],
      [
        '¿Qué plaga mina hojas, tallos y frutos de tomate?',
        'Tuta absoluta (polilla del tomate)',
        ['Arañita roja (Tetranychus urticae)', 'Pulgón verde (Myzus persicae)', 'Trips (Frankliniella occidentalis)'],
      ],
      [
        '¿Qué virus transmiten los trips en tomate?',
        'Virus del bronceado del tomate (TSWV)',
        ['Virus del mosaico del pepino solo por semilla', 'RBDV', 'Virus de Newcastle'],
      ],
      [
        '¿Por qué se rotan modos de acción de insecticidas?',
        'Para evitar que las plagas desarrollen resistencia',
        [
          'Para que los productos resulten más baratos',
          'Para atraer polinizadores al invernadero',
          'Para que un producto controle más plagas',
        ],
      ],
    ],
  }),
]

/** Pregunta final del Climatizador Desbocado. */
export const HORTICULTURA_BOSS_FINAL = bossFinal(
  'Tomates en invernadero cerrado muestran pudrición apical en frutos, CE de drenaje alta y humedad del 95 % durante días nublados. ¿Cuál es el manejo correcto?',
  'Ventilar para bajar la humedad y subir la transpiración, regar con más drenaje y frecuencia regular',
  [
    'Agregar más calcio a la solución sin cambiar el riego ni el clima',
    'Cerrar las ventanas para subir la temperatura y la humedad',
    'Reducir el riego para concentrar la solución y endurecer el fruto',
  ],
)

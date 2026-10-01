import { campaignModule } from './helpers.ts'

/** Módulo 9 · Horticultura e Invernaderos. */
const { submodule, bossFinal } = campaignModule(9)

export const HORTICULTURA_SUBMODULES = [
  submodule({
    order: 1,
    title: 'Estructuras y Materiales de Cubierta',
    description: 'Túneles, invernaderos de capilla y multinave, y los plásticos que deciden cuánta luz y calor entran.',
    subboss: { name: 'Arquitecto de Túneles', title: 'Constructor del Ambiente Protegido' },
    codexTitle: 'Estructuras y Cubiertas',
    sections: [
      {
        heading: 'Tipos de estructura',
        body: [
          'El microtúnel o túnel bajo cubre una o dos hileras y se usa unas semanas para adelantar cultivos o protegerlos de heladas. El macrotúnel permite trabajar dentro y es común en berries y hortalizas. El invernadero de capilla (dos aguas) y el multicapilla o multitúnel cubren grandes superficies con varias naves unidas.',
          'Más altura significa más volumen de aire: el ambiente cambia de temperatura más lento (mayor inercia térmica) y se ventila mejor. Los invernaderos bajos se calientan muy rápido de día y se enfrían muy rápido de noche.',
        ],
      },
      {
        heading: 'Materiales de la estructura',
        body: [
          'En Chile son comunes las estructuras de madera, baratas pero de vida útil corta y con piezas gruesas que dan sombra. El acero galvanizado cuesta más, dura décadas y usa perfiles delgados que sombrean menos.',
          'La estructura debe resistir el viento y, en el sur, la nieve. La orientación de las naves y de las hileras influye en la uniformidad de la luz dentro del invernadero.',
        ],
      },
      {
        heading: 'Materiales de cubierta',
        body: [
          'El más usado es el polietileno de baja densidad, de 100 a 200 micrones, con aditivos estabilizadores UV que le dan una vida de una a tres temporadas. El polietileno térmico (con EVA u otros aditivos) retiene el infrarrojo largo y reduce el enfriamiento nocturno; el antigoteo hace que el agua condensada escurra en película en vez de gotear sobre el cultivo; el difusor reparte la luz y evita quemaduras.',
          'El policarbonato y el vidrio duran muchos años y transmiten bien la luz, pero cuestan mucho más. Con el tiempo, el polvo y el envejecimiento bajan la transmisión de luz de cualquier cubierta, por eso se lavan y se renuevan.',
        ],
      },
    ],
    checkpoint: {
      at: 115,
      prompt:
        'En un invernadero, el agua condensada gotea desde la cubierta sobre las plantas cada mañana. ¿Qué aditivo del plástico lo evita?',
      options: ['Estabilizador UV', 'Antigoteo', 'Pigmento negro', 'Antiestático'],
      correctIndex: 1,
      explanation:
        'El aditivo antigoteo baja la tensión superficial del agua: el condensado escurre como película hacia los costados en vez de formar gotas que caen.',
    },
    questions: [
      [
        '¿Qué ventaja tiene un invernadero alto sobre uno bajo?',
        'Mayor inercia térmica y mejor ventilación',
        ['Se calienta más rápido de día', 'No necesita cubierta', 'Usa menos estructura por metro cuadrado'],
      ],
      [
        '¿Para qué se agregan estabilizadores UV al polietileno?',
        'Para que el plástico dure más sin degradarse con el sol',
        ['Para bloquear toda la luz visible', 'Para que el agua gotee más', 'Para subir la humedad'],
      ],
      [
        '¿Qué hace el polietileno térmico?',
        'Retiene el infrarrojo largo y reduce el enfriamiento nocturno',
        ['Deja pasar más calor hacia afuera de noche', 'Bloquea la fotosíntesis', 'Elimina la condensación'],
      ],
      [
        '¿Qué estructura cubre una o dos hileras por unas semanas para adelantar cultivos?',
        'Microtúnel',
        ['Multicapilla', 'Invernadero de vidrio', 'Macrotúnel'],
      ],
      [
        '¿Qué desventaja tiene una estructura de madera frente a una de acero galvanizado?',
        'Dura menos y sus piezas gruesas dan más sombra',
        ['Es más cara de instalar', 'No se puede cubrir con plástico', 'Transmite el calor del suelo'],
      ],
    ],
  }),

  submodule({
    order: 2,
    title: 'Dinámica de CO₂ y Microclima',
    description:
      'Cómo el cultivo agota el CO₂ del invernadero cerrado, cuándo enriquecer y cómo varía el microclima dentro de la nave.',
    subboss: { name: 'Absorbedor de Gas', title: 'Ladrón del Carbono' },
    codexTitle: 'CO₂ y Microclima del Invernadero',
    sections: [
      {
        heading: 'El ciclo diario del CO₂',
        body: [
          'El aire exterior tiene alrededor de 420 ppm de CO₂. De noche, la respiración de las plantas y del suelo lo acumula dentro del invernadero cerrado. Con la salida del sol empieza la fotosíntesis y, si no se ventila, el cultivo puede bajarlo a 200 ppm o menos en pocas horas.',
          'Bajo unas 300 ppm la fotosíntesis cae fuertemente: en un día frío y soleado, con las ventanas cerradas para guardar calor, el CO₂ se vuelve el factor limitante.',
        ],
      },
      {
        heading: 'Enriquecimiento carbónico',
        body: [
          'Enriquecer hasta 700 a 1.000 ppm aumenta la fotosíntesis y el rendimiento en cultivos C3 como tomate, pepino y pimiento. Solo conviene mientras las ventanas están cerradas o casi cerradas: con ventilación abierta, el gas se escapa.',
          'Las fuentes son el CO₂ líquido envasado (puro y seguro) y los gases de quemadores de gas natural o propano, que además calientan. La combustión incompleta genera etileno y monóxido de carbono, que dañan al cultivo y a las personas.',
          'Sobre unas 1.500 ppm ya no hay beneficio y pueden aparecer daños; además, el CO₂ se mide con sensores ubicados a la altura del cultivo.',
        ],
      },
      {
        heading: 'Microclima dentro de la nave',
        body: [
          'El invernadero no es homogéneo: el aire caliente sube y se estratifica, las zonas cercanas a las ventanas son más frescas y secas, y dentro de un follaje denso el aire queda quieto, húmedo y con menos CO₂.',
          'Los ventiladores de circulación horizontal mueven el aire, uniforman temperatura y humedad, rompen la capa de aire quieto alrededor de las hojas y renuevan el CO₂ que cada hoja consume.',
        ],
      },
    ],
    checkpoint: {
      at: 130,
      prompt:
        'Día frío y soleado: a las 11:00 el invernadero cerrado marca 180 ppm de CO₂ y el cultivo crece poco. ¿Qué limita la fotosíntesis y qué conviene hacer?',
      options: [
        'La luz: encender lámparas',
        'El CO₂: enriquecer o ventilar en la medida que la temperatura lo permita',
        'El agua: duplicar el riego',
        'El nitrógeno: fertilizar foliar',
      ],
      correctIndex: 1,
      explanation:
        'El cultivo agotó el CO₂ del aire cerrado. Enriquecer, o ventilar algo si la temperatura lo permite, devuelve el CO₂ y reactiva la fotosíntesis.',
    },
    questions: [
      [
        '¿Cuánto CO₂ tiene aproximadamente el aire exterior?',
        'Alrededor de 420 ppm',
        ['Alrededor de 4.000 ppm', 'Alrededor de 40 ppm', 'Alrededor de 21 %'],
      ],
      [
        '¿Qué pasa con el CO₂ en un invernadero cerrado durante la mañana soleada?',
        'Baja porque el cultivo lo consume en la fotosíntesis',
        [
          'Sube porque las plantas respiran más de día',
          'Se mantiene igual que afuera',
          'Se transforma en oxígeno puro sin cambiar',
        ],
      ],
      [
        '¿Cuándo conviene enriquecer con CO₂?',
        'Cuando las ventanas están cerradas o casi cerradas',
        ['Con todas las ventanas abiertas', 'Solo de noche', 'Solo cuando está nublado y frío'],
      ],
      [
        '¿Qué gas dañino puede generar un quemador con combustión incompleta?',
        'Etileno y monóxido de carbono',
        ['Oxígeno puro', 'Nitrógeno', 'Vapor de agua solamente'],
      ],
      [
        '¿Para qué sirven los ventiladores de circulación horizontal?',
        'Para uniformar el microclima y renovar el CO₂ junto a las hojas',
        ['Para sacar todo el aire del invernadero', 'Para regar por aspersión', 'Para calentar el suelo'],
      ],
    ],
  }),

  submodule({
    order: 3,
    title: 'Control Climático Pasivo y Activo',
    description: 'Temperatura, humedad, DPV, ventilación, calefacción y sombreo: cómo se gobierna el ambiente protegido.',
    subboss: { name: 'El Vórtice Microclimático', title: 'Condensador del Rocío' },
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
        heading: 'Control pasivo y activo',
        body: [
          'El control pasivo usa la propia estructura: ventanas, mallas sombra, blanqueo y pantallas. Ventilar renueva el aire y saca humedad y calor; las ventanas cenitales son más eficientes que las laterales porque el aire caliente sube (efecto chimenea).',
          'El control activo usa energía: calefactores y tubos de agua caliente contra el frío nocturno, ventiladores extractores con paneles evaporativos (pad and fan) o nebulización para enfriar, y pantallas térmicas que de noche se cierran bajo la cubierta para guardar el calor.',
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
        '¿Qué hace un sistema pad and fan?',
        'Enfría el aire haciéndolo pasar por paneles húmedos',
        ['Calienta el suelo con tubos de agua', 'Enriquece el aire con CO₂', 'Cierra las ventanas de noche'],
      ],
    ],
  }),

  submodule({
    order: 4,
    title: 'Fertirriego y Cultivo sin Suelo',
    description: 'Solución nutritiva, CE y pH del gotero, sustratos e hidroponía.',
    subboss: { name: 'Espectro de la Lana de Roca', title: 'Tirano de la Conductividad' },
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
    subboss: { name: 'Nube de Trialeurodes', title: 'Reina del Envés' },
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

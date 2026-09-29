-- =============================================================================
-- Pachapp · Datos semilla
-- ARCHIVO GENERADO por scripts/generate-seed-sql.ts — no editar a mano.
-- Ejecutar después de supabase/schema.sql.
-- =============================================================================

begin;

-- Administradores
insert into public.admin_emails (email) values ('joaquin.rothmund@gmail.com') on conflict do nothing;

-- Módulos
insert into public.modules (id, slug, title, summary, initially_unlocked, codex) values (0, 'fundamentos', 'Fundamentos Agronómicos', 'Suelos de Chile, dinámica hídrica, MIP y diseño experimental.', true, '[{"heading":"Dinámica Hídrica y Suelos","body":["El suelo dicta el potencial. En Chile, va desde Entisoles norteños hasta Andisoles (trumaos) del sur.","Los trumaos (dominados por arcillas alofana e imogolita) retienen mucha agua pero bloquean químicamente el Fósforo. La Capacidad de Intercambio Catiónico (CIC) depende de arcillas y materia orgánica.","El riego moderno usa el Déficit de Presión de Vapor (VPD); un VPD alto cierra estomas para evitar cavitación, deteniendo la fotosíntesis."]},{"heading":"Sanidad y Metodología","body":["El MIP actúa sobre el Umbral de Daño Económico.","En terreno, rara vez se usa Diseño Completamente al Azar (DCA); se usa Bloques Completos al Azar (DBCA) para aislar gradientes topográficos."]}]'::jsonb)
  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary, initially_unlocked = excluded.initially_unlocked, codex = excluded.codex;
insert into public.modules (id, slug, title, summary, initially_unlocked, codex) values (1, 'cranberry', 'Cranberry', 'Acidófila de raíz superficial, heladas por aspersión y cosecha en agua.', false, '[{"heading":"Manejo Especializado de Cranberry","body":["Especie acidófila (pH 4,0-5,5) ineficiente absorbiendo nitratos (exige N amoniacal).","Posee tallos rastreros (runners) y verticales (uprights) donde fructifica en yemas apicales (ideal 400-600 uprights/pie²). Su sistema radicular superficial (10-15 cm) es muy susceptible a Phytophthora cinnamomi."]},{"heading":"Manejo térmico y cosecha","body":["Toleran hasta -18 °C en invierno profundo por deshidratación y antocianinas.","En primavera, se defienden de heladas con aspersión, aprovechando el calor latente de congelación (si el hielo se ve opaco y seco, la tasa de agua es insuficiente).","Cosecha en agua (water-harvest) para industria, donde las batidoras desprenden la fruta que flota por sus cámaras de aire."]}]'::jsonb)
  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary, initially_unlocked = excluded.initially_unlocked, codex = excluded.codex;
insert into public.modules (id, slug, title, summary, initially_unlocked, codex) values (2, 'frambuesa', 'Frambuesa', 'Primocane vs floricane, camellones, conducción en V y pre-frío.', false, '[{"heading":"Manejo Avanzado de Frambuesa","body":["Arbusto de raíces perennes y cañas bianuales. Remontantes dan fruta en otoño (primocane) y no remontantes en verano (floricane, exige horas frío y muere postcosecha).","Su sensibilidad extrema a Phytophthora exige plantación en camellones."]},{"heading":"Conducción y postcosecha","body":["El manejo en \"V\" (T-trellis) abre la canopia y previene Botrytis. El raleo temprano de primocanes evita competencia con la floricane.","Tienen altísima tasa respiratoria postcosecha, requiriendo túneles de pre-frío (0 °C) en menos de 4 horas o atmósferas modificadas."]}]'::jsonb)
  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary, initially_unlocked = excluded.initially_unlocked, codex = excluded.codex;

-- Preguntas
insert into public.questions (id, module_id, prompt, correct_answer, distractors, is_boss_final, sort_order) values
  ('m0-q1', 0, '¿Qué clase textural tiene la mayor Capacidad de Campo y el mayor Punto de Marchitez?', 'Arcillosa', array['Arenosa', 'Franca', 'Franco-limosa']::text[], false, 1),
  ('m0-q2', 0, '¿Cuál es el reto principal al fertilizar suelos Trumaos?', 'Alta fijación de Fósforo', array['Alta salinidad', 'Exceso de carbonatos', 'pH alcalino']::text[], false, 2),
  ('m0-q3', 0, '¿Cuándo alcanza su máximo el coeficiente de cultivo (Kc)?', 'Pleno verano con canopia completa', array['Receso invernal', 'Brotación', 'Caída de hojas']::text[], false, 3),
  ('m0-q4', 0, '¿Qué caracteriza a una helada de radiación?', 'Noche despejada, pérdida de calor del suelo', array['Llegada de una masa polar', 'Lluvia congelada', 'Exceso de riego']::text[], false, 4),
  ('m0-q5', 0, '¿Cuál es la macrozona primicia para cerezas en Chile?', 'Norte Chico/Coquimbo', array['Araucanía', 'Chiloé', 'O''Higgins']::text[], false, 5),
  ('m0-q6', 0, 'En MIP, ¿cuándo corresponde aplicar un insecticida?', 'Cuando la plaga supera el Umbral de Daño Económico', array['Al ver el primer insecto', 'Por calendario cada 15 días', 'Cuando el daño ya es irreversible']::text[], false, 6),
  ('m0-q7', 0, '¿Qué plantea la Ley de Liebig?', 'El rendimiento está limitado por el nutriente más escaso', array['Usar la menor cantidad de agua', 'Solo importa el nitrógeno', 'La planta crece hasta un tamaño mínimo']::text[], false, 7),
  ('m0-q8', 0, '¿Qué malezas controla un herbicida graminicida?', 'Hoja angosta', array['Hoja ancha', 'Ciperáceas', 'Toda maleza']::text[], false, 8),
  ('m0-q9', 0, '¿Qué rango de temperatura define una Hora Frío tradicional?', 'Entre 0 °C y 7,2 °C', array['Bajo 0 °C', 'Horas con neblina', 'Horas de sombra en verano']::text[], false, 9),
  ('m0-q10', 0, '¿Qué componentes aportan principalmente a la CIC del suelo?', 'Arcilla y Materia Orgánica', array['Arena', 'Carbonatos', 'Fertilizantes']::text[], false, 10),
  ('m0-q11', 0, '¿En qué se diferencian la densidad aparente y la densidad real del suelo?', 'La aparente incluye los poros; la real, solo los sólidos', array['La real cambia con la labranza', 'Ambas miden la materia orgánica', 'Son iguales']::text[], false, 11),
  ('m0-q12', 0, '¿Qué es una inversión térmica?', 'Una capa fría asentada bajo una capa cálida en altura', array['El suelo más caliente que el aire', 'El choque de un frente polar', 'El congelamiento del agua de riego']::text[], false, 12),
  ('m0-q13', 0, '¿Por qué tejido se transportan los fotoasimilados?', 'Floema', array['Xilema', 'Estomas', 'Cambium']::text[], false, 13),
  ('m0-q14', 0, '¿En qué se diferencia un suelo salino de uno sódico?', 'Salino: alta CE; sódico: alto PSI que destruye la estructura', array['El salino retiene y el sódico repele agua', 'El sódico está en el sur y el salino en el norte', 'Son sinónimos']::text[], false, 14),
  ('m0-q15', 0, 'En un test de Tukey, dos tratamientos con letras "a" y "ab" indican que…', 'No hay diferencia estadística significativa', array['Uno rinde el doble', 'Hay que eliminar un tratamiento', 'El tratamiento "a" es superior']::text[], false, 15),
  ('m0-q16', 0, '¿Cuál es la eficiencia típica del riego por goteo?', '90% a 95%', array['50% a 60%', '70% a 75%', '100%']::text[], false, 16),
  ('m0-q17', 0, '¿Qué deficiencia aparece primero en las hojas viejas?', 'Nitrógeno', array['Calcio', 'Boro', 'Hierro']::text[], false, 17),
  ('m0-q18', 0, '¿Para qué se usan los Días Grado en MIP?', 'Predecir el desarrollo fenológico del insecto según el calor acumulado', array['Medir el daño en hojas', 'Estimar la degradación del pesticida', 'Fijar la fecha de cosecha']::text[], false, 18),
  ('m0-q19', 0, '¿Qué es la capacidad tampón (buffer) del suelo?', 'Su resistencia a cambiar de pH', array['Su retención de agua', 'Su infiltración de lluvia', 'Su resistencia a la compactación']::text[], false, 19),
  ('m0-q20', 0, '¿Qué consecuencia tiene el cierre estomático por un VPD alto?', 'Aumento de la temperatura foliar y cese de la asimilación de CO₂', array['La planta absorbe más nitrógeno', 'Se abren las acuaporinas', 'La fotosíntesis se duplica']::text[], false, 20),
  ('m0-q21', 0, '¿Qué arcillas amorfas dominan en los Trumaos?', 'Alofana e Imogolita', array['Montmorillonita y Caolinita', 'Ilita y Vermiculita', 'Cuarzo']::text[], false, 21),
  ('m0-q22', 0, '¿Qué indica un valor de NDVI de 0,2 (muy bajo)?', 'Baja densidad de biomasa o suelo desnudo', array['Exceso de clorofila', 'Deficiencia de Zinc', 'Alta humedad']::text[], false, 22),
  ('m0-q99', 0, 'Proyecto en Panguipulli: suelo Andisol, pH 5,6 y agua justa para cubrir la ETc. ¿Por qué fracasará el Cranberry?', 'Déficit hídrico para la aspersión contra heladas', array['pH tóxico', 'Asfixia por materia orgánica', 'Bloqueo de nitrógeno']::text[], true, 999),
  ('m1-q1', 1, '¿Cuál es el pH óptimo de suelo para el Cranberry?', '4,0 - 5,5', array['5,5 - 6,5', '6,5 - 7,5', '3,0 - 3,5']::text[], false, 1),
  ('m1-q2', 1, '¿Qué forma de nitrógeno exige el Cranberry?', 'Amoniacal (NH₄⁺)', array['Nítrica', 'Urea foliar', 'Nitrito']::text[], false, 2),
  ('m1-q3', 1, '¿Cuál es el método de control activo de heladas?', 'Aspersión continua (calor latente)', array['Hélices', 'Calefactores', 'Plásticos']::text[], false, 3),
  ('m1-q4', 1, '¿Cuál es el objetivo del sanding (aplicación de arena)?', 'Estimular el enraizamiento y rejuvenecer', array['Subir el pH', 'Retener agua en verano', 'Aportar sílice']::text[], false, 4),
  ('m1-q5', 1, '¿Cuál es el destino de la fruta cosechada en agua (water-harvest)?', 'Industria', array['Mercado fresco', 'Exportación aérea', 'Mercado orgánico']::text[], false, 5),
  ('m1-q6', 1, '¿Qué patógeno se asocia al mal drenaje?', 'Phytophthora cinnamomi', array['Botrytis', 'Oidium', 'Agrobacterium']::text[], false, 6),
  ('m1-q7', 1, '¿Qué gatilla la síntesis de antocianinas en la fruta?', 'Frío nocturno', array['Restricción hídrica', 'Exceso de nitrógeno', 'Giberelinas']::text[], false, 7),
  ('m1-q8', 1, '¿Cuándo se monitorea Cranberry fruitworm?', 'Post-cuaja', array['En receso', 'En pinta de color', 'En floración']::text[], false, 8),
  ('m1-q9', 1, '¿Cómo se asegura la polinización obligatoria?', 'Colmenas de abejas/abejorros', array['Por viento', 'Polinización manual', 'Aplicación de auxinas']::text[], false, 9),
  ('m1-q10', 1, '¿Cuál es la maleza parásita enredadera más problemática?', 'Cuscuta', array['Chufa', 'Correhuela', 'Ballica']::text[], false, 10),
  ('m1-q11', 1, '¿Dónde produce fruta el Cranberry?', 'En yemas apicales de uprights formadas el año anterior', array['En los runners', 'En la raíz', 'En brotes desde el suelo']::text[], false, 11),
  ('m1-q12', 1, '¿Para qué se usan peinadoras en primavera?', 'Alinear runners para la cosecha', array['Cortar flores', 'Romper la costra del suelo', 'Espantar insectos']::text[], false, 12),
  ('m1-q13', 1, '¿Qué es el daño por Sunscald?', 'Daño fisiológico por alta radiación y temperatura', array['Daño por agua caliente', 'Daño por herbicida', 'Daño por trips']::text[], false, 13),
  ('m1-q14', 1, '¿Cuál es la variedad histórica más productiva?', 'Stevens', array['Duke', 'Chandler', 'Heritage']::text[], false, 14),
  ('m1-q15', 1, '¿Qué provoca el exceso de nitrógeno?', 'Emboscamiento y fruta blanda', array['Fruta gigante', 'Clorosis', 'Muerte de raíces']::text[], false, 15),
  ('m1-q16', 1, '¿Por qué la fruta cosechada en agua tiene vida postcosecha corta?', 'Entran patógenos por la cicatriz y el daño de la batidora', array['Pierde color', 'Absorbe sal', 'Pierde sus ceras']::text[], false, 16),
  ('m1-q17', 1, '¿A qué profundidad están las raíces absorbentes?', '10 a 15 cm', array['50 cm', '1 m', '2 m']::text[], false, 17),
  ('m1-q18', 1, '¿A qué tensión se riega con tensiómetro en suelos de arena?', '20 a 30 cbars', array['60 cbars', '10 cbars', '100 cbars']::text[], false, 18),
  ('m1-q19', 1, '¿Qué deficiencia provoca un pH mayor a 6,5?', 'Hierro (clorosis intervenal en brote nuevo)', array['Calcio', 'Fósforo', 'Nitrógeno']::text[], false, 19),
  ('m1-q20', 1, '¿Qué indica ver hielo opaco y seco durante la aspersión contra heladas?', 'Tasa de agua insuficiente: la planta se congela', array['Control perfecto', 'Exceso de sales', 'Humedad al 100%']::text[], false, 20),
  ('m1-q21', 1, '¿Qué daño causa Dasineura oxycoccana?', 'Mata las yemas apicales de uprights tiernos', array['Perfora la fruta', 'Come raíces', 'Transmite virus']::text[], false, 21),
  ('m1-q22', 1, '¿Cómo se manifiesta el Fairy Ring (Psilocybe)?', 'Manchas circulares expansivas de parras muertas', array['Agallas rojas', 'Fruta vacía', 'Moho harinoso']::text[], false, 22),
  ('m1-q23', 1, '¿Qué efecto tiene un pruning severo?', 'Caída temporal del rendimiento y aumento de calibre', array['Aumento explosivo del rendimiento', 'Muerte de uprights', 'Retraso del color']::text[], false, 23),
  ('m1-q24', 1, '¿Qué mide el valor T-Ac?', 'Antocianinas totales', array['Acidez', 'Brix', 'Firmeza']::text[], false, 24),
  ('m1-q25', 1, '¿Cómo actúa el hongo Cottonball?', 'Infecta la flor y la baya se llena de una masa algodonosa', array['Destruye la raíz', 'Causa defoliación', 'Mancha la epidermis']::text[], false, 25),
  ('m1-q99', 1, '¿Cómo se llama el mecanismo por el que las abejas extraen el polen en tétradas de la flor del Cranberry?', 'Polinización vibratoria (Buzz pollination)', array['Anemófila estricta', 'Nectarización', 'Autopolinización']::text[], true, 999),
  ('m2-q1', 2, '¿Qué diferencia a una variedad remontante de una no remontante?', 'La remontante da en caña del año (otoño); la no remontante, en caña de segundo año (verano)', array['La remontante no tiene espinas', 'La remontante es de secano', 'La remontante da fruta azul']::text[], false, 1),
  ('m2-q2', 2, '¿Qué plaga deja larvas blancas dentro del fruto blando?', 'Drosophila suzukii', array['Ceratitis', 'Trips', 'Burrito']::text[], false, 2),
  ('m2-q3', 2, '¿Por qué se planta en camellones elevados?', 'La raíz es hipersensible a la asfixia y a Phytophthora', array['Para permitir cosecha mecánica', 'Para evitar heladas', 'Para proteger del viento']::text[], false, 3),
  ('m2-q4', 2, '¿Qué se hace con la caña floricane después de cosecha?', 'Cortarla a ras y eliminarla', array['Podar solo las puntas', 'Dejarla para que engrose', 'Acodarla']::text[], false, 4),
  ('m2-q5', 2, '¿Qué hongo causa pudrición en una floración húmeda?', 'Botrytis cinerea', array['Oidio', 'Verticillium', 'Agrobacterium']::text[], false, 5),
  ('m2-q6', 2, '¿Qué sistema de conducción mejora la aireación?', 'V o cruceta (T-trellis)', array['Eje central', 'Parronal', 'Vaso abierto']::text[], false, 6),
  ('m2-q7', 2, '¿Qué nutriente se asocia a la firmeza del fruto?', 'Potasio', array['Nitrógeno', 'Fósforo', 'Cloro']::text[], false, 7),
  ('m2-q8', 2, '¿Qué plaga prolifera en bordes de camino polvorientos?', 'Arañita roja', array['Pulgón', 'Escama', 'Gusano tebo']::text[], false, 8),
  ('m2-q9', 2, '¿Qué causa el desgrane (crumbly berry)?', 'Virus RBDV o mala polinización', array['Exceso de potasio', 'Helada', 'Falta de poda']::text[], false, 9),
  ('m2-q10', 2, '¿Qué produce agallas leñosas en el cuello?', 'Agrobacterium tumefaciens', array['Nematodos', 'Armillaria', 'Fusarium']::text[], false, 10),
  ('m2-q11', 2, '¿Cuál es el sistema ideal de riego y fertirrigación?', 'Goteo con doble cinta', array['Surco', 'Aspersión foliar', 'Pivote']::text[], false, 11),
  ('m2-q12', 2, '¿Qué estructura hace invasiva a la frambuesa al brotar?', 'Raíces gemíferas (hijuelos)', array['Semillas', 'Estolones aéreos', 'Bulbos']::text[], false, 12),
  ('m2-q13', 2, '¿A qué hora conviene cosechar para mercado fresco?', 'Mañana temprano, sin calor de campo', array['Al mediodía, con fruta seca', 'En la tarde-noche', 'A cualquier hora']::text[], false, 13),
  ('m2-q14', 2, '¿Cuál es el objetivo del raleo de cañas (primocanes)?', 'Mejorar la luz, la aireación y el vuelo de abejas', array['Retrasar la cosecha', 'Dar más raíz', 'Producir fruta en invierno']::text[], false, 14),
  ('m2-q15', 2, '¿Cuál es la acción postcosecha crítica en las primeras 2-4 horas?', 'Túnel de pre-frío inmediato a 0 °C', array['Lavar con agua', 'Dejar al sol para subir el brix', 'Empacar al vacío']::text[], false, 15),
  ('m2-q16', 2, '¿Qué efecto tiene la polinización por abejas?', 'Es altamente atractiva y mejora la cuaja (más drupéolas)', array['Se poliniza por viento', 'Es partenocárpica', 'Repele a los insectos']::text[], false, 16),
  ('m2-q17', 2, '¿Qué diferencia botánica tiene la frambuesa con la mora?', 'La frambuesa deja el receptáculo en la planta (queda hueca)', array['La mora no tiene espinas', 'La mora es un árbol', 'La frambuesa es climatérica']::text[], false, 17),
  ('m2-q18', 2, '¿Cómo se reconoce el Spur blight (tizón de la yema)?', 'Zonas oscuras (púrpura) en los nudos de la caña en otoño/invierno', array['Grietas blancas', 'Agallas en la base', 'Hongos con forma de paraguas']::text[], false, 18),
  ('m2-q19', 2, '¿Cuál es el daño letal de Aegorhinus (burrito)?', 'La larva barrena la corona y las raíces principales', array['Inyecta una toxina en la flor', 'La ninfa transmite virus', 'El macho come yemas']::text[], false, 19),
  ('m2-q20', 2, '¿Qué requiere la floricane para brotar?', 'Acumular horas frío (600-1000) en receso', array['Poda a ras en invierno', 'Estrés hídrico en abril', 'Aplicación de giberelinas']::text[], false, 20),
  ('m2-q21', 2, '¿Qué tipo de nematodo es Pratylenchus?', 'Endoparásito migratorio (destruye tejido al moverse)', array['Ectoparásito adherido a la raíz', 'Fijador de nitrógeno', 'Ataca estolones']::text[], false, 21),
  ('m2-q22', 2, '¿Cuál es el vector del virus del mosaico?', 'Pulgones', array['Viento', 'Tijera de poda', 'Arañita']::text[], false, 22),
  ('m2-q23', 2, '¿Por qué el calcio foliar aplicado post-cuaja llega poco al fruto?', 'Viaja por xilema hacia las hojas que transpiran', array['La raíz es impermeable', 'Ahuyenta a la mosca', 'Se transforma en yeso']::text[], false, 23),
  ('m2-q24', 2, '¿Qué causa el White Drupelet Disorder?', 'Radiación UV directa y altas temperaturas', array['Botrytis temprana', 'Falta de magnesio', 'Picadura de mosca']::text[], false, 24),
  ('m2-q25', 2, '¿Qué riesgo tiene un raleo de primocanes muy tardío?', 'El segundo flujo de cañas no alcanza vigor para el año siguiente', array['La fruta cuaja de color blanco', 'Mueren las raíces', 'Se compacta el suelo']::text[], false, 25),
  ('m2-q99', 2, 'Para evitar toxicidad en frambuesa, ¿qué fertilizante potásico hay que evitar?', 'Muriato de Potasio (KCl)', array['Sulfato de Potasio', 'Nitrato de Potasio', 'Tiosulfato de Potasio']::text[], true, 999)
on conflict (id) do update set module_id = excluded.module_id, prompt = excluded.prompt, correct_answer = excluded.correct_answer, distractors = excluded.distractors, is_boss_final = excluded.is_boss_final, sort_order = excluded.sort_order;

-- Jefes (el HP actual y la derrota se preservan al re-ejecutar)
insert into public.bosses (id, module_id, name, title, max_hp, current_hp, damage_per_hit, final_question_id, unlocks_module_id) values ('boss-m0', 0, 'Archimago de Terrones', 'Consultor de Panguipulli', 1000, 1000, 10, 'm0-q99', 1)
  on conflict (id) do update set module_id = excluded.module_id, name = excluded.name, title = excluded.title, max_hp = excluded.max_hp, damage_per_hit = excluded.damage_per_hit, final_question_id = excluded.final_question_id, unlocks_module_id = excluded.unlocks_module_id;
insert into public.bosses (id, module_id, name, title, max_hp, current_hp, damage_per_hit, final_question_id, unlocks_module_id) values ('boss-m1', 1, 'Deformidad de los Verticales', 'Señora de los Floats', 1000, 1000, 10, 'm1-q99', 2)
  on conflict (id) do update set module_id = excluded.module_id, name = excluded.name, title = excluded.title, max_hp = excluded.max_hp, damage_per_hit = excluded.damage_per_hit, final_question_id = excluded.final_question_id, unlocks_module_id = excluded.unlocks_module_id;
insert into public.bosses (id, module_id, name, title, max_hp, current_hp, damage_per_hit, final_question_id, unlocks_module_id) values ('boss-m2', 2, 'Señor de las Cañas', 'Guardián del Pre-frío', 1000, 1000, 10, 'm2-q99', null)
  on conflict (id) do update set module_id = excluded.module_id, name = excluded.name, title = excluded.title, max_hp = excluded.max_hp, damage_per_hit = excluded.damage_per_hit, final_question_id = excluded.final_question_id, unlocks_module_id = excluded.unlocks_module_id;

-- Emblemas
insert into public.badges (id, name, description, icon, criterion) values ('lector-del-codice', 'Lector del Códice', 'Leíste tu primer Códice.', 'book', '{"type":"codex_read","count":1}'::jsonb)
  on conflict (id) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, criterion = excluded.criterion;
insert into public.badges (id, name, description, icon, criterion) values ('sobreviviente-de-heladas', 'Sobreviviente de Heladas', 'Participaste en la caída del Archimago de Terrones.', 'snowflake', '{"type":"boss_defeated","moduleId":0}'::jsonb)
  on conflict (id) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, criterion = excluded.criterion;
insert into public.badges (id, name, description, icon, criterion) values ('senor-de-la-turbera', 'Señor de la Turbera', 'Completaste el módulo Cranberry.', 'berry-red', '{"type":"module_completed","moduleId":1}'::jsonb)
  on conflict (id) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, criterion = excluded.criterion;
insert into public.badges (id, name, description, icon, criterion) values ('cazador-de-suzukii', 'Cazador de Suzukii', 'Completaste el módulo Frambuesa.', 'berry-pink', '{"type":"module_completed","moduleId":2}'::jsonb)
  on conflict (id) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, criterion = excluded.criterion;
insert into public.badges (id, name, description, icon, criterion) values ('racha-perfecta', 'Racha Perfecta', '10 respuestas correctas seguidas.', 'flame', '{"type":"correct_streak","count":10}'::jsonb)
  on conflict (id) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, criterion = excluded.criterion;
insert into public.badges (id, name, description, icon, criterion) values ('golpe-final', 'Golpe Final', 'Diste el último golpe a un jefe.', 'sword', '{"type":"final_blow"}'::jsonb)
  on conflict (id) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, criterion = excluded.criterion;

commit;

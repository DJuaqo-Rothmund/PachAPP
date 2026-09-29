-- =============================================================================
-- Pachapp · Datos semilla
-- ARCHIVO GENERADO por scripts/generate-seed-sql.ts — no editar a mano.
-- Ejecutar después de supabase/schema.sql.
-- =============================================================================

begin;

-- Administradores
insert into public.admin_emails (email) values ('joaquin.rothmund@gmail.com') on conflict do nothing;

-- Módulos
insert into public.modules (id, slug, title, summary, initially_unlocked, codex) values (0, 'fundamentos', 'Fundamentos Agronómicos', 'Suelo, nutrición, clima de Chile y Manejo Integrado de Plagas.', true, '[{"heading":"Suelo y Nutrición","body":["El suelo es un sistema vivo: una mezcla de minerales, materia orgánica, agua, aire y millones de organismos que reciclan nutrientes. Entenderlo es el primer paso de cualquier decisión agronómica.","La textura describe la proporción de arena, limo y arcilla. Los suelos arenosos drenan rápido y retienen poca agua; los arcillosos tienen partículas finísimas con enorme superficie específica, por lo que presentan la mayor Capacidad de Campo (agua retenida tras drenar) y también el mayor Punto de Marchitez Permanente (agua que la planta ya no puede extraer). Los francos equilibran ambas fracciones.","La Capacidad de Intercambio Catiónico (CIC) mide cuántos cationes (Ca²⁺, Mg²⁺, K⁺, NH₄⁺) puede retener el suelo. Los aportes principales vienen de la arcilla y de la materia orgánica; la arena prácticamente no aporta.","La Ley del Mínimo de Liebig dice que el rendimiento queda limitado por el nutriente que está en menor proporción respecto de lo que el cultivo necesita, como el agua de un barril que se escapa por su duela más corta. Fertilizar en exceso lo que ya sobra no sube el techo productivo.","En el sur de Chile dominan los Trumaos (Andisoles derivados de cenizas volcánicas). Son porosos y ricos en materia orgánica, pero sus alófanos retienen y fijan el fósforo con enorme fuerza, lo que obliga a planificar la fertilización fosforada con cuidado. Suelen ser además ácidos."]},{"heading":"Clima y agua en Chile","body":["Chile es un laboratorio climático: del desierto del norte a los bosques lluviosos del sur. El Norte Chico (Coquimbo) tiene inviernos templados y alta luminosidad, lo que permite producir primicias, como las cerezas más tempranas del país. Hacia el sur, más frío y lluvia desplazan las cosechas.","Las heladas pueden ser de dos tipos. La helada advectiva llega con una masa de aire polar y viento. La helada radiativa ocurre en noches despejadas y sin viento: el suelo y las plantas irradian su calor al cielo y el aire frío se acumula en las zonas bajas. Es la más frecuente en los valles agrícolas y la que se combate con aspersión, hélices o calefactores.","Muchos frutales necesitan acumular frío invernal para brotar de forma pareja. Una Hora Frío tradicional es una hora con temperatura entre 0 °C y 7,2 °C.","La demanda de agua de un cultivo se estima como ETc = ET₀ × Kc. El coeficiente de cultivo Kc es bajo en receso y brotación, y alcanza su máximo en pleno verano, cuando la canopia está totalmente desarrollada."]},{"heading":"Manejo Integrado de Plagas (MIP)","body":["El MIP combina monitoreo, control cultural, biológico y químico para mantener las plagas bajo niveles que no causen pérdidas económicas, reduciendo el uso de pesticidas.","El criterio central es el Umbral de Daño Económico: se aplica un insecticida solo cuando la población de la plaga lo supera, es decir, cuando el costo del daño esperado supera el costo del control. No se aplica por calendario ni al ver el primer insecto.","En malezas, la selectividad importa. Un herbicida graminicida controla gramíneas de hoja angosta (como la ballica) sin dañar cultivos de hoja ancha."]}]'::jsonb)
  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary, initially_unlocked = excluded.initially_unlocked, codex = excluded.codex;
insert into public.modules (id, slug, title, summary, initially_unlocked, codex) values (1, 'cranberry', 'Cranberry', 'Enredadera acidófila, cosecha en agua y control de heladas.', false, '[{"heading":"Cranberry (Vaccinium macrocarpon)","body":["Enredadera acidófila (pH 4-5,5). Cosecha en agua (floats). Susceptible a asfixia radicular en verano. Requiere control de heladas por aspersión."]}]'::jsonb)
  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary, initially_unlocked = excluded.initially_unlocked, codex = excluded.codex;
insert into public.modules (id, slug, title, summary, initially_unlocked, codex) values (2, 'frambuesa', 'Frambuesa', 'Cañas remontantes, Phytophthora y pre-frío postcosecha.', false, '[{"heading":"Frambuesa (Rubus idaeus)","body":["Arbusto de caña bianual o anual (remontantes vs no remontantes). Extremadamente sensible a Phytophthora (uso de camellones). Pre-frío rápido postcosecha es clave."]}]'::jsonb)
  on conflict (id) do update set slug = excluded.slug, title = excluded.title, summary = excluded.summary, initially_unlocked = excluded.initially_unlocked, codex = excluded.codex;

-- Preguntas
insert into public.questions (id, module_id, prompt, correct_answer, distractors, is_boss_final, sort_order) values
  ('m0-q1', 0, '¿Qué clase textural tiene la mayor Capacidad de Campo y el mayor Punto de Marchitez?', 'Arcillosa', array['Arenosa', 'Franca', 'Franco-limosa']::text[], false, 1),
  ('m0-q2', 0, 'Suelos Trumaos (sur de Chile): ¿qué los hace complejos para fertilizar?', 'Alta retención y fijación de Fósforo', array['Alta salinidad', 'Exceso de carbonatos', 'pH muy alcalino']::text[], false, 2),
  ('m0-q3', 0, '¿Cuándo alcanza su máximo el coeficiente de cultivo (Kc)?', 'Pleno verano con máximo desarrollo de canopia', array['Receso invernal', 'Inicio de brotación', 'Caída de hojas']::text[], false, 3),
  ('m0-q4', 0, '¿Qué caracteriza a una helada de radiación?', 'Noches despejadas sin viento, el suelo pierde calor', array['Llegada de una masa de aire polar', 'Viento congelado', 'Exceso de riego']::text[], false, 4),
  ('m0-q5', 0, '¿Cuál es la macrozona primicia para cerezas en Chile?', 'Norte Chico/Coquimbo', array['Araucanía', 'Chiloé', 'O''Higgins central']::text[], false, 5),
  ('m0-q6', 0, 'En MIP, ¿cuándo corresponde aplicar un insecticida?', 'Cuando la plaga supera el Umbral de Daño Económico', array['Al ver el primer insecto', 'Por calendario', 'Cuando el daño ya es irreversible']::text[], false, 6),
  ('m0-q7', 0, '¿Qué plantea la Ley del Mínimo (Liebig)?', 'El rendimiento está limitado por el nutriente en menor proporción', array['Usar la menor cantidad de agua posible', 'Solo el nitrógeno importa', 'La planta crece hasta un tamaño mínimo']::text[], false, 7),
  ('m0-q8', 0, '¿Qué malezas controla un herbicida graminicida?', 'Hoja angosta (ballica)', array['Hoja ancha', 'Ciperáceas', 'Toda planta joven']::text[], false, 8),
  ('m0-q9', 0, '¿Qué rango define una Hora Frío tradicional?', 'Entre 0 °C y 7,2 °C', array['Bajo 0 °C', 'Horas con neblina', 'Horas de sombra en verano']::text[], false, 9),
  ('m0-q10', 0, '¿Qué componentes aportan principalmente a la CIC del suelo?', 'Arcilla y Materia Orgánica', array['Arena', 'Carbonatos', 'Fertilizantes']::text[], false, 10),
  ('m0-q99', 0, 'Proyecto en Panguipulli: suelo Andisol, pH 5,6 y agua justa para cubrir la ETc. ¿Por qué fracasará el Cranberry?', 'Déficit hídrico para el control activo de heladas en primavera', array['pH tóxico', 'Asfixia por materia orgánica', 'Bloqueo de nitrógeno']::text[], true, 999),
  ('m1-q1', 1, '¿Cuál es el pH óptimo de suelo para el Cranberry?', '4,0 - 5,5', array['5,5 - 6,5', '6,5 - 7,5', '3,0 - 3,5']::text[], false, 1),
  ('m1-q2', 1, '¿Qué forma de nitrógeno se recomienda en Cranberry?', 'Amoniacal (NH₄⁺)', array['Nítrica', 'Urea foliar', 'Nitrito']::text[], false, 2),
  ('m1-q3', 1, '¿Cuál es el método de control de heladas en Cranberry?', 'Aspersión continua', array['Hélices', 'Calefactores', 'Plásticos']::text[], false, 3),
  ('m1-q4', 1, '¿Para qué se hace el sanding (aplicación de arena)?', 'Estimular el enraizamiento y rejuvenecer', array['Subir el pH', 'Retener agua', 'Aportar sílice']::text[], false, 4),
  ('m1-q5', 1, '¿Cuál es el destino de la fruta cosechada en agua?', 'Industria', array['Mercado fresco', 'Exportación en fresco', 'Mercado orgánico']::text[], false, 5),
  ('m1-q6', 1, '¿Qué patógeno se asocia al mal drenaje?', 'Phytophthora cinnamomi', array['Botrytis', 'Oidium', 'Agrobacterium']::text[], false, 6),
  ('m1-q7', 1, '¿Qué gatilla el color rojo de la fruta?', 'Bajas temperaturas nocturnas', array['Restricción de riego', 'Aplicación de nitrógeno', 'Giberelinas']::text[], false, 7),
  ('m1-q8', 1, '¿Por qué es crítico el drenaje en verano?', 'Es susceptible a asfixia radicular', array['Para mantener la napa limpia', 'Para aprovechar el agua lluvia', 'Para alejar a los pájaros']::text[], false, 8),
  ('m1-q9', 1, '¿Cuándo se monitorea Cranberry fruitworm?', 'Post-cuaja', array['En receso', 'En pinta de color', 'En floración']::text[], false, 9),
  ('m1-q10', 1, '¿Cómo se asegura la polinización?', 'Colmenas de abejas/abejorros', array['Por viento', 'Polinización manual', 'Aplicación de auxinas']::text[], false, 10),
  ('m1-q11', 1, '¿Cuál es la maleza parásita más problemática?', 'Cuscuta', array['Chufa', 'Correhuela', 'Ballica']::text[], false, 11),
  ('m1-q12', 1, '¿Dónde se produce la fruta?', 'Yemas apicales de uprights del año anterior', array['Runners', 'Raíz', 'Brotes nuevos']::text[], false, 12),
  ('m1-q13', 1, '¿Para qué se usan peinadoras en primavera?', 'Alinear runners para la cosecha', array['Cortar flores', 'Romper el suelo', 'Espantar insectos']::text[], false, 13),
  ('m1-q14', 1, '¿Qué es el Sunscald?', 'Daño fisiológico por radiación', array['Daño por agua caliente', 'Daño por herbicida', 'Daño por trips']::text[], false, 14),
  ('m1-q15', 1, '¿Cuál es la variedad histórica de referencia?', 'Stevens', array['Duke', 'Chandler', 'Heritage']::text[], false, 15),
  ('m1-q16', 1, '¿Qué causa el exceso de nitrógeno?', 'Emboscamiento y fruta blanda', array['Fruta gigante', 'Clorosis', 'Muerte de raíces']::text[], false, 16),
  ('m1-q17', 1, '¿Por qué la fruta water-harvest tiene postcosecha corta?', 'Entrada de patógenos por la cicatriz al agua', array['No tiene antocianinas', 'Absorbe sal', 'Pierde sus ceras']::text[], false, 17),
  ('m1-q18', 1, '¿A qué profundidad se concentran las raíces?', 'Primeros 10-15 cm', array['50 cm', '1 m', '2 m']::text[], false, 18),
  ('m1-q19', 1, '¿Cuál es la forma de propagación más común?', 'Esquejes sin enraizar esparcidos', array['Semillas', 'Injertos', 'Cultivo in vitro']::text[], false, 19),
  ('m1-q20', 1, '¿Cómo se previene el fruit rot?', 'Fungicidas en flor y aireación', array['Fungicida al suelo', 'Cloro', 'Bajar el pH']::text[], false, 20),
  ('m2-q1', 2, '¿Qué diferencia a una variedad remontante de una no remontante?', 'La remontante produce en caña del año (otoño); la no remontante en caña de segundo año', array['La remontante no tiene espinas', 'La remontante no necesita agua', 'La remontante da fruta azul']::text[], false, 1),
  ('m2-q2', 2, '¿Qué plaga deja larvas blancas dentro de la fruta?', 'Drosophila suzukii', array['Ceratitis', 'Trips', 'Burrito']::text[], false, 2),
  ('m2-q3', 2, '¿Por qué los camellones son obligatorios?', 'Sensibilidad a asfixia y Phytophthora', array['Para permitir cosecha mecánica', 'Para evitar heladas', 'Para proteger del viento']::text[], false, 3),
  ('m2-q4', 2, '¿Qué se hace con la caña floricane después de cosecha?', 'Cortarla a ras y eliminarla (muere)', array['Podar solo las puntas', 'Dejarla para que engrose', 'Acodarla']::text[], false, 4),
  ('m2-q5', 2, '¿Qué hongo queda latente en una floración húmeda?', 'Botrytis cinerea', array['Oidio', 'Verticillium', 'Agrobacterium']::text[], false, 5),
  ('m2-q6', 2, '¿Cuál es el sistema de conducción más común?', 'V o cruceta', array['Eje central', 'Parronal', 'Vaso abierto']::text[], false, 6),
  ('m2-q7', 2, '¿Qué nutriente se asocia a la firmeza de la fruta?', 'Potasio', array['Nitrógeno', 'Fósforo', 'Cloro']::text[], false, 7),
  ('m2-q8', 2, '¿Qué plaga prolifera en bordes de camino secos y polvorientos?', 'Arañita roja', array['Pulgón', 'Escama', 'Gusano']::text[], false, 8),
  ('m2-q9', 2, '¿Qué causa el crumbly berry (desgrane)?', 'Virus (RBDV) o mala polinización', array['Exceso de potasio', 'Helada', 'Falta de poda']::text[], false, 9),
  ('m2-q10', 2, '¿Qué produce tumores en el cuello o la raíz?', 'Agrobacterium tumefaciens', array['Nematodos', 'Armillaria', 'Fusarium']::text[], false, 10),
  ('m2-q11', 2, '¿Cuál es el sistema de riego ideal?', 'Goteo con doble cinta', array['Surco', 'Microaspersión foliar', 'Pivote']::text[], false, 11),
  ('m2-q12', 2, '¿Qué estructura la hace invasiva?', 'Yemas en raíces (hijuelos)', array['Semillas', 'Estolones aéreos', 'Bulbos']::text[], false, 12),
  ('m2-q13', 2, '¿A qué hora conviene cosechar para mercado fresco?', 'En la mañana, antes del calor', array['Al mediodía', 'En la tarde', 'A cualquier hora']::text[], false, 13),
  ('m2-q14', 2, '¿Para qué se hace el raleo de cañas en primavera?', 'Mejorar la entrada de luz, aire e insectos', array['Retrasar la cosecha', 'Generar más raíces', 'Producir fruta en invierno']::text[], false, 14),
  ('m2-q15', 2, '¿Cuál es la acción postcosecha crítica en las primeras 2-4 horas?', 'Pre-frío rápido', array['Lavar con agua', 'Dejar al sol para subir el brix', 'Empacar al vacío']::text[], false, 15),
  ('m2-q16', 2, '¿Cómo es la polinización de la frambuesa?', 'Muy atractiva para abejas (mucho néctar)', array['Por viento', 'Partenocárpica', 'Repele a los insectos']::text[], false, 16),
  ('m2-q17', 2, '¿Para qué se usa mulch en el camellón?', 'Retener humedad y controlar malezas', array['Pintar el suelo', 'Aportar salitre', 'Quemar la paja']::text[], false, 17),
  ('m2-q18', 2, '¿Cuál es el síntoma típico de RBDV?', 'Amarillamiento y desgrane', array['Pudrición del cuello', 'Fruta gigante', 'Agallas']::text[], false, 18),
  ('m2-q19', 2, '¿Qué significa IQF?', 'Congelado rápido individual', array['Calidad interna de la fruta', 'Fruta de calidad internacional', 'Granja integrada']::text[], false, 19),
  ('m2-q20', 2, '¿Cuál es el síntoma de la polilla del brote?', 'Brote en cayado con larva y túnel', array['Telaraña de arañita', 'Moho gris de Botrytis', 'Deficiencia de calcio']::text[], false, 20)
on conflict (id) do update set module_id = excluded.module_id, prompt = excluded.prompt, correct_answer = excluded.correct_answer, distractors = excluded.distractors, is_boss_final = excluded.is_boss_final, sort_order = excluded.sort_order;

-- Jefes (el HP actual y la derrota se preservan al re-ejecutar)
insert into public.bosses (id, module_id, name, title, max_hp, current_hp, damage_per_hit, final_question_id, unlocks_module_id) values ('boss-m0', 0, 'Archimago de Terrones', 'Consultor de Panguipulli', 1000, 1000, 10, 'm0-q99', 1)
  on conflict (id) do update set module_id = excluded.module_id, name = excluded.name, title = excluded.title, max_hp = excluded.max_hp, damage_per_hit = excluded.damage_per_hit, final_question_id = excluded.final_question_id, unlocks_module_id = excluded.unlocks_module_id;
insert into public.bosses (id, module_id, name, title, max_hp, current_hp, damage_per_hit, final_question_id, unlocks_module_id) values ('boss-m1', 1, 'Deformidad de los Verticales', 'Señora de los Floats', 1000, 1000, 10, null, 2)
  on conflict (id) do update set module_id = excluded.module_id, name = excluded.name, title = excluded.title, max_hp = excluded.max_hp, damage_per_hit = excluded.damage_per_hit, final_question_id = excluded.final_question_id, unlocks_module_id = excluded.unlocks_module_id;
insert into public.bosses (id, module_id, name, title, max_hp, current_hp, damage_per_hit, final_question_id, unlocks_module_id) values ('boss-m2', 2, 'Señor de las Cañas', 'Guardián del Pre-frío', 1000, 1000, 10, null, null)
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

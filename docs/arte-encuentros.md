# Arte de los encuentros (D&D Agrícola 16-bits)

Guía para generar y conectar las imágenes de los **13 jefes cooperativos** y los **65 subjefes**.
El estilo visual de cada módulo (paleta, marco y fondo de batalla) vive en `src/data/encounters.ts`.

## Cómo conectar una imagen

1. **Formato:** PNG cuadrado de 512×512 (o 256×256), con fondo oscuro sólido o transparente. La app la muestra
   con `image-rendering: pixelated`, así que no la suavices al escalar.
2. **Súbela a Supabase Storage** (recomendado: funciona en la web y en la app Android sin publicar otra versión):
   Storage → *New bucket* `encuentros` (público) → sube el archivo con el nombre indicado abajo → *Get URL*.
3. **Conéctala:**
   - **Jefe del módulo:** panel `/admin` → Módulos → editar → *Imagen del jefe (sprite_url)* → pega la URL. Se ve
     la vista previa al instante.
   - **Subjefe:** en el SQL Editor:
     ```sql
     update public.submodules set sprite_url = 'https://…/encuentros/m2-s1.png' where id = 'm2-s1';
     ```
   - También sirve una ruta del sitio web (`/encounters/boss-fertilidad.png`) si copias el archivo en
     `public/encounters/`, pero esa opción **solo funciona en la web**: la app Android necesita una URL completa
     (https://…).
4. Si la imagen no carga, la app vuelve sola al sprite pixel de respaldo.

`npm run db:seed-sql` nunca borra un `sprite_url` ya cargado. El fondo de batalla (`bg_theme`) se puede cambiar desde
el mismo formulario del admin; en los subjefes, `bg_theme` vacío hereda el del módulo.

## Jefes cooperativos (13)

### M1 · El Gólem de Arcilla Compactada
- Archivo: `boss-edafologia.png` · Marco: `packed-clay` · Fondo: `bg-clay-pit` · Temática: Arcilla compactada, capas de suelo y raíces retorcidas

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A massive golem made of compacted clay, dark soil layers, and thick twisted roots. The design merges soil science with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M2 · El Titán de la Salinidad Residual
- Archivo: `boss-fertilidad.png` · Marco: `salt-crystal` · Fondo: `bg-salt-flats` · Temática: Sal y cristales corrosivos

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A towering titan made of glowing white salt crystals and corrosive minerals draining life from the earth. The design merges soil chemistry with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M3 · La Tempestad de Escarcha Negra
- Archivo: `boss-agrometeorologia.png` · Marco: `black-ice` · Fondo: `bg-black-frost` · Temática: Hielo oscuro y viento

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A dark tempest elemental made of freezing black frost, shattered ice, and violent winds. The design merges agrometeorology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M4 · La Raíz Senescente Ancestral
- Archivo: `boss-fisiologia.png` · Marco: `ancient-root` · Fondo: `bg-ancient-roots` · Temática: Raíces nudosas y magia antigua

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A sinister, ancient dying root system imbued with dark magic, draining water and life from its surroundings. The design merges plant physiology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M5 · El Filotaxista Ancestral
- Archivo: `boss-botanica.png` · Marco: `vine-lattice` · Fondo: `bg-geometric-grove` · Temática: Hojas y enredaderas geométricas

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A mystical botanical guardian made of perfectly geometric vines and razor-sharp leaves forming magical patterns. The design merges botany with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M6 · El Patriarca del Canopio Desbocado
- Archivo: `boss-fruticultura.png` · Marco: `tangled-wood` · Fondo: `bg-overgrown-canopy` · Temática: Ramas caóticas y madera densa

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A chaotic, overgrown ancient tree patriarch with excessively thick, dark branches blocking out the sun. The design merges fruit farming with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M7 · Deformidad de los Verticales
- Archivo: `boss-cranberry.png` · Marco: `peat-bog` · Fondo: `bg-red-swamp` · Temática: Pantano de turba rojo

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A grotesque swamp monster made of red peat moss, muddy water, and tangled cranberry vines. The design merges agriculture with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M8 · Señor de las Cañas
- Archivo: `boss-frambuesa.png` · Marco: `thorn-ice` · Fondo: `bg-thorn-frost` · Temática: Espinas y hielo

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A cold, menacing knight wearing rusted armor made of icy thorns and overgrown raspberry canes. The design merges agriculture with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M9 · El Climatizador Desbocado
- Archivo: `boss-horticultura.png` · Marco: `scrap-tech` · Fondo: `bg-greenhouse` · Temática: Ciberpunk rústico: ventiladores, sensores y cañerías

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A rustic cyberpunk golem made of broken greenhouse fans, glowing climate sensors, and irrigation pipes. The design merges agricultural technology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M10 · El Tirano de la Espiga
- Archivo: `boss-aves.png` · Marco: `feather-grain` · Fondo: `bg-wheat-storm` · Temática: Plumas y cereales

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A terrifying giant bird tyrant, clad in armor made of stolen wheat and grains, commanding a flock. The design merges ornithology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M11 · El Micelio Nigromante
- Archivo: `boss-hongos.png` · Marco: `fungal` · Fondo: `bg-spore-crypt` · Temática: Esporas bioluminiscentes y descomposición

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A towering necromancer made of decaying wood and glowing purple bioluminescent fungal spores. The design merges mycology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M12 · El Barón de la Cresta Hipertrófica
- Archivo: `boss-avicola.png` · Marco: `flesh-crest` · Fondo: `bg-mutant-coop` · Temática: Mutación avícola

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A mutated avian baron with an overgrown, glowing red hypertrophic crest and sharp metallic spurs. The design merges poultry farming with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### M13 · El Macho Cabrío del Rastrojo Salino
- Archivo: `boss-caprinos.png` · Marco: `dry-rock` · Fondo: `bg-dry-steppe` · Temática: Secano, cuernos y rocas

```
A highly detailed 16-bit pixel art sprite of an RPG boss. A fierce, demonic billy goat with massive twisted horns, standing defiantly on dry salt rocks. The design merges livestock farming with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

## Subjefes (65)

Prompts entregados por el equipo de arte. Cada subjefe va en el submódulo cuyo contenido calza mejor con su temática:
cuando el orden del equipo de arte no coincide con el de la app, la línea *Tema (arte)* indica el submódulo original.
Archivo: súbelo como `m{n}-s{k}.png` y conéctalo con el `update … where id = 'm{n}-s{k}'` de arriba.

### Módulo 1

#### m1-s1 · Densímetro de Bouyoucos — *Lector de la Sedimentación*
- Submódulo de la app: Textura y Estructura · Tema (arte): 1.1 Textura y Estructura · Archivo: `m1-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Bouyoucos Hydrometer. A magical, floating glass golem filled with swirling muddy water and sediment layers. The design merges soil science with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m1-s2 · Olla de Presión Richards — *Extractora de la Tensión Mátrica*
- Submódulo de la app: Retención y Curvas de Humedad · Tema (arte): 1.2 Retención y Curvas de Humedad · Archivo: `m1-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Richards Pressure Pot. A heavy, rusted iron pressure cooker golem shooting jets of pressurized steam and draining water. The design merges soil hydrology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m1-s3 · Penitente del Suelo Fisurado — *Guardián del Pie de Arado*
- Submódulo de la app: Aireación y Compactación · Tema (arte): 1.3 Aireación y Compactación · Archivo: `m1-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Fissured Soil Penitent. A hunched, armored golem made of severely compacted, cracked dry earth, wielding a heavy iron plowshare. The design merges soil compaction with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m1-s4 · Vórtice de Acarreo — *Devorador de Laderas*
- Submódulo de la app: Erosión y Conservación · Tema (arte): 1.4 Erosión y Conservación · Archivo: `m1-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Runoff Vortex. A churning, aggressive water elemental made of muddy runoff, carrying stolen topsoil, roots, and debris. The design merges soil erosion with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m1-s5 · Espectro de la Calicata Profunda — *Guardián de los Horizontes*
- Submódulo de la app: Horizontes y Perfil de Suelo · Tema (arte): 1.5 Horizontes y Perfil de Suelo · Archivo: `m1-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Deep Soil Pit Specter. A towering, multi-layered earth spirit showing distinct soil horizons, glowing with buried ancient minerals. The design merges soil profiles with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 2

#### m2-s1 · Coloso de Adsorción — *Devorador de Cationes*
- Submódulo de la app: CIC y Coloides del Suelo · Tema (arte): 2.2 CIC · Archivo: `m2-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Adsorption Colossus. A hulking elemental made of electrically charged clay and floating glowing minerals. The design merges soil chemistry with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m2-s2 · Alquimista Acidófilo — *Señor del Aluminio Tóxico*
- Submódulo de la app: pH, Encalado y Disponibilidad · Tema (arte): 2.1 pH y Salinidad · Archivo: `m2-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Acidophilic Alchemist. A dark wizard holding a bubbling vial of corrosive acid, standing on barren, crystallized soil. The design merges agriculture with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m2-s3 · Hidra del Nitrato Lixiviado — *Fugitiva del Perfil*
- Submódulo de la app: Nitrógeno, Fósforo y Potasio · Tema (arte): 2.3 Macronutrientes · Archivo: `m2-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Leached Nitrate Hydra. A serpentine monster made of toxic blue underground water and glowing green nitrogen veins. The design merges agricultural chemistry with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m2-s4 · Sombras Cloróticas — *Heraldos de la Carencia*
- Submódulo de la app: Secundarios y Micronutrientes · Tema (arte): 2.4 Micronutrientes · Archivo: `m2-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Chlorotic Shadows. A wraith-like creature made of pale, dying yellow leaves with green veins, radiating a sickening aura. The design merges plant deficiency with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m2-s5 · Auditor de Espectrometría — *Juez de los Rangos Críticos*
- Submódulo de la app: Diagnóstico y Programas de Fertilización · Tema (arte): 2.5 Análisis de Suelo · Archivo: `m2-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Spectrometry Auditor. A robotic medieval golem with a glowing glass eye, examining a glowing soil sample. The design merges laboratory equipment with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 3

#### m3-s1 · Prisma Solar Descalibrado — *Ladrón de Onda Larga*
- Submódulo de la app: Radiación y Balance de Energía · Tema (arte): 3.1 Radiación Solar · Archivo: `m3-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Uncalibrated Solar Prism. A floating, corrupted glass crystal shooting blinding rays of scorching light. The design merges meteorology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m3-s2 · Criomante del Meristema — *Contador de Horas Frío*
- Submódulo de la app: Temperatura, Grados Día y Horas Frío · Tema (arte): 3.2 Temperatura · Archivo: `m3-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Meristem Cryomancer. A frozen ghost wearing a crown of dead, icy plant buds, wielding a wand of frost. The design merges crop freezing with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m3-s3 · El Inversor Térmico — *Señor de la Noche Despejada*
- Submódulo de la app: Heladas: Tipos y Control · Tema (arte): 3.4 Heladas · Archivo: `m3-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Thermal Inverter. A two-faced elemental, half burning heat and half freezing ice, creating a suffocating dome. The design merges weather anomalies with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m3-s4 · Viento Psicrométrico — *Amo de la ET₀*
- Submódulo de la app: Humedad, Viento y Evapotranspiración · Tema (arte): 3.3 Evapotranspiración · Archivo: `m3-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Psychrometric Wind. An elemental air spirit wrapped in fog and spinning metal anemometer blades as weapons. The design merges meteorology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m3-s5 · Autómata de la Caseta Meteorológica — *Vigía del Riesgo Climático*
- Submódulo de la app: Clima de Chile y Riesgo Agroclimático · Tema (arte): 3.5 Estaciones Meteorológicas · Archivo: `m3-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Weather Station Automaton. A hostile mechanical construct built from rusted rain gauges, solar panels, and whirring weather instruments. The design merges agricultural tech with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 4

#### m4-s1 · Guardián del Complejo Antena — *Escudo de Clorofila*
- Submódulo de la app: Fotosíntesis C3, C4 y CAM · Tema (arte): 4.1 Fotosíntesis · Archivo: `m4-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Antenna Complex Guardian. A radiant plant elemental wielding a shield made of glowing green chloroplasts and shooting sunbeams. The design merges plant physiology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m4-s2 · Tensión Xilemática Extrema — *Medidor del Potencial Hídrico*
- Submódulo de la app: Agua en la Planta: Potencial Hídrico · Tema (arte): 4.2 Relaciones Hídricas · Archivo: `m4-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Extreme Xylem Tension. A water-starved ent made of desiccated wood, surrounded by swirling, pressurized water droplets. The design merges plant hydrology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m4-s3 · Sombra Osmótica — *Emisaria del Ácido Abscísico*
- Submódulo de la app: Transpiración y Estomas · Tema (arte): 4.5 Estrés Abiótico · Archivo: `m4-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Osmotic Shadow. A dark, shriveled wraith radiating an aura of severe heat and drought, turning the ground to cracked dust. The design merges abiotic stress with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m4-s4 · Quimera de Apicalidad — *Bestia de la Dominancia Apical*
- Submódulo de la app: Hormonas Vegetales · Tema (arte): 4.3 Fitohormonas · Archivo: `m4-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Apicality Chimera. A multi-headed monstrous bud with rapidly growing, aggressive thorny shoots controlled by hormonal magic. The design merges plant hormones with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m4-s5 · Dren de Azúcares — *Vampiro del Añerismo*
- Submódulo de la app: Fenología, Dormancia y Floración · Tema (arte): 4.4 Partición de Asimilados · Archivo: `m4-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Sugar Drain. A vampiric, glowing amber sludge monster siphoning sweet glowing sap from a dying root. The design merges plant metabolism with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 5

#### m5-s1 · El Meristema Bifurcado — *Arquitecto de Raíz, Tallo y Hoja*
- Submódulo de la app: Raíz, Tallo y Hoja · Tema (arte): 5.1 Organografía Vegetal · Archivo: `m5-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Bifurcated Meristem. A mutating plant creature with actively dividing, glowing green cellular structures and sharp root-claws. The design merges botany with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m5-s2 · Flor de Sépalos Caducos — *Bruja del Ovario Ínfero*
- Submódulo de la app: Flor, Fruto y Semilla · Tema (arte): 5.2 Morfología Floral · Archivo: `m5-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Flower of Deciduous Sepals. A hauntingly beautiful but deadly floral witch wearing a gown of falling, razor-sharp petals. The design merges floral morphology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m5-s3 · El Taxónomo Categórico — *Juez de los Nombres Científicos*
- Submódulo de la app: Taxonomía y Nomenclatura · Tema (arte): 5.4 Familias Botánicas · Archivo: `m5-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Categorical Taxonomist. An undead medieval scholar wielding a heavy, magical botanical codex that summons spectral weeds. The design merges plant taxonomy with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m5-s4 · Cariópside Indehiscente — *Fortaleza del Bosque Nativo*
- Submódulo de la app: Flora Nativa de Chile · Tema (arte): 5.3 Frutos y Semillas · Archivo: `m5-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Indehiscent Caryopsis. A heavily armored seed-golem that acts as an impenetrable, rolling fortress of tough botanical grain. The design merges seed biology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m5-s5 · La Raíz Gemífera — *Reina de los Rizomas*
- Submódulo de la app: Reconocimiento de Malezas · Tema (arte): 5.5 Malezas · Archivo: `m5-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Gemmiferous Root. A creeping, invasive weed-beast composed of endless regenerating stolons and toxic leaves. The design merges weed biology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 6

#### m6-s1 · El Callo Desfasado — *Quebrador de la Unión*
- Submódulo de la app: Portainjertos e Injertación · Tema (arte): 6.5 Portainjertos · Archivo: `m6-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Mismatched Callus. A monstrous grafted creature, half noble rootstock and half chaotic scion, struggling to connect through glowing, leaking sap. The design merges plant propagation with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m6-s2 · La Lamburda Ciega — *Señor de la Sombra Interior*
- Submódulo de la app: Sistemas de Conducción y Densidad · Tema (arte): 6.2 Madera Frutal · Archivo: `m6-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Blind Spur. A grotesque, twisted branch golem that lacks leaves or flowers, striking blindly with jagged wooden limbs. The design merges tree morphology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m6-s3 · La Tijera Descompensada — *Despertadora de Chupones*
- Submódulo de la app: Poda y Equilibrio del Árbol · Tema (arte): 6.3 Poda y Conducción · Archivo: `m6-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Unbalanced Shear. A possessed, giant rusted pruning shear floating menacingly, dripping with dark sap. The design merges agricultural tools with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m6-s4 · El Fruto Abortivo — *Enjambre de la Cuaja Fallida*
- Submódulo de la app: Polinización, Cuaja y Raleo · Tema (arte): 6.4 Cuaja y Raleo · Archivo: `m6-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Abortive Fruit. A swarm of decaying, half-formed sinister fruits detaching from a spectral branch, attacking like a hive. The design merges fruit development with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m6-s5 · La Yema Invernante — *Guardiana de la Cámara de Frío*
- Submódulo de la app: Madurez, Cosecha y Postcosecha · Tema (arte): 6.1 Dormancia · Archivo: `m6-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Wintering Bud. A heavily armored, dormant plant creature shielded by thick, dark woody scales covered in frost. The design merges fruit farming with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 7

#### m7-s1 · Centinela de la Turba — *Guardián de las Camas Ácidas*
- Submódulo de la app: Biología y Suelo · Tema (arte): 7.1 Establecimiento y Suelo · Archivo: `m7-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Peat Sentinel. A bulky swamp golem made of dark acidic peat moss, wet sand, and twisted cranberry roots. The design merges cranberry farming with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m7-s2 · Leviatán del Dique — *Señor del Calor Latente*
- Submódulo de la app: Agua, Heladas y Clima · Tema (arte): 7.3 Manejo Hídrico · Archivo: `m7-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Dike Leviathan. A monstrous water elemental emerging from a flooded red cranberry bog, armored with floating berries. The design merges cranberry wet harvesting with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m7-s3 · Sílfide del Botón Floral — *Danzante de los Uprights*
- Submódulo de la app: Manejo de las Camas · Tema (arte): 7.2 Fenología y Floración · Archivo: `m7-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Floral Bud Sylph. A deceptive, hostile fairy made of pale pink cranberry petals, wielding a spear made of a sharp upright shoot. The design merges cranberry biology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m7-s4 · Picudo de la Corona — *Plaga de las Camas*
- Submódulo de la app: Plagas, Enfermedades y Malezas · Tema (arte): 7.4 Sanidad y Plagas · Archivo: `m7-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss. A giant, menacing weevil insect with a long curved snout, wearing thorny armor made of cranberry vines. The design merges agricultural pests with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m7-s5 · El Clasificador Óptico — *Juez de los Floats*
- Submódulo de la app: Polinización, Cosecha y Calidad · Tema (arte): 7.5 Maduración y Calidad · Archivo: `m7-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Optical Sorter. A corrupted medieval sorting machine with a single glowing red crystal eye that shoots destructive beams at soft berries. The design merges agricultural machinery with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 8

#### m8-s1 · Vástago de la Corona — *Señor del Doble Ciclo*
- Submódulo de la app: Biología y Tipos de Caña · Tema (arte): 8.1 Arquitectura y Hábito de Fructificación · Archivo: `m8-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Crown Shoot. A corrupted, thorny raspberry plant crown bursting with wild, overgrown, whip-like green and red shoots. The design merges raspberry farming with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m8-s2 · El Tensor Roto — *Azote de los Camellones*
- Submódulo de la app: Suelo, Riego y Nutrición · Tema (arte): 8.3 Estructuras de Soporte · Archivo: `m8-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Broken Tensor. A restless, armored spirit bound by snapped, rusted high-tensile wires and swinging heavy wooden trellis posts like flails. The design merges farm infrastructure with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m8-s3 · La Podadera Mecánica — *Raleadora de Primocanes*
- Submódulo de la app: Conducción y Manejo de Cañas · Tema (arte): 8.2 Podas, Manejo de Cañas y Densidades · Archivo: `m8-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Mechanical Pruner. A possessed, giant rusted pruning shear with sharp metallic blades and mechanical joints dripping with green plant sap. The design merges agricultural tools with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m8-s4 · Moho Grisáceo — *Señor de la Pudrición Gris*
- Submódulo de la app: Plagas y Enfermedades · Tema (arte): 8.4 Patología del Huerto · Archivo: `m8-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Grey Mold. A toxic, creeping blob monster made of fuzzy grey fungal spores (Botrytis) enveloping and rotting a giant raspberry cluster. The design merges phytopathology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m8-s5 · El Sensor de Deformación — *Verdugo de la Fruta Blanda*
- Submódulo de la app: Cosecha y Postcosecha · Tema (arte): 8.5 Fisiología de Cosecha y Perecibilidad · Archivo: `m8-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Deformation Sensor. A corrupted, floating agricultural pressure sensor device with glowing red gauges and mechanical claws designed to crush soft fruit. The design merges postharvest technology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 9

#### m9-s1 · Arquitecto de Túneles — *Constructor del Ambiente Protegido*
- Submódulo de la app: Hortalizas: Clasificación y Fisiología · Tema (arte): 9.1 Estructuras y Materiales de Cubierta · Archivo: `m9-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Tunnel Architect. A goblin-like builder wearing a flowing cloak made of diffuse greenhouse plastic film, wielding a giant, heavy metallic arch pipe as a weapon. The design merges greenhouse construction with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m9-s2 · Absorbedor de Gas — *Asfixiador de Almácigos*
- Submódulo de la app: Almácigos y Establecimiento · Tema (arte): 9.4 Dinámica de CO₂ y Microclima · Archivo: `m9-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Gas Absorber. A heavy, steampunk-style iron golem with metallic lungs and valves, inhaling white vapor and emitting a dark, suffocating CO2 aura. The design merges greenhouse gas dynamics with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m9-s3 · El Vórtice Microclimático — *Condensador del Rocío*
- Submódulo de la app: Clima del Invernadero · Tema (arte): 9.2 Control Climático Pasivo y Activo · Archivo: `m9-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Microclimate Vortex. A swirling elemental monster made of artificial white fog, shimmering heat waves, and spinning metallic ventilation fan blades. The design merges climate control technology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m9-s4 · Espectro de la Lana de Roca — *Tirano de la Conductividad*
- Submódulo de la app: Fertirriego y Cultivo sin Suelo · Tema (arte): 9.3 Fertirriego en Sustratos sin Suelo · Archivo: `m9-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Rockwool Wraith. A floating, dripping ghost made of synthetic yellow rockwool fibers, heavily saturated with glowing, toxic nutrient solution. The design merges hydroponics with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m9-s5 · Nube de Trialeurodes — *Reina del Envés*
- Submódulo de la app: Plagas y Manejo Integrado · Tema (arte): 9.5 Manejo Integrado de Plagas en Entorno Cerrado · Archivo: `m9-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Trialeurodes Cloud. A terrifying, humanoid swarm-entity composed entirely of thousands of glowing whiteflies, buzzing with a blinding, toxic white light. The design merges agricultural pest control with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 10

#### m10-s1 · Espejismo de Plumaje — *Maestro del Dimorfismo*
- Submódulo de la app: Anatomía e Identificación · Tema (arte): 10.1 Morfología y Claves de Campo · Archivo: `m10-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Plumage Mirage. A shape-shifting avian spirit made of swirling, colorful holographic feathers that blur its true form. The design merges ornithology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m10-s2 · Halcón del Alambre — *Cazador de Roedores*
- Submódulo de la app: Rapaces y Control Biológico · Tema (arte): 10.2 Rapaces Diurnas y Nocturnas · Archivo: `m10-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Wire Falcon. A fierce, armored raptor perched on rusted barbed wire, with metallic talons and glowing yellow eyes. The design merges bird of prey biology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m10-s3 · La Bandada Voraz — *Saqueadora del Maizal*
- Submódulo de la app: Aves de Ambientes Agrícolas · Tema (arte): 10.3 Aves Granívoras y Frugívoras · Archivo: `m10-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Ravenous Flock. A swirling, chaotic vortex of aggressive, shadowy granivorous birds moving together as a single terrifying entity. The design merges agricultural ornithology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m10-s4 · Sílfide de las Corolas — *Vigía del Humedal*
- Submódulo de la app: Humedales y Aves Acuáticas · Tema (arte): 10.4 Aves Insectívoras y Polinizadoras · Archivo: `m10-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Corolla Sylph. A swift, humanoid hummingbird fairy armed with a needle-thin rapier, surrounded by glowing golden pollen. The design merges pollinator biology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m10-s5 · El Anillador Invisible — *Guardián de la Ley de Caza*
- Submódulo de la app: Manejo de Daños y Conservación · Tema (arte): 10.5 Metodologías de Monitoreo · Archivo: `m10-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Invisible Ringer. A ghostly tracker wearing a ragged camouflage cloak, wielding a giant magical bird-banding ring like a chakram. The design merges wildlife monitoring with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 11

#### m11-s1 · El Sombrero del Velo — *Tejedor del Micelio*
- Submódulo de la app: Biología y Morfología Fúngica · Tema (arte): 11.1 Morfología Macroscópica · Archivo: `m11-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Veil Cap. A sinister humanoid mushroom wearing a wide, fleshy fungal cap as a hat, with a torn universal veil acting as a cape. The design merges mycology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m11-s2 · Clamor de Conidiosporas — *Heraldo del Conidio*
- Submódulo de la app: Reproducción y Ciclos de Vida · Tema (arte): 11.3 Fitopatógenos Foliares y Frutales · Archivo: `m11-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Conidiospore Clamor. A creeping, toxic cloud-monster made of white powdery mildew and erupting orange rust pustules on a decaying leaf. The design merges phytopathology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m11-s3 · Red de Simbiosis — *Pacto de las Micorrizas*
- Submódulo de la app: Hongos Benéficos · Tema (arte): 11.2 Micorrizas y Hongos Benéficos · Archivo: `m11-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Symbiosis Network. A glowing, underground root-golem entangled in a pulsing, bright blue mycelial web that shares magical energy. The design merges soil biology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m11-s4 · El Cancro Negro — *Señor de la Pudrición*
- Submódulo de la app: Hongos Fitopatógenos · Tema (arte): 11.4 Hongos de Madera y Decaimiento · Archivo: `m11-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Black Canker. A corrupted, weeping wood-spirit with deep, dark necrotic lesions on its bark-like skin, wielding a rotting branch. The design merges wood decay fungi with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m11-s5 · El Cáliz Amatoxina — *Imitador Mortal*
- Submódulo de la app: Setas Silvestres de Chile · Tema (arte): 11.5 Comestibles vs. Tóxicos · Archivo: `m11-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Amatoxin Chalice. A sinister mushroom creature shaped like a glowing green chalice dripping with toxic poison. The design merges toxic mycology with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 12

#### m12-s1 · El Disparador del Fotoperiodo — *Amo de las Líneas Comerciales*
- Submódulo de la app: Razas, Líneas y Sistemas · Tema (arte): 12.2 Manejo de Recría y Curvas de Postura · Archivo: `m12-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Photoperiod Trigger. A mechanized owl-like construct emitting blinding flashes of artificial light from its eyes to manipulate time. The design merges poultry management with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m12-s2 · La Tolva Segregada — *Tirana de la Energía Metabolizable*
- Submódulo de la app: Nutrición y Alimentación · Tema (arte): 12.3 Nutrición y Balance de Dietas · Archivo: `m12-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Segregated Hopper. A possessed, rusty medieval grain silo spewing a chaotic mix of toxic yellow corn and sharp calcium shards. The design merges poultry nutrition with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m12-s3 · El Centinela del Galpón — *Espíritu del Amoníaco*
- Submódulo de la app: Ambiente y Manejo del Galpón · Tema (arte): 12.4 Sistemas Productivos y Bienestar Animal · Archivo: `m12-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Barn Sentinel. A heavy, iron-clad guardian wielding a giant ventilation fan as a shield, surrounded by a suffocating cloud of ammonia. The design merges poultry housing with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m12-s4 · El Vector Patógeno — *Portador del Paramixovirus*
- Submódulo de la app: Sanidad y Bioseguridad · Tema (arte): 12.5 Sanidad y Bioseguridad Avícola · Archivo: `m12-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Pathogen Vector. A sinister, plague-doctor figure surrounded by a toxic green aura, scattering infected, decaying feathers. The design merges avian diseases with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m12-s5 · La Espiral del Magno — *Forjadora de Cáscaras*
- Submódulo de la app: Huevo, Calidad y Bienestar · Tema (arte): 12.1 Fisiología del Aparato Reproductor · Archivo: `m12-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Spiral of Magnum. A bizarre, serpentine monster resembling a twisted, fleshy oviduct radiating a glowing, calcifying magic aura. The design merges poultry anatomy with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

### Módulo 13

#### m13-s1 · El Guardián de la Raza Pura — *Señor de las Veranadas*
- Submódulo de la app: Razas y Sistemas Caprinos de Chile · Tema (arte): 13.2 Razas Caprinas · Archivo: `m13-s1.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Purebred Guardian. A towering, muscular minotaur-like goat champion clad in heavy bronze armor, wielding a massive halberd. The design merges livestock breeding with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m13-s2 · El Protozoo Ruminal — *Tirano del Almidón*
- Submódulo de la app: Alimentación y Rumia · Tema (arte): 13.1 Fisiología Digestiva · Archivo: `m13-s2.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Ruminal Protozoan. A giant, floating, translucent microscopic beast filled with swirling green fermented grass and acidic bubbles. The design merges ruminant digestion with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m13-s3 · El Reloj Melatonínico — *Señor del Efecto Macho*
- Submódulo de la app: Reproducción y Manejo del Rebaño · Tema (arte): 13.3 Ciclo Reproductivo · Archivo: `m13-s3.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Melatonin Clock. A mystical, cloaked figure floating on a crescent moon, controlling the dark night sky with a glowing hourglass. The design merges goat reproduction with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m13-s4 · La Larva L3 Enquistada — *Vampira del Cuajar*
- Submódulo de la app: Sanidad Caprina · Tema (arte): 13.5 Sanidad y Parasitismo · Archivo: `m13-s4.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Encysted L3 Larva. A vile, giant writhing nematode worm armored in a tough, spiky cyst, hiding in tall, dark grass. The design merges gastrointestinal parasites with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

#### m13-s5 · El Filtro de Células Somáticas — *Señor del Queso sin Pasteurizar*
- Submódulo de la app: Leche, Quesos y Productos · Tema (arte): 13.4 Instalaciones y Ordeño · Archivo: `m13-s5.png`

```
A highly detailed 16-bit pixel art sprite of an RPG sub-boss named Somatic Cell Filter. A corrupted, multi-armed milking machine golem leaking glowing, infected milk from rusted iron tubes. The design merges dairy farming with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges, dark solid background, isolated character.
```

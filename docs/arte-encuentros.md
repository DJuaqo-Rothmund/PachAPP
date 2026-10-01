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

Plantilla para Midjourney / DALL·E 3 (reemplaza lo que está entre llaves; describe al subjefe en inglés a partir de
su nombre y título):

```
A highly detailed 16-bit pixel art sprite of an RPG mini-boss, smaller and less ornate than a final boss.
{english description of the creature}. Themed around {module theme in English}. The design merges agronomy
with dark medieval fantasy. Clean pixel art, vibrant 16-bit retro arcade colors, dynamic combat pose, sharp edges,
dark solid background, isolated character.
```

| Submódulo | Subjefe | Título | Temática del módulo | Archivo |
| --- | --- | --- | --- | --- |
| m1-s1 | Densímetro de Bouyoucos | Lector de la Sedimentación | Arcilla compactada, capas de suelo y raíces retorcidas | `m1-s1.png` |
| m1-s2 | Olla de Presión Richards | Extractora de la Tensión Mátrica | Arcilla compactada, capas de suelo y raíces retorcidas | `m1-s2.png` |
| m1-s3 | Penitente del Suelo Fisurado | Guardián del Pie de Arado | Arcilla compactada, capas de suelo y raíces retorcidas | `m1-s3.png` |
| m1-s4 | Vórtice de Acarreo | Devorador de Laderas | Arcilla compactada, capas de suelo y raíces retorcidas | `m1-s4.png` |
| m1-s5 | Espectro de la Calicata Profunda | Guardián de los Horizontes | Arcilla compactada, capas de suelo y raíces retorcidas | `m1-s5.png` |
| m2-s1 | El Coloide Avaro | Acaparador de Cationes | Sal y cristales corrosivos | `m2-s1.png` |
| m2-s2 | La Bruja de la Acidez | Tejedora del Aluminio Intercambiable | Sal y cristales corrosivos | `m2-s2.png` |
| m2-s3 | El Lixiviador de Nitratos | Fugitivo del Perfil | Sal y cristales corrosivos | `m2-s3.png` |
| m2-s4 | El Clorótico Intervenal | Heraldo de la Carencia de Hierro | Sal y cristales corrosivos | `m2-s4.png` |
| m2-s5 | El Oráculo del Análisis Foliar | Guardián de los Rangos Críticos | Sal y cristales corrosivos | `m2-s5.png` |
| m3-s1 | El Espejo del Albedo | Ladrón de Onda Larga | Hielo oscuro y viento | `m3-s1.png` |
| m3-s2 | El Contador de Horas Frío | Guardián del Receso | Hielo oscuro y viento | `m3-s2.png` |
| m3-s3 | El Espectro de la Helada Radiativa | Señor de la Noche Despejada | Hielo oscuro y viento | `m3-s3.png` |
| m3-s4 | El Djinn de Penman-Monteith | Amo de la ET₀ | Hielo oscuro y viento | `m3-s4.png` |
| m3-s5 | La Sombra de La Niña | Hija de la Oscilación del Sur | Hielo oscuro y viento | `m3-s5.png` |
| m4-s1 | El Rubisco Confundido | Fijador de Oxígeno | Raíces nudosas y magia antigua | `m4-s1.png` |
| m4-s2 | La Cámara de Scholander | Medidora del Potencial Xilemático | Raíces nudosas y magia antigua | `m4-s2.png` |
| m4-s3 | El Estoma Sellado | Guardián del Ácido Abscísico | Raíces nudosas y magia antigua | `m4-s3.png` |
| m4-s4 | El Etileno Maduro | Señor de la Abscisión | Raíces nudosas y magia antigua | `m4-s4.png` |
| m4-s5 | El Durmiente Endodormido | Guardián del Receso Invernal | Raíces nudosas y magia antigua | `m4-s5.png` |
| m5-s1 | El Rizoma Laberíntico | Arquitecto Subterráneo | Hojas y enredaderas geométricas | `m5-s1.png` |
| m5-s2 | El Ovario Ínfero | Custodio del Pomo | Hojas y enredaderas geométricas | `m5-s2.png` |
| m5-s3 | El Binomio Linneano | Juez de los Nombres Científicos | Hojas y enredaderas geométricas | `m5-s3.png` |
| m5-s4 | El Espino Centinela | Guardián del Bosque Esclerófilo | Hojas y enredaderas geométricas | `m5-s4.png` |
| m5-s5 | La Correhuela Enredadora | Reina de los Rizomas Profundos | Hojas y enredaderas geométricas | `m5-s5.png` |
| m6-s1 | El Injerto Incompatible | Quebrador de la Unión | Ramas caóticas y madera densa | `m6-s1.png` |
| m6-s2 | El Eje Central Torcido | Señor de la Sombra Interior | Ramas caóticas y madera densa | `m6-s2.png` |
| m6-s3 | El Chupón Indómito | Ladrón de Carbohidratos | Ramas caóticas y madera densa | `m6-s3.png` |
| m6-s4 | El Polinizador Ausente | Señor de la Flor Vacía | Ramas caóticas y madera densa | `m6-s4.png` |
| m6-s5 | El Climatérico Desatado | Heraldo del Etileno | Ramas caóticas y madera densa | `m6-s5.png` |
| m7-s1 | El Runner Errante | Tejedor de Estolones | Pantano de turba rojo | `m7-s1.png` |
| m7-s2 | El Aspersor Congelado | Guardián del Calor Latente | Pantano de turba rojo | `m7-s2.png` |
| m7-s3 | El Arenador Implacable | Sepultador de Runners | Pantano de turba rojo | `m7-s3.png` |
| m7-s4 | La Cuscuta Estranguladora | Parásita de las Camas | Pantano de turba rojo | `m7-s4.png` |
| m7-s5 | El Batidor de la Inundación | Cosechador de Bayas Flotantes | Pantano de turba rojo | `m7-s5.png` |
| m8-s1 | La Caña Bienal | Señora del Doble Ciclo | Espinas y hielo | `m8-s1.png` |
| m8-s2 | El Camellón Anegado | Ahogador de Raíces | Espinas y hielo | `m8-s2.png` |
| m8-s3 | El Primocane Desbocado | Señor de la Espesura | Espinas y hielo | `m8-s3.png` |
| m8-s4 | El Burrito Barrenador | Devorador de Coronas | Espinas y hielo | `m8-s4.png` |
| m8-s5 | La Mosca de Alas Manchadas | Reina de la Fruta Blanda | Espinas y hielo | `m8-s5.png` |
| m9-s1 | El Bulbo Prematuro | Señor del Fotoperiodo | Ciberpunk rústico: ventiladores, sensores y cañerías | `m9-s1.png` |
| m9-s2 | El Damping-off | Segador de Plántulas | Ciberpunk rústico: ventiladores, sensores y cañerías | `m9-s2.png` |
| m9-s3 | La Niebla del Invernadero | Condensadora del Rocío | Ciberpunk rústico: ventiladores, sensores y cañerías | `m9-s3.png` |
| m9-s4 | El Gotero Obstruido | Tirano de la Conductividad | Ciberpunk rústico: ventiladores, sensores y cañerías | `m9-s4.png` |
| m9-s5 | La Mosquita Blanca Legionaria | Reina del Envés | Ciberpunk rústico: ventiladores, sensores y cañerías | `m9-s5.png` |
| m10-s1 | El Plumaje Engañoso | Maestro del Dimorfismo | Plumas y cereales | `m10-s1.png` |
| m10-s2 | La Lechuza Fantasma | Cazadora de la Medianoche | Plumas y cereales | `m10-s2.png` |
| m10-s3 | La Bandada de Tordos | Saqueadores del Maizal | Plumas y cereales | `m10-s3.png` |
| m10-s4 | La Garza Centinela | Vigía del Humedal | Plumas y cereales | `m10-s4.png` |
| m10-s5 | El Choroy Saqueador | Señor de la Bandada Verde | Plumas y cereales | `m10-s5.png` |
| m11-s1 | La Hifa Tabicada | Tejedora del Micelio | Esporas bioluminiscentes y descomposición | `m11-s1.png` |
| m11-s2 | La Espora Durmiente | Heraldo del Conidio | Esporas bioluminiscentes y descomposición | `m11-s2.png` |
| m11-s3 | El Trichoderma Mercenario | Cazador de Patógenos | Esporas bioluminiscentes y descomposición | `m11-s3.png` |
| m11-s4 | La Botrytis Gris | Señora de la Pudrición | Esporas bioluminiscentes y descomposición | `m11-s4.png` |
| m11-s5 | La Amanita Embustera | Imitadora Mortal | Esporas bioluminiscentes y descomposición | `m11-s5.png` |
| m12-s1 | El Híbrido Comercial | Señor de la Línea Pesada | Mutación avícola | `m12-s1.png` |
| m12-s2 | El Comedero Desbalanceado | Tirano de la Energía Metabolizable | Mutación avícola | `m12-s2.png` |
| m12-s3 | El Amoníaco Asfixiante | Espíritu de la Cama Húmeda | Mutación avícola | `m12-s3.png` |
| m12-s4 | El Heraldo de Newcastle | Portador del Paramixovirus | Mutación avícola | `m12-s4.png` |
| m12-s5 | La Gallina Desplumada | Señora del Picaje | Mutación avícola | `m12-s5.png` |
| m13-s1 | La Cabra Criolla Trashumante | Señora de las Veranadas | Secano, cuernos y rocas | `m13-s1.png` |
| m13-s2 | El Rumen Acidótico | Tirano del Almidón | Secano, cuernos y rocas | `m13-s2.png` |
| m13-s3 | El Macho Estacional | Señor del Efecto Macho | Secano, cuernos y rocas | `m13-s3.png` |
| m13-s4 | El Vampiro del Cuajar | Haemonchus Insaciable | Secano, cuernos y rocas | `m13-s4.png` |
| m13-s5 | El Cuajo Rebelde | Señor del Queso sin Pasteurizar | Secano, cuernos y rocas | `m13-s5.png` |

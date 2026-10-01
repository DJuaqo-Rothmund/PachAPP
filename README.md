# Pachapp · by DJuaqo

PWA de e-learning gamificada para agrónomos: lee el **Códice**, responde preguntas,
derrota al **Jefe** en un Boss Raid comunitario, gana **emblemas** y sube en el **ranking** mensual.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router
- Supabase (Auth con Google OAuth + Postgres)
- PWA con `vite-plugin-pwa` (manifest + service worker con auto-update)

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completa URL y anon key de Supabase
npm run dev
```

Sin variables de Supabase la app corre en **modo demo**: sin login, con un backend simulado en el navegador
(`src/lib/game/demoApi.ts`) que aplica las mismas reglas que el servidor y guarda el progreso en `localStorage`.
En la demo los jefes parten con 120 HP (la "comunidad simulada" ya los hirió) para poder derrotarlos jugando solo.
El progreso se borra desde **Perfil → Reiniciar demo**.

## App Android (`mobile/`)

App nativa hecha con **Expo (React Native)**. Comparte con la web los datos semilla, los tipos, las reglas del juego
(backend demo y API de Supabase) y los sprites pixel art: los importa desde `../src` con el alias `@shared/*`.

- **Descargar el APK:** en GitHub → pestaña **Actions** → workflow **Android APK** → la última ejecución → artefacto
  `pachapp-android-apk`. Descomprime el zip e instala el `.apk` en tu Android (permite "instalar apps desconocidas").
  El APK está firmado con la llave de depuración: sirve para probar, no para Google Play.
- **Modo demo:** sin secretos de Supabase, el APK corre en modo demo con el progreso guardado en el teléfono.
- **Datos reales y login con Google:**
  1. En GitHub → Settings → Secrets and variables → Actions, crea los secretos `EXPO_PUBLIC_SUPABASE_URL`
     y `EXPO_PUBLIC_SUPABASE_ANON_KEY` (los mismos valores que la web). El próximo APK los incluye.
  2. En Supabase → Authentication → URL Configuration → *Redirect URLs*, agrega `pachapp://auth-callback`.
  3. Listo: el login abre Google en una pestaña segura de Chrome y vuelve a la app. Usa el mismo proveedor
     Google de Supabase que la web, así que **no se necesitan credenciales de Android en Google Cloud**.
- **Desarrollo:**

  ```bash
  cd mobile
  npm install
  npx expo start        # escanea el QR con un build de desarrollo, o usa --web para verla en el navegador
  npx tsc --noEmit      # typecheck
  ```

## Base de datos (Supabase)

1. **SQL Editor** → ejecutar `supabase/schema.sql` (tablas, RLS, funciones del juego).
2. **SQL Editor** → ejecutar `supabase/seed.sql` (módulos, preguntas, jefes, emblemas y correo admin).
3. **Authentication → Providers → Google**: activar con tu Client ID/Secret de Google Cloud.
4. **Authentication → URL Configuration**: agregar `http://localhost:5173`, tu dominio y `pachapp://auth-callback`
   (app Android) a *Redirect URLs*.

Ambos archivos se pueden re-ejecutar sin perder el progreso de los jugadores.
**Al actualizar desde una versión anterior** re-ejecuta los dos: `schema.sql` agrega la tabla `raid_sessions` y las
funciones del raid semanal y habilita las clases nuevas (Artífice, Alquimista, Guerrero del Surco y Guardián Ambiental),
y `seed.sql` carga los nuevos Códices y preguntas. Las preguntas semilla conservan sus IDs
(`m0-q1`…), pero su contenido cambió: el historial de respuestas de esos IDs ahora apunta a las preguntas nuevas.
Ojo: re-ejecutar `seed.sql` restaura el contenido original de los módulos, preguntas, jefes y emblemas semilla
(mismos IDs), pisando lo que hayas editado desde el panel admin. El contenido creado desde el panel no se toca.
Si editas `src/data/seed.ts`, regenera el SQL con:

```bash
npm run db:seed-sql            # usa ADMIN_EMAILS=correo1,correo2 para cambiar admins
```

### Campaña de 13 módulos

Módulo → submódulos (Códice + subjefe individual) → jefe cooperativo semanal de 5.000 HP. El contenido vive en
`src/data/seed.ts` y `src/data/campaign/` (Módulo 1 · Edafología es el piloto con sus 5 submódulos); `seed.sql` se
genera desde ahí. Los módulos sin contenido aparecen bloqueados con el Códice "En preparación".

Al re-ejecutar `schema.sql` sobre una base de la campaña anterior, Cranberry pasa a ser el módulo 7 y Frambuesa el 8
(con su progreso, raids y daño acumulado) y el antiguo módulo Fundamentos queda archivado.

Checkpoint interactivo de un Códice (`codices.interactive_checkpoints`, validado por `codex_checkpoints_valid`):

```json
{ "id": "m1-s2-cp1", "timestamp_seconds": 140, "prompt": "…", "options": ["…", "…"], "correct_index": 0, "explanation": "…" }
```

### Modelo

| Tabla          | Contenido                                                           |
| -------------- | ------------------------------------------------------------------- |
| `profiles`     | Usuarios: nombre, avatar, clase RPG, XP total (se crea al registrarse) |
| `modules`      | Los 13 módulos de la campaña (`archived` oculta módulos retirados)  |
| `submodules`   | Submódulos de cada módulo, con su subjefe individual (nombre, título, HP) |
| `codices`      | Códice de cada submódulo: secciones de texto, `video_url` y `interactive_checkpoints` (JSONB) |
| `submodule_progress` | Progreso individual por submódulo: Códice leído, checkpoints y daño al subjefe |
| `daily_lives`  | Errores del día por jugador (3 vidas; el día es el de Chile)        |
| `master_settings` / `master_attempts` | Clave del modo maestro (hash bcrypt) e intentos fallidos por día |
| `questions`    | Preguntas con respuesta correcta y 3 falsas (**solo admin la lee**); `submodule_id` opcional |
| `bosses`       | Jefe por módulo: HP actual/máximo, daño por acierto, módulo que desbloquea |
| `codex_reads`  | Qué Códices leyó cada usuario                                       |
| `answers`      | Historial de respuestas, XP y daño                                  |
| `raid_sessions`| Batalla semanal de cada jugador: sus 15 preguntas, avance y daño    |
| `badges` / `user_badges` | Emblemas y quién los ganó                                 |
| `admin_emails` | Correos con rol admin                                               |

### Reglas del juego (en el servidor)

- Hay que leer el Códice (`mark_codex_read()`) antes de responder.
- **Boss Raid semanal** (`start_raid()`): cada jugador combate **una vez por semana** contra cada jefe (lunes a domingo,
  hora de Chile). La batalla tiene **máximo 15 preguntas**: 14 al azar del módulo y la pregunta final del jefe al cierre.
  Si sales a mitad de camino, al volver retomas la misma batalla. Así el jefe se derrota en comunidad, semana a semana.
- Solo los aciertos **dentro del raid** restan HP (−10; la pregunta final pega ×5).
- **Entrenamiento** (`get_module_questions()`): todas las preguntas del módulo, sin límite; da XP pero no daña al jefe.
- XP: solo el **primer acierto** de cada pregunta (raid o entrenamiento) da XP (+10; la final +50).
- Quien deja al jefe en 0 HP da el **golpe final** (+100 XP) y la comunidad desbloquea el siguiente módulo de forma permanente.
- Las alternativas llegan barajadas y sin la respuesta correcta; `answer_question()` la valida en el servidor.
- Ranking mensual: `get_monthly_leaderboard()` (mes calendario, hora de Chile).
- **Submódulos**: se abren en orden. Cada uno tiene su Códice (`mark_submodule_codex_read()`) y un **subjefe
  individual** (`start_subboss()` / `answer_subboss()`): 40–50 HP propios, −10 por acierto y 5 preguntas por duelo; si
  no cae, el duelo se reinicia con HP completo. Derrotarlo abre el siguiente submódulo.
- El **Boss Raid** de un módulo con submódulos exige haber derrotado a **todos sus subjefes**.
- **Vidas**: 3 por día (`get_lives()`). Cada error en un duelo contra un subjefe o en el Boss Raid gasta una; sin vidas
  no se puede combatir hasta las **00:00 (hora de Chile)**. Entrenar y los checkpoints del Códice no gastan vidas.

### Modo maestro (cuenta de pruebas)

En la pantalla de clases, **5 toques seguidos sobre el Brujo Fitosanitario** piden la clave. Con el modo maestro
(`profiles.is_tester`) el jugador tiene vidas ilimitadas, todos los submódulos y Boss Raids abiertos y puede repetir el
raid semanal. Se desactiva desde el perfil. El daño que hace **sí cuenta** para los jefes de la comunidad.

La clave inicial es `1234` y vive hasheada (bcrypt) en `master_settings`; tras 5 intentos fallidos en el día la cuenta
queda bloqueada hasta el día siguiente. **Cámbiala antes de abrir la app al público** (en el SQL Editor):

```sql
update public.master_settings set code_hash = extensions.crypt('NUEVA-CLAVE', extensions.gen_salt('bf'));
-- o desactívalo por completo:
update public.master_settings set enabled = false;
```

En la demo sin Supabase la clave es `1234` (`DEMO_MASTER_CODE` en `src/lib/game/lives.ts`).

## Clases, skins y desbloqueables

Las clases viven en `src/data/classes.ts` (compartido con la app Android). Cada una define:

- `theme`: la skin que toma la interfaz al elegirla (color de acento y fondo decorativo: olas para Riego, runas para el
  Brujo, surcos para Cultivos, grilla de circuito para Precisión, etc.). En la web la aplica `ClassThemeController`
  (tokens `--color-moss*` y `html[data-motif]` en `src/index.css`); en Android, `useClassTheme` y `ThemeBackdrop`.
- `unlock`: la regla para ganarla (`starter`, `level` o `boss_defeated`). Hoy **no se exige**
  (`CLASS_UNLOCKS_ENFORCED = false`): la pantalla de clases muestra la recompensa, pero todas se pueden elegir. Al
  activarla hay que exigir la misma regla en el servidor.

## Generador de preguntas (API de Anthropic)

`generate_questions.ts` pide a Claude lotes de preguntas nuevas sobre Fisiología, Riego de Precisión, Patología y
Postcosecha, usando el Códice del módulo como contexto, y guarda cada lote en `src/data/db/<módulo>_batch_<n>.json`
apenas llega. Descarta preguntas con alternativas repetidas o enunciados que ya existan en la semilla o en lotes anteriores.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run generate:questions -- --module cranberry --count 20 --batches 3   # → cranberry_batch_1..3.json
npm run generate:questions -- --module frambuesa --dry-run                # ver el prompt sin llamar a la API
npm run db:batches-sql                                                    # lotes revisados → supabase/batches.sql
```

Opciones: `--module` (`0|fundamentos`, `1|cranberry`, `2|frambuesa`), `--count` (1–40, por defecto 20), `--batches`,
`--effort` (`low`…`max`, por defecto `high`), `--out`, `--dry-run` y `--from-file` (usa un JSON guardado, para probar sin API).
Usa el modelo `claude-opus-5-5` con salida JSON estructurada y `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`):
si el modelo declina una solicitud, la API la reintenta sola con el modelo de respaldo recomendado.

**Revisa cada lote antes de publicarlo** (edita o borra preguntas en el JSON) y luego ejecuta `supabase/batches.sql`
en el SQL Editor. Las preguntas nuevas entran de inmediato al pool aleatorio del raid y al entrenamiento.

## Despliegue en Vercel

1. En [vercel.com/new](https://vercel.com/new) importa el repo `DJuaqo-Rothmund/PachAPP` (Vercel detecta Vite solo; `vercel.json` ya trae la configuración).
2. En **Settings → Environment Variables** agrega `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_ADMIN_EMAILS`.
   Sin ellas la app se publica en modo demo.
3. Despliega. Luego, en Supabase → **Authentication → URL Configuration**, agrega tu dominio de Vercel
   (por ejemplo `https://pachapp.vercel.app`) como *Site URL* y en *Redirect URLs*, para que funcione el login con Google.

`vercel.json` redirige todas las rutas a `index.html` (para que `/perfil` o `/admin` funcionen al recargar)
y evita que el navegador guarde en caché el service worker, para que las actualizaciones de la PWA lleguen.

## Panel admin (`/admin`)

Solo visible para los correos en `admin_emails` (acceso desde **Perfil → Panel Admin**). En modo demo, el usuario local es admin.

- **Resumen:** jugadores, respuestas, % de acierto, jefes derrotados y las preguntas con menor tasa de acierto.
- **Módulos:** crear, editar y borrar; editor del Códice por secciones; desbloqueo manual.
- **Preguntas:** por módulo, con búsqueda; valida 4 alternativas distintas; marca la pregunta del jefe.
- **Jefes:** HP, daño por acierto, módulo que desbloquean, reiniciar HP y crear jefes para módulos nuevos.
- **Emblemas:** nombre, descripción, ícono pixel art y regla para ganarlo (leer N Códices, racha de N aciertos,
  completar un módulo, participar en la derrota de un jefe o dar el golpe final). Muestra cuántos jugadores tiene cada uno.
  Los emblemas nuevos se otorgan en la siguiente acción del jugador que cumpla la regla.

Las escrituras las protege RLS en Supabase (`is_admin()`): aunque alguien llame a la API directamente, un jugador no puede modificar contenido.

## Rutas

| Ruta                        | Descripción                          |
| --------------------------- | ------------------------------------ |
| `/login`                    | Login con Google                     |
| `/`                         | Mapa de campaña (dashboard)          |
| `/onboarding`               | Elección de clase RPG                |
| `/modulos/:id`              | Árbol del módulo: submódulos, subjefes y jefe cooperativo |
| `/modulos/:id/submodulos/:sub` | Códice del submódulo con checkpoints |
| `/modulos/:id/submodulos/:sub/combate` | Duelo contra el subjefe     |
| `/modulos/:id/codice`       | Texto de estudio del módulo (módulos sin submódulos) |
| `/modulos/:id/raid`         | Boss Raid semanal (máx. 15 preguntas) |
| `/modulos/:id/entrenar`     | Entrenamiento (XP sin daño al jefe)  |
| `/leaderboard`              | Ranking mensual por XP               |
| `/perfil`                   | Perfil y emblemas                    |
| `/admin`                    | Panel CRUD (oculto, solo admin)      |

## Estructura

```
src/
  components/   layout, guards de rutas, UI base, componentes de juego y sprites pixel art
  context/      Auth, Profile (perfil/XP) y Toast (loot obtenido)
  data/         clases RPG y datos semilla (data/db: lotes generados por generate_questions.ts)
  hooks/        useAsync
  lib/          cliente Supabase y capa de juego (lib/game: API Supabase + API demo)
  pages/        una página por ruta
```

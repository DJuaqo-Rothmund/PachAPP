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
Ojo: re-ejecutar `seed.sql` restaura el contenido original de los módulos, preguntas, jefes y emblemas semilla
(mismos IDs), pisando lo que hayas editado desde el panel admin. El contenido creado desde el panel no se toca.
Si editas `src/data/seed.ts`, regenera el SQL con:

```bash
npm run db:seed-sql            # usa ADMIN_EMAILS=correo1,correo2 para cambiar admins
```

### Modelo

| Tabla          | Contenido                                                           |
| -------------- | ------------------------------------------------------------------- |
| `profiles`     | Usuarios: nombre, avatar, clase RPG, XP total (se crea al registrarse) |
| `modules`      | Módulos con el texto del Códice (`codex` en JSON)                   |
| `questions`    | Preguntas con respuesta correcta y 3 falsas (**solo admin la lee**) |
| `bosses`       | Jefe por módulo: HP actual/máximo, daño por acierto, módulo que desbloquea |
| `codex_reads`  | Qué Códices leyó cada usuario                                       |
| `answers`      | Historial de respuestas, XP y daño                                  |
| `badges` / `user_badges` | Emblemas y quién los ganó                                 |
| `admin_emails` | Correos con rol admin                                               |

### Reglas del juego (en el servidor)

- Los jugadores reciben preguntas vía `get_module_questions()` (alternativas barajadas, sin la correcta) y responden vía `answer_question()`.
- Hay que leer el Códice (`mark_codex_read()`) antes de responder.
- Solo el **primer acierto** de cada usuario por pregunta da XP (+10) y resta HP al jefe (−10). La pregunta final del jefe da +50 XP y pega ×5.
- Quien deja al jefe en 0 HP da el **golpe final** (+100 XP) y la comunidad desbloquea el siguiente módulo de forma permanente.
- Ranking mensual: `get_monthly_leaderboard()` (mes calendario, hora de Chile).

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
| `/modulos/:id/codice`       | Texto de estudio del módulo          |
| `/modulos/:id/raid`         | Boss Raid del módulo                 |
| `/leaderboard`              | Ranking mensual por XP               |
| `/perfil`                   | Perfil y emblemas                    |
| `/admin`                    | Panel CRUD (oculto, solo admin)      |

## Estructura

```
src/
  components/   layout, guards de rutas, UI base, componentes de juego y sprites pixel art
  context/      Auth, Profile (perfil/XP) y Toast (loot obtenido)
  data/         clases RPG y datos semilla
  hooks/        useAsync
  lib/          cliente Supabase y capa de juego (lib/game: API Supabase + API demo)
  pages/        una página por ruta
```

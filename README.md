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

## Base de datos (Supabase)

1. **SQL Editor** → ejecutar `supabase/schema.sql` (tablas, RLS, funciones del juego).
2. **SQL Editor** → ejecutar `supabase/seed.sql` (módulos, preguntas, jefes, emblemas y correo admin).
3. **Authentication → Providers → Google**: activar con tu Client ID/Secret de Google Cloud.
4. **Authentication → URL Configuration**: agregar `http://localhost:5173` y tu dominio a *Redirect URLs*.

Ambos archivos se pueden re-ejecutar sin perder el progreso de los jugadores.
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

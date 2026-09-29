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

Sin variables de Supabase la app corre en **modo demo** (sin login) para poder revisar la UI.

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
  components/   layout, routing guards y UI base
  context/      AuthContext (sesión Supabase)
  data/         clases RPG y datos semilla
  lib/          cliente Supabase
  pages/        una página por ruta
```

# blog4.0 — AGENTS.md

## Commands

| Command | What it does |
|---------|-------------|
| `yarn dev` | Nuxt SSR dev server on **port 4000** (not 3000) |
| `yarn build` | Nuxt production build |
| `yarn start` | Nuxt SSR production server |
| `yarn lint` | `vue-cli-service lint` (ESLint only, no typechecker) |
| `yarn generate` | Static site gen with `API_PREFIX=/prod-api` |

Use **Yarn** (not npm). Both lockfiles exist — ignore `package-lock.json`.

## Architecture

**Nuxt 2 SSR** (primary) with `srcDir: 'src/'`. Pages auto-route from `src/pages/`:
- `/` → `src/pages/index.vue` (redirects to `/article`)
- `/article`, `/article/:id`, `/tag`, `/tag/:id`, `/archives`

**Dual legacy SPA** via Vue CLI (`src/main.js` + `src/router/index.js` + `src/views/`) — admin CRUD pages only. Admin routes guarded by `localStorage.token`.

`nuxt.config.js` is the real config; `vue.config.js` is only for the legacy SPA.

## API

Backend is an external NestJS API. Proxy configured via env:
- `API_PREFIX` (default `/dev-api`) → `API_BASE_URL` (default `http://localhost:3000`)
- Production: `/prod-api/*` rewrites to `https://nest-blog-eight.vercel.app/prod-api/*`
- `yarn generate` hardcodes `API_PREFIX=/prod-api`

## Environment

- Node 20.x (`.yarnrc` has `ignore-engines true` if needed)
- Plain JS, no TypeScript, no CI workflows
- No test framework — no `yarn test`
- Vuetify 2, Vue 2.6, Vuex 3
- Dark theme persisted via localStorage + cookie, with inline SSR script to prevent FOUC

## Vercel deploy

`vercel.json` rewrites:
- `/prod-api/:path*` → NestJS backend
- `/blog-images/:path*` → `api/proxy.js` serverless function → `http://43.136.115.90:9000`

Docker also available (multi-stage, nginx serves `/build/dist`).

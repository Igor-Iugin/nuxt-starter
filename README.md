# Nuxt Starter

A starter template for Nuxt 4 projects with pre-configured architecture, authentication, UI library, and developer tooling.

## Tech Stack

- **[Nuxt 4](https://nuxt.com/)** — framework (SPA mode, SSR disabled)
- **[Vue 3](https://vuejs.org/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[nuance-ui](https://github.com/nuance-ui)** — UI component library
- **[@sidebase/nuxt-auth](https://auth.sidebase.io/)** — authentication (local provider)
- **[TanStack Query](https://tanstack.com/query)** — server state and caching
- **[Pinia](https://pinia.vuejs.org/)** — global state management
- **[VeeValidate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/)** — form validation
- **[VueUse](https://vueuse.org/)** — collection of composables
- **[nuxt-i18n-micro](https://nuxt-i18n-micro.github.io/)** — internationalization
- **[@nuxt/icon](https://nuxt.com/modules/icon) + Gravity UI icons** — icons

## Architecture

The project follows the **Feature-Sliced Design (FSD)** methodology:

```
src/
├── app/
│   ├── i18n/          # Translations (ru.json + per-page translations)
│   ├── layouts/       # Layouts (default, centered)
│   ├── middleware/    # Router middlewares (auth.global.ts)
│   ├── plugins/       # Nuxt plugins (vue-query)
│   └── routes/        # Pages (index.vue, auth.vue)
├── entities/
│   └── user/          # User entity (api, model, ui)
├── features/
│   ├── auth/          # Authentication (login-form, logout-button, user-menu)
│   └── user/          # Edit / delete user
└── shared/
    ├── api/           # Base $fetch instance, useAppFetch, ApiError/ApiResponse types
    └── types.ts       # Shared types
config/
├── auth.ts            # nuxt-auth config (endpoints, token)
└── icon.ts            # @nuxt/icon config
```

Import aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Nuxt dev server |
| `pnpm build` | Static build (`nuxi generate`) |
| `pnpm start` | Preview built app |
| `pnpm web:prepare` | Generate Nuxt types |
| `pnpm lint` | ESLint check |
| `pnpm lint:ts` | TypeScript check |
| `pnpm release` | Generate changelog and release tag |
| `pnpm prepare` | Husky pre-commit hook |

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `QUERY_DEV_TOOLS` | `false` | Show TanStack Query DevTools |

The API base URL is set via `vite.define.__API__` in `nuxt.config.ts`:
- **development**: `http://localhost:3001/api`
- **production**: `/api`

## Authentication

Uses `@sidebase/nuxt-auth` with a local provider.

The backend base URL is configured in `config/auth.ts` via `authRuntime`.

| Action | Method | Path |
|---|---|---|
| Sign in | POST | `/account/signin` |
| Sign out | POST | `/account/signout` |
| Get session | GET | `/account/me` |

After setting up the backend — remove the `return` at the top of [src/app/middleware/auth.global.ts](src/app/middleware/auth.global.ts).

## Code Quality

- **ESLint** — [@antfu/eslint-config](https://github.com/antfu/eslint-config) with Vue/TS rules and import sorting (`perfectionist`)
- **Stylelint** — standard config + property order + Vue SFC support
- **Husky + lint-staged** — pre-commit checks
- **TypeScript** — strict mode, type checking on build

## CSS Modules

Scoped class names are generated as `ComponentName__className_hash` for easier debugging in DevTools.

## i18n

Default locale is `ru`. Translations are located in `src/app/i18n/`:

```
i18n/
├── ru.json                  # Global translations
└── pages/
    ├── index/ru.json        # Home page translations
    └── auth/ru.json         # Auth page translations
```

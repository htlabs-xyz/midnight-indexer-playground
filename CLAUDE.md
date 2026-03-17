---

Uses Next.js 16 with App Router, TypeScript, and Tailwind CSS.

- Use `yarn install` for installing dependencies
- Use `yarn dev` to start the dev server (Turbopack)
- Use `yarn build` to build for production (static export to `out/`)
- Use `yarn start` to serve the production build

## Frontend

Next.js App Router with static export (`output: 'export'`). Routes:
- `/` — Landing page (server component)
- `/v1`, `/v3`, `/v4` — Playground pages (client components)

Key directories:
- `app/` — Pages and layouts
- `app/components/` — Shared React components
- `lib/` — Config, queries, fetcher utilities

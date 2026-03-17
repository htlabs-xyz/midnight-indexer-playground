# Next.js 16 Research Report

**Date:** 2026-03-17
**Status:** Stable Release Available
**Target:** Migration Planning & Setup Guidance

---

## 1. Latest Version & Installation

**Current Stable:** Next.js 16.1.7 (released Dec 18, 2025)
**Base Release:** Next.js 16.0 (released Oct 21, 2025)

### Install Latest
```bash
yarn add next@latest react@latest react-dom@latest
# TypeScript support
yarn add -D @types/react@latest @types/react-dom@latest
```

### Automated Migration (Recommended)
```bash
yarn dlx @next/codemod@canary upgrade latest
```
Handles: `next.config` migration, `next lint` removal, `middleware` → `proxy` conversion, unstable_ prefix removal.

---

## 2. Key Changes: v15 → v16

### Breaking Changes (MUST ADDRESS)

| Change | Impact | Migration |
|--------|--------|-----------|
| **Async Request APIs** | `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams` now async-only | Use `await` everywhere; run `npx next typegen` for type helpers |
| **Turbopack Default** | Webpack removed as default; custom webpack configs now fail | Use `--webpack` flag to opt out, or migrate to Turbopack config |
| **Removed: `next lint`** | Built-in linting gone | Use ESLint/Biome directly; codemod available |
| **Removed: AMP** | All AMP APIs/configs deleted | Remove `amp: true`, `useAmp()` imports |
| **`middleware` → `proxy`** | Middleware renamed; edge runtime no longer supported | Rename to `proxy.ts`, use Node.js runtime |
| **Image Metadata** | `params` and `id` in image generators now promises | Use `await params`, `await id` in handlers |
| **Image Config Defaults** | `minimumCacheTTL`: 60s→4hrs, `imageSizes` no longer includes 16px, `qualities`: all→[75] only | Update `next.config` if old defaults needed |
| **Parallel Routes** | All `default.js` files now required | Add `default.js` returning `null` or `notFound()` |
| **Node.js Min** | 18.x no longer supported | Upgrade to 20.9+ (LTS) |
| **TypeScript Min** | 4.x no longer supported | Upgrade to 5.1+ |

### New/Stable Features

| Feature | Use Case |
|---------|----------|
| **`use cache` directive** | Explicit opt-in caching for pages/components/functions (replaces implicit App Router caching) |
| **Cache Components (PPR)** | Enable via `cacheComponents: true` in config |
| **Turbopack Stable** | Default bundler; 2-5x faster builds, up to 10x faster Fast Refresh |
| **React Compiler (stable)** | Auto-memoization; enable via `reactCompiler: true` |
| **New Cache APIs** | `updateTag()` (read-your-writes), `refresh()` (uncached data), `revalidateTag(tag, profile)` |
| **Enhanced Routing** | Layout deduplication, incremental prefetching (auto; no code changes) |
| **React 19.2** | View Transitions, `useEffectEvent`, Activity component |

---

## 3. Setup: Next.js 16 with App Router, TypeScript, Tailwind, Static Export

### Create New Project
```bash
npx create-next-app@latest my-app
# Defaults: App Router, TypeScript, Tailwind, ESLint
```

### Manual Configuration for Static Export

**`next.config.ts`**
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',  // Static export (no Node.js runtime)
  turbopack: {
    // Optional: Turbopack config
  },
}

export default nextConfig
```

**`package.json` Scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**TypeScript Setup** (`tsconfig.json` auto-generated)
- Strict mode enabled by default
- React 19.2 JSX transform
- ESNext module syntax

**Tailwind** (auto-installed)
- `tailwind.config.ts`
- `postcss.config.mjs`
- Global styles in `app/globals.css`

**Key Constraints for Static Export:**
- No API routes (use external backend)
- No dynamic Server Components requiring runtime
- `generateStaticParams()` for dynamic routes
- No cookies/headers/draftMode in components

---

## 4. Async Request APIs: Critical Changes

### Before (v15)
```typescript
import { cookies } from 'next/server'

export default function Layout() {
  const cookieStore = cookies()  // sync
  return <div>{cookieStore.get('session')?.value}</div>
}
```

### After (v16)
```typescript
import { cookies } from 'next/server'

export default async function Layout() {
  const cookieStore = await cookies()  // async required
  return <div>{cookieStore.get('session')?.value}</div>
}
```

**Apply to:** `cookies()`, `headers()`, `draftMode()`, all `params` access, `searchParams`.

**Type Safety Helper:**
```bash
npx next typegen  # Generates PageProps, LayoutProps, RouteContext types
```

---

## 5. graphql-ws Compatibility with Next.js 16

### Status: ✓ Compatible

**graphql-ws Support:** GraphQL peer deps ^15.10.1 | ^16
**Next.js Integration:** Works with custom server setup

### Limitation
WebSockets require custom Node.js server; incompatible with:
- API Routes (serverless)
- App Router route.js without custom server
- Static export (`output: 'export'`)

### Setup Example (Custom Server)
```typescript
// server.ts - custom Node.js server
import { createServer } from 'http'
import { createYoga } from 'graphql-yoga'
import { useServer } from 'graphql-ws/use/ws'
import { WebSocketServer } from 'ws'
import next from 'next'

const app = next()
const server = createServer(app.getRequestHandler())
const wsServer = new WebSocketServer({ server })

useServer({ schema }, wsServer)
server.listen(3000)
```

**Requires:** Running Next.js with custom server (not `next dev`/`next start` directly).

---

## 6. Migration Checklist

### Immediate (Before Upgrade)
- [ ] Upgrade Node.js to 20.9+
- [ ] Upgrade TypeScript to 5.1+
- [ ] Review custom webpack configs (migrate or use `--webpack` flag)

### During Upgrade
- [ ] Run codemod: `yarn dlx @next/codemod@canary upgrade latest`
- [ ] Run typegen: `npx next typegen`
- [ ] Search codebase for `unstable_` imports and remove prefix

### Post-Upgrade
- [ ] Add `await` to all `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams`
- [ ] Rename `middleware.ts` → `proxy.ts` (if using)
- [ ] Update image handlers to use `await params`/`await id`
- [ ] Add missing `default.js` to parallel routes
- [ ] Test with `yarn dev` and `yarn build`
- [ ] Verify image config defaults match expected behavior (cache TTL, sizes, qualities)

### For graphql-ws Integration
- [ ] If using WebSocket GraphQL: set up custom Node.js server
- [ ] Update server startup procedure
- [ ] Test with `next build` (static export) vs custom server

---

## Unresolved Questions

1. **graphql-ws + Static Export:** Is a custom server required, or can WebSocket be proxied? (Answer: custom server required for WS support; static export cannot support real-time subscriptions)
2. **Cache Components Migration Timeline:** When does PPR transition from `cacheComponents: true` to stable documentation? (In progress per Vercel; awaiting Next.js Conf 2025 materials)
3. **Build Adapters Maturity:** When moving from alpha to stable? (Timeline TBD)

---

## Sources

- [Next.js 16 Blog](https://nextjs.org/blog/next-16)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16.1 Release](https://nextjs.org/blog/next-16-1)
- [graphql-ws Releases](https://github.com/enisdenjo/graphql-ws/releases)
- [GraphQL Yoga + Next.js Integration](https://the-guild.dev/graphql/yoga-server/docs/integrations/integration-with-nextjs)

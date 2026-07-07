# Marketspace

A marketplace where teams discover, compare, and buy SaaS products from independent sellers.

This pass scaffolds the project from scratch and ships the marketing landing page. Auth, database, and payments are **not** wired up yet — see below.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-native `@theme`/`@custom-variant` — no `tailwind.config.ts`)
- shadcn/ui (Radix base) for primitives (`components/ui/*`)
- `next-themes` for class-based dark mode
- `motion` (the current package name; `framer-motion` is now a compatibility re-export of the same package) for animation

## Getting started

Requires Node 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run lint   # ESLint (flat config, eslint-config-next)
npm run build  # production build
npm run start  # serve the production build
```

## Notes

- `npm install` completed cleanly with no peer-dependency conflicts — no `--legacy-peer-deps` or `overrides` were needed.
- `npm audit` reports 2 moderate advisories in a transitive `postcss` version pulled in by `next` itself; the suggested fix downgrades `next` to a pre-9.4 release, which is not viable. Not actioned in this pass.
- `.env.local.example` documents the env vars future Clerk (auth), Supabase (database), and Stripe (payments) integrations will need — the `sign-in`/`sign-up` routes already use Clerk's `[[...catch-all]]` folder convention so wiring in `@clerk/nextjs` later is a same-file swap, not a restructure.
- `dashboard/`, `api/*`, `blog/`, `categories/`, `search/`, `sellers/` are intentionally untouched — they're empty folders with no `page.tsx`/`route.ts`, so the App Router treats them as non-routes. Building them out is future work.
- Brand name, copy, palette (violet/indigo accent), logo cloud names, and testimonials are placeholders — swap before any real launch.

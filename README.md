# ecsight-group

Marketing site for Ecsight Group — [Astro](https://astro.build) (static) + [Sanity](https://www.sanity.io) CMS + Tailwind CSS 4 + React islands.

## Getting started

```bash
bun install
cp .env.example .env.local   # fill in PUBLIC_SANITY_PROJECT_ID etc.
bun run dev
```

Open [http://localhost:4321](http://localhost:4321).

- `/` — English landing page, `/th/` — Thai
- `/studio` — embedded Sanity Studio

## Structure

- `src/pages/` — routes (en at root, th under `/th/`), both render `src/components/Landing.astro`
- `src/components/` — React islands (motion, swiper, ogl) + `.astro` components
- `src/i18n/ui.ts` — message dictionaries from `messages/*.json`
- `src/sanity/` — schemas, GROQ queries, image helper
- `sanity.config.ts` — Studio config (embedded via `@sanity/astro`)

## Build

```bash
bun run build    # static output in dist/
bun run preview
```

Content updates: publish in Studio, then trigger a rebuild (set up a Sanity webhook → deploy hook).

# Stack

Astro 6 (static output) + Sanity CMS + Tailwind CSS 4 + React islands.

- Pages: `src/pages/` (`/` = en, `/th/` = Thai). Both render `src/components/Landing.astro`.
- i18n: Astro built-in (`astro.config.mjs`) + message dictionaries in `messages/*.json` exposed via `src/i18n/ui.ts`. Translations are passed to React components as props.
- Interactive components (motion, swiper, ogl, marquee) are React islands mounted with `client:*` directives. Static markup belongs in `.astro` files.
- Sanity: embedded Studio at `/studio` (`@sanity/astro`, config in `sanity.config.ts`); schemas in `src/sanity/schemaTypes/`; GROQ queries in `src/sanity/lib/queries.ts`; fetch via `import { sanityClient } from "sanity:client"`.
- Env vars use the `PUBLIC_` prefix (see `.env.example`).
- Runtime: bun for installs, `bun run dev` / `bun run build`.

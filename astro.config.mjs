// @ts-check

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// astro.config runs before Astro's env loading — read PUBLIC_ vars via Vite.
const {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_API_VERSION,
} = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  // Static by default; API routes opt into SSR via `export const prerender = false`.
  adapter: vercel(),
  i18n: {
    defaultLocale: "en",
    locales: ["en", "th"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false, // false for static builds
      apiVersion: PUBLIC_SANITY_API_VERSION || "2024-06-10",
      studioBasePath: "/studio",
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

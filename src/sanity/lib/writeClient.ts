import { createClient, type SanityClient } from "@sanity/client";

// Server-only Sanity client with a write token. Never import this into a
// client component — it carries SANITY_API_WRITE_TOKEN. Built lazily so the
// token is read from the runtime env on the serverless function, not at build.
export function getWriteClient(): SanityClient {
  const projectId =
    import.meta.env.PUBLIC_SANITY_PROJECT_ID ??
    process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset =
    import.meta.env.PUBLIC_SANITY_DATASET ??
    process.env.PUBLIC_SANITY_DATASET ??
    "production";
  const apiVersion =
    import.meta.env.PUBLIC_SANITY_API_VERSION ??
    process.env.PUBLIC_SANITY_API_VERSION ??
    "2024-06-10";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) throw new Error("Missing PUBLIC_SANITY_PROJECT_ID");
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

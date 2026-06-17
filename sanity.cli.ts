import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "4i09w8mv",
    dataset: "production",
  },
  autoUpdates: true,
  // env.ts reads PUBLIC_* vars via import.meta.env; expose them to the CLI's Vite too.
  vite: (config) => ({
    ...config,
    envPrefix: [
      ...(Array.isArray(config.envPrefix)
        ? config.envPrefix
        : config.envPrefix
          ? [config.envPrefix]
          : ["SANITY_STUDIO_"]),
      "PUBLIC_",
    ],
  }),
});

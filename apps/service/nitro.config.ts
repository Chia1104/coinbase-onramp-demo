import { defineConfig } from "nitro";

const enableOnrampWebhooksCheck =
  process.env.ENABLE_ONRAMP_WEBHOOKS_CHECK === "1" ||
  process.env.ENABLE_ONRAMP_WEBHOOKS_CHECK === "true";

export default defineConfig({
  serverDir: "src",
  modules: ["workflow/nitro"],
  plugins: ["plugins/start-pg-world.ts", "plugins/start-redis-world.ts"],
  typescript: {
    tsconfigPath: "./tsconfig.build.json",
  },
  preset: "bun",
  routes: {
    "/**": "./src/server.ts",
  },
  noPublicDir: true,
  experimental: {
    tasks: enableOnrampWebhooksCheck,
  },
  scheduledTasks: enableOnrampWebhooksCheck
    ? {
        // Run `onramp-webhooks-check` task every minute
        "* * * * *": ["onramp-webhooks-check"],
      }
    : undefined,
});

import { defineConfig } from "nitro";

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
    tasks: true,
  },
  scheduledTasks: {
    // Run `onramp-webhooks-check` task every minute
    "* * * * *": ["onramp-webhooks-check"],
  },
});

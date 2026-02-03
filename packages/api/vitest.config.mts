import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./__tests__/setup.ts"],
    globals: true,
    include: [
      "src/**/*.{spec,test}.{ts,tsx}",
      "__tests__/**/*.{spec,test}.{ts,tsx}",
    ],
    exclude: ["**/node_modules/**"],
  },
});

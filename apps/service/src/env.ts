import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

import { env as apiEnv } from "@repo/api/orpc/env";
import { env as kvEnv } from "@repo/kv/env";

export const env = createEnv({
  server: {
    PORT: z.number().optional().default(3005),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .optional()
      .default("development"),
    CORS_ALLOWED_ORIGIN: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
    ZEABUR_SERVICE_ID: z.string().optional(),
    RATELIMIT_WINDOW_MS: z
      .number()
      .optional()
      .default(5 * 60000),
    RATELIMIT_MAX: z.number().optional().default(300),
    IP_DENY_LIST: z.string().optional(),
    IP_ALLOW_LIST: z.string().optional(),
    MAINTENANCE_MODE: z.string().optional().default("false"),
    MAINTENANCE_BYPASS_TOKEN: z.string().optional(),
    TIMEOUT_MS: z.number().optional().default(10000),
    WEBHOOK_SECRET: z.string(),
  },
  runtimeEnv: {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3005,
    NODE_ENV: process.env.NODE_ENV ?? "development",
    CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    ZEABUR_SERVICE_ID: process.env.ZEABUR_SERVICE_ID,
    RATELIMIT_WINDOW_MS: process.env.RATELIMIT_WINDOW_MS
      ? Number(process.env.RATELIMIT_WINDOW_MS)
      : 15 * 60000,
    RATELIMIT_MAX: process.env.RATELIMIT_MAX
      ? Number(process.env.RATELIMIT_MAX)
      : 87,
    IP_DENY_LIST: process.env.IP_DENY_LIST,
    IP_ALLOW_LIST: process.env.IP_ALLOW_LIST,
    MAINTENANCE_MODE:
      process.env.MAINTENANCE_MODE === "true" ||
      process.env.MAINTENANCE_MODE === "1"
        ? "true"
        : "false",
    MAINTENANCE_BYPASS_TOKEN: process.env.MAINTENANCE_BYPASS_TOKEN,
    TIMEOUT_MS: process.env.TIMEOUT_MS || 10000,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  },
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.SKIP_ENV_VALIDATION === "1",
  extends: [kvEnv, apiEnv],
});

export type ENV = typeof env;

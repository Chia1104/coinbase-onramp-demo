import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  server: {
    CDP_KEY_ID: z.string(),
    CDP_KEY_SECRET: z.string(),
    CDP_DOMAIN_ALLOWLIST: z.string().optional(),
  },
  runtimeEnv: {
    CDP_KEY_ID: process.env.CDP_KEY_ID,
    CDP_KEY_SECRET: process.env.CDP_KEY_SECRET,
    CDP_DOMAIN_ALLOWLIST: process.env.CDP_DOMAIN_ALLOWLIST,
  },
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.SKIP_ENV_VALIDATION === "1",
});

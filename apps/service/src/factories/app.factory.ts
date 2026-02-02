import { createFactory } from "hono/factory";

import { tryCatch } from "@repo/utils/error-helper";
import { getClientIP } from "@repo/utils/server";

export default createFactory<HonoContext>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const kv = await tryCatch(import("@repo/kv").then((m) => m.kv));

      if (kv.error) {
        console.error(kv.error);
        return c.json({ error: kv.error }, 503);
      }

      c.set("kv", kv.data);
      c.set("clientIP", getClientIP(c.req.raw));

      await next();
    });
  },
});

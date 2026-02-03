import { Hono } from "hono";
import { start } from "workflow/api";

import { coinbaseHook0SignatureGuard } from "../guards/coinbase-hook0-signature.guard";
import { onrampWebhooksWorkflow } from "../workflows/onramp.workflow";

const api = new Hono<HonoContext>()
  .use(coinbaseHook0SignatureGuard)
  .post("/webhooks", async (c) => {
    try {
      const workflow = await start(onrampWebhooksWorkflow);
      return c.json(
        {
          received: true,
          data: {
            id: workflow.runId,
          },
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json({ received: true, error: "Processing error" }, 200);
    }
  });

export default api;

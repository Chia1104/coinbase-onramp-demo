import { createWebhook } from "workflow";

import { onrampWebhooks } from "../steps/onramp.step";

export async function onrampWebhooksWorkflow() {
  "use workflow";

  const webhook = createWebhook();
  const request = await webhook;

  onrampWebhooks(request);
}

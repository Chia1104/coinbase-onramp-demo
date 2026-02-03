import { all } from "better-all";
import { defineTask } from "nitro/task";

import { generateToken, cdpRequest } from "@repo/api/orpc/onramp/services";
import { kv } from "@repo/kv";

const TARGET_HOST =
  process.env.NODE_ENV === "production"
    ? "https://coinbase-onramp-demo.zeabur.app"
    : "http://localhost:3001";

const WEBHOOKS_REGISTER_DATA = {
  description: "Onramp transaction status webhook",
  eventTypes: [
    "onramp.transaction.created",
    "onramp.transaction.updated",
    "onramp.transaction.success",
    "onramp.transaction.failed",
  ],
  target: {
    url: `${TARGET_HOST}/api/v1/onramp/webhooks`,
    method: "POST",
  },
  labels: {},
  isEnabled: true,
};

export default defineTask({
  meta: {
    name: "onramp-webhooks-check",
    description: "Check for onramp webhooks",
  },
  async run() {
    let subscriptionId = await kv.get("onramp-webhooks-subscription-id");

    if (!subscriptionId) {
      console.warn("No subscription id found");
      const jwt = await generateToken(
        "POST",
        `/platform/v2/data/webhooks/subscriptions`,
        {
          host: "api.cdp.coinbase.com",
        }
      );

      const response = await cdpRequest.post(
        `platform/v2/data/webhooks/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          json: WEBHOOKS_REGISTER_DATA,
        }
      );

      const subscription = await response.json<{
        subscriptionId: string;
        metadata: {
          secret: string;
        };
      }>();

      if (!subscription) {
        console.warn("No subscription found");
        return { result: "No subscription found" };
      }

      await all({
        subscriptionId: async () =>
          await kv.set(
            "onramp-webhooks-subscription-id",
            subscription.subscriptionId
          ),
        secret: async () =>
          await kv.set("onramp-webhooks-secret", subscription.metadata.secret),
      });

      subscriptionId = subscription.subscriptionId;

      console.log("Subscription created:", subscriptionId);
    }

    const jwt = await generateToken(
      "GET",
      `/platform/v2/data/webhooks/subscriptions/${subscriptionId}`,
      {
        host: "api.cdp.coinbase.com",
      }
    );

    const response = await cdpRequest.get(
      `platform/v2/data/webhooks/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const webhooksSecret = await kv.get("onramp-webhooks-secret");

    const subscriptions = await response.json<{ isEnabled: boolean }>();

    if (!subscriptions.isEnabled || !webhooksSecret) {
      console.warn("Subscription is not enabled, re-registering...");
      const jwt = await generateToken(
        "PUT",
        `/platform/v2/data/webhooks/subscriptions/${subscriptionId}`,
        {
          host: "api.cdp.coinbase.com",
        }
      );

      const response = await cdpRequest.put(
        `platform/v2/data/webhooks/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          json: WEBHOOKS_REGISTER_DATA,
        }
      );

      const subscription = await response.json<{
        subscriptionId: string;
        metadata: {
          secret: string;
        };
      }>();

      await all({
        subscriptionId: async () =>
          await kv.set(
            "onramp-webhooks-subscription-id",
            subscription.subscriptionId
          ),
        secret: async () =>
          await kv.set("onramp-webhooks-secret", subscription.metadata.secret),
      });

      console.log("Subscription re-registered:", subscriptionId);
    }

    console.log("Subscription is enabled:", subscriptions.isEnabled);

    return { result: "Success" };
  },
});

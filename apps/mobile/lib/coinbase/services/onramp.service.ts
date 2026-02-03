import type { InferClientInputs } from "@orpc/client";
import * as Crypto from "expo-crypto";

import { client } from "@/lib/orpc/client";

export type SessionTokenRequest = InferClientInputs<typeof client.onramp.token>;

export const getOnrampBuyUrl = async (
  request: SessionTokenRequest,
  options?: {
    redirectUrl?: string;
    useSandbox?: boolean;
  }
) => {
  const {
    redirectUrl = "exp://192.168.0.103:8081/coinbase-onramp-demo",
    useSandbox = true,
  } = options ?? {};
  const response = await client.onramp.token(request);

  const baseUrl = useSandbox
    ? "https://pay-sandbox.coinbase.com"
    : "https://pay.coinbase.com";

  const url = new URL(baseUrl);
  url.searchParams.set("sessionToken", response.token);
  url.searchParams.set("redirectUrl", redirectUrl);
  url.searchParams.set("partnerUserRef", Crypto.randomUUID());
  return url.toString();
};

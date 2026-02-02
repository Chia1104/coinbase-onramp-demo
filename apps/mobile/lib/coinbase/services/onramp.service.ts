import type { InferClientInputs } from "@orpc/client";

import { client } from "@/lib/orpc/client";

export type SessionTokenRequest = InferClientInputs<typeof client.onramp.token>;

export const getOnrampBuyUrl = async (
  request: SessionTokenRequest,
  redirectUrl = "exp://192.168.0.103:8081/coinbase-onramp-demo"
) => {
  const response = await client.onramp.token(request);

  const url = new URL("https://pay.coinbase.com/buy/select-asset");
  url.searchParams.set("sessionToken", response.token);
  url.searchParams.set("redirectUrl", redirectUrl);
  return url.toString();
};

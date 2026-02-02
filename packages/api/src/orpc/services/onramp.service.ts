import { generateJwt } from "@coinbase/cdp-sdk/auth";
import ky from "ky";

import type { SessionTokenRequest } from "../contracts/onramp.contract";
import { env } from "../env";

export const onrampRequest = ky.create({
  prefixUrl: "https://api.developer.coinbase.com/onramp/v1",
});

export const generateOnrampToken = async () => {
  const jwt = await generateJwt({
    apiKeyId: env.CDP_KEY_ID,
    apiKeySecret: env.CDP_KEY_SECRET,
    requestMethod: "POST",
    requestHost: "api.developer.coinbase.com",
    requestPath: "/onramp/v1/token",
    expiresIn: 120, // optional (defaults to 120 seconds)
  });
  return jwt;
};

export const generateSessionToken = async (
  jwt: string,
  data: SessionTokenRequest,
  _ip?: string
) => {
  const response = await onrampRequest.post("token", {
    json: {
      ...data,
      // clientIp: ip,
    },
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  });
  return response.json<{
    token: string;
    channel_id: string;
  }>();
};

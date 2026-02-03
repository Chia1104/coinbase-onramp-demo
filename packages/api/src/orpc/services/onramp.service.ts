import { generateJwt } from "@coinbase/cdp-sdk/auth";
import ky from "ky";

import type { SessionTokenRequest } from "../contracts/onramp.contract";
import { env } from "../env";

export const onrampRequest = ky.create({
  prefixUrl: "https://api.developer.coinbase.com/onramp/v1",
});

export const cdpRequest = ky.create({
  prefixUrl: "https://api.cdp.coinbase.com",
});

export const generateToken = async (
  method: string,
  path: string,
  options?: {
    expiresIn?: number;
    host?: string;
  }
) => {
  const { expiresIn = 120, host = "api.developer.coinbase.com" } =
    options ?? {};
  const jwt = await generateJwt({
    apiKeyId: env.CDP_KEY_ID,
    apiKeySecret: env.CDP_KEY_SECRET,
    requestMethod: method,
    requestHost: host,
    requestPath: path,
    expiresIn,
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

export const getBuyConfig = async (jwt: string) => {
  const response = await onrampRequest.get("buy/config", {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.json<{
    countries: {
      id: string;
      subdivisions: string[];
      payment_methods: {
        id: string;
      }[];
    }[];
  }>();
};

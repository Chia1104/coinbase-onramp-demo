import {
  generateToken,
  generateSessionToken,
  getBuyConfig,
} from "../services/onramp.service";
import { contractOS } from "../utils";

export const onrampTokenRoute = contractOS.onramp.token.handler(async (ctx) => {
  const jwt = await generateToken("POST", "/onramp/v1/token");
  const token = await generateSessionToken(
    jwt,
    ctx.input,
    ctx.context.clientIP
  );

  return token;
});

export const onrampBuyConfigRoute = contractOS.onramp.buyConfig.handler(
  async () => {
    const jwt = await generateToken("GET", "/onramp/v1/buy/config");
    const config = await getBuyConfig(jwt);
    return config;
  }
);

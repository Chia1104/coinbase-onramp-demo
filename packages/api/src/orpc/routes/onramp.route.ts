import {
  generateOnrampToken,
  generateSessionToken,
} from "../services/onramp.service";
import { contractOS } from "../utils";

export const onrampTokenRoute = contractOS.onramp.token.handler(async (ctx) => {
  const jwt = await generateOnrampToken();
  const token = await generateSessionToken(
    jwt,
    ctx.input,
    ctx.context.clientIP
  );

  return token;
});

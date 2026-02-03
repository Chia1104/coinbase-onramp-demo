import {
  generateToken,
  generateSessionToken,
  getBuyConfig,
} from "../services/onramp.service";
import { contractOS } from "../utils";

/**
 * @deprecated Use `onrampPrepareRoute` instead.
 */
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

export const onrampPrepareRoute = contractOS.onramp.prepare.handler(
  async (ctx) => {
    const jwt = await generateToken("POST", "/onramp/v1/token");
    const token = await generateSessionToken(
      jwt,
      ctx.input,
      ctx.context.clientIP
    );

    /**
     * **IMPORTANT**
     *
     * You should generate a unique partnerUserRef for each user.
     * This value will be used to identify the user in the webhook callback.
     */
    const partnerUserRef = crypto.randomUUID();

    const url = new URL(
      ctx.input.use_sandbox
        ? "https://pay-sandbox.coinbase.com"
        : "https://pay.coinbase.com"
    );

    url.searchParams.set("sessionToken", token.token);

    /**
     * **IMPORTANT**
     *
     * Make sure the redirect URL is added to the domain allowlist in the Coinbase Developer Portal.
     */
    url.searchParams.set("redirectUrl", ctx.input.redirect_url);

    url.searchParams.set("partnerUserRef", partnerUserRef);

    if (ctx.context.hooks?.onPrepareOnrampUrl) {
      await ctx.context.hooks.onPrepareOnrampUrl({
        redirectUrl: ctx.input.redirect_url,
        useSandbox: ctx.input.use_sandbox ?? false,
        partnerUserRef,
      });
    }

    return {
      url: url.toString(),
    };
  }
);

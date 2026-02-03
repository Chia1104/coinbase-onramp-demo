import * as healthRoutes from "./routes/health.route";
import * as onrampRoutes from "./routes/onramp.route";
import { contractOS } from "./utils";

export const router = contractOS.router({
  health: {
    server: healthRoutes.healthRoute,
  },
  onramp: {
    /**
     * @deprecated Use `prepare` instead.
     */
    token: onrampRoutes.onrampTokenRoute,
    buyConfig: onrampRoutes.onrampBuyConfigRoute,
    prepare: onrampRoutes.onrampPrepareRoute,
  },
});

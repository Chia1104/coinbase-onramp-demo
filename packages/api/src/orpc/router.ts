import * as healthRoutes from "./routes/health.route";
import * as onrampRoutes from "./routes/onramp.route";
import { baseOS } from "./utils";

export const router = baseOS.router({
  health: {
    server: healthRoutes.healthRoute,
  },
  onramp: {
    token: onrampRoutes.onrampTokenRoute,
  },
});

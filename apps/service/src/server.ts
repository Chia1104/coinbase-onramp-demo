import bootstrap from "./bootstrap";
import { env } from "./env";
import appFactory from "./factories/app.factory";
import healthRoutes from "./routes/health.route";
import rpcRoutes from "./routes/rpc.route";

export const app = bootstrap(appFactory.createApp())
  .basePath("/api/v1")
  .route("/health", healthRoutes)
  .route("/rpc", rpcRoutes);

export type AppRPC = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch,
};

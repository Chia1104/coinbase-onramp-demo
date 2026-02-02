import { contractOS } from "../utils";

export const healthRoute = contractOS.health.server.handler(() => {
  return { status: "ok" };
});

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import type { routerContract } from "@repo/api/orpc/contracts";

import { withServiceUrl } from "@/utils/service-url";

export const link = new RPCLink({
  url: withServiceUrl("/rpc"),
  async fetch(request, init) {
    const { fetch } = await import("expo/fetch");

    const resp = await fetch(request.url, {
      body: await request.blob(),
      headers: request.headers,
      method: request.method,
      signal: request.signal,
      ...init,
    });

    return resp;
  },
});

export const client: ContractRouterClient<typeof routerContract> =
  createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

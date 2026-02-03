import { implement } from "@orpc/server";
import { os } from "@orpc/server";

import { routerContract } from "./router.contract";

export interface BaseContext {
  headers: Headers;
  clientIP: string;
  hooks?: {
    onPrepareOnrampUrl?: (options: {
      redirectUrl: string;
      useSandbox: boolean;
      partnerUserRef: string;
    }) => Promise<string>;
  };
}

export const baseOS = os.$context<BaseContext>();

export const contractOS = implement(routerContract).$context<BaseContext>();

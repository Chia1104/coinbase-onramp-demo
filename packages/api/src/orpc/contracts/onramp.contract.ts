import { oc } from "@orpc/contract";
import * as z from "zod";

export const SessionTokenRequest = z.object({
  addresses: z.array(
    z.object({
      address: z.string(),
      blockchains: z.array(z.string()),
    })
  ),
  assets: z.array(z.string()),
});

export type SessionTokenRequest = z.infer<typeof SessionTokenRequest>;

export const onrampTokenContract = oc.input(SessionTokenRequest).output(
  z.object({
    token: z.string(),
    channel_id: z.string(),
  })
);

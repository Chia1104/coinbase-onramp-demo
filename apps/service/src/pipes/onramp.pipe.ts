import * as z from "zod";

export const sessionTokenRequest = z.object({
  addresses: z.array(
    z.object({
      address: z.string(),
      blockchains: z.array(z.string()),
    })
  ),
  assets: z.array(z.string()),
});

export type SessionTokenRequest = z.infer<typeof sessionTokenRequest>;

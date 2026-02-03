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

export const OnrampTokenContract = oc.input(SessionTokenRequest).output(
  z.object({
    token: z.string(),
    channel_id: z.string(),
  })
);

export const OnrampOptionsRequest = z.object({
  country: z.string(),
  subdivision: z.string().optional(),
});

export type OnrampOptionsRequest = z.infer<typeof OnrampOptionsRequest>;

const PaymentCurrency = z.object({
  id: z.string(),
  payment_method_limits: z.array(
    z.object({
      id: z.string(),
      min: z.string(),
      max: z.string(),
    })
  ),
});

const PurchaseCurrency = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  networks: z.array(
    z.object({
      name: z.string(),
      display_name: z.string(),
      chain_id: z.string(),
      contract_address: z.number(),
    })
  ),
});

export const OnrampOptionsResponse = z.object({
  payment_currencies: z.array(PaymentCurrency),
  purchase_currencies: z.array(PurchaseCurrency),
});

export type OnrampOptionsResponse = z.infer<typeof OnrampOptionsResponse>;

export const OnrampOptionsContract = oc
  .input(OnrampOptionsRequest)
  .output(OnrampOptionsResponse);

export const OnrampBuyConfigResponse = z.object({
  countries: z.array(
    z.object({
      id: z.string(),
      subdivisions: z.array(z.string()),
      payment_methods: z.array(
        z.object({
          id: z.string(),
        })
      ),
    })
  ),
});

export type OnrampBuyConfigResponse = z.infer<typeof OnrampBuyConfigResponse>;

export const OnrampBuyConfigContract = oc.output(OnrampBuyConfigResponse);

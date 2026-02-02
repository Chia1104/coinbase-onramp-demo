import { client } from "@/lib/orpc/client";

export const getOnrampBuyUrl = async () => {
  const response = await client.onramp.token({
    addresses: [
      {
        address: "0x024ad440b3f85dd01c19b5e83c049ff3f00f0699",
        blockchains: ["ethereum"],
      },
    ],
    assets: ["USDC"],
  });

  const url = new URL("https://pay.coinbase.com/buy/select-asset");
  url.searchParams.set("sessionToken", response.token);
  url.searchParams.set(
    "redirectUrl",
    "exp://192.168.0.103:8081--/coinbase-onramp-demo"
  );
  return url.toString();
};

import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";

import { getOnrampBuyUrl } from "../services/onramp.service";

export const useGetOnrampUrl = (
  options?: Partial<UseMutationOptions<string, Error, void>>
) => {
  return useMutation({
    ...options,
    mutationFn: getOnrampBuyUrl,
  });
};

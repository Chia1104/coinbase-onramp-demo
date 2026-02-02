import * as healthContracts from "./contracts/health.contract";
import * as onrampContracts from "./contracts/onramp.contract";

export const routerContract = {
  health: {
    server: healthContracts.healthContract,
  },
  onramp: {
    token: onrampContracts.onrampTokenContract,
  },
};

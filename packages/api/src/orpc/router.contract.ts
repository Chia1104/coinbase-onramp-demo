import * as healthContracts from "./contracts/health.contract";
import * as onrampContracts from "./contracts/onramp.contract";

export const routerContract = {
  health: {
    server: healthContracts.HealthContract,
  },
  onramp: {
    token: onrampContracts.OnrampTokenContract,
    buyConfig: onrampContracts.OnrampBuyConfigContract,
  },
};

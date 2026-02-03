import { generateToken } from "../../src/orpc/services/onramp.service";

describe("onramp.service", () => {
  it("should generate a valid JWT token", async () => {
    const jwt = await generateToken("GET", "/onramp/v1/buy/options");
    console.log("jwt", jwt);
    expect(jwt).toBeDefined();
  });
});

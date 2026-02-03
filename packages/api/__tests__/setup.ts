import dotenv from "dotenv";

dotenv.config({
  path: "packages/api/.env",
});

vi.stubEnv("CDP_KEY_ID", process.env.CDP_KEY_ID);
vi.stubEnv("CDP_KEY_SECRET", process.env.CDP_KEY_SECRET);

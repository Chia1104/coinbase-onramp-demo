import { oc } from "@orpc/contract";
import * as z from "zod";

export const HealthContract = oc.output(
  z.object({
    status: z.string(),
  })
);

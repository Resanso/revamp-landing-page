import { z } from "zod";

export const competitionUpdateSchema = z.object({
  gemastik: z.string(),
  lidm: z.string(),
  satriaData: z.string(),
  pkm: z.string(),
  p2mw: z.string(),
  internal: z.string(),
});

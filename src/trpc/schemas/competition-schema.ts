import { z } from "zod";

// A destination link is either a valid URL or an empty string ("not set").
const urlField = z
  .string()
  .trim()
  .url("Masukkan URL yang valid.")
  .or(z.literal(""));

export const competitionUpdateSchema = z.object({
  gemastik: urlField.optional(),
  lidm: urlField.optional(),
  satriaData: urlField.optional(),
  pkm: urlField.optional(),
  p2mw: urlField.optional(),
  internal: urlField.optional(),
});

import { z } from "zod";

export const contentCategoryCreateSchema = z.object({
  name: z.string().min(1).max(50),
});

export const contentCategoryDeleteSchema = z.object({
  id: z.string(),
});

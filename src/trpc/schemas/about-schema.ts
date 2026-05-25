import { z } from "zod";

export const aboutSlideCreateSchema = z.object({
  imageUrl: z.string().url("URL gambar tidak valid"),
});

export const aboutSlideIdSchema = z.object({
  id: z.number().int().positive(),
});

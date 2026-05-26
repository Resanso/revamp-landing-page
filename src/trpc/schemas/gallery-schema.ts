import { z } from "zod";

export const galleryImageCreateSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Format tahun tidak valid (contoh: 2025)"),
  imageUrl: z.string().url("URL gambar tidak valid"),
});

export const galleryImageUpdateSchema = z.object({
  id: z.number().int().positive(),
  year: z.string().regex(/^\d{4}$/).optional(),
  imageUrl: z.string().url().optional(),
});

export const galleryImageGetAllSchema = z
  .object({
    year: z.string().regex(/^\d{4}$/).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(500).default(30),
  })
  .optional();

export const galleryImageIdSchema = z.object({
  id: z.number().int().positive(),
});


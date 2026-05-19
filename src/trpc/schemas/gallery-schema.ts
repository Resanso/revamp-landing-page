import { z } from "zod";

export const galleryImageCreateSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Format tahun tidak valid (contoh: 2025)"),
  fileName: z.string().min(1, "Nama file tidak boleh kosong"),
  imageUrl: z.string().url("URL gambar tidak valid"),
  description: z.string().max(500).optional().nullable(),
});

export const galleryImageUpdateSchema = z.object({
  id: z.number().int().positive(),
  year: z.string().regex(/^\d{4}$/).optional(),
  fileName: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
  description: z.string().max(500).optional().nullable(),
});

export const galleryImageGetAllSchema = z
  .object({
    year: z.string().regex(/^\d{4}$/).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(30),
  })
  .optional();

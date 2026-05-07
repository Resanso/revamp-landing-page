import { z } from "zod";

export const hallOfFameCreateSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Format tahun tidak valid (contoh: 2024)"),
  title: z
    .string()
    .min(1, "Judul tidak boleh kosong")
    .max(255, "Judul maksimal 255 karakter"),
  competition: z
    .string()
    .min(1, "Nama kompetisi tidak boleh kosong")
    .max(255, "Nama kompetisi maksimal 255 karakter"),
  image: z.string().url("URL gambar tidak valid"),
});

export const hallOfFameUpdateSchema = z.object({
  id: z.number().int().positive("ID harus bilangan bulat positif"),
  year: z
    .string()
    .regex(/^\d{4}$/, "Format tahun tidak valid (contoh: 2024)")
    .optional(),
  title: z
    .string()
    .min(1, "Judul tidak boleh kosong")
    .max(255, "Judul maksimal 255 karakter")
    .optional(),
  competition: z
    .string()
    .min(1, "Nama kompetisi tidak boleh kosong")
    .max(255, "Nama kompetisi maksimal 255 karakter")
    .optional(),
  image: z.string().url("URL gambar tidak valid").optional(),
});

export const getAllSchema = z
  .object({
    year: z
      .string()
      .regex(/^\d{4}$/, "Format tahun tidak valid")
      .optional(),
    q: z.string().max(100, "Query pencarian maksimal 100 karakter").optional(),
    limit: z
      .number()
      .int()
      .min(1, "Minimal 1 item")
      .max(100, "Maksimal 100 item per halaman")
      .default(20),
    cursor: z.number().int().positive().optional(),
  })
  .optional();

import { z } from "zod";

export const executiveMemberCreateSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Format tahun tidak valid (contoh: 2025)"),
  name: z.string().min(1, "Nama tidak boleh kosong").max(255),
  nim: z.string().min(1, "NIM tidak boleh kosong").max(50),
  prodi: z.string().min(1, "Program studi tidak boleh kosong").max(255),
  angkatan: z.string().min(4, "Angkatan tidak valid").max(4),
  position: z.string().min(1, "Jabatan tidak boleh kosong").max(255),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const executiveMemberUpdateSchema = z.object({
  id: z.number().int().positive(),
  year: z.string().regex(/^\d{4}$/).optional(),
  name: z.string().min(1).max(255).optional(),
  nim: z.string().min(1).max(50).optional(),
  prodi: z.string().min(1).max(255).optional(),
  angkatan: z.string().min(4).max(4).optional(),
  position: z.string().min(1).max(255).optional(),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const executiveMemberGetAllSchema = z
  .object({
    year: z.string().regex(/^\d{4}$/).optional(),
    q: z.string().max(100).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .optional();

export const executiveMemberIdSchema = z.object({
  id: z.number().int().positive(),
});


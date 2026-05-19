import { z } from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import {
  galleryImageCreateSchema,
  galleryImageUpdateSchema,
  galleryImageGetAllSchema,
} from "@/trpc/schemas/gallery-schema";

export const galleryRouter = createTRPCRouter({
  // Ambil semua tahun yang tersedia (distinct)
  getYears: baseProcedure.query(async () => {
    const rows = await prisma.galleryImage.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });
    return rows.map((r) => r.year);
  }),

  // Ambil semua gambar dengan filter & pagination
  getAll: baseProcedure
    .input(galleryImageGetAllSchema)
    .query(async ({ input }) => {
      const year = input?.year;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 30;
      const skip = (page - 1) * limit;

      const where = year ? { year } : {};

      const [images, total] = await Promise.all([
        prisma.galleryImage.findMany({
          where,
          orderBy: [{ year: "desc" }, { id: "asc" }],
          skip,
          take: limit,
        }),
        prisma.galleryImage.count({ where }),
      ]);

      return {
        images,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Ambil satu gambar by ID
  getById: baseProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const image = await prisma.galleryImage.findUnique({
        where: { id: input.id },
      });
      if (!image) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Gambar dengan id ${input.id} tidak ditemukan`,
        });
      }
      return image;
    }),

  // Tambah gambar baru (admin only)
  create: adminProcedure
    .input(galleryImageCreateSchema)
    .mutation(({ input }) => prisma.galleryImage.create({ data: input })),

  // Update gambar (admin only)
  update: adminProcedure
    .input(galleryImageUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await prisma.galleryImage.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Gambar dengan id ${id} tidak ditemukan`,
        });
      }
      return prisma.galleryImage.update({ where: { id }, data });
    }),

  // Hapus gambar (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.galleryImage.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Gambar dengan id ${input.id} tidak ditemukan`,
        });
      }
      await prisma.galleryImage.delete({ where: { id: input.id } });
      return { success: true };
    }),
});

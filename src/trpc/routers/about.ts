import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import {
  aboutSlideCreateSchema,
  aboutSlideIdSchema,
} from "@/trpc/schemas/about-schema";

export const aboutRouter = createTRPCRouter({
  // Get all slides ordered by insertion (id asc)
  getAll: baseProcedure.query(async () => {
    return prisma.aboutSlide.findMany({
      orderBy: { id: "asc" },
    });
  }),

  // Create a new slide (admin only)
  create: adminProcedure
    .input(aboutSlideCreateSchema)
    .mutation(async ({ input }) => {
      return prisma.aboutSlide.create({ data: input });
    }),

  // Delete a slide (admin only)
  delete: adminProcedure
    .input(aboutSlideIdSchema)
    .mutation(async ({ input }) => {
      const existing = await prisma.aboutSlide.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `About slide dengan id ${input.id} tidak ditemukan`,
        });
      }
      await prisma.aboutSlide.delete({ where: { id: input.id } });
      return { success: true };
    }),
});

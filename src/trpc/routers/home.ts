import { z } from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";

export const homeRouter = createTRPCRouter({
  getHeroSlides: baseProcedure.query(() =>
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
  ),

  getSuccessStats: baseProcedure.query(() =>
    prisma.successStat.findMany({ orderBy: { order: "asc" } }),
  ),

  getDepartments: baseProcedure.query(() =>
    prisma.department.findMany({ orderBy: { order: "asc" } }),
  ),

  upsertHeroSlide: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        src: z.string().min(1),
        alt: z.string().min(1),
        order: z.number().int(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.id) {
        return prisma.heroSlide.update({
          where: { id: input.id },
          data: { src: input.src, alt: input.alt, order: input.order },
        });
      }
      return prisma.heroSlide.create({
        data: { src: input.src, alt: input.alt, order: input.order },
      });
    }),

  deleteHeroSlide: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.heroSlide.delete({ where: { id: input.id } }),
    ),

  updateSuccessStat: adminProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string().min(1),
        value: z.string().min(1),
        accent: z.enum(["black", "primary"]),
      }),
    )
    .mutation(({ input }) =>
      prisma.successStat.update({
        where: { id: input.id },
        data: { label: input.label, value: input.value, accent: input.accent },
      }),
    ),

  upsertDepartment: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1),
        description: z.string().min(1),
        img: z.string().min(1),
        order: z.number().int(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (id) {
        return prisma.department.update({ where: { id }, data });
      }
      return prisma.department.create({ data });
    }),
});

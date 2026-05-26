import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import {
  upsertHeroSlideSchema,
  deleteHeroSlideSchema,
  updateSuccessStatSchema,
  upsertDepartmentSchema,
} from "@/trpc/schemas/home-schema";

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
    .input(upsertHeroSlideSchema)
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
    .input(deleteHeroSlideSchema)
    .mutation(({ input }) =>
      prisma.heroSlide.delete({ where: { id: input.id } }),
    ),

  updateSuccessStat: adminProcedure
    .input(updateSuccessStatSchema)
    .mutation(({ input }) =>
      prisma.successStat.update({
        where: { id: input.id },
        data: { label: input.label, value: input.value, accent: input.accent },
      }),
    ),

  upsertDepartment: adminProcedure
    .input(upsertDepartmentSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      if (id) {
        return prisma.department.update({ where: { id }, data });
      }
      return prisma.department.create({ data });
    }),
});

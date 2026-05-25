import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import {
  contentCategoryCreateSchema,
  contentCategoryDeleteSchema,
} from "@/trpc/schemas/content-categories-schema";

export const contentCategoriesRouter = createTRPCRouter({
  list: baseProcedure.query(() =>
    prisma.contentCategory.findMany({ orderBy: { order: "asc" } }),
  ),

  create: adminProcedure
    .input(contentCategoryCreateSchema)
    .mutation(async ({ input }) => {
      const last = await prisma.contentCategory.findFirst({ orderBy: { order: "desc" } });
      return prisma.contentCategory.create({
        data: { name: input.name, order: (last?.order ?? -1) + 1 },
      });
    }),

  delete: adminProcedure
    .input(contentCategoryDeleteSchema)
    .mutation(({ input }) =>
      prisma.contentCategory.delete({ where: { id: input.id } }),
    ),
});

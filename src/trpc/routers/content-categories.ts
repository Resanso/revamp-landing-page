import { z } from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";

export const contentCategoriesRouter = createTRPCRouter({
  list: baseProcedure.query(() =>
    prisma.contentCategory.findMany({ orderBy: { order: "asc" } }),
  ),

  create: adminProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .mutation(async ({ input }) => {
      const last = await prisma.contentCategory.findFirst({ orderBy: { order: "desc" } });
      return prisma.contentCategory.create({
        data: { name: input.name, order: (last?.order ?? -1) + 1 },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.contentCategory.delete({ where: { id: input.id } }),
    ),
});

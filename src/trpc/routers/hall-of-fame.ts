import { z } from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";

export const hallOfFameRouter = createTRPCRouter({
  getYears: baseProcedure.query(async () => {
    const rows = await prisma.hallOfFame.groupBy({
      by: ["year"],
      orderBy: { year: "desc" },
    });
    return rows.map((r) => r.year);
  }),

  getByYear: baseProcedure
    .input(z.object({ year: z.string() }))
    .query(({ input }) =>
      prisma.hallOfFame.findMany({
        where: { year: input.year },
        orderBy: { createdAt: "desc" },
      }),
    ),

  getAll: baseProcedure.query(() =>
    prisma.hallOfFame.findMany({ orderBy: [{ year: "desc" }, { createdAt: "desc" }] }),
  ),

  create: adminProcedure
    .input(
      z.object({
        year: z.string().min(4),
        title: z.string().min(1),
        competition: z.string().min(1),
        image: z.string().min(1),
      }),
    )
    .mutation(({ input }) => prisma.hallOfFame.create({ data: input })),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        year: z.string().min(4),
        title: z.string().min(1),
        competition: z.string().min(1),
        image: z.string().min(1),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.hallOfFame.update({ where: { id }, data });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) =>
      prisma.hallOfFame.delete({ where: { id: input.id } }),
    ),
});

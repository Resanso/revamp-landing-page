import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { competitionUpdateSchema } from "@/trpc/schemas/competition-schema";

export const competitionRouter = createTRPCRouter({
  get: baseProcedure.query(async () => {
    let competition = await prisma.competition.findUnique({
      where: { id: 1 },
    });

    if (!competition) {
      competition = await prisma.competition.create({
        data: {
          id: 1,
        },
      });
    }

    return competition;
  }),
  update: adminProcedure
    .input(competitionUpdateSchema)
    .mutation(async ({ input }) => {
      const competition = await prisma.competition.upsert({
        where: { id: 1 },
        update: input,
        create: {
          id: 1,
          ...input,
        },
      });

      return competition;
    }),
});

import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { competitionUpdateSchema } from "@/trpc/schemas/competition-schema";

const COMPETITION_ID = 1;

// Only the link fields the UI consumes — keeps router output free of Date
// values so it can be safely passed as a client component prop.
const linkSelect = {
  id: true,
  gemastik: true,
  lidm: true,
  satriaData: true,
  pkm: true,
  p2mw: true,
  internal: true,
} as const;

export const competitionRouter = createTRPCRouter({
  get: baseProcedure.query(async () => {
    const existing = await prisma.competition.findUnique({
      where: { id: COMPETITION_ID },
      select: linkSelect,
    });
    if (existing) return existing;
    return prisma.competition.create({
      data: { id: COMPETITION_ID },
      select: linkSelect,
    });
  }),

  update: adminProcedure
    .input(competitionUpdateSchema)
    .mutation(({ input }) =>
      prisma.competition.upsert({
        where: { id: COMPETITION_ID },
        update: input,
        create: { id: COMPETITION_ID, ...input },
        select: linkSelect,
      }),
    ),
});

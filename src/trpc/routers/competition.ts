import { z } from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";

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

// A destination link is either a valid URL or an empty string ("not set").
const urlField = z
  .string()
  .trim()
  .url("Masukkan URL yang valid.")
  .or(z.literal(""));

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
    .input(
      z.object({
        gemastik: urlField.optional(),
        lidm: urlField.optional(),
        satriaData: urlField.optional(),
        pkm: urlField.optional(),
        p2mw: urlField.optional(),
        internal: urlField.optional(),
      }),
    )
    .mutation(({ input }) =>
      prisma.competition.upsert({
        where: { id: COMPETITION_ID },
        update: input,
        create: { id: COMPETITION_ID, ...input },
        select: linkSelect,
      }),
    ),
});

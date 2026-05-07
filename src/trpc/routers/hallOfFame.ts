import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import {
  hallOfFameCreateSchema,
  hallOfFameUpdateSchema,
  getAllSchema,
} from "@/trpc/schemas/hallOfFame-schema";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { TRPCError } from "@trpc/server";

export const hallOfFameRouter = createTRPCRouter({
  getAll: baseProcedure.input(getAllSchema).query(async ({ input }) => {
    const year = input?.year;
    const q = input?.q;
    const limit = input?.limit ?? 6;
    const page = input?.page ?? 1;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.HallOfFameWhereInput = {};
    if (year) {
      whereClause.year = year;
    }
    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { competition: { contains: q, mode: "insensitive" } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.hallOfFame.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          id: "asc",
        },
      }),
      prisma.hallOfFame.count({ where: whereClause }),
    ]);

    return {
      entries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }),

  getYears: baseProcedure.query(async () => {
    const distinctYearsResult = await prisma.hallOfFame.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });
    return distinctYearsResult.map((item) => item.year);
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const entry = await prisma.hallOfFame.findUnique({
        where: { id: input.id },
      });

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `data dengan id ${input.id} tidak ditemukan`,
        });
      }

      return entry;
    }),

  create: baseProcedure
    .input(hallOfFameCreateSchema)
    .mutation(async ({ input }) => {
      const newEntry = await prisma.hallOfFame.create({
        data: input,
      });
      return newEntry;
    }),

  update: baseProcedure
    .input(hallOfFameUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const existing = await prisma.hallOfFame.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `data dengan id ${id} tidak ditemukan`,
        });
      }

      const updatedEntry = await prisma.hallOfFame.update({
        where: { id },
        data,
      });
      return updatedEntry;
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.hallOfFame.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `data dengan id ${input.id} tidak ditemukan`,
        });
      }

      await prisma.hallOfFame.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});

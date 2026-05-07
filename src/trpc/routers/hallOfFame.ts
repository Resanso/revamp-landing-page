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
import { handlePrismaError } from "@/trpc/utils/prismaErrorHandlers";

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

    try {
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
    } catch (error) {
      handlePrismaError(error, { entity: "HallOfFame" });
    }
  }),

  getYears: baseProcedure.query(async () => {
    try {
      const distinctYearsResult = await prisma.hallOfFame.findMany({
        select: { year: true },
        distinct: ["year"],
        orderBy: { year: "desc" },
      });
      return distinctYearsResult.map((item) => item.year);
    } catch (error) {
      handlePrismaError(error, { entity: "HallOfFame" });
    }
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const entry = await prisma.hallOfFame.findUnique({
          where: { id: input.id },
        });

        if (!entry) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Entry dengan id ${input.id} tidak ditemukan`,
          });
        }

        return entry;
      } catch (error) {
        handlePrismaError(error, { id: input.id, entity: "HallOfFame" });
      }
    }),

  create: baseProcedure
    .input(hallOfFameCreateSchema)
    .mutation(async ({ input }) => {
      try {
        const newEntry = await prisma.hallOfFame.create({
          data: input,
        });
        return newEntry;
      } catch (error) {
        handlePrismaError(error, { entity: "HallOfFame" });
      }
    }),

  update: baseProcedure
    .input(hallOfFameUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      try {
        const updatedEntry = await prisma.hallOfFame.update({
          where: { id },
          data,
        });
        return updatedEntry;
      } catch (error) {
        handlePrismaError(error, { id, entity: "HallOfFame" });
      }
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await prisma.hallOfFame.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        handlePrismaError(error, { id: input.id, entity: "HallOfFame" });
      }
    }),
});

import { z } from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const authRouter = createTRPCRouter({
  login: baseProcedure
    .input(
      z.object({
        nim: z.string().min(1, "NIM tidak boleh kosong"),
        password: z.string().min(1, "Password tidak boleh kosong"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { nim, password } = input;

      const profile = await prisma.adminProfile.findUnique({
        where: { nim },
        select: { email: true },
      });

      if (!profile) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "NIM atau password salah. Silakan coba lagi.",
        });
      }

      const { error: authError } = await ctx.supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (authError) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "NIM atau password salah. Silakan coba lagi.",
        });
      }

      return { success: true };
    }),

  getAdmins: adminProcedure.query(async () => {
    const admins = await prisma.adminProfile.findMany({
      select: {
        id: true,
        nim: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return admins;
  }),

  register: adminProcedure
    .input(
      z.object({
        nim: z.string().min(1, "NIM tidak boleh kosong"),
        name: z.string().min(1, "Nama tidak boleh kosong"),
        email: z.email("Format email tidak valid"),
        password: z
          .string()
          .min(8, "Password minimal 8 karakter")
          .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
          .regex(/[0-9]/, "Password harus mengandung angka"),
      }),
    )
    .mutation(async ({ input }) => {
      const { nim, name, email, password } = input;

      const existing = await prisma.adminProfile.findFirst({
        where: { OR: [{ nim }, { email }] },
        select: { nim: true, email: true },
      });

      if (existing) {
        const field = existing.nim === nim ? "NIM" : "email";
        throw new TRPCError({
          code: "CONFLICT",
          message: `${field} sudah terdaftar.`,
        });
      }

      const supabaseAdmin = createServiceRoleClient();
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (authError || !authData.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: authError?.message ?? "Gagal membuat akun Supabase.",
        });
      }

      const supabaseUserId = authData.user.id;

      try {
        const profile = await prisma.adminProfile.create({
          data: {
            nim,
            name,
            email,
            userId: supabaseUserId,
          },
        });

        return {
          success: true,
          profile: {
            id: profile.id,
            nim: profile.nim,
            name: profile.name,
            email: profile.email,
          },
        };
      } catch (dbError) {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal menyimpan profil admin. Silakan coba lagi.",
        });
      }
    }),
});

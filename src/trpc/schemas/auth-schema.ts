import { z } from "zod";

export const loginSchema = z.object({
  nim: z.string().min(1, "NIM tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export const registerSchema = z.object({
  nim: z.string().min(1, "NIM tidak boleh kosong"),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung angka"),
});
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

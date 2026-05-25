"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function AddAdminForm() {
  const router = useRouter();
  const trpc = useTRPC();

  const [form, setForm] = useState({
    nim: "",
    name: "",
    email: "",
    password: "",
    showPassword: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: (data) => {
        setSuccess(`Admin "${data.profile.name}" berhasil ditambahkan!`);
        setForm({
          nim: "",
          name: "",
          email: "",
          password: "",
          showPassword: false,
        });
        setTimeout(() => {
          router.push("/admin/admin-management");
          router.refresh();
        }, 1500);
      },
      onError: (err) => {
        setError(err.message);
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    registerMutation.mutate({
      nim: form.nim,
      name: form.name,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-[#3e484f] text-sm font-medium font-jakarta">
          Nama Lengkap
        </label>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
            <User className="w-5 h-5 text-[#6e7980]" />
          </div>
          <input
            id="admin-name"
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Budi Santoso"
            className="w-full bg-[#f6f6f6] rounded-lg pl-11 pr-4 py-4 text-base font-jakarta text-[#191c1e] placeholder:text-[rgba(110,121,128,0.6)] outline-none focus:ring-2 focus:ring-[#FFC917]/40"
          />
        </div>
      </div>

      {/* NIM */}
      <div className="flex flex-col gap-2">
        <label className="text-[#3e484f] text-sm font-medium font-jakarta">
          NIM
        </label>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
            <CreditCard className="w-5 h-5 text-[#6e7980]" />
          </div>
          <input
            id="admin-nim"
            type="text"
            required
            value={form.nim}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nim: e.target.value }))
            }
            placeholder="103012001212"
            className="w-full bg-[#f6f6f6] rounded-lg pl-11 pr-4 py-4 text-base font-jakarta text-[#191c1e] placeholder:text-[rgba(110,121,128,0.6)] outline-none focus:ring-2 focus:ring-[#FFC917]/40"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-[#3e484f] text-sm font-medium font-jakarta">
          Email
        </label>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
            <Mail className="w-5 h-5 text-[#6e7980]" />
          </div>
          <input
            id="admin-email"
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="budi@example.com"
            className="w-full bg-[#f6f6f6] rounded-lg pl-11 pr-4 py-4 text-base font-jakarta text-[#191c1e] placeholder:text-[rgba(110,121,128,0.6)] outline-none focus:ring-2 focus:ring-[#FFC917]/40"
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="text-[#3e484f] text-sm font-medium font-jakarta">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
            <Lock className="w-5 h-5 text-[#6e7980]" />
          </div>
          <input
            id="admin-password"
            type={form.showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Min. 8 karakter, huruf kapital & angka"
            className="w-full bg-[#f6f6f6] rounded-lg pl-11 pr-12 py-4 text-base font-jakarta text-[#191c1e] placeholder:text-[rgba(110,121,128,0.6)] outline-none focus:ring-2 focus:ring-[#FFC917]/40"
          />
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, showPassword: !prev.showPassword }))
            }
            className="absolute right-0 top-0 bottom-0 flex items-center pr-4 text-[#6e7980] hover:text-[#191c1e] transition-colors"
          >
            {form.showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[#6e7980] text-xs font-jakarta">
          Minimal 8 karakter, mengandung huruf kapital dan angka.
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-jakarta text-red-600">
          {error}
        </p>
      )}

      {/* Success */}
      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-jakarta text-green-700">
          {success}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-[#FFC917] hover:bg-[#ffb901] rounded-lg py-4 text-base font-semibold font-jakarta text-white transition-colors disabled:opacity-60"
      >
        {registerMutation.isPending ? "Menambahkan..." : "Tambah Admin"}
      </button>
    </form>
  );
}

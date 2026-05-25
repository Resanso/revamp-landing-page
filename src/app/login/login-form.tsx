"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Eye, EyeOff } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function LoginForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => {
        router.push("/admin");
        router.refresh();
      },
      onError: (err) => {
        setError(err.message);
      },
    }),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ nim, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* NIM Field */}
      <div className="flex flex-col gap-2">
        <label className="text-[#3e484f] text-sm font-medium font-jakarta">
          NIM
        </label>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
            <CreditCard className="w-5 h-5 text-[#6e7980]" />
          </div>
          <input
            type="text"
            required
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="103012001212"
            className="w-full bg-[#f6f6f6] rounded-[8px] pl-11 pr-4 py-4 text-base font-jakarta text-[#191c1e] placeholder:text-[rgba(110,121,128,0.6)] outline-none focus:ring-2 focus:ring-[#FFC917]/40"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <label className="text-[#3e484f] text-sm font-medium font-jakarta">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
            <Lock className="w-5 h-5 text-[#6e7980]" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#f6f6f6] rounded-[8px] pl-11 pr-12 py-4 text-base font-jakarta text-[#191c1e] placeholder:text-[rgba(110,121,128,0.6)] outline-none focus:ring-2 focus:ring-[#FFC917]/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 top-0 bottom-0 flex items-center pr-4 text-[#6e7980] hover:text-[#191c1e] transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-jakarta text-red-600">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-[#FFC917] hover:bg-[#ffb901] rounded-[8px] py-4 text-base font-semibold font-jakarta text-white transition-colors disabled:opacity-60"
      >
        {loginMutation.isPending ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}

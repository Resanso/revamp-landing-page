import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./login-form";

export const metadata = {
  title: "Login | PRODIGI Admin",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f6f6] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
            PRODIGI
          </h1>
          <p className="mt-1 text-sm text-black/50">Admin Panel</p>
        </div>

        <div className="border border-black/10 bg-white p-8">
          <h2 className="mb-6 text-lg font-semibold text-[#1a1a1a]">Masuk</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

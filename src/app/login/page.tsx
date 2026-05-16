import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[475px]">
        {/* Card */}
        <div
          className="bg-white border border-[#ededed] rounded-[8px] px-8 pt-10 pb-8 flex flex-col gap-8"
          style={{ boxShadow: "0px 20px 40px -10px rgba(27,73,101,0.08)" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-start">
            <Image
              src="/images/logo-landscape.png"
              alt="PRODIGI"
              width={220}
              height={52}
              className="object-contain"
              priority
            />
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#e6e8ea]" />

          {/* Heading */}
          <h2 className="text-[#191c1e] text-2xl font-bold font-jakarta text-center w-full">
            Masuk Sekarang
          </h2>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

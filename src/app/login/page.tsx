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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[475px]">
        {/* Card */}
        <div
          className="bg-white border border-[#ededed] rounded-[8px] px-8 pt-10 pb-8 flex flex-col gap-8"
          style={{ boxShadow: "0px 20px 40px -10px rgba(27,73,101,0.08)" }}
        >
          {/* Logo */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2.5">
              {/* Icon mark */}
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute top-0 left-0 w-[14px] h-[14px] bg-[#231918] rounded-[2px]" />
                <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#FFC917] rounded-[2px]" />
                <div className="absolute top-0 right-0 w-[14px] h-[14px] bg-[#FFC917]/60 rounded-[2px]" />
                <div className="absolute bottom-0 left-0 w-[14px] h-[14px] bg-[#231918]/40 rounded-[2px]" />
              </div>
              <span className="font-jakarta text-[22px] leading-none">
                <span className="font-bold text-[#231918]">PRO</span>
                <span className="font-bold text-[#FFC917]">DIGI</span>
              </span>
            </div>
            <p className="text-[#6A6A6A] text-xs font-jakarta ml-[42px]">
              Inspire Through Creation.
            </p>
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

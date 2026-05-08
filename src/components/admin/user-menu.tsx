"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserMenuProps = {
  name: string;
  email: string;
  nim: string;
};

export default function UserMenu({ name, email, nim }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffc91f] text-sm font-bold text-black transition hover:bg-[#ffb901]"
        aria-label="User menu"
      >
        {name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-10 z-20 w-64 border border-black/10 bg-white shadow-lg">
            <div className="border-b border-black/10 px-4 py-3">
              <p className="font-semibold text-[#1a1a1a]">{name}</p>
              <p className="text-xs text-black/50">{email}</p>
              <p className="text-xs text-black/50">NIM: {nim}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

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
        className="flex w-[180px] items-center justify-end gap-2"
        aria-label="User menu"
      >
        <div className="flex flex-col items-end w-[140px]">
          <span className="text-right text-black text-xs font-semibold leading-tight font-jakarta">{name}</span>
          <span className="text-right text-black text-[10px] font-light leading-tight font-jakarta">Administrator</span>
        </div>
        <div className="w-8 h-8 rounded-full shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.10),0px_4px_6px_-1px_rgba(0,0,0,0.10),0px_0px_0px_2px_#FBBF24] overflow-hidden bg-gray-200 flex items-center justify-center">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} alt={name} className="w-full h-full object-cover" />
        </div>
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

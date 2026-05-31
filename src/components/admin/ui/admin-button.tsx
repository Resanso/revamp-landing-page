import { cn } from "@/lib/utils";
import React from "react";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "dashed" | "ghost";
  children: React.ReactNode;
}

export function AdminButton({
  variant = "primary",
  children,
  className,
  ...props
}: AdminButtonProps) {
  const baseStyles =
    "inline-flex justify-center items-center gap-2.5 rounded text-base font-bold transition-colors";
  const variants = {
    primary: "bg-[#FFC917] hover:bg-[#ffb901] text-black px-[var(--admin-btn-px)] py-[var(--admin-btn-py)] h-[var(--admin-btn-h)]",
    outline: "border border-[#FFC917] bg-[rgba(255,201,23,0.15)] text-[#231918] px-[108px] py-10 rounded-[80px]",
    dashed: "",
    ghost: "bg-transparent text-black px-[var(--admin-btn-px)] py-[var(--admin-btn-py)] h-[var(--admin-btn-h)]",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

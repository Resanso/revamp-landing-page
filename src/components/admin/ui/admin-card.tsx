import { cn } from "@/lib/utils";
import React from "react";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdminCard({ children, className, ...props }: AdminCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-[#D9D9D9] p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

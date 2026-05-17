import { cn } from "@/lib/utils";
import React from "react";

interface AdminTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function AdminTabs({ tabs, activeTab, onChange }: AdminTabsProps) {
  return (
    <div className="flex items-center gap-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-10 py-4 rounded-lg flex justify-center items-center gap-2.5 transition-colors text-base font-medium",
              isActive
                ? "bg-[#FFC917] text-black border border-[#D9D9D9]"
                : "bg-transparent text-black border border-[#D9D9D9] hover:bg-black/5"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

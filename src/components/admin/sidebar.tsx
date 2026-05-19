"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Info, Users, Medal, CalendarDays, Trophy, ChevronDown } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/admin/home", Icon: Home },
  { label: "About", href: "/admin/about", Icon: Info },
  { 
    label: "Executive", 
    Icon: Users,
    subItems: [
      { label: "Executives", href: "/admin/executives" },
      { label: "Gallery", href: "/admin/gallery" },
    ]
  },
  { label: "Hall of Fame", href: "/admin/hall-of-fame", Icon: Medal },
  { label: "Activities", href: "/admin/activities", Icon: CalendarDays },
  { label: "Competition", href: "/admin/competition", Icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [executiveOpen, setExecutiveOpen] = useState(
    pathname.startsWith("/admin/executives") || pathname.startsWith("/admin/gallery")
  );

  return (
    <aside className="flex w-[234px] shrink-0 flex-col bg-[#050816] text-white overflow-hidden">
      {/* Logo */}
      <div className="px-6 py-8">
        <Image
          src="/images/logo-white.png"
          alt="PRODIGI"
          width={160}
          height={38}
          className="object-contain"
          priority
        />
      </div>

      <nav className="flex-1 flex flex-col pt-2 gap-1">
        {navItems.map((item) => {
          if (item.subItems) {
            const isActive = item.subItems.some(sub => pathname.startsWith(sub.href));
            return (
              <div key={item.label} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setExecutiveOpen(!executiveOpen)}
                  className={`relative flex items-center justify-between px-6 py-3.5 transition-colors ${
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FFC917] rounded-r-full" />
                  )}
                  <div className="flex items-center gap-3">
                    <item.Icon
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#FFC917]" : "text-white/70"}`}
                    />
                    <span
                      className={`text-base font-jakarta ${
                        isActive ? "font-semibold text-[#FFC917]" : "font-normal text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform ${
                      executiveOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {executiveOpen && (
                  <div className="flex flex-col bg-black/20 py-2">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname.startsWith(subItem.href);
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`pl-14 pr-6 py-2 transition-colors text-sm font-jakarta ${
                            isSubActive
                              ? "text-[#FFC917] font-semibold"
                              : "text-white/70 hover:text-white"
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname.startsWith(item.href!);
          return (
            <Link
              key={item.href!}
              href={item.href!}
              className={`relative flex items-center gap-3 px-6 py-3.5 transition-colors ${
                isActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FFC917] rounded-r-full" />
              )}
              <item.Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#FFC917]" : "text-white/70"}`}
              />
              <span
                className={`text-base font-jakarta ${
                  isActive ? "font-semibold text-[#FFC917]" : "font-normal text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

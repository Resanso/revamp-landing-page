"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Users, Medal, CalendarDays, Trophy } from "lucide-react";

const navItems = [
  { label: "Home", href: "/admin/home", Icon: Home },
  { label: "About", href: "/admin/about", Icon: Info },
  { label: "Executive", href: "/admin/executive", Icon: Users },
  { label: "Hall of Fame", href: "/admin/hall-of-fame", Icon: Medal },
  { label: "Activities", href: "/admin/activities", Icon: CalendarDays },
  { label: "Competition", href: "/admin/competition", Icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[234px] shrink-0 flex-col bg-[#050816] text-white overflow-hidden">
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-2.5">
          {/* Icon mark */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#FFC917] rounded-sm" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#FFC917] rounded-sm" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#FFC917]/40 rounded-sm" />
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#FFC917]/40 rounded-sm" />
          </div>
          <span className="font-jakarta text-xl leading-none">
            <span className="font-normal text-white">PRO</span>
            <span className="font-bold text-white">DIGI</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col pt-2 gap-1">
        {navItems.map(({ label, href, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-6 py-3.5 transition-colors ${
                isActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FFC917] rounded-r-full" />
              )}
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#FFC917]" : "text-white/70"}`}
              />
              <span
                className={`text-base font-jakarta ${
                  isActive ? "font-semibold text-[#FFC917]" : "font-normal text-white"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/admin/home" },
  { label: "Hall of Fame", href: "/admin/hall-of-fame" },
  { label: "Activities", href: "/admin/activities" },
  { label: "Executive Members", href: "/admin/executives" },
  { label: "Executive Gallery", href: "/admin/gallery" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-black/10 bg-[#18181b] text-white">
      <div className="border-b border-white/10 px-5 py-4">
        <span className="text-lg font-bold tracking-tight">PRODIGI</span>
        <span className="ml-2 text-xs text-white/40">Admin</span>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-5 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#ffc91f] text-black"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

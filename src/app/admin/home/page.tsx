import { getCaller } from "@/trpc/server";
import HeroSlidesPanel from "./hero-slides-panel";
import StatsPanel from "./stats-panel";
import DepartmentsPanel from "./departments-panel";
import LeaderboardPanel from "./leaderboard-panel";
import Link from "next/link";

export const metadata = { title: "Home | Admin" };

export default async function HomeAdminPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const tab = typeof searchParams.tab === "string" ? searchParams.tab : "all";

  const caller = await getCaller();
  const [slides, stats, departments, siteSetting, leaderboard] = await Promise.all([
    caller.home.getHeroSlides(),
    caller.home.getSuccessStats(),
    caller.home.getDepartments(),
    caller.home.getSiteSetting(),
    caller.home.getLeaderBoard(),
  ]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "hero", label: "Background Hero" },
    { id: "stats", label: "Success Stories Stats" },
    { id: "departments", label: "Departments" },
    { id: "leaderboard", label: "Leader Board" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta break-words">Manage Home</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta break-words">Manage hero banners, departments, statistics, and leaderboard</p>
      </div>
      
      <div className="bg-white rounded-lg border border-[#D9D9D9] p-8 flex flex-col gap-2.5">
        <p className="text-[#6A6A6A] text-base font-medium font-jakarta break-words">Section in Home</p>
        <div className="flex items-center gap-4 flex-wrap">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={`/admin/home?tab=${t.id}`}
              className={`px-10 py-4 rounded-lg border border-[#D9D9D9] flex justify-center items-center transition-colors ${
                tab === t.id ? "bg-[#FFC917]" : "bg-transparent hover:bg-black/5"
              }`}
            >
              <span className="text-black text-base font-medium font-jakarta break-words">{t.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {(tab === "all" || tab === "hero") && <HeroSlidesPanel slides={slides} />}
      {(tab === "all" || tab === "stats") && <StatsPanel stats={stats} siteSetting={siteSetting} />}
      {(tab === "all" || tab === "departments") && <DepartmentsPanel departments={departments} siteSetting={siteSetting} />}
      {(tab === "all" || tab === "leaderboard") && <LeaderboardPanel leads={leaderboard} />}
    </div>
  );
}

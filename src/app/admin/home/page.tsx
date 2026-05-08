import { getCaller } from "@/trpc/server";
import HeroSlidesPanel from "./hero-slides-panel";
import StatsPanel from "./stats-panel";
import DepartmentsPanel from "./departments-panel";

export const metadata = { title: "Home | Admin" };

export default async function HomeAdminPage() {
  const caller = await getCaller();
  const [slides, stats, departments] = await Promise.all([
    caller.home.getHeroSlides(),
    caller.home.getSuccessStats(),
    caller.home.getDepartments(),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-[#1a1a1a]">Home</h1>
      <HeroSlidesPanel slides={slides} />
      <StatsPanel stats={stats} />
      <DepartmentsPanel departments={departments} />
    </div>
  );
}

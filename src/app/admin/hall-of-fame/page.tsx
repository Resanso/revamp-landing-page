import { getCaller } from "@/trpc/server";
import HofPanel from "./hof-panel";

export const metadata = { title: "Hall of Fame | Admin" };

export default async function HallOfFameAdminPage() {
  const caller = await getCaller();
  const years = await caller.hallOfFame.getYears();

  const entriesByYear: Record<string, Awaited<ReturnType<typeof caller.hallOfFame.getByYear>>> = {};
  await Promise.all(
    years.map(async (year) => {
      entriesByYear[year] = await caller.hallOfFame.getByYear({ year });
    }),
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">Hall of Fame</h1>
      <HofPanel years={years} entriesByYear={entriesByYear} />
    </div>
  );
}

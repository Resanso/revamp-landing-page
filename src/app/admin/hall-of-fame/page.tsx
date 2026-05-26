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
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta break-words">Manage Hall of Fame</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta break-words">Manage yearly achievements and showcase accomplishment cards</p>
      </div>

      <HofPanel years={years} entriesByYear={entriesByYear} />
    </div>
  );
}

import Link from "next/link";
import { getCaller } from "@/trpc/server";
import ExecutivesAdminClient from "./executives-admin-client";

export const metadata = { title: "Executive Members | Admin" };

export default async function ExecutivesAdminPage() {
  const caller = await getCaller();
  const years = await caller.executives.getYears();

  const activeYear = years[0] ?? "";
  const { members } = activeYear
    ? await caller.executives.getAll({ year: activeYear, limit: 100 })
    : { members: [] };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta break-words">Manage Executive Members</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta break-words">Manage executive members data</p>
      </div>
      <ExecutivesAdminClient
        initialYears={years}
        initialMembers={members}
        initialYear={activeYear}
      />
    </div>
  );
}

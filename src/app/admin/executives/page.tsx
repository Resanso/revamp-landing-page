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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Executive Members</h1>
      </div>
      <ExecutivesAdminClient
        initialYears={years}
        initialMembers={members}
        initialYear={activeYear}
      />
    </div>
  );
}

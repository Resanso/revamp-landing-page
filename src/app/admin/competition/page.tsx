import { getCaller } from "@/trpc/server";
import CompetitionAdminClient from "./competition-admin-client";

export const metadata = { title: "Competition | Admin" };

export default async function ManageCompetitionPage() {
  const caller = await getCaller();
  const competition = await caller.competition.get();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta">
          Manage Competitions
        </h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta">
          Manage, organize, and update destination links for competitions
          displayed on the website.
        </p>
      </div>

      <CompetitionAdminClient competition={competition} />
    </div>
  );
}

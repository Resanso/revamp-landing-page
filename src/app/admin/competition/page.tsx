import { getCaller } from "@/trpc/server";
import CompetitionAdminClient from "./competition-admin-client";

export const metadata = { title: "Competitions | Admin" };

export default async function ManageCompetitionPage() {
  const caller = await getCaller();
  const competitionData = await caller.competition.get();

  return <CompetitionAdminClient initialData={competitionData} />;
}

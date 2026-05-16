import { getCaller } from "@/trpc/server";
import ActivitiesAdminClient from "./activities-admin-client";

export const metadata = { title: "Activities | Admin" };

export default async function ActivitiesAdminPage() {
  const caller = await getCaller();
  const { posts } = await caller.activities.getAll({ page: 1, limit: 50 });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta">Manage Activities</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta">
          Manage activity content including events, information, and articles
        </p>
      </div>

      <ActivitiesAdminClient posts={posts} />
    </div>
  );
}

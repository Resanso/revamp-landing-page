import Link from "next/link";
import { getCaller } from "@/trpc/server";
import ActivitiesAdminClient from "./activities-admin-client";

export const metadata = { title: "Activities | Admin" };

export default async function ActivitiesAdminPage() {
  const caller = await getCaller();
  const { posts } = await caller.activities.getAll({ page: 1, limit: 50 });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Activities</h1>
        <Link
          href="/admin/activities/new"
          className="bg-[#ffc91f] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ffb901]"
        >
          + Tambah Aktivitas
        </Link>
      </div>

      <ActivitiesAdminClient posts={posts} />
    </div>
  );
}

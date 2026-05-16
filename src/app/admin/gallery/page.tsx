import { getCaller } from "@/trpc/server";
import GalleryAdminClient from "./gallery-admin-client";

export const metadata = { title: "Executive Gallery | Admin" };

export default async function GalleryAdminPage() {
  const caller = await getCaller();
  const years = await caller.gallery.getYears();

  const activeYear = years[0] ?? "";
  const { images } = activeYear
    ? await caller.gallery.getAll({ year: activeYear, limit: 100 })
    : { images: [] };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Executive Gallery</h1>
      </div>
      <GalleryAdminClient
        initialYears={years}
        initialImages={images}
        initialYear={activeYear}
      />
    </div>
  );
}

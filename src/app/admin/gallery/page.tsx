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
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta break-words">Manage Executive Gallery</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta break-words">Manage executive gallery photos</p>
      </div>
      <GalleryAdminClient
        initialYears={years}
        initialImages={images}
        initialYear={activeYear}
      />
    </div>
  );
}

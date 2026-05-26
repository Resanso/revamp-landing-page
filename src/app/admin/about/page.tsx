import { getCaller } from "@/trpc/server";
import AboutAdminClient from "./about-admin-client";

export const metadata = { title: "About Slides | Admin" };

export default async function AboutAdminPage() {
  const caller = await getCaller();
  const slides = await caller.about.getAll();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta break-words">
          Manage About Slides
        </h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta break-words">
          Manage the carousel images shown on the About page. Images are stored in
          Supabase storage under the <code className="text-xs bg-black/5 px-1 rounded">about-slides</code> bucket.
        </p>
      </div>
      <AboutAdminClient initialSlides={slides} />
    </div>
  );
}

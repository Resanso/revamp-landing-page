import { getCaller } from "@/trpc/server";
import { notFound } from "next/navigation";
import ActivityForm from "../activity-form";

export const metadata = { title: "Edit Aktivitas | Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditActivityPage({ params }: Props) {
  const { id } = await params;
  const caller = await getCaller();

  // Fetch all then find by id (no getById procedure needed)
  const { posts } = await caller.activities.getAll({ page: 1, limit: 200 });
  const post = posts.find((p) => p.id === id);

  if (!post) notFound();

  // Also fetch full content for the edit form
  const full = await caller.activities.getBySlug({ slug: post.slug });
  if (!full) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">Edit Aktivitas</h1>
      <ActivityForm
        initial={{
          id: full.id,
          title: full.title,
          excerpt: full.excerpt,
          category: full.category,
          coverImage: full.coverImage,
          contentMarkdown: full.contentHtml,
        }}
      />
    </div>
  );
}

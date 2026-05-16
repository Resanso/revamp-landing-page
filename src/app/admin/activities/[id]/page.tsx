import { getCaller } from "@/trpc/server";
import { notFound } from "next/navigation";
import ActivityForm from "../activity-form";

export const metadata = { title: "Edit Activities | Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditActivityPage({ params }: Props) {
  const { id } = await params;
  const caller = await getCaller();

  const post = await caller.activities.getById({ id });
  if (!post) notFound();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta">Edit Activities</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta">
          Edit activity content
        </p>
      </div>
      <ActivityForm
        initial={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          coverImage: post.coverImage,
          contentMarkdown: post.contentHtml,
          date: post.date,
        }}
      />
    </div>
  );
}

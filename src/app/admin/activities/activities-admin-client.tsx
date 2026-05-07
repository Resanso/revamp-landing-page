"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import type { ActivityMeta } from "@/lib/activity-types";

type Props = { posts: ActivityMeta[] };

export default function ActivitiesAdminClient({ posts }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation(
    trpc.activities.delete.mutationOptions({
      onSuccess: () => router.refresh(),
    }),
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus "${title}"?`)) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync({ id });
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <p className="text-sm text-black/50">Belum ada aktivitas. Buat yang pertama!</p>
    );
  }

  return (
    <div className="overflow-hidden border border-black/10 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-black/10 bg-[#f9f9f9]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-black/70">Judul</th>
            <th className="px-4 py-3 text-left font-semibold text-black/70">Kategori</th>
            <th className="px-4 py-3 text-left font-semibold text-black/70">Tanggal</th>
            <th className="px-4 py-3 text-right font-semibold text-black/70">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-[#fafafa]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">
                <Link href={`/activities/${post.slug}`} target="_blank" className="hover:underline">
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-black/60">{post.category}</td>
              <td className="px-4 py-3 text-black/60">
                {new Date(post.date).toLocaleDateString("id-ID")}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/activities/${post.id}`}
                  className="mr-3 text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id, post.title)}
                  disabled={deletingId === post.id}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  {deletingId === post.id ? "..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

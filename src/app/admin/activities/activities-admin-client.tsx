"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Edit2, Trash2, Search } from "lucide-react";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";
import type { ActivityMeta, ActivityCategory } from "@/lib/activity-types";
import { ACTIVITY_CATEGORIES } from "@/lib/activity-types";

type Props = { posts: ActivityMeta[] };

type FilterTab = "All" | ActivityCategory;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "/");
}

export default function ActivitiesAdminClient({ posts }: Props) {
  const router = useRouter();
  const trpc = useTRPC();

  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ActivityMeta | null>(null);

  const deleteMutation = useMutation(
    trpc.activities.delete.mutationOptions({ onSuccess: () => router.refresh() }),
  );

  const filtered = posts.filter((p) => {
    const matchTab = activeTab === "All" || p.category === activeTab;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs: FilterTab[] = ["All", ...ACTIVITY_CATEGORIES];

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] px-8 py-8 flex flex-col gap-6">
      {/* Content type tabs */}
      <div className="flex flex-col gap-2 border-b border-[#D9D9D9] pb-6">
        <p className="text-[#6A6A6A] text-base font-medium font-jakarta">Content</p>
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/admin/activities/new"
            className="px-10 py-3.5 bg-white rounded-lg border border-dashed border-[#FFC917] flex justify-center items-center hover:bg-yellow-50 transition-colors"
          >
            <span className="text-[#FFC917] text-base font-medium font-jakarta">New Content</span>
          </Link>

          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3.5 rounded-lg border border-[#D9D9D9] flex justify-center items-center transition-colors ${
                tab === activeTab ? "bg-[#FFC917]" : "bg-transparent hover:bg-black/5"
              }`}
            >
              <span className="text-black text-base font-medium font-jakarta">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex items-center justify-between gap-4">
        <div className="border border-[#D9D9D9] rounded-lg flex items-center gap-3 px-6 py-3.5 w-[327px]">
          <Search className="w-5 h-5 text-[#A9A9A9] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or NIM..."
            className="bg-transparent text-base font-medium font-jakarta text-black outline-none placeholder:text-[#A9A9A9] w-full"
          />
        </div>
        <Link
          href="/admin/activities/new"
          className="bg-[#FFC917] px-10 py-3.5 rounded-lg text-black text-base font-medium font-jakarta hover:bg-[#ffb901] transition-colors whitespace-nowrap"
        >
          Add Activities
        </Link>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-black/50 font-jakarta py-8 text-center">
          Belum ada aktivitas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg border border-[#D9D9D9] flex flex-col overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-[200px] bg-gray-100 flex-shrink-0">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-black/30 font-jakarta">
                    No Image
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    href={`/admin/activities/${post.id}`}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#A7A7A7]" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(post)}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#F75F5F]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3">
                <span className="text-[#FFC917] text-sm font-bold font-jakarta uppercase tracking-wide">
                  {post.category} • {formatDate(post.date)}
                </span>
                <span className="text-black text-xl font-semibold leading-tight font-jakarta line-clamp-2">
                  {post.title}
                </span>
                <span className="text-black text-sm font-light font-jakarta line-clamp-3">
                  {post.excerpt}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Aktivitas"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ id: deleteTarget.id });
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}

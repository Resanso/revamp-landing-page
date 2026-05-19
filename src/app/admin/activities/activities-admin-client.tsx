"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2, Search } from "lucide-react";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";
import ActivityFormFields from "./activity-form";
import type { ActivityMeta } from "@/lib/activity-types";

type Props = { posts: ActivityMeta[] };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ActivitiesAdminClient({ posts }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewContentModal, setShowNewContentModal] = useState(false);
  const [newContentName, setNewContentName] = useState("");
  const [newContentError, setNewContentError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActivityMeta | null>(null);

  const { data: categoriesData } = useQuery(
    trpc.contentCategories.list.queryOptions(),
  );
  const categories = categoriesData ?? [];
  const tabs = ["All", ...categories.map((c) => c.name)];

  const { data: editPost, isLoading: editLoading } = useQuery(
    trpc.activities.getById.queryOptions(
      { id: editId! },
      { enabled: !!editId },
    ),
  );

  const createCategoryMutation = useMutation(
    trpc.contentCategories.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.contentCategories.list.queryFilter(),
        );
        setShowNewContentModal(false);
        setNewContentName("");
        setNewContentError(null);
      },
      onError: () =>
        setNewContentError("Nama kategori sudah ada atau terjadi kesalahan."),
    }),
  );

  const createMutation = useMutation(
    trpc.activities.create.mutationOptions({
      onSuccess: () => {
        setShowAddModal(false);
        router.refresh();
      },
    }),
  );
  const updateMutation = useMutation(
    trpc.activities.update.mutationOptions({
      onSuccess: () => {
        setEditId(null);
        router.refresh();
      },
    }),
  );
  const deleteMutation = useMutation(
    trpc.activities.delete.mutationOptions({
      onSuccess: () => router.refresh(),
    }),
  );

  const filtered = posts.filter((p) => {
    const matchTab = activeTab === "All" || p.category === activeTab;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] px-8 py-8 flex flex-col gap-6">
      {/* Content type tabs */}
      <div className="flex flex-col gap-2 border-b border-[#D9D9D9] pb-6">
        <p className="text-[#6A6A6A] text-base font-medium font-jakarta">
          Content
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setShowNewContentModal(true)}
            className="px-10 py-3.5 bg-white rounded-lg border border-dashed border-[#FFC917] flex justify-center items-center hover:bg-yellow-50 transition-colors"
          >
            <span className="text-[#FFC917] text-base font-medium font-jakarta">
              New Content
            </span>
          </button>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3.5 rounded-lg border border-[#D9D9D9] flex justify-center items-center transition-colors ${
                tab === activeTab
                  ? "bg-[#FFC917]"
                  : "bg-transparent hover:bg-black/5"
              }`}
            >
              <span className="text-black text-base font-medium font-jakarta">
                {tab}
              </span>
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
            placeholder="Search activities..."
            className="bg-transparent text-base font-medium font-jakarta text-black outline-none placeholder:text-[#A9A9A9] w-full"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-[#FFC917] px-10 py-3.5 rounded-lg text-black text-base font-medium font-jakarta hover:bg-[#ffb901] transition-colors whitespace-nowrap"
        >
          Add Activities
        </button>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditId(post.id)}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#A7A7A7]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(post)}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#F75F5F]" />
                  </button>
                </div>
              </div>
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

      {/* New Content Modal */}
      <AdminModal
        open={showNewContentModal}
        onOpenChange={(open) => {
          setShowNewContentModal(open);
          if (!open) {
            setNewContentName("");
            setNewContentError(null);
          }
        }}
        title="Add New Content"
        maxWidth="max-w-[480px]"
      >
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setNewContentError(null);
            createCategoryMutation.mutate({ name: newContentName.trim() });
          }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-black text-sm font-normal font-jakarta">
              Category Name
            </label>
            <input
              type="text"
              required
              value={newContentName}
              onChange={(e) => setNewContentName(e.target.value)}
              placeholder="e.g. Event"
              className="w-full border border-[#D9D9D9] rounded-[4px] px-4 py-[14px] text-base font-medium font-jakarta text-[#050816] placeholder:text-[#897b7a] outline-none focus:border-[#FFC917]"
            />
          </div>
          {newContentError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-jakarta text-red-600">
              {newContentError}
            </p>
          )}
          <button
            type="submit"
            disabled={createCategoryMutation.isPending}
            className="w-full bg-[#FFC917] hover:bg-[#ffb901] py-5 rounded-[8px] text-base font-bold font-jakarta text-black transition-colors disabled:opacity-60"
          >
            {createCategoryMutation.isPending ? "Menyimpan..." : "Save"}
          </button>
        </form>
      </AdminModal>

      {/* Add Modal */}
      <AdminModal
        open={showAddModal}
        onOpenChange={(open) => setShowAddModal(open)}
        title="Add new Activities"
        maxWidth="max-w-[580px]"
      >
        <ActivityFormFields
          categories={categories.map((c) => c.name)}
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data);
          }}
          isPending={createMutation.isPending}
        />
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        open={!!editId}
        onOpenChange={(open) => !open && setEditId(null)}
        title="Edit Activities"
        maxWidth="max-w-[580px]"
      >
        {editLoading || !editPost ? (
          <div className="py-12 flex items-center justify-center">
            <span className="text-sm text-black/50 font-jakarta">
              Loading...
            </span>
          </div>
        ) : (
          <ActivityFormFields
            categories={categories.map((c) => c.name)}
            initial={{
              title: editPost.title,
              excerpt: editPost.excerpt,
              category: editPost.category,
              coverImage: editPost.coverImage,
              contentMarkdown: editPost.contentHtml,
              date: editPost.date,
            }}
            onSubmit={async (data) => {
              await updateMutation.mutateAsync({ id: editPost.id, ...data });
            }}
            isPending={updateMutation.isPending}
          />
        )}
      </AdminModal>

      {/* Delete Confirm */}
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

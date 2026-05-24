"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Search, Edit2, Trash2, ImagePlus } from "lucide-react";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import GalleryImageForm from "./gallery-image-form";

type GalleryImage = {
  id: number;
  year: string;
  fileName: string;
  imageUrl: string;
  description: string | null;
};

type Props = {
  initialYears: string[];
  initialImages: GalleryImage[];
  initialYear: string;
};

export default function GalleryAdminClient({
  initialYears,
  initialImages,
  initialYear,
}: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const [activeYear, setActiveYear] = useState(initialYear);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GalleryImage | null>(null);

  const imagesQuery = useQuery(
    trpc.gallery.getAll.queryOptions({ year: activeYear, limit: 100 }),
  );
  const images =
    imagesQuery.data?.images ??
    (activeYear === initialYear ? initialImages : []);

  const yearsQuery = useQuery(trpc.gallery.getYears.queryOptions());
  const years = yearsQuery.data ?? initialYears;

  const deleteMutation = useMutation(
    trpc.gallery.delete.mutationOptions({
      onSuccess: () => {
        imagesQuery.refetch();
        yearsQuery.refetch();
        router.refresh();
      },
    }),
  );

  const filtered = images.filter((img) => {
    const matchSearch =
      !search ||
      img.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (img.description &&
        img.description.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(img: GalleryImage) {
    setEditTarget(img);
    setModalOpen(true);
  }

  function handleModalSuccess() {
    setModalOpen(false);
    setEditTarget(null);
    imagesQuery.refetch();
    yearsQuery.refetch();
    router.refresh();
  }

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] px-8 py-8 flex flex-col gap-6">
      {/* Year tabs */}
      <div className="flex flex-col gap-2 border-b border-[#D9D9D9] pb-6">
        <p className="text-[#6A6A6A] text-base font-medium font-jakarta">
          Year
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setActiveYear(y)}
              className={`px-10 py-3.5 rounded-lg border flex justify-center items-center transition-colors ${
                y === activeYear
                  ? "bg-[#FFC917] border-[#FFC917]"
                  : "bg-transparent border-[#D9D9D9] hover:bg-black/5"
              }`}
            >
              <span className="text-black text-base font-medium font-jakarta">
                {y}
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
            placeholder="Search photos..."
            className="bg-transparent text-base font-medium font-jakarta text-black outline-none placeholder:text-[#A9A9A9] w-full"
          />
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FFC917] px-10 py-3.5 rounded-lg text-black text-base font-medium font-jakarta hover:bg-[#ffb901] transition-colors whitespace-nowrap"
        >
          <ImagePlus className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      {/* Cards grid */}
      {imagesQuery.isLoading ? (
        <p className="text-sm text-black/50 font-jakarta py-8 text-center">
          Memuat data...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-black/50 font-jakarta py-8 text-center">
          Belum ada foto untuk tahun ini atau tidak ditemukan dalam pencarian.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-lg border border-[#D9D9D9] flex flex-col overflow-hidden"
            >
              <div className="relative aspect-video bg-gray-100 flex-shrink-0">
                <Image
                  src={img.imageUrl}
                  alt={img.description ?? img.fileName}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(img)}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#A7A7A7]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(img)}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#F75F5F]" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <span className="text-black text-lg font-semibold leading-tight font-jakarta line-clamp-1">
                  {img.fileName}
                </span>
                {img.description && (
                  <span className="text-black text-sm font-light font-jakarta line-clamp-2">
                    {img.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditTarget(null);
        }}
        title={editTarget ? "Edit Foto" : "Tambah Foto"}
        description={
          editTarget
            ? `Edit data untuk ${editTarget.fileName}`
            : "Upload foto baru ke galeri"
        }
        maxWidth="max-w-2xl"
      >
        <GalleryImageForm
          key={editTarget?.id ?? "new"}
          initial={editTarget ?? undefined}
          onSuccess={handleModalSuccess}
        />
      </AdminModal>

      {/* Delete Confirm */}
      <AdminConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Foto"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.fileName}"? Tindakan ini tidak dapat dibatalkan.`}
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

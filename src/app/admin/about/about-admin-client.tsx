"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Trash2, ImagePlus } from "lucide-react";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AboutSlide = {
  id: number;
  imageUrl: string;
};

type Props = {
  initialSlides: AboutSlide[];
};

export default function AboutAdminClient({ initialSlides }: Props) {
  const router = useRouter();
  const trpc = useTRPC();

  const [deleteTarget, setDeleteTarget] = useState<AboutSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const slidesQuery = useQuery(trpc.about.getAll.queryOptions());
  const slides = slidesQuery.data ?? initialSlides;

  const createMutation = useMutation(
    trpc.about.create.mutationOptions({
      onSuccess: () => {
        slidesQuery.refetch();
        router.refresh();
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.about.delete.mutationOptions({
      onSuccess: () => {
        slidesQuery.refetch();
        router.refresh();
      },
    }),
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error: err } = await supabase.storage
        .from("about-slides")
        .upload(path, file, { upsert: true });

      if (err || !data) throw err;

      const { data: urlData } = supabase.storage
        .from("about-slides")
        .getPublicUrl(data.path);

      await createMutation.mutateAsync({ imageUrl: urlData.publicUrl });
    } catch (err) {
      if (err instanceof Error) {
        setUploadError(`Upload failed: ${err.message}`);
      } else {
        setUploadError("Failed to upload image. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] px-8 py-8 flex flex-col gap-6">
      {/* Header + Add button */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-[#6A6A6A] text-base font-medium font-jakarta">
          {slides.length} slide{slides.length !== 1 ? "s" : ""} in carousel
        </p>
        <label className={`flex items-center gap-2 bg-[#FFC917] px-10 py-3.5 rounded-lg text-black text-base font-medium font-jakarta hover:bg-[#ffb901] transition-colors whitespace-nowrap cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
          <ImagePlus className="w-4 h-4" />
          {uploading ? "Uploading..." : "Add Slide"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {uploadError && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{uploadError}</p>
      )}

      {/* Slides grid */}
      {slidesQuery.isLoading ? (
        <p className="text-sm text-black/50 font-jakarta py-8 text-center">
          Loading data...
        </p>
      ) : slides.length === 0 ? (
        <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-[#D9D9D9] rounded-lg py-16 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-16 h-16 bg-[rgba(255,201,23,0.15)] rounded-full flex items-center justify-center">
            <Camera className="w-7 h-7 text-[#FFC917]" />
          </div>
          <div className="text-center">
            <p className="text-black font-medium text-sm font-jakarta">No slides yet — click to add your first photo</p>
            <p className="text-[#A9A9A9] text-xs font-jakarta mt-1">Supports JPG, PNG, and WebP</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-lg border border-[#D9D9D9] overflow-hidden relative group"
            >
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={slide.imageUrl}
                  alt="About slide"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <button
                  type="button"
                  onClick={() => setDeleteTarget(slide)}
                  className="absolute top-3 right-3 p-2 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-[#F75F5F]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <AdminConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Slide"
        description="Are you sure you want to delete this slide? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
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

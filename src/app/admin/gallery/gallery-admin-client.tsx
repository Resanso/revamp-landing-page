"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <div>
      {/* Year Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setActiveYear(y)}
            className={`border px-4 py-2 text-sm font-semibold transition ${
              y === activeYear
                ? "border-[#ffc91f] bg-[#ffc91f] text-black"
                : "border-black/15 bg-white text-black/70 hover:text-black"
            }`}
          >
            {y}
          </button>
        ))}
        <Link
          href="/admin/gallery/new"
          className="border border-dashed border-black/30 bg-white px-4 py-2 text-sm text-black/50 transition hover:border-black/50 hover:text-black"
        >
          + Tambah Foto
        </Link>
      </div>

      {/* Image Grid */}
      {imagesQuery.isLoading ? (
        <p className="text-sm text-black/50">Memuat data...</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-black/50">
          Belum ada foto untuk tahun ini.{" "}
          <Link
            href="/admin/gallery/new"
            className="text-[#ffc91f] hover:underline"
          >
            Tambah sekarang
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="border border-black/10 bg-white transition hover:border-black/20"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#f5f5f5]">
                <Image
                  src={img.imageUrl}
                  alt={img.description ?? img.fileName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="truncate text-xs font-medium text-black/70">
                  {img.fileName}
                </p>
                {img.description && (
                  <p className="mt-0.5 truncate text-xs text-black/40">
                    {img.description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-2 flex gap-3 text-sm">
                  <Link
                    href={`/admin/gallery/${img.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus foto "${img.fileName}"?`))
                        deleteMutation.mutate({ id: img.id });
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

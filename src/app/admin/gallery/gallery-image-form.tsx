"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { parseTRPCClientErrorMessage } from "@/lib/utils/error";

type InitialData = {
  id: number;
  year: string;
  fileName: string;
  imageUrl: string;
  description: string | null;
};

type Props = {
  initial?: InitialData;
};

export default function GalleryImageForm({ initial }: Props) {
  const router = useRouter();
  const trpc = useTRPC();

  const [form, setForm] = useState({
    year: initial?.year ?? "",
    fileName: initial?.fileName ?? "",
    imageUrl: initial?.imageUrl ?? "",
    description: initial?.description ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation(
    trpc.gallery.create.mutationOptions({
      onSuccess: () => router.push("/admin/gallery"),
    }),
  );

  const updateMutation = useMutation(
    trpc.gallery.update.mutationOptions({
      onSuccess: () => router.push("/admin/gallery"),
    }),
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error: uploadError } = await supabase.storage
        .from("executives")
        .upload(path, file, { upsert: true });

      if (uploadError || !data) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("executives")
        .getPublicUrl(data.path);
      setForm((prev) => ({
        ...prev,
        imageUrl: urlData.publicUrl,
        fileName: file.name,
      }));
    } catch (err) {
      if (err instanceof Error) {
        setError(`Gagal upload: ${err.message}`);
      } else {
        setError("Gagal upload gambar. Coba lagi.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!form.imageUrl) {
      setError("Foto wajib diupload.");
      return;
    }

    const payload = {
      year: form.year,
      fileName: form.fileName,
      imageUrl: form.imageUrl,
      description: form.description || null,
    };
    try {
      if (initial) {
        await updateMutation.mutateAsync({ id: initial.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (err: unknown) {
      const parsedErrors = parseTRPCClientErrorMessage(err);
      if (parsedErrors) {
        setFieldErrors(parsedErrors);
      } else {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan. Coba lagi.");
      }
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Preview gambar */}
      <div>
        <label className="mb-1 block text-sm font-medium">Foto Galeri</label>

        <div className="mb-3 relative aspect-video w-full max-w-sm overflow-hidden border border-black/10 bg-[#f5f5f5]">
          {form.imageUrl ? (
            <Image
              src={form.imageUrl}
              alt="Preview foto galeri"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-black/30">
              Belum ada foto
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm"
        />
        {uploading && (
          <p className="mt-1 text-xs text-black/50">Mengupload...</p>
        )}
        {form.imageUrl && !uploading && (
          <p className="mt-1 truncate text-xs text-black/40">{form.imageUrl}</p>
        )}
      </div>

      {/* Tahun */}
      <div>
        <label className="mb-1 block text-sm font-medium">Tahun *</label>
        <input
          type="text"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          placeholder="2025"
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.year && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.year}</p>
        )}
      </div>

      {/* Nama File */}
      <div>
        <label className="mb-1 block text-sm font-medium">Nama File *</label>
        <input
          type="text"
          value={form.fileName}
          onChange={(e) => setForm({ ...form, fileName: e.target.value })}
          placeholder="foto-kegiatan-2025.jpg"
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.fileName && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.fileName}</p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Deskripsi <span className="text-black/40">(opsional)</span>
        </label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Keterangan foto..."
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || uploading}
          className="bg-[#ffc91f] px-6 py-2 text-sm font-semibold text-black transition hover:bg-[#ffb901] disabled:opacity-60"
        >
          {isPending
            ? "Menyimpan..."
            : initial
              ? "Simpan Perubahan"
              : "Tambah Foto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/gallery")}
          className="border border-black/20 px-6 py-2 text-sm font-medium transition hover:bg-black/5"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

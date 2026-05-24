"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Camera } from "lucide-react";
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
  onSuccess?: () => void;
};

export default function GalleryImageForm({ initial, onSuccess }: Props) {
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
      onSuccess: () => {
        if (onSuccess) onSuccess();
        else router.push("/admin/gallery");
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.gallery.update.mutationOptions({
      onSuccess: () => {
        if (onSuccess) onSuccess();
        else router.push("/admin/gallery");
      },
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
        <label className="mb-2 block text-sm font-medium">Foto Galeri *</label>

        <label className="cursor-pointer block w-full max-w-lg">
          {form.imageUrl ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#D9D9D9]">
              <Image src={form.imageUrl} alt="Preview foto galeri" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-jakarta font-medium">Change photo</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video border border-dashed border-[#D9D9D9] rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-[rgba(255,201,23,0.15)] rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#FFC917]" />
              </div>
              <div className="text-center px-4">
                <p className="text-black font-medium text-sm font-jakarta">Drag &amp; drop image here</p>
                <p className="text-[#A9A9A9] text-xs font-jakarta mt-1">Supported only JPG and PNG</p>
              </div>
            </div>
          )}
          <input type="file" accept="image/jpeg,image/png" onChange={handleImageUpload} className="hidden" />
        </label>
        {uploading && (
          <p className="mt-2 text-xs text-black/50 font-jakarta">Mengupload...</p>
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
          onClick={() => {
            if (onSuccess) onSuccess();
            else router.push("/admin/gallery");
          }}
          className="border border-black/20 px-6 py-2 text-sm font-medium transition hover:bg-black/5"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

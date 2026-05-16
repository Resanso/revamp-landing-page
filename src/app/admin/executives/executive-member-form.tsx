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
  name: string;
  nim: string;
  prodi: string;
  angkatan: string;
  position: string;
  linkedin: string | null;
  instagram: string | null;
  image: string | null;
};

type Props = {
  initial?: InitialData;
};

export default function ExecutiveMemberForm({ initial }: Props) {
  const router = useRouter();
  const trpc = useTRPC();

  const [form, setForm] = useState({
    year: initial?.year ?? "",
    name: initial?.name ?? "",
    nim: initial?.nim ?? "",
    prodi: initial?.prodi ?? "",
    angkatan: initial?.angkatan ?? "",
    position: initial?.position ?? "",
    linkedin: initial?.linkedin ?? "",
    instagram: initial?.instagram ?? "",
    image: initial?.image ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation(
    trpc.executives.create.mutationOptions({
      onSuccess: () => router.push("/admin/executives"),
    }),
  );

  const updateMutation = useMutation(
    trpc.executives.update.mutationOptions({
      onSuccess: () => router.push("/admin/executives"),
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
      setForm((prev) => ({ ...prev, image: urlData.publicUrl }));
    } catch {
      setError("Gagal upload gambar. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!form.image) {
      setError("Foto wajib diupload.");
      return;
    }

    const payload = {
      ...form,
      linkedin: form.linkedin || null,
      instagram: form.instagram || null,
      image: form.image || null,
    };
    try {
      if (initial) {
        await updateMutation.mutateAsync({ id: initial.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (err: any) {
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

      {/* Foto Preview */}
      <div>
        <label className="mb-1 block text-sm font-medium">Foto Member</label>

        {/* Preview gambar */}
        <div className="mb-3 relative aspect-square w-40 overflow-hidden border border-black/10 bg-[#f5f5f5]">
          {form.image ? (
            <Image
              src={form.image}
              alt="Preview foto member"
              fill
              className="object-cover object-center"
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
        {form.image && !uploading && (
          <p className="mt-1 truncate text-xs text-black/40">{form.image}</p>
        )}
      </div>

      {/* Tahun & Angkatan */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tahun *</label>
          <input
            type="text"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            placeholder="2025"
            className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
          />
          {fieldErrors.year && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.year}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Angkatan *</label>
          <input
            type="text"
            required
            value={form.angkatan}
            onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
            placeholder="2022"
            className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
          />
          {fieldErrors.angkatan && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.angkatan}</p>
          )}
        </div>
      </div>

      {/* Nama */}
      <div>
        <label className="mb-1 block text-sm font-medium">Nama Lengkap *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Muhammad Haulul Azkiyaa"
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
        )}
      </div>

      {/* NIM */}
      <div>
        <label className="mb-1 block text-sm font-medium">NIM *</label>
        <input
          type="text"
          required
          value={form.nim}
          onChange={(e) => setForm({ ...form, nim: e.target.value })}
          placeholder="1302223007"
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.nim && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.nim}</p>
        )}
      </div>

      {/* Program Studi */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Program Studi *
        </label>
        <input
          type="text"
          required
          value={form.prodi}
          onChange={(e) => setForm({ ...form, prodi: e.target.value })}
          placeholder="S1 Rekayasa Perangkat Lunak"
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.prodi && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.prodi}</p>
        )}
      </div>

      {/* Jabatan */}
      <div>
        <label className="mb-1 block text-sm font-medium">Jabatan *</label>
        <input
          type="text"
          required
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          placeholder="Ketua"
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.position && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.position}</p>
        )}
      </div>

      {/* LinkedIn */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          LinkedIn <span className="text-black/40">(opsional)</span>
        </label>
        <input
          type="text"
          value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          placeholder="https://linkedin.com/in/..."
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.linkedin && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.linkedin}</p>
        )}
      </div>

      {/* Instagram */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Instagram <span className="text-black/40">(opsional)</span>
        </label>
        <input
          type="text"
          value={form.instagram}
          onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          placeholder="https://instagram.com/..."
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
        {fieldErrors.instagram && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.instagram}</p>
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
              : "Tambah Member"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/executives")}
          className="border border-black/20 px-6 py-2 text-sm font-medium transition hover:bg-black/5"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

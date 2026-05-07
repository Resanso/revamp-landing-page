"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { ACTIVITY_CATEGORIES } from "@/lib/activity-types";
import { createClient } from "@/lib/supabase/client";
import type { ActivityCategory } from "@/lib/activity-types";

type ActivityFormProps = {
  initial?: {
    id: string;
    title: string;
    excerpt: string;
    category: ActivityCategory;
    coverImage: string;
    contentMarkdown: string;
  };
};

export default function ActivityForm({ initial }: ActivityFormProps) {
  const router = useRouter();
  const trpc = useTRPC();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState<ActivityCategory>(
    initial?.category ?? "Event",
  );
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [contentMarkdown, setContentMarkdown] = useState(
    initial?.contentMarkdown ?? "",
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation(
    trpc.activities.create.mutationOptions({
      onSuccess: () => router.push("/admin/activities"),
    }),
  );

  const updateMutation = useMutation(
    trpc.activities.update.mutationOptions({
      onSuccess: () => router.push("/admin/activities"),
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
        .from("activity-covers")
        .upload(path, file, { upsert: true });

      if (uploadError || !data) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("activity-covers")
        .getPublicUrl(data.path);

      setCoverImage(urlData.publicUrl);
    } catch {
      setError("Gagal upload gambar. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = { title, excerpt, category, coverImage, contentMarkdown };

    try {
      if (initial) {
        await updateMutation.mutateAsync({ id: initial.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
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

      <div>
        <label className="mb-1 block text-sm font-medium">Judul</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Deskripsi Singkat</label>
        <textarea
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ActivityCategory)}
          className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]"
        >
          {ACTIVITY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm"
        />
        {uploading && <p className="mt-1 text-xs text-black/50">Mengupload...</p>}
        {coverImage && (
          <p className="mt-1 truncate text-xs text-black/50">{coverImage}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Konten (Markdown)
        </label>
        <textarea
          rows={12}
          value={contentMarkdown}
          onChange={(e) => setContentMarkdown(e.target.value)}
          className="w-full border border-black/20 px-3 py-2 font-mono text-sm outline-none focus:border-[#ffc91f]"
          placeholder="Tulis konten dalam format Markdown..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending || uploading}
          className="bg-[#ffc91f] px-6 py-2 text-sm font-semibold text-black transition hover:bg-[#ffb901] disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Buat Aktivitas"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-black/20 px-6 py-2 text-sm font-medium transition hover:bg-black/5"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

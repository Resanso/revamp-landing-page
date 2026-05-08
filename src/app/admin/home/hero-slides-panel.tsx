"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Slide = { id: string; src: string; alt: string; order: number };

export default function HeroSlidesPanel({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const trpc = useTRPC();

  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);

  const upsertMutation = useMutation(
    trpc.home.upsertHeroSlide.mutationOptions({ onSuccess: () => { setSrc(""); setAlt(""); router.refresh(); } }),
  );
  const deleteMutation = useMutation(
    trpc.home.deleteHeroSlide.mutationOptions({ onSuccess: () => router.refresh() }),
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage.from("hero-slides").upload(path, file, { upsert: true });
      if (error || !data) throw error;
      const { data: urlData } = supabase.storage.from("hero-slides").getPublicUrl(data.path);
      setSrc(urlData.publicUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsertMutation.mutateAsync({ src, alt, order: slides.length });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-[#1a1a1a]">Hero Slides</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {slides.map((slide) => (
          <div key={slide.id} className="border border-black/10 bg-white">
            <div className="relative aspect-video">
              <Image src={slide.src} alt={slide.alt} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-2">
              <p className="text-xs text-black/50">Order: {slide.order}</p>
              <button
                type="button"
                onClick={() => { if (confirm("Hapus slide ini?")) deleteMutation.mutate({ id: slide.id }); }}
                className="text-xs text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 border border-dashed border-black/20 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium">Upload Foto Baru</label>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-black/50">Uploading...</p>}
          {src && <p className="mt-1 truncate text-xs text-black/40">{src}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Alt Text</label>
          <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} required className="border border-black/20 px-2 py-1.5 text-sm outline-none" />
        </div>
        <button type="submit" disabled={!src || upsertMutation.isPending || uploading} className="bg-[#ffc91f] px-4 py-1.5 text-sm font-semibold text-black disabled:opacity-60">
          Tambah Slide
        </button>
      </form>
    </div>
  );
}

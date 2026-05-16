"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";

type Slide = { id: string; src: string; alt: string; order: number };

export default function HeroSlidesPanel({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const trpc = useTRPC();

  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Slide | null>(null);

  const upsertMutation = useMutation(
    trpc.home.upsertHeroSlide.mutationOptions({ onSuccess: () => router.refresh() }),
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
      await upsertMutation.mutateAsync({ src: urlData.publicUrl, alt: file.name, order: slides.length });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] p-8 flex flex-col gap-6">
      <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">Background Hero</h2>

      <div className="flex flex-row items-center gap-4 overflow-x-auto pb-4">
        <label className="flex-shrink-0 cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-4 px-[108px] py-10 rounded-lg border border-[#FFC917] border-dashed">
            <div className="w-[84px] h-[84px] bg-[rgba(255,201,23,0.15)] rounded-full flex items-center justify-center relative overflow-hidden">
                   <Plus className="w-8 h-8 text-[#FFC917]" />
            </div>
            <span className="text-[#231918] text-base font-medium font-jakarta text-center">Add Photo</span>
          </div>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        
        <div className="flex flex-row gap-4">
          {slides.map((slide) => (
            <div key={slide.id} className="relative w-[300px] h-[200px] rounded-lg overflow-hidden flex-shrink-0 border border-black/10">
              <Image src={slide.src} alt={slide.alt} fill className="object-cover" />
              <button
                type="button"
                onClick={() => setDeleteTarget(slide)}
                className="absolute top-3 right-3 p-2 bg-[#F9FAFB] hover:bg-gray-100 transition-colors rounded flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 text-[#F75F5F]" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {uploading && <p className="text-xs text-black/50 font-jakarta">Uploading...</p>}

      <AdminConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Slide"
        description="Apakah Anda yakin ingin menghapus slide ini? Tindakan ini tidak dapat dibatalkan."
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

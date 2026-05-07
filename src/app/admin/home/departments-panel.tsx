"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Dept = { id: string; title: string; description: string; img: string; order: number };

export default function DepartmentsPanel({ departments }: { departments: Dept[] }) {
  const router = useRouter();
  const trpc = useTRPC();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editImg, setEditImg] = useState("");
  const [uploading, setUploading] = useState(false);

  const upsertMutation = useMutation(
    trpc.home.upsertDepartment.mutationOptions({ onSuccess: () => { setEditingId(null); router.refresh(); } }),
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage.from("department-images").upload(path, file, { upsert: true });
      if (error || !data) throw error;
      const { data: urlData } = supabase.storage.from("department-images").getPublicUrl(data.path);
      setEditImg(urlData.publicUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-[#1a1a1a]">Departments</h2>
      <div className="space-y-2">
        {departments.map((dept) => (
          <div key={dept.id} className="flex items-center gap-4 border border-black/10 bg-white p-3">
            <div className="relative h-14 w-20 shrink-0 bg-[#f5f5f5]">
              <Image src={dept.img} alt={dept.title} fill className="object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#1a1a1a]">{dept.title}</p>
            </div>
            {editingId === dept.id ? (
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
                {uploading && <span className="text-xs text-black/50">Uploading...</span>}
                <button
                  type="button"
                  disabled={!editImg || upsertMutation.isPending}
                  onClick={() => upsertMutation.mutate({ id: dept.id, title: dept.title, description: dept.description, img: editImg || dept.img, order: dept.order })}
                  className="bg-[#ffc91f] px-3 py-1 text-xs font-semibold text-black disabled:opacity-60"
                >
                  Simpan
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="text-xs text-black/50">Batal</button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setEditingId(dept.id); setEditImg(""); }}
                className="text-sm text-blue-600 hover:underline"
              >
                Ganti Foto
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

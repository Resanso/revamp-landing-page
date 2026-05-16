"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { Edit2 } from "lucide-react";
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
      return urlData.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] p-8 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">Departments</h2>
        <button className="px-8 py-4 bg-[#FFC917] bg-opacity-80 rounded flex justify-center items-center">
          <span className="text-black text-base font-bold font-jakarta break-words">Edit Background</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg border border-[#D9D9D9] flex flex-col overflow-hidden">
            <div className="relative h-[226px] bg-gray-100 flex-shrink-0">
              {dept.img ? (
                <Image src={dept.img} alt={dept.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-black/50">No Image</div>
              )}
              
              {/* Overlay edit image button */}
              <label className="absolute top-4 right-4 p-2 bg-[#F9FAFB] rounded flex flex-col items-start gap-2.5 cursor-pointer z-10">
                <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                   <Edit2 className="w-[18px] h-[18px] text-[#A7A7A7]" />
                </div>
                <input type="file" accept="image/*" onChange={async (e) => { 
                  setEditingId(dept.id); 
                  const url = await handleUpload(e); 
                  if (url) {
                    upsertMutation.mutate({ id: dept.id, title: dept.title, description: dept.description, img: url, order: dept.order });
                  }
                }} className="hidden" />
              </label>
            </div>
            
            <div className="p-4 flex flex-col gap-2">
              <input
                type="text"
                value={dept.title}
                onChange={(e) => upsertMutation.mutate({ id: dept.id, title: e.target.value, description: dept.description, img: dept.img, order: dept.order })}
                className="w-full bg-transparent text-[#1A1C1C] text-base font-semibold font-jakarta break-words outline-none"
                placeholder="Department Title"
              />
              <textarea
                value={dept.description}
                onChange={(e) => upsertMutation.mutate({ id: dept.id, title: dept.title, description: e.target.value, img: dept.img, order: dept.order })}
                className="w-full bg-transparent text-black text-sm font-light font-jakarta break-words outline-none resize-none"
                rows={3}
                placeholder="Department Description"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Edit2, RefreshCw, Trash2, Building2, Users, Rocket, Trophy } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Stat = { id: string; label: string; value: string; accent: string; order: number };

const STAT_ICONS: { keywords: string[]; Icon: React.ComponentType<{ className?: string }> }[] = [
  { keywords: ["department", "departemen"], Icon: Building2 },
  { keywords: ["executive", "eksekutif", "member", "anggota"], Icon: Users },
  { keywords: ["program", "flagship", "rocket"], Icon: Rocket },
  { keywords: ["achievement", "pencapaian", "medal", "trophy"], Icon: Trophy },
];

function getStatIcon(label: string) {
  const lower = label.toLowerCase();
  for (const { keywords, Icon } of STAT_ICONS) {
    if (keywords.some((k) => lower.includes(k))) return Icon;
  }
  return Trophy;
}

export default function StatsPanel({ stats }: { stats: Stat[] }) {
  const router = useRouter();
  const trpc = useTRPC();
  const [featuredImg, setFeaturedImg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const updateMutation = useMutation(
    trpc.home.updateSuccessStat.mutationOptions({ onSuccess: () => router.refresh() }),
  );

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `featured-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage.from("hero-slides").upload(path, file, { upsert: true });
      if (error || !data) throw error;
      const { data: urlData } = supabase.storage.from("hero-slides").getPublicUrl(data.path);
      setFeaturedImg(urlData.publicUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] p-8 flex flex-col gap-6">
      <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">Success Story Stats</h2>

      <div className="flex flex-col xl:flex-row items-start gap-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              stat={stat}
              onSave={(data) => updateMutation.mutate({ id: stat.id, ...data })}
              saving={updateMutation.isPending}
            />
          ))}
        </div>

        <div className="xl:w-[450px] w-full h-[248px] rounded-lg border border-[#D9D9D9] relative overflow-hidden bg-[#f9fafb] flex-shrink-0">
          {featuredImg ? (
            <Image src={featuredImg} alt="Featured stat" fill className="object-cover" />
          ) : (
            <label className="absolute inset-0 flex items-center justify-center cursor-pointer text-sm text-black/40 font-jakarta">
              {uploading ? "Uploading..." : "Click to add featured image"}
              <input type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" />
            </label>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <label className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
              <RefreshCw className="w-5 h-5 text-[#A7A7A7]" />
              <input type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setFeaturedImg(null)}
              className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-[#F75F5F]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  stat,
  onSave,
  saving,
}: {
  stat: Stat;
  onSave: (data: { label: string; value: string; accent: "black" | "primary" }) => void;
  saving: boolean;
}) {
  const [label, setLabel] = useState(stat.label);
  const [value, setValue] = useState(stat.value);
  const [accent] = useState<"black" | "primary">(stat.accent as "black" | "primary");
  const [dirty, setDirty] = useState(false);
  const Icon = getStatIcon(stat.label);

  return (
    <div className="p-4 rounded-lg border border-[#D9D9D9] flex flex-col gap-3">
      <div className="flex items-center gap-[14px]">
        <div className="p-3 bg-[rgba(255,201,23,0.15)] rounded-[32px] flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-[#FFC917]" />
        </div>

        <div className="flex flex-col flex-1 gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => { setLabel(e.target.value); setDirty(true); }}
            className="w-full bg-transparent text-[#6A6A6A] text-base font-medium font-jakarta outline-none"
            placeholder="Label"
          />

          <div className="p-2 rounded border border-[#D9D9D9] flex justify-between items-center bg-white">
            <input
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setDirty(true); }}
              className="w-full bg-transparent text-black text-2xl font-bold leading-[35px] font-jakarta outline-none"
            />
            <button
              type="button"
              onClick={() => { if (dirty) { onSave({ label, value, accent }); setDirty(false); } }}
              disabled={saving}
              className="w-11 h-11 p-2 bg-[#F9FAFB] rounded flex items-center justify-center flex-shrink-0 flex-shrink-0"
            >
              <Edit2 className="w-4 h-4 text-[#A7A7A7]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

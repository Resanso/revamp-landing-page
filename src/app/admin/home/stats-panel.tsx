"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

type Stat = { id: string; label: string; value: string; accent: string; order: number };

export default function StatsPanel({ stats }: { stats: Stat[] }) {
  const router = useRouter();
  const trpc = useTRPC();

  const updateMutation = useMutation(
    trpc.home.updateSuccessStat.mutationOptions({ onSuccess: () => router.refresh() }),
  );

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-[#1a1a1a]">Success Stats</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            onSave={(data) => updateMutation.mutate({ id: stat.id, ...data })}
            saving={updateMutation.isPending}
          />
        ))}
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
  const [accent, setAccent] = useState<"black" | "primary">(stat.accent as "black" | "primary");
  const [dirty, setDirty] = useState(false);

  return (
    <div className="border border-black/10 bg-white p-4 space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-black/60">Nilai</label>
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setDirty(true); }}
          className="w-full border border-black/20 px-2 py-1.5 text-2xl font-bold outline-none focus:border-[#ffc91f]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-black/60">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => { setLabel(e.target.value); setDirty(true); }}
          className="w-full border border-black/20 px-2 py-1.5 text-sm outline-none focus:border-[#ffc91f]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-black/60">Warna</label>
        <select
          value={accent}
          onChange={(e) => { setAccent(e.target.value as "black" | "primary"); setDirty(true); }}
          className="w-full border border-black/20 px-2 py-1.5 text-sm outline-none"
        >
          <option value="black">Hitam</option>
          <option value="primary">Kuning</option>
        </select>
      </div>
      {dirty && (
        <button
          type="button"
          onClick={() => { onSave({ label, value, accent }); setDirty(false); }}
          disabled={saving}
          className="w-full bg-[#ffc91f] py-1.5 text-sm font-semibold text-black disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      )}
    </div>
  );
}

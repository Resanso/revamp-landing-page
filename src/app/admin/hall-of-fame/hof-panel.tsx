"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Entry = {
  id: number;
  year: string;
  title: string;
  competition: string;
  image: string;
};

type Props = {
  years: string[];
  entriesByYear: Record<string, Entry[]>;
};

export default function HofPanel({ years, entriesByYear }: Props) {
  const router = useRouter();
  const trpc = useTRPC();

  const [activeYear, setActiveYear] = useState(years[0] ?? "");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);

  const [formYear, setFormYear] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCompetition, setFormCompetition] = useState("");
  const [formImage, setFormImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation(
    trpc.hallOfFame.create.mutationOptions({ onSuccess: () => { resetForm(); router.refresh(); } }),
  );
  const updateMutation = useMutation(
    trpc.hallOfFame.update.mutationOptions({ onSuccess: () => { resetForm(); router.refresh(); } }),
  );
  const deleteMutation = useMutation(
    trpc.hallOfFame.delete.mutationOptions({ onSuccess: () => router.refresh() }),
  );

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormYear(activeYear);
    setFormTitle("");
    setFormCompetition("");
    setFormImage("");
  };

  const openCreate = () => {
    setEditing(null);
    setFormYear(activeYear);
    setFormTitle("");
    setFormCompetition("");
    setFormImage("");
    setShowForm(true);
  };

  const openEdit = (entry: Entry) => {
    setEditing(entry);
    setFormYear(entry.year);
    setFormTitle(entry.title);
    setFormCompetition(entry.competition);
    setFormImage(entry.image);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage.from("hall-of-fame").upload(path, file, { upsert: true });
      if (error || !data) throw error;
      const { data: urlData } = supabase.storage.from("hall-of-fame").getPublicUrl(data.path);
      setFormImage(urlData.publicUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { year: formYear, title: formTitle, competition: formCompetition, image: formImage };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const currentEntries = entriesByYear[activeYear] ?? [];

  return (
    <div>
      {/* Year Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setActiveYear(y)}
            className={`border px-4 py-2 text-sm font-semibold transition ${
              y === activeYear ? "border-[#ffc91f] bg-[#ffc91f] text-black" : "border-black/15 bg-white text-black/70 hover:text-black"
            }`}
          >
            {y}
          </button>
        ))}
        <button
          type="button"
          onClick={openCreate}
          className="border border-dashed border-black/30 bg-white px-4 py-2 text-sm text-black/50 transition hover:border-black/50 hover:text-black"
        >
          + Tambah Entry
        </button>
      </div>

      {/* Entry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentEntries.map((entry) => (
          <div key={entry.id} className="border border-black/10 bg-white">
            <div className="relative aspect-video bg-[#f5f5f5]">
              <Image src={entry.image} alt={entry.title} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="font-semibold text-[#1a1a1a]">{entry.title}</p>
              <p className="text-sm text-black/60">{entry.competition}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <button type="button" onClick={() => openEdit(entry)} className="text-blue-600 hover:underline">Edit</button>
                <button
                  type="button"
                  onClick={() => { if (confirm(`Hapus "${entry.title}"?`)) deleteMutation.mutate({ id: entry.id }); }}
                  className="text-red-600 hover:underline"
                >Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md border border-black/10 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Edit Entry" : "Tambah Entry"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Tahun</label>
                <input type="text" required value={formYear} onChange={(e) => setFormYear(e.target.value)} className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]" placeholder="2024" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Judul Pencapaian</label>
                <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]" placeholder="Juara 1" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Deskripsi Lomba</label>
                <input type="text" required value={formCompetition} onChange={(e) => setFormCompetition(e.target.value)} className="w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-[#ffc91f]" placeholder="Big Data Challenge Satria Data 2024" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Foto</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                {uploading && <p className="mt-1 text-xs text-black/50">Uploading...</p>}
                {formImage && <p className="mt-1 truncate text-xs text-black/50">{formImage}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploading} className="bg-[#ffc91f] px-5 py-2 text-sm font-semibold text-black disabled:opacity-60">
                  {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
                <button type="button" onClick={resetForm} className="border border-black/20 px-5 py-2 text-sm">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

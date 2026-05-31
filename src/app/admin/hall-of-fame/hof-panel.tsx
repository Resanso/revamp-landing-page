"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Edit2, Trash2, Search, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";

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
  const [search, setSearch] = useState("");

  // Achievement form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null);

  const [formYear, setFormYear] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCompetition, setFormCompetition] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Period form state
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [formPeriodYear, setFormPeriodYear] = useState("");

  const createMutation = useMutation(
    trpc.hallOfFame.create.mutationOptions({ onSuccess: () => { resetForm(); router.refresh(); } }),
  );
  const updateMutation = useMutation(
    trpc.hallOfFame.update.mutationOptions({ onSuccess: () => { resetForm(); router.refresh(); } }),
  );
  const deleteMutation = useMutation(
    trpc.hallOfFame.delete.mutationOptions({ onSuccess: () => router.refresh() }),
  );
  const createPeriodMutation = useMutation(
    trpc.hallOfFame.createPeriod.mutationOptions({
      onSuccess: () => {
        setShowPeriodForm(false);
        setFormPeriodYear("");
        router.refresh();
      },
    }),
  );

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormYear(activeYear);
    setFormTitle("");
    setFormCompetition("");
    setFormImage("");
    setFormImageFile(null);
    if (formImagePreview.startsWith("blob:")) URL.revokeObjectURL(formImagePreview);
    setFormImagePreview("");
  };

  const openCreate = () => {
    setEditing(null);
    setFormYear(activeYear);
    setFormTitle("");
    setFormCompetition("");
    setFormImage("");
    setFormImageFile(null);
    setFormImagePreview("");
    setShowForm(true);
  };

  const openEdit = (entry: Entry) => {
    setEditing(entry);
    setFormYear(entry.year);
    setFormTitle(entry.title);
    setFormCompetition(entry.competition);
    setFormImage(entry.image);
    setFormImageFile(null);
    setFormImagePreview(entry.image);
    setShowForm(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (formImagePreview.startsWith("blob:")) URL.revokeObjectURL(formImagePreview);
    const previewUrl = URL.createObjectURL(file);
    setFormImageFile(file);
    setFormImagePreview(previewUrl);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = formImage;

    if (formImageFile) {
      setUploading(true);
      try {
        const supabase = createClient();
        const path = `${Date.now()}-${formImageFile.name.replace(/\s+/g, "-")}`;
        const { data, error } = await supabase.storage
          .from("hall-of-fame")
          .upload(path, formImageFile, { upsert: true });
        if (error || !data) throw error ?? new Error("Upload failed");
        const { data: urlData } = supabase.storage.from("hall-of-fame").getPublicUrl(data.path);
        imageUrl = urlData.publicUrl;
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Gagal mengupload gambar. Silakan coba lagi.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload = { year: formYear, title: formTitle, competition: formCompetition, image: imageUrl };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handlePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPeriodMutation.mutateAsync({ year: formPeriodYear });
  };

  const currentEntries = (entriesByYear[activeYear] ?? []).filter((e) =>
    !search ||
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.competition.toLowerCase().includes(search.toLowerCase()),
  );

  const isPending = createMutation.isPending || updateMutation.isPending;
  const displayImage = formImagePreview || formImage;

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] px-8 py-8 flex flex-col gap-6">
      {/* Period */}
      <div className="flex flex-col gap-2 border-b border-[#D9D9D9] pb-6">
        <p className="text-[#6A6A6A] text-base font-medium font-jakarta">Period</p>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => { setFormPeriodYear(""); setShowPeriodForm(true); }}
            className="px-10 py-4 bg-white rounded-lg border border-dashed border-[#FFC917] flex justify-center items-center hover:bg-yellow-50 transition-colors"
          >
            <span className="text-[#FFC917] text-base font-medium font-jakarta">New Period</span>
          </button>

          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setActiveYear(y)}
              className={`px-10 py-4 rounded-lg border border-[#D9D9D9] flex justify-center items-center transition-colors ${
                y === activeYear ? "bg-[#FFC917]" : "bg-transparent hover:bg-black/5"
              }`}
            >
              <span className="text-black text-base font-medium font-jakarta">{y}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex items-center justify-between gap-4">
        <div className="border border-[#D9D9D9] rounded-lg flex items-center gap-3 px-6 py-3.5 w-[327px]">
          <Search className="w-5 h-5 text-[#A9A9A9] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent text-base font-medium font-jakarta text-black outline-none placeholder:text-[#A9A9A9] w-full"
          />
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-[#FFC917] px-10 py-4 rounded-lg text-black text-base font-medium font-jakarta hover:bg-[#ffb901] transition-colors whitespace-nowrap"
        >
          Add Achievements
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg border border-[#D9D9D9] flex flex-col overflow-hidden">
            <div className="relative h-[188px] bg-gray-100 flex-shrink-0">
              {entry.image ? (
                <Image src={entry.image} alt={entry.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-black/50 font-jakarta">
                  No Image
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(entry)}
                  className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-[#A7A7A7]" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(entry)}
                  className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[#F75F5F]" />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <span className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">
                {entry.title}
              </span>
              <span className="text-black text-base font-light font-jakarta break-words">
                {entry.competition}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Period Modal */}
      <AdminModal
        open={showPeriodForm}
        onOpenChange={setShowPeriodForm}
        title="Add New Period"
      >
        <form onSubmit={handlePeriodSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium font-jakarta text-black">Period Year</label>
            <input
              type="text"
              required
              pattern="\d{4}"
              value={formPeriodYear}
              onChange={(e) => setFormPeriodYear(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FFC917] font-jakarta"
              placeholder="2024"
              maxLength={4}
            />
          </div>

          <button
            type="submit"
            disabled={createPeriodMutation.isPending}
            className="w-full bg-[#FFC917] hover:bg-[#ffb901] py-4 rounded-lg text-base font-semibold text-black disabled:opacity-60 transition-colors font-jakarta mt-2"
          >
            {createPeriodMutation.isPending ? "Menyimpan..." : "Save"}
          </button>
        </form>
      </AdminModal>

      {/* Add / Edit Achievement Modal */}
      <AdminModal
        open={showForm}
        onOpenChange={setShowForm}
        title={editing ? "Edit Achievement" : "Add new Achievement"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <label className="cursor-pointer block">
            {displayImage ? (
              <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-[#D9D9D9]">
                <Image src={displayImage} alt="Preview" fill className="object-cover" unoptimized={displayImage.startsWith("blob:")} />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-jakarta font-medium">Change photo</span>
                </div>
              </div>
            ) : (
              <div className="w-full border border-dashed border-[#D9D9D9] rounded-lg py-10 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 bg-[rgba(255,201,23,0.15)] rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-[#FFC917]" />
                </div>
                <div className="text-center">
                  <p className="text-black font-medium text-base font-jakarta">Drag &amp; drop image here</p>
                  <p className="text-[#A9A9A9] text-sm font-jakarta mt-1">Supported only JPG and PNG</p>
                </div>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png" onChange={handleImageSelect} className="hidden" />
          </label>

          {formImageFile && (
            <p className="text-xs text-black/50 font-jakarta">
              {uploading ? "Mengupload gambar..." : `Gambar dipilih: ${formImageFile.name}`}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium font-jakarta text-black">Judul Pencapaian</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FFC917] font-jakarta"
              placeholder="Juara 1"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium font-jakarta text-black">Deskripsi Lomba</label>
            <input
              type="text"
              required
              value={formCompetition}
              onChange={(e) => setFormCompetition(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FFC917] font-jakarta"
              placeholder="Big Data Challenge Satria Data 2024"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium font-jakarta text-black">Tahun</label>
            <input
              type="text"
              required
              value={formYear}
              onChange={(e) => setFormYear(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FFC917] font-jakarta"
              placeholder="2024"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || uploading}
            className="w-full bg-[#FFC917] hover:bg-[#ffb901] py-4 rounded-lg text-base font-semibold text-black disabled:opacity-60 transition-colors font-jakarta mt-2"
          >
            {isPending || uploading ? "Menyimpan..." : "Save"}
          </button>
        </form>
      </AdminModal>

      <AdminConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Entry"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
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

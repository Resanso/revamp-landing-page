"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, RefreshCw, Trash2, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type ActivityFormData = {
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  contentMarkdown: string;
};

type Props = {
  categories: string[];
  initial?: ActivityFormData & { date?: string };
  onSubmit: (data: ActivityFormData) => Promise<void>;
  isPending: boolean;
};

export default function ActivityFormFields({ categories, initial, onSubmit, isPending }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? categories[0] ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [contentMarkdown, setContentMarkdown] = useState(initial?.contentMarkdown ?? "");
  const [uploading, setUploading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayDate = initial?.date
    ? new Date(initial.date).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
    : new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });

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
      const { data: urlData } = supabase.storage.from("activity-covers").getPublicUrl(data.path);
      setCoverImage(urlData.publicUrl);
    } catch {
      setError("Gagal upload gambar. Coba lagi.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({ title, excerpt, category, coverImage, contentMarkdown });
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Image Section */}
      {initial ? (
        <div className="flex flex-col gap-2">
          <p className="text-black text-sm font-normal font-jakarta">Preview Current</p>
          <div className="relative h-[200px] rounded-[8px] overflow-hidden bg-gray-100">
            {coverImage ? (
              <Image src={coverImage} alt="Preview" fill className="object-cover rounded-[8px]" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-black/40 font-jakarta">No Image</div>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <label className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                <RefreshCw className="w-5 h-5 text-[#A7A7A7]" />
                <input type="file" accept="image/jpeg,image/png" onChange={handleImageUpload} className="hidden" />
              </label>
              <button type="button" onClick={() => setCoverImage("")} className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Trash2 className="w-5 h-5 text-[#F75F5F]" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-black text-sm font-normal font-jakarta">Upload Activities Photo</p>
          <label className="cursor-pointer block">
            {coverImage ? (
              <div className="relative w-full h-[180px] rounded-[8px] overflow-hidden border border-[#D9D9D9]">
                <Image src={coverImage} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-jakarta font-medium">Change photo</span>
                </div>
              </div>
            ) : (
              <div className="w-full border-2 border-dashed border-[#D9D9D9] rounded-[8px] py-8 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 bg-[rgba(255,201,23,0.15)] rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-[#FFC917]" />
                </div>
                <div className="text-center">
                  <p className="text-[#231918] font-bold text-base font-jakarta">Drag &amp; drop image here</p>
                  <p className="text-[rgba(86,66,64,0.7)] text-sm font-jakarta mt-1">Supported only JPG and PNG</p>
                </div>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png" onChange={handleImageUpload} className="hidden" />
          </label>
          {uploading && <p className="text-xs text-black/50 font-jakarta">Uploading...</p>}
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-black text-sm font-normal font-jakarta">Activities Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. PRODIGI Awarded Best Laboratory at Telkom University"
          className="w-full border border-[#D9D9D9] rounded-[4px] px-4 py-[14px] text-base font-medium font-jakarta text-[#050816] placeholder:text-[#897b7a] outline-none focus:border-[#FFC917]"
        />
      </div>

      {/* Category + Date */}
      <div className="flex gap-4 items-start">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-black text-sm font-normal font-jakarta">Category</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown((v) => !v)}
              className="w-full border border-[#D9D9D9] rounded-[4px] px-4 py-[14px] flex items-center justify-between text-base font-medium font-jakarta text-[#050816] bg-white"
            >
              <span>{category}</span>
              <ChevronDown className={`w-5 h-5 text-[#6A6A6A] transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 z-20 bg-white border border-[#D9D9D9] rounded-[8px] overflow-hidden shadow-sm mt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setCategory(cat); setShowCategoryDropdown(false); }}
                    className="w-full px-4 py-[14px] text-left text-base font-medium font-jakarta text-[#897b7a] hover:bg-gray-50 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-black text-sm font-normal font-jakarta">Publish Date</label>
          <div className="border border-[#D9D9D9] rounded-[4px] px-4 py-[14px] text-base font-medium font-jakarta text-[#050816]">
            {displayDate}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-black text-sm font-normal font-jakarta">Description</label>
        <textarea
          required
          rows={4}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="e.g. PRODIGI received recognition as the best laboratory..."
          className="w-full border border-[#D9D9D9] rounded-[4px] px-4 py-[14px] text-base font-medium font-jakarta text-[#050816] placeholder:text-[#897b7a] outline-none focus:border-[#FFC917] resize-none"
        />
      </div>

      {/* Content Markdown */}
      <div className="flex flex-col gap-2">
        <label className="text-black text-sm font-normal font-jakarta">Content (Markdown)</label>
        <textarea
          rows={7}
          value={contentMarkdown}
          onChange={(e) => setContentMarkdown(e.target.value)}
          placeholder="Tulis konten lengkap dalam format Markdown..."
          className="w-full border border-[#D9D9D9] rounded-[4px] px-4 py-[14px] text-sm font-mono text-[#050816] placeholder:text-[#897b7a] outline-none focus:border-[#FFC917] resize-none"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-jakarta text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending || uploading}
        className="w-full bg-[#FFC917] hover:bg-[#ffb901] py-5 rounded-[8px] text-base font-bold font-jakarta text-black transition-colors disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : "Save"}
      </button>
    </form>
  );
}

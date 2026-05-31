"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { createClient } from "@/lib/supabase/client";

type LeadMessage = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  order: number;
};

export default function LeaderboardPanel({ leads = [] }: { leads?: LeadMessage[] }) {
  const router = useRouter();
  const trpc = useTRPC();
  const [deleteTarget, setDeleteTarget] = useState<LeadMessage | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "",
    role: "",
    quote: "",
    avatar: "",
  });

  const deleteMutation = useMutation(
    trpc.home.deleteLeaderBoard.mutationOptions({ onSuccess: () => router.refresh() }),
  );

  const upsertMutation = useMutation(
    trpc.home.upsertLeaderBoard.mutationOptions({
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewLead({ name: "", role: "", quote: "", avatar: "" });
        router.refresh();
      },
    }),
  );

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `leaderboard-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage.from("hero-slides").upload(path, file, { upsert: true });
      if (error || !data) throw error;
      const { data: urlData } = supabase.storage.from("hero-slides").getPublicUrl(data.path);
      setNewLead({ ...newLead, avatar: urlData.publicUrl });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveLead = () => {
    upsertMutation.mutate({
      ...newLead,
      order: leads.length,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] p-8 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">Leader Board</h2>
        <AdminButton variant="primary" onClick={() => setIsAddModalOpen(true)}>Add Lead</AdminButton>
      </div>

      <div className="flex flex-col gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="p-8 bg-white rounded-lg border border-[#E2E2E2] flex justify-between items-center gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-20 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E8ECEF] flex-shrink-0 relative">
                  <Image src={lead.avatar || "/images/profile-placeholder.webp"} alt={lead.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-1 w-[204px] flex-shrink-0">
                  <span className="text-[#1A1C1C] text-base font-semibold font-jakarta break-words">{lead.name}</span>
                  <span className="text-[#6A6A6A] text-sm font-normal leading-tight font-jakarta break-words">{lead.role}</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="text-[#6A6A6A] text-base font-normal italic font-jakarta break-words">{lead.quote}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteTarget(lead)}
                className="p-2 bg-[#F9FAFB] hover:bg-gray-100 transition-colors rounded flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 text-[#F75F5F]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Lead"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ id: deleteTarget.id });
          }
          setDeleteTarget(null);
        }}
      />

      {isAddModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-bold font-jakarta text-black">Add New Lead</h2>
            
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded outline-none font-jakarta text-black"
              />
              <input
                type="text"
                placeholder="Role (e.g., LEAD 2025)"
                value={newLead.role}
                onChange={(e) => setNewLead({ ...newLead, role: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded outline-none font-jakarta text-black"
              />
              <textarea
                placeholder="Quote"
                value={newLead.quote}
                onChange={(e) => setNewLead({ ...newLead, quote: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded outline-none font-jakarta resize-none h-24 text-black"
              />
              
              <div className="flex items-center gap-4">
                {newLead.avatar && (
                  <div className="w-16 h-16 rounded overflow-hidden relative border border-gray-200">
                    <Image src={newLead.avatar} alt="Avatar Preview" fill className="object-cover" />
                  </div>
                )}
                <label className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors text-sm font-semibold text-gray-700 border border-gray-300">
                  {uploading ? "Uploading..." : "Upload Avatar"}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 transition-colors font-jakarta"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLead}
                disabled={upsertMutation.isPending || uploading || !newLead.name || !newLead.role}
                className="px-6 py-2 rounded bg-[#FFC917] text-black font-semibold font-jakarta disabled:opacity-50 hover:bg-[#ffb901] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";
import { useState } from "react";

export default function LeaderboardPanel() {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const leads = [
    {
      id: "1",
      name: "Muhammad Haulul Azkiyaa",
      role: "LEAD 2025",
      quote: "“Kami membangun Prodigi sebagai ruang tumbuh bersama. Setiap anggota didorong untuk berani mencoba, berkolaborasi, dan menuntaskan karya terbaiknya.”",
      avatar: "https://placehold.co/80x80"
    },
    {
      id: "2",
      name: "Sayyid Rayhan Mulachela",
      role: "LEAD 2024",
      quote: "“Prodigi bukan hanya tentang menang lomba, tapi juga tentang membentuk karakter problem solver yang siap membawa dampak nyata bagi sekitar.”",
      avatar: "https://placehold.co/80x80"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] p-8 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">Leader Board</h2>
        <AdminButton variant="primary">Add Lead</AdminButton>
      </div>

      <div className="flex flex-col gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="p-8 bg-white rounded-lg border border-[#E2E2E2] flex justify-between items-center gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-20 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E8ECEF] flex-shrink-0 relative">
                  <Image src={lead.avatar} alt={lead.name} fill className="object-cover" />
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
                onClick={() => setDeleteTarget(lead.name)}
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
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          // Placeholder for future delete logic
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

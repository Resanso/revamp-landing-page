"use client";

import React, { useState } from "react";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

type Props = {
  initialData: {
    gemastik: string;
    lidm: string;
    satriaData: string;
    pkm: string;
    p2mw: string;
    internal: string;
  };
};

export default function CompetitionAdminClient({ initialData }: Props) {
  const trpc = useTRPC();

  const [links, setLinks] = useState({
    gemastik: initialData?.gemastik ?? "",
    lidm: initialData?.lidm ?? "",
    satriaData: initialData?.satriaData ?? "",
    pkm: initialData?.pkm ?? "",
    p2mw: initialData?.p2mw ?? "",
    internal: initialData?.internal ?? "",
  });

  const updateMutation = useMutation(
    trpc.competition.update.mutationOptions({
      onSuccess: () => {
        alert("Links updated successfully!");
      },
      onError: (error) => {
        alert("Failed to update links: " + error.message);
      },
    })
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateMutation.mutate(links);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta break-words">Manage Competitions</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta break-words">Manage, organize, and update destination links for competitions displayed on the website.</p>
      </div>

      <AdminCard className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">Belmawa Competition</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-10">
          <div className="flex flex-col gap-2">
            <label className="text-[#1A1C1C] text-base font-medium font-jakarta break-words">Gemastik</label>
            <input
              type="text"
              name="gemastik"
              value={links.gemastik}
              onChange={handleChange}
              placeholder="Enter destination link..."
              className="w-full px-4 py-3 rounded border border-[#D9D9D9] bg-white outline-none focus:border-[#FFC917] transition-colors font-jakarta text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1A1C1C] text-base font-medium font-jakarta break-words">LIDM</label>
            <input
              type="text"
              name="lidm"
              value={links.lidm}
              onChange={handleChange}
              placeholder="Enter destination link..."
              className="w-full px-4 py-3 rounded border border-[#D9D9D9] bg-white outline-none focus:border-[#FFC917] transition-colors font-jakarta text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1A1C1C] text-base font-medium font-jakarta break-words">Satria Data</label>
            <input
              type="text"
              name="satriaData"
              value={links.satriaData}
              onChange={handleChange}
              placeholder="Enter destination link..."
              className="w-full px-4 py-3 rounded border border-[#D9D9D9] bg-white outline-none focus:border-[#FFC917] transition-colors font-jakarta text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1A1C1C] text-base font-medium font-jakarta break-words">PKM</label>
            <input
              type="text"
              name="pkm"
              value={links.pkm}
              onChange={handleChange}
              placeholder="Enter destination link..."
              className="w-full px-4 py-3 rounded border border-[#D9D9D9] bg-white outline-none focus:border-[#FFC917] transition-colors font-jakarta text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1A1C1C] text-base font-medium font-jakarta break-words">P2MW</label>
            <input
              type="text"
              name="p2mw"
              value={links.p2mw}
              onChange={handleChange}
              placeholder="Enter destination link..."
              className="w-full px-4 py-3 rounded border border-[#D9D9D9] bg-white outline-none focus:border-[#FFC917] transition-colors font-jakarta text-sm"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta break-words">Internal Competition</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="internal"
              value={links.internal}
              onChange={handleChange}
              placeholder="Enter destination link..."
              className="w-full px-4 py-3 rounded border border-[#D9D9D9] bg-white outline-none focus:border-[#FFC917] transition-colors font-jakarta text-sm"
            />
          </div>
        </div>
      </AdminCard>

      <div className="flex justify-end">
        <AdminButton variant="primary" onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </AdminButton>
      </div>
    </div>
  );
}

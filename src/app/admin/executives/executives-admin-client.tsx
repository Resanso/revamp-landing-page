"use client";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import { AdminConfirmModal } from "@/components/admin/ui/admin-confirm-modal";

type Member = {
  id: number;
  year: string;
  name: string;
  nim: string;
  prodi: string;
  angkatan: string;
  position: string;
  linkedin: string | null;
  instagram: string | null;
  image: string | null;
};

type Props = {
  initialYears: string[];
  initialMembers: Member[];
  initialYear: string;
};

export default function ExecutivesAdminClient({
  initialYears,
  initialMembers,
  initialYear,
}: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const [activeYear, setActiveYear] = useState(initialYear);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const membersQuery = useQuery(
    trpc.executives.getAll.queryOptions({ year: activeYear, limit: 100 }),
  );
  const members =
    membersQuery.data?.members ??
    (activeYear === initialYear ? initialMembers : []);

  const yearsQuery = useQuery(trpc.executives.getYears.queryOptions());
  const years = yearsQuery.data ?? initialYears;

  const deleteMutation = useMutation(
    trpc.executives.delete.mutationOptions({
      onSuccess: () => {
        membersQuery.refetch();
        yearsQuery.refetch();
        router.refresh();
      },
    }),
  );

  const filtered = members.filter((m) => {
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase()) ||
      m.nim.toLowerCase().includes(search.toLowerCase()) ||
      m.prodi.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] px-8 py-8 flex flex-col gap-6">
      {/* Year tabs */}
      <div className="flex flex-col gap-2 border-b border-[#D9D9D9] pb-6">
        <p className="text-[#6A6A6A] text-base font-medium font-jakarta">
          Year
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setActiveYear(y)}
              className={`px-10 py-3.5 rounded-lg border flex justify-center items-center transition-colors ${
                y === activeYear
                  ? "bg-[#FFC917] border-[#FFC917]"
                  : "bg-transparent border-[#D9D9D9] hover:bg-black/5"
              }`}
            >
              <span className="text-black text-base font-medium font-jakarta">
                {y}
              </span>
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
            placeholder="Search executives..."
            className="bg-transparent text-base font-medium font-jakarta text-black outline-none placeholder:text-[#A9A9A9] w-full"
          />
        </div>
        <Link
          href="/admin/executives/new"
          className="bg-[#FFC917] px-10 py-3.5 rounded-lg text-black text-base font-medium font-jakarta hover:bg-[#ffb901] transition-colors whitespace-nowrap"
        >
          Add Executive
        </Link>
      </div>

      {/* Cards grid */}
      {membersQuery.isLoading ? (
        <p className="text-sm text-black/50 font-jakarta py-8 text-center">
          Memuat data...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-black/50 font-jakarta py-8 text-center">
          Belum ada member untuk tahun ini atau tidak ditemukan dalam pencarian.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-lg border border-[#D9D9D9] flex flex-col overflow-hidden"
            >
              <div className="relative h-[240px] bg-gray-100 flex-shrink-0">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-black/30 font-jakarta">
                    No Photo
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                
                {/* Position badge */}
                <span className="absolute left-4 top-4 bg-[#FFC917] px-3 py-1 rounded text-xs font-bold uppercase tracking-wide text-black">
                  {m.position}
                </span>

                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    href={`/admin/executives/${m.id}`}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#A7A7A7]" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(m)}
                    className="p-2 bg-[#F9FAFB] rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#F75F5F]" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <span className="text-black text-xl font-semibold leading-tight font-jakarta line-clamp-1">
                  {m.name}
                </span>
                <span className="text-[#6A6A6A] text-sm font-medium font-jakarta">
                  {m.nim}
                </span>
                <span className="text-black text-sm font-light font-jakarta line-clamp-1">
                  {m.prodi} • Angkatan {m.angkatan}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <AdminConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Executive"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
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

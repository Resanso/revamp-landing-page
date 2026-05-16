"use client";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <div>
      {/* Year Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setActiveYear(y)}
            className={`border px-4 py-2 text-sm font-semibold transition ${
              y === activeYear
                ? "border-[#ffc91f] bg-[#ffc91f] text-black"
                : "border-black/15 bg-white text-black/70 hover:text-black"
            }`}
          >
            {y}
          </button>
        ))}
        <Link
          href="/admin/executives/new"
          className="border border-dashed border-black/30 bg-white px-4 py-2 text-sm text-black/50 transition hover:border-black/50 hover:text-black"
        >
          + Tambah Member
        </Link>
      </div>

      {/* Member Grid */}
      {membersQuery.isLoading ? (
        <p className="text-sm text-black/50">Memuat data...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-black/50">
          Belum ada member untuk tahun ini.{" "}
          <Link
            href="/admin/executives/new"
            className="text-[#ffc91f] hover:underline"
          >
            Tambah sekarang
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="border border-black/10 bg-white transition hover:border-black/20"
            >
              {/* Foto */}
              <div className="relative aspect-square bg-[#f5f5f5]">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-black/30">
                    No Photo
                  </div>
                )}
                {/* Position badge */}
                <span className="absolute right-0 top-0 bg-[#ffc91f] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
                  {m.position}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-semibold leading-tight text-[#1a1a1a]">
                  {m.name}
                </p>
                <p className="mt-0.5 text-xs text-black/50">
                  {m.nim} · {m.prodi} ({m.angkatan})
                </p>

                {/* Actions */}
                <div className="mt-3 flex gap-3 text-sm">
                  <Link
                    href={`/admin/executives/${m.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus "${m.name}"?`))
                        deleteMutation.mutate({ id: m.id });
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

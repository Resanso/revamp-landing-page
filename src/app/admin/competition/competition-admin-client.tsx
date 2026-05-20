"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, X } from "lucide-react";
import { AdminCard } from "@/components/admin/ui/admin-card";

type CompetitionFieldKey =
  | "gemastik"
  | "lidm"
  | "satriaData"
  | "pkm"
  | "p2mw"
  | "internal";

export type CompetitionData = {
  id: number;
  gemastik: string;
  lidm: string;
  satriaData: string;
  pkm: string;
  p2mw: string;
  internal: string;
};

type Field = { key: CompetitionFieldKey; label: string };

const BELMAWA_FIELDS: Field[] = [
  { key: "gemastik", label: "Gemastik" },
  { key: "lidm", label: "LIDM" },
  { key: "satriaData", label: "Satria Data" },
  { key: "pkm", label: "PKM" },
  { key: "p2mw", label: "P2MW" },
];

const INTERNAL_FIELDS: Field[] = [{ key: "internal", label: "Adikara" }];

type Props = { competition: CompetitionData };

function CompetitionLinkRow({
  field,
  value,
}: {
  field: Field;
  value: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useMutation(
    trpc.competition.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.competition.get.queryFilter(),
        );
        setEditing(false);
        setError(null);
      },
      onError: (e) => setError(e.message || "Gagal menyimpan link. Coba lagi."),
    }),
  );

  const startEdit = () => {
    setDraft(value);
    setError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(value);
    setError(null);
    setEditing(false);
  };

  const save = () => {
    setError(null);
    updateMutation.mutate({ [field.key]: draft.trim() });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#6A6A6A] text-base font-medium font-jakarta">
        {field.label}
      </label>

      <div
        className={`border rounded-[4px] flex items-center gap-3 pl-4 pr-2 py-2 transition-colors ${
          editing ? "border-[#FFC917]" : "border-[#D9D9D9]"
        }`}
      >
        {editing ? (
          <input
            type="text"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancelEdit();
            }}
            placeholder="Enter destination link..."
            className="flex-1 min-w-0 bg-transparent text-base font-medium font-jakarta text-black outline-none placeholder:text-[#A9A9A9]"
          />
        ) : (
          <p className="flex-1 min-w-0 truncate text-base font-medium font-jakarta text-black">
            {value || <span className="text-[#A9A9A9]">No link set</span>}
          </p>
        )}

        {editing ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={save}
              disabled={updateMutation.isPending}
              aria-label={`Save ${field.label} link`}
              className="bg-[#FFC917] hover:bg-[#ffb901] rounded-[4px] size-11 flex items-center justify-center transition-colors disabled:opacity-60"
            >
              <Check className="size-5 text-black" />
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={updateMutation.isPending}
              aria-label="Cancel editing"
              className="bg-[#F9FAFB] hover:bg-gray-100 rounded-[4px] size-11 flex items-center justify-center transition-colors disabled:opacity-60"
            >
              <X className="size-5 text-[#A7A7A7]" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            aria-label={`Edit ${field.label} link`}
            className="bg-[#F9FAFB] hover:bg-gray-100 rounded-[4px] size-11 flex items-center justify-center shrink-0 transition-colors"
          >
            <Pencil className="size-5 text-[#A7A7A7]" />
          </button>
        )}
      </div>

      {error && <p className="text-sm font-jakarta text-red-600">{error}</p>}
    </div>
  );
}

export default function CompetitionAdminClient({ competition }: Props) {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.competition.get.queryOptions(undefined, {
      initialData: competition,
    }),
  );

  const current = data ?? competition;

  return (
    <div className="flex flex-col gap-10">
      <AdminCard className="flex flex-col gap-6">
        <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta">
          Belmawa Competition
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BELMAWA_FIELDS.map((field) => (
            <CompetitionLinkRow
              key={field.key}
              field={field}
              value={current[field.key]}
            />
          ))}
        </div>
      </AdminCard>

      <AdminCard className="flex flex-col gap-6">
        <h2 className="text-black text-2xl font-semibold leading-[35px] font-jakarta">
          Internal Competition
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INTERNAL_FIELDS.map((field) => (
            <CompetitionLinkRow
              key={field.key}
              field={field}
              value={current[field.key]}
            />
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

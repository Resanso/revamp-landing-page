import { getCaller } from "@/trpc/server";
import Link from "next/link";
import { UserPlus, Mail, CreditCard } from "lucide-react";

export const metadata = { title: "Admin Management | Admin" };

export default async function AdminManagementPage() {
  const caller = await getCaller();
  const admins = await caller.auth.getAdmins();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-black text-5xl font-bold leading-tight font-jakarta break-words">
            Admin Management
          </h1>
          <p className="text-black text-sm font-normal leading-tight font-jakarta break-words">
            Kelola akun admin yang memiliki akses ke dashboard ini
          </p>
        </div>
        <Link
          href="/admin/admin-management/add"
          className="flex items-center gap-2 bg-[#FFC917] hover:bg-[#ffb901] text-white font-semibold font-jakarta text-sm px-5 py-3 rounded-lg transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Admin
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D9D9D9] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D9D9D9]">
          <p className="text-[#6A6A6A] text-sm font-medium font-jakarta">
            Total Admin:{" "}
            <span className="text-black font-semibold">{admins.length}</span>
          </p>
        </div>

        {admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <UserPlus className="w-12 h-12 text-[#D9D9D9]" />
            <p className="text-[#6A6A6A] font-jakarta text-sm">
              Belum ada admin terdaftar.
            </p>
            <Link
              href="/admin/admin-management/add"
              className="text-[#FFC917] font-jakarta text-sm font-semibold hover:underline"
            >
              Tambah Admin Pertama
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F0F0]">
            {admins.map((admin, idx) => (
              <div
                key={admin.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#FFC917]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#FFC917] font-bold font-jakarta text-sm">
                    {admin.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-black font-semibold font-jakarta text-sm truncate">
                    {admin.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[#6A6A6A] font-jakarta text-xs">
                      <CreditCard className="w-3 h-3" />
                      {admin.nim}
                    </span>
                    <span className="flex items-center gap-1 text-[#6A6A6A] font-jakarta text-xs">
                      <Mail className="w-3 h-3" />
                      {admin.email}
                    </span>
                  </div>
                </div>

                {/* Index */}
                <span className="text-[#D9D9D9] font-jakarta text-xs shrink-0">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

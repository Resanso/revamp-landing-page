import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddAdminForm from "./add-admin-form";

export const metadata = { title: "Tambah Admin | Admin" };

export default function AddAdminPage() {
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/admin-management"
          className="flex items-center gap-2 text-[#6A6A6A] hover:text-black font-jakarta text-sm transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Admin Management
        </Link>
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta wrap-break-word">
          Tambah Admin
        </h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta wrap-break-word">
          Buat akun admin baru yang dapat mengakses dashboard ini
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-[#D9D9D9] p-8 max-w-lg">
        <AddAdminForm />
      </div>
    </div>
  );
}

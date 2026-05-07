import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/sidebar";
import AdminNavbar from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const meta = user.user_metadata ?? {};
  const name: string = meta.name ?? user.email ?? "Admin";
  const nim: string = meta.nim ?? "-";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f6]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar name={name} email={user.email ?? ""} nim={nim} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

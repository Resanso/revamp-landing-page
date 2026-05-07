import ActivityForm from "../activity-form";

export const metadata = { title: "Tambah Aktivitas | Admin" };

export default function NewActivityPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">Tambah Aktivitas</h1>
      <ActivityForm />
    </div>
  );
}

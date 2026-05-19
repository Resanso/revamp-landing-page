import ExecutiveMemberForm from "../executive-member-form";

export const metadata = { title: "Tambah Executive Member | Admin" };

export default function NewExecutiveMemberPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">
        Tambah Executive Member
      </h1>
      <ExecutiveMemberForm />
    </div>
  );
}

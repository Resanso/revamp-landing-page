import { getCaller } from "@/trpc/server";
import { notFound } from "next/navigation";
import ExecutiveMemberForm from "../executive-member-form";

export const metadata = { title: "Edit Executive Member | Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditExecutiveMemberPage({ params }: Props) {
  const { id } = await params;
  const memberId = parseInt(id, 10);
  if (isNaN(memberId)) notFound();

  const caller = await getCaller();
  const member = await caller.executives.getById({ id: memberId }).catch(() => null);
  if (!member) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">
        Edit Executive Member
      </h1>
      <ExecutiveMemberForm initial={member} />
    </div>
  );
}

import ActivityForm from "../activity-form";

export const metadata = { title: "Add Activities | Admin" };

export default function NewActivityPage() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-black text-5xl font-bold leading-tight font-jakarta">Add Activities</h1>
        <p className="text-black text-sm font-normal leading-tight font-jakarta">
          Add new activity content for events, information, or articles
        </p>
      </div>
      <ActivityForm />
    </div>
  );
}

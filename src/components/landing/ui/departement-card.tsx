import Image from "next/image";

type DepartmentItem = {
  id: string;
  title: string;
  description: string;
  img: string;
};

type DepartementCardProps = {
  department: DepartmentItem;
};

export default function DepartementCard({ department }: DepartementCardProps) {
  return (
    <div className="flex h-full w-full flex-col border border-white/25 bg-white/10 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300">
      <div className="relative aspect-video w-full overflow-hidden bg-black/20 mb-6">
        <Image
          src={department.img}
          alt={department.title}
          fill
          className="object-cover"
        />
      </div>
      <h4 className="mb-4 font-serif text-3xl font-bold text-white">
        {department.title}
      </h4>
      <p className="text-sm font-medium leading-relaxed text-white/80">
        {department.description}
      </p>
    </div>
  );
}

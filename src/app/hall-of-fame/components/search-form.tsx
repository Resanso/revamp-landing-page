"use client";
import { SearchNormal1 } from "iconsax-react";
import { useRouter } from "next/navigation";

export function SearchForm({
  activeYear,
  defaultQuery,
}: {
  activeYear: string;
  defaultQuery: string;
}) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    const params = new URLSearchParams({ year: activeYear });
    if (q) params.set("q", q.toString());
    router.push(`/hall-of-fame?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center border border-black/15 bg-white px-3 py-2"
    >
      <input type="hidden" name="year" value={activeYear} />
      <SearchNormal1
        size="16"
        color="currentColor"
        variant="Linear"
        className="text-black/50"
      />
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Cari title atau lomba..."
        className="w-full border-0 bg-transparent px-3 text-sm outline-none"
      />
    </form>
  );
}

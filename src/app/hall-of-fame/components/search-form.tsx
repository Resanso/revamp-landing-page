"use client";
import { SearchNormal1 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function SearchForm({
  activeYear,
  defaultQuery,
}: {
  activeYear: string;
  defaultQuery: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // timeout
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ year: activeYear });
      const searchQuery = query.trim();
      if (searchQuery) params.set("q", searchQuery);
      router.push(`/hall-of-fame?${params.toString()}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, activeYear, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({ year: activeYear });
    const searchQuery = query.trim();
    if (searchQuery) params.set("q", searchQuery);
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari title atau lomba..."
        className="w-full border-0 bg-transparent px-3 text-sm outline-none"
      />
    </form>
  );
}

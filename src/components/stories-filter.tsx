"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function StoriesFilter({ isSignedIn }: { isSignedIn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const sort = searchParams.get("sort") ?? "newest";
  const mine = searchParams.get("mine") === "true";

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", q.trim() || null);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recovery stories by pet name or treatment..."
          className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-xs text-[#163829] placeholder-gray-400 focus:outline-emerald-600 focus:border-emerald-600 shadow-xs"
        />
      </form>

      <select
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium text-[#163829] focus:outline-emerald-600 shadow-xs cursor-pointer"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      {isSignedIn && (
        <button
          type="button"
          onClick={() => updateParam("mine", mine ? null : "true")}
          className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs ${
            mine
              ? "bg-[#163829] text-white"
              : "bg-white border border-gray-200 text-[#163829] hover:bg-gray-50"
          }`}
        >
          {mine ? "Showing My Stories" : "My Stories"}
        </button>
      )}
    </div>
  );
}

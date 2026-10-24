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
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter recovery cases by title or treatment..."
          className="w-full border-[1.5px] border-[#101124] bg-white px-3.5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-[#101124] focus:outline-hidden"
        />
      </form>

      <select
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="border-[1.5px] border-[#101124] bg-white px-3.5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-[#101124] focus:outline-hidden"
      >
        <option value="newest">Chronological: Newest</option>
        <option value="oldest">Chronological: Oldest</option>
      </select>

      {isSignedIn && (
        <button
          type="button"
          onClick={() => updateParam("mine", mine ? null : "true")}
          className={`border-[1.5px] border-[#101124] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] font-bold transition-colors ${
            mine
              ? "bg-[#101124] text-[#FAF8FC]"
              : "bg-white text-[#101124] hover:bg-[#FAF8FC]"
          }`}
        >
          {mine ? "Showing Personal Logs" : "Filter My Logs"}
        </button>
      )}
    </div>
  );
}

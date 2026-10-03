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
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stories…"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </form>

      <select
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="border rounded-md px-3 py-2 text-sm bg-white"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      {isSignedIn && (
        <button
          type="button"
          onClick={() => updateParam("mine", mine ? null : "true")}
          className={`border rounded-md px-3 py-2 text-sm transition ${
            mine
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          {mine ? "Showing mine" : "My stories"}
        </button>
      )}
    </div>
  );
}

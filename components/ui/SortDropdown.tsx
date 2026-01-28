"use client";

import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "newest", label: "新着順" },
  { value: "oldest", label: "古い順" },
  { value: "name_asc", label: "名前順 (A-Z)" },
  { value: "name_desc", label: "名前順 (Z-A)" },
];

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
        並び替え:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="input py-1.5 px-3 text-sm min-w-[140px]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

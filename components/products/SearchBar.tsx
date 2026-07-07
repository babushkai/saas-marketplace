"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSearch = useCallback((searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }

    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== defaultValue) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, defaultValue, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="プロダクトを検索..."
        className="input pl-10 pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="プロダクト検索"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="検索をクリア"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}

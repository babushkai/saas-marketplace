"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative bg-white rounded-xl shadow-card-premium overflow-hidden flex ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-white/60 transition-shadow">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SaaS製品・ツールを検索..."
          className="flex-1 pl-12 pr-4 py-4 text-gray-900 text-base placeholder-gray-400 focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          className="px-6 py-4 bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors flex-shrink-0"
        >
          検索
        </button>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        {["マーケティング", "CRM", "経理", "開発ツール"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => router.push(`/products?q=${encodeURIComponent(tag)}`)}
            className="text-xs text-white/80 bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </form>
  );
}

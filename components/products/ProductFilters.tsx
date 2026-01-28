"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

const categories = [
  { id: "all", name: "すべて" },
  { id: "marketing", name: "マーケティング" },
  { id: "sales", name: "営業・CRM" },
  { id: "finance", name: "経理・財務" },
  { id: "hr", name: "人事・労務" },
  { id: "productivity", name: "業務効率化" },
  { id: "communication", name: "コミュニケーション" },
  { id: "development", name: "開発・エンジニアリング" },
  { id: "design", name: "デザイン" },
  { id: "other", name: "その他" },
];

const pricingTypes = [
  { id: "free", name: "無料" },
  { id: "freemium", name: "フリーミアム" },
  { id: "paid", name: "有料" },
  { id: "contact", name: "要問合せ" },
];

interface ProductFiltersProps {
  selectedCategory: string;
  selectedPricing: string[];
}

export function ProductFilters({ selectedCategory, selectedPricing }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localPricing, setLocalPricing] = useState<string[]>(selectedPricing);

  useEffect(() => {
    setLocalPricing(selectedPricing);
  }, [selectedPricing]);

  const updateFilters = useCallback((category: string, pricing: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (pricing.length > 0) {
      params.set("pricing", pricing.join(","));
    } else {
      params.delete("pricing");
    }

    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    updateFilters(categoryId, localPricing);
  };

  const handlePricingChange = (pricingId: string, checked: boolean) => {
    const newPricing = checked
      ? [...localPricing, pricingId]
      : localPricing.filter((p) => p !== pricingId);
    setLocalPricing(newPricing);
    updateFilters(selectedCategory, newPricing);
  };

  const clearFilters = () => {
    setLocalPricing([]);
    router.push("/products");
  };

  const hasActiveFilters = selectedCategory !== "all" || localPricing.length > 0;

  return (
    <aside className="lg:w-64 flex-shrink-0 space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          フィルターをクリア
        </button>
      )}

      {/* Categories */}
      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          カテゴリー
        </h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Pricing Filter */}
      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          料金体系
        </h2>
        <div className="space-y-2">
          {pricingTypes.map((pricing) => (
            <label
              key={pricing.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={localPricing.includes(pricing.id)}
                onChange={(e) => handlePricingChange(pricing.id, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {pricing.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

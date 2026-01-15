"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/database";

// Mock data - replace with actual API call
const allProducts: Product[] = [
  {
    id: "1",
    seller_id: "seller-1",
    slug: "cloud-invoice",
    name: "クラウド請求書",
    tagline: "請求書作成から入金管理まで、すべてをクラウドで完結",
    description: "中小企業向けの請求書管理SaaS",
    category: "finance",
    pricing_type: "freemium",
    price_info: "¥980/月〜",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    seller_id: "seller-1",
    slug: "team-chat-pro",
    name: "チームチャットPro",
    tagline: "チームコミュニケーションを加速する国産チャットツール",
    description: "日本企業向けのビジネスチャット",
    category: "communication",
    pricing_type: "paid",
    price_info: "¥500/ユーザー/月",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    seller_id: "seller-2",
    slug: "ai-writing-assistant",
    name: "AI文章アシスタント",
    tagline: "日本語に最適化されたAIライティング支援ツール",
    description: "日本語文章の校正・生成をAIでサポート",
    category: "productivity",
    pricing_type: "free",
    price_info: null,
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    seller_id: "seller-2",
    slug: "sales-crm",
    name: "営業管理CRM",
    tagline: "中小企業向けのシンプルな営業管理ツール",
    description: "顧客管理、商談管理、売上予測を一元管理",
    category: "sales",
    pricing_type: "freemium",
    price_info: "¥2,980/月〜",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    seller_id: "seller-3",
    slug: "hr-management",
    name: "人事労務クラウド",
    tagline: "入退社から給与計算まで、人事労務をまるごとクラウド化",
    description: "人事労務管理のオールインワンSaaS",
    category: "hr",
    pricing_type: "paid",
    price_info: "¥400/従業員/月",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (searchQuery: string) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
      // Update URL without reload
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            プロダクトを検索
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="プロダクト名、機能、キーワードで検索..."
              className="input pl-12 pr-24 py-4 text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary py-2"
            >
              検索
            </button>
          </form>
        </div>

        {/* Popular Searches */}
        {!query && results.length === 0 && (
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-sm font-medium text-gray-500 mb-3">
              人気の検索キーワード
            </h2>
            <div className="flex flex-wrap gap-2">
              {["請求書", "チャット", "CRM", "人事", "プロジェクト管理", "AI", "マーケティング"].map(
                (keyword) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setQuery(keyword);
                      performSearch(keyword);
                      window.history.pushState({}, "", `/search?q=${encodeURIComponent(keyword)}`);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {keyword}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {(query || results.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {isSearching ? (
                  "検索中..."
                ) : (
                  <>
                    「{query}」の検索結果: {results.length}件
                  </>
                )}
              </h2>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  検索結果が見つかりませんでした
                </h3>
                <p className="text-gray-600 mb-6">
                  別のキーワードで検索するか、カテゴリーから探してみてください。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products" className="btn btn-primary">
                    すべてのプロダクト
                  </Link>
                  <Link href="/categories" className="btn btn-secondary">
                    カテゴリーから探す
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

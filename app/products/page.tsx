import { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Product } from "@/types/database";

export const metadata: Metadata = {
  title: "プロダクト一覧 - SaaS製品を探す",
  description:
    "日本発のSaaS製品・サービスを一覧で検索。マーケティング、営業CRM、経理、人事、業務効率化など、カテゴリー別にビジネスツールを比較できます。",
  keywords: [
    "SaaS一覧",
    "SaaS製品",
    "ビジネスツール",
    "クラウドサービス",
    "業務効率化ツール",
    "日本SaaS",
  ],
  openGraph: {
    title: "プロダクト一覧 - SaaS製品を探す | SaaSマーケット",
    description:
      "日本発のSaaS製品・サービスを一覧で検索。カテゴリー別にビジネスツールを比較できます。",
  },
};

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

interface ProductsPageProps {
  searchParams: { category?: string; q?: string };
}

async function getProducts(category?: string): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }

  return data || [];
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const selectedCategory = searchParams.category || "all";
  const products = await getProducts(selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          プロダクト一覧
        </h1>
        <p className="text-gray-600">
          日本発のSaaS製品・サービスを探してみましょう
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Categories */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card p-4">
            <h2 className="font-semibold text-gray-900 mb-4">カテゴリー</h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={
                    category.id === "all"
                      ? "/products"
                      : `/products?category=${category.id}`
                  }
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="card p-4 mt-4">
            <h2 className="font-semibold text-gray-900 mb-4">料金体系</h2>
            <div className="space-y-2">
              {[
                { id: "free", name: "無料" },
                { id: "freemium", name: "フリーミアム" },
                { id: "paid", name: "有料" },
                { id: "contact", name: "要問合せ" },
              ].map((pricing) => (
                <label key={pricing.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">{pricing.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="プロダクトを検索..."
                className="input pl-10"
                defaultValue={searchParams.q}
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
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            {products.length}件のプロダクト
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当するプロダクトがありません</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

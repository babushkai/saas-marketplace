import { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SearchBar } from "@/components/products/SearchBar";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MobileFilters } from "@/components/products/MobileFilters";
import { Pagination } from "@/components/ui/Pagination";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Product } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const ITEMS_PER_PAGE = 12;

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

interface ProductsPageProps {
  searchParams: {
    category?: string;
    q?: string;
    pricing?: string;
    sort?: string;
    page?: string;
  };
}

interface ProductsResult {
  products: Product[];
  totalCount: number;
}

async function getProducts(
  category?: string,
  search?: string,
  pricing?: string[],
  sort?: string,
  page?: number
): Promise<ProductsResult> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return { products: [], totalCount: 0 };
  }

  // First, get total count
  let countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  if (category && category !== "all") {
    countQuery = countQuery.eq("category", category);
  }

  if (search && search.trim()) {
    countQuery = countQuery.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (pricing && pricing.length > 0) {
    countQuery = countQuery.in("pricing_type", pricing);
  }

  const { count } = await countQuery;
  const totalCount = count || 0;

  // Then get paginated data
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_published", true);

  // Category filter
  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  // Search filter
  if (search && search.trim()) {
    query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Pricing filter
  if (pricing && pricing.length > 0) {
    query = query.in("pricing_type", pricing);
  }

  // Sorting
  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Pagination
  const currentPage = page || 1;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch products:", error);
    return { products: [], totalCount: 0 };
  }

  return { products: data || [], totalCount };
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const selectedCategory = searchParams.category || "all";
  const searchQuery = searchParams.q || "";
  const selectedPricing = searchParams.pricing?.split(",").filter(Boolean) || [];
  const sortOption = searchParams.sort || "newest";
  const currentPage = parseInt(searchParams.page || "1", 10);

  const { products, totalCount } = await getProducts(
    selectedCategory,
    searchQuery,
    selectedPricing,
    sortOption,
    currentPage
  );

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasFilters = selectedCategory !== "all" || searchQuery || selectedPricing.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "プロダクト一覧" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          プロダクト一覧
        </h1>
        <p className="text-gray-600">
          日本発のSaaS製品・サービスを探してみましょう
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Filters (hidden on mobile) */}
        <Suspense fallback={<div className="hidden lg:block lg:w-64 flex-shrink-0" />}>
          <div className="hidden lg:block">
            <ProductFilters
              selectedCategory={selectedCategory}
              selectedPricing={selectedPricing}
            />
          </div>
        </Suspense>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Suspense fallback={<div className="input" />}>
                <SearchBar defaultValue={searchQuery} />
              </Suspense>
            </div>
            <div className="flex gap-2">
              <MobileFilters
                selectedCategory={selectedCategory}
                selectedPricing={selectedPricing}
              />
              <Suspense fallback={<div className="w-[180px]" />}>
                <SortDropdown />
              </Suspense>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">適用中:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                  「{searchQuery}」
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  カテゴリー: {selectedCategory}
                </span>
              )}
              {selectedPricing.map((p) => (
                <span key={p} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {p === "free" ? "無料" : p === "freemium" ? "フリーミアム" : p === "paid" ? "有料" : "要問合せ"}
                </span>
              ))}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {totalCount}件のプロダクト
              {hasFilters && "が見つかりました"}
            </p>
          </div>

          {/* Products Grid */}
          <Suspense fallback={<ProductsLoading />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>

          {/* Pagination */}
          {totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                プロダクトが見つかりませんでした
              </h3>
              <p className="text-gray-500 mb-6">
                検索条件を変更して、もう一度お試しください。
              </p>
              <a
                href="/products"
                className="btn btn-outline"
              >
                フィルターをクリア
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

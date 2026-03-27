import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SearchBar } from "@/components/products/SearchBar";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MobileFilters } from "@/components/products/MobileFilters";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { Pagination } from "@/components/ui/Pagination";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getProductViewCounts } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import type { Product, ProductWithStats } from "@/types/database";

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
    view?: string;
  };
}

interface ProductsResult {
  products: (Product | ProductWithStats)[];
  totalCount: number;
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_published", true);

  if (error || !data) return {};

  const counts: Record<string, number> = {};
  data.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
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

  // For popular sort, we need a different strategy:
  // 1. Get all matching product IDs
  // 2. Get view counts via RPC
  // 3. Sort by view count and paginate in-memory
  // Note: This approach works well under ~1000 products. For larger scale,
  // a materialized view with pre-computed view counts would be needed.
  if (sort === "popular") {
    return getProductsPopularSort(supabase, category, search, pricing, page);
  }

  // Standard sort path
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

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_published", true);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (search && search.trim()) {
    query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (pricing && pricing.length > 0) {
    query = query.in("pricing_type", pricing);
  }

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

async function getProductsPopularSort(
  supabase: NonNullable<ReturnType<typeof createServerSupabaseClient>>,
  category?: string,
  search?: string,
  pricing?: string[],
  page?: number
): Promise<ProductsResult> {
  let query = supabase
    .from("products")
    .select("id")
    .eq("is_published", true);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  if (search && search.trim()) {
    query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (pricing && pricing.length > 0) {
    query = query.in("pricing_type", pricing);
  }

  const { data: allIds } = await query;
  if (!allIds || allIds.length === 0) {
    return { products: [], totalCount: 0 };
  }

  const productIds = allIds.map((p) => p.id);
  const viewCounts = await getProductViewCounts(productIds);

  const sortedIds = [...productIds].sort(
    (a, b) => (viewCounts[b] || 0) - (viewCounts[a] || 0)
  );

  const totalCount = sortedIds.length;
  const currentPage = page || 1;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageIds = sortedIds.slice(from, from + ITEMS_PER_PAGE);

  if (pageIds.length === 0) {
    return { products: [], totalCount };
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", pageIds)
    .eq("is_published", true);

  if (!products) {
    return { products: [], totalCount };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const sorted: ProductWithStats[] = pageIds
    .map((id) => {
      const product = productMap.get(id);
      if (!product) return null;
      return { ...product, view_count: viewCounts[id] || 0 };
    })
    .filter((p): p is ProductWithStats => p !== null);

  return { products: sorted, totalCount };
}

function buildFilterUrl(
  currentParams: ProductsPageProps["searchParams"],
  removeKey: string,
  removeValue?: string
): string {
  const params = new URLSearchParams();
  if (currentParams.category && removeKey !== "category") params.set("category", currentParams.category);
  if (currentParams.q && removeKey !== "q") params.set("q", currentParams.q);
  if (currentParams.sort) params.set("sort", currentParams.sort);
  if (currentParams.page) params.set("page", currentParams.page);
  if (currentParams.view) params.set("view", currentParams.view);

  if (currentParams.pricing) {
    if (removeKey === "pricing" && removeValue) {
      const remaining = currentParams.pricing.split(",").filter((v) => v !== removeValue).join(",");
      if (remaining) params.set("pricing", remaining);
    } else if (removeKey !== "pricing") {
      params.set("pricing", currentParams.pricing);
    }
  }

  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

function getCategoryNameById(id: string): string | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.id === id)?.name;
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="h-40 bg-gray-100" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-16" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <div className="h-5 bg-gray-100 rounded w-16" />
              <div className="h-5 bg-gray-100 rounded w-4" />
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
  const viewMode = searchParams.view === "list" ? "list" : "grid";
  const currentPage = parseInt(searchParams.page || "1", 10);

  const [{ products, totalCount }, categoryCounts] = await Promise.all([
    getProducts(selectedCategory, searchQuery, selectedPricing, sortOption, currentPage),
    getCategoryCounts(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasFilters = selectedCategory !== "all" || searchQuery || selectedPricing.length > 0;
  const categoryName = selectedCategory !== "all" ? getCategoryNameById(selectedCategory) : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: "プロダクト一覧", href: categoryName ? "/products" : undefined },
        ...(categoryName ? [{ label: categoryName }] : []),
      ]} />

      {/* Page Header — context-aware */}
      <div className="mb-8">
        {categoryName ? (
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {categoryName}
            </h1>
            <span className="bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
              {totalCount}件
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                プロダクト一覧
              </h1>
              <span className="bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                {totalCount}件
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              日本発のSaaS製品・サービスを探してみましょう
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Suspense fallback={<div className="hidden lg:block lg:w-64 flex-shrink-0" />}>
          <div className="hidden lg:block">
            <ProductFilters
              selectedCategory={selectedCategory}
              selectedPricing={selectedPricing}
              categoryCounts={categoryCounts}
            />
          </div>
        </Suspense>

        {/* Main Content */}
        <main className="flex-1">
          {/* Row 1: Search bar */}
          <div className="mb-4">
            <Suspense fallback={<div className="input" />}>
              <SearchBar defaultValue={searchQuery} />
            </Suspense>
          </div>

          {/* Row 2: Filters/Count + Sort/View */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <MobileFilters
                selectedCategory={selectedCategory}
                selectedPricing={selectedPricing}
                categoryCounts={categoryCounts}
              />
              {hasFilters && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {searchQuery && (
                    <Link
                      href={buildFilterUrl(searchParams, "q")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors"
                    >
                      「{searchQuery}」
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Link>
                  )}
                  {categoryName && (
                    <Link
                      href={buildFilterUrl(searchParams, "category")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      {categoryName}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Link>
                  )}
                  {selectedPricing.map((p) => (
                    <Link
                      key={p}
                      href={buildFilterUrl(searchParams, "pricing", p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      {p === "free" ? "無料" : p === "freemium" ? "フリーミアム" : p === "paid" ? "有料" : "要問合せ"}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center flex-shrink-0">
              <Suspense fallback={<div className="w-[180px]" />}>
                <SortDropdown />
              </Suspense>
              <Suspense fallback={null}>
                <ViewToggle currentView={viewMode} />
              </Suspense>
            </div>
          </div>

          {/* Products Grid */}
          <Suspense fallback={<ProductsLoading />}>
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} compact={viewMode === "list"} />
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
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-2xl shadow-inner mb-6">
                <span className="text-5xl">{searchQuery ? "🔍" : "📦"}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                見つかりませんでした
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchQuery
                  ? `「${searchQuery}」に一致するプロダクトはありません。別のキーワードをお試しください。`
                  : "条件に一致するプロダクトはありません。フィルターを変更してみてください。"
                }
              </p>
              <div className="flex gap-3 justify-center">
                <a href="/products" className="btn btn-primary btn-lg">
                  すべて見る
                </a>
                {hasFilters && (
                  <a href="/products" className="btn btn-outline btn-lg">
                    フィルターをクリア
                  </a>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

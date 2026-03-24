import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getPricingLabel, getPricingColor, formatDate } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ProductActions } from "@/components/dashboard/ProductActions";
import { PublishToggle } from "@/components/dashboard/PublishToggle";
import { ProductsTableSkeleton } from "@/components/dashboard/ProductsTableSkeleton";
import { ProductCreatedCelebration } from "@/components/dashboard/ProductCreatedCelebration";
import { PlanBanner } from "@/components/dashboard/PlanBanner";
import { canAddProduct, getProductLimit, PLAN_LABELS } from "@/lib/plans";
import type { Product, PlanTier } from "@/types/database";

interface SellerProductsData {
  products: Product[];
  plan: PlanTier;
  productStats: Map<string, { views: number; inquiries: number }>;
}

async function getSellerProducts(): Promise<SellerProductsData> {
  const { userId } = await auth();

  if (!userId) {
    return { products: [], plan: "free", productStats: new Map() };
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return { products: [], plan: "free", productStats: new Map() };
  }

  const { data: seller } = await supabase
    .from("sellers")
    .select("id, plan")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) {
    return { products: [], plan: "free", productStats: new Map() };
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { products: [], plan: (seller.plan as PlanTier) || "free", productStats: new Map() };
  }

  const allProducts = products || [];
  const productIds = allProducts.map((p) => p.id);
  const statsMap = new Map<string, { views: number; inquiries: number }>();

  if (productIds.length > 0) {
    // Single aggregation query for per-product stats
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const now = new Date().toISOString();

    const { data: breakdown } = await supabase.rpc("get_product_breakdown", {
      p_product_ids: productIds,
      p_start_date: thirtyDaysAgo,
      p_end_date: now,
    });

    for (const row of breakdown || []) {
      statsMap.set(row.product_id, { views: Number(row.views), inquiries: Number(row.inquiries) });
    }
  }

  return { products: allProducts, plan: (seller.plan as PlanTier) || "free", productStats: statsMap };
}

async function ProductsTable() {
  const { products, plan, productStats } = await getSellerProducts();
  const canAdd = canAddProduct(plan, products.length);
  const limit = getProductLimit(plan);

  if (products.length === 0) {
    return (
      <div className="card p-12 text-center">
        <svg className="w-10 h-10 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          プロダクトがまだありません
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          SaaS・ツール・サービスを登録して出品を始めましょう
        </p>
        <Link href="/dashboard/products/new" className="btn btn-primary">
          プロダクトを追加
        </Link>
      </div>
    );
  }

  return (
    <>
      <PlanBanner plan={plan} productCount={products.length} />

      {/* Product count + limit */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <span>{products.length}件のプロダクト</span>
        {limit !== null && (
          <span className="text-gray-400">
            ({PLAN_LABELS[plan]}プラン: 上限{limit}件)
          </span>
        )}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                プロダクト
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                料金
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                公開
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                PV / 問合せ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const pStats = productStats.get(product.id) || { views: 0, inquiries: 0 };
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.logo_url ? (
                          <Image
                            src={product.logo_url}
                            alt={product.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{product.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPricingColor(product.pricing_type)}`}>
                      {getPricingLabel(product.pricing_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <PublishToggle productId={product.id} isPublished={product.is_published} />
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <div className="text-sm">
                      <span className="text-gray-700 font-medium">{pStats.views}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-purple-600 font-medium">{pStats.inquiries}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">30日間</p>
                  </td>
                  <td className="px-6 py-4">
                    <ProductActions
                      productId={product.id}
                      productName={product.name}
                      productSlug={product.slug}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function ProductsManagementPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プロダクト管理</h1>
          <p className="text-gray-600 mt-1">登録したプロダクトの管理ができます</p>
        </div>
        <Link href="/dashboard/products/new" className="btn btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規追加
        </Link>
      </div>

      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable />
      </Suspense>

      {/* Celebration modal (client component, reads search params) */}
      <Suspense fallback={null}>
        <ProductCreatedCelebration />
      </Suspense>
    </div>
  );
}

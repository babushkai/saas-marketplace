import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getPricingLabel, getPricingColor, formatDate } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ProductActions } from "@/components/dashboard/ProductActions";
import { ProductsTableSkeleton } from "@/components/dashboard/ProductsTableSkeleton";
import type { Product } from "@/types/database";

async function getSellerProducts(): Promise<Product[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  // Get seller ID
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) {
    return [];
  }

  // Get all products (published and unpublished)
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }

  return products || [];
}

async function ProductsTable() {
  const products = await getSellerProducts();

  if (products.length === 0) {
    return (
      <div className="card p-12 text-center">
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          まだプロダクトがありません
        </h3>
        <p className="text-gray-500 mb-4">
          最初のプロダクトを追加して、出品を始めましょう
        </p>
        <Link href="/dashboard/products/new" className="btn btn-primary">
          プロダクトを追加
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              プロダクト
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              料金
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              更新日
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
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
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {product.tagline}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPricingColor(product.pricing_type)}`}
                >
                  {getPricingLabel(product.pricing_type)}
                </span>
                {product.price_info && (
                  <p className="text-xs text-gray-500 mt-1">
                    {product.price_info}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                {product.is_published ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    公開中
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    下書き
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(product.updated_at)}
              </td>
              <td className="px-6 py-4">
                <ProductActions
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          新規追加
        </Link>
      </div>

      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}

import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { StaggerGrid } from "@/components/ui/StaggerGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCategoryColor } from "@/lib/categories";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Product, Seller } from "@/types/database";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://saas-market.jp";

interface SellerPageProps {
  params: { username: string };
}

// cache() deduplicates generateMetadata + page render within the same request
const getSellerWithProducts = cache(async (username: string): Promise<{ seller: Seller; products: Product[] } | null> => {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data: seller, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("username", username)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !seller) return null;

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", seller.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return {
    seller: seller as Seller,
    products: (products || []) as Product[],
  };
});

export async function generateMetadata({ params }: SellerPageProps): Promise<Metadata> {
  const data = await getSellerWithProducts(params.username);
  if (!data) return { title: "出品者が見つかりません" };

  const { seller } = data;
  const description = seller.bio?.slice(0, 160) ?? `${seller.display_name}が提供するSaaSプロダクト一覧`;

  return {
    title: `${seller.display_name} - プロフィール`,
    description,
    alternates: { canonical: `${BASE_URL}/sellers/${seller.username}` },
    openGraph: {
      type: "profile",
      title: `${seller.display_name} | SaaSマーケット`,
      description,
      url: `${BASE_URL}/sellers/${seller.username}`,
      images: seller.avatar_url ? [{ url: seller.avatar_url }] : [],
    },
  };
}

export default async function SellerPage({ params }: SellerPageProps) {
  const data = await getSellerWithProducts(params.username);
  if (!data) notFound();

  const { seller, products } = data;

  // Determine a category color for the header gradient from the seller's most common product category
  const categoryFreq: Record<string, number> = {};
  products.forEach((p) => {
    categoryFreq[p.category] = (categoryFreq[p.category] || 0) + 1;
  });
  const topCategory = Object.entries(categoryFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "other";
  const categoryColor = getCategoryColor(topCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: "プロダクト一覧", href: "/products" },
        { label: seller.display_name },
      ]} />

      {/* Seller Header — premium card with gradient banner */}
      <div className="card-elevated overflow-visible mb-10">
        <div className={`h-24 sm:h-32 rounded-t-2xl ${categoryColor.gradient}`} />
        <div className="relative px-6 sm:px-8 pb-8">
          {/* Avatar overlapping the gradient */}
          <div className="-mt-12 sm:-mt-14 mb-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden">
              {seller.avatar_url ? (
                <Image
                  src={seller.avatar_url}
                  alt={seller.display_name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${categoryColor.text} opacity-60`}>
                  {seller.display_name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {seller.display_name}
              </h1>
              {seller.company_name && (
                <p className="text-gray-500 mt-1">{seller.company_name}</p>
              )}
              {seller.bio && (
                <p className="text-gray-600 mt-4 max-w-2xl leading-relaxed whitespace-pre-line">{seller.bio}</p>
              )}

              {/* Social links */}
              {(seller.website_url || seller.twitter_url) && (
                <div className="flex items-center gap-4 mt-4">
                  {seller.website_url && (
                    <a
                      href={seller.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      ウェブサイト
                    </a>
                  )}
                  {seller.twitter_url && (
                    <a
                      href={seller.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X (Twitter)
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">プロダクト</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">
          提供プロダクト
        </h2>
        {products.length > 0 ? (
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerGrid>
        ) : (
          <div className="card p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl shadow-inner mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-500">まだプロダクトがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

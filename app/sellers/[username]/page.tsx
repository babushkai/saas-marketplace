import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Product, Seller } from "@/types/database";

export const dynamic = "force-dynamic";

interface SellerPageProps {
  params: { username: string };
}

async function getSellerWithProducts(username: string): Promise<{ seller: Seller; products: Product[] } | null> {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return null;
  }

  // Get the most recently updated seller with this username
  // (handles case where duplicate usernames may exist)
  const { data: seller, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("username", username)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !seller) {
    return null;
  }

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
}

export default async function SellerPage({ params }: SellerPageProps) {
  const data = await getSellerWithProducts(params.username);

  if (!data) {
    notFound();
  }

  const { seller, products } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Seller Header */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
            {seller.avatar_url ? (
              <Image
                src={seller.avatar_url}
                alt={seller.display_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                {seller.display_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {seller.display_name}
            </h1>
            {seller.company_name && (
              <p className="text-gray-600 mt-1">{seller.company_name}</p>
            )}

            {seller.bio && (
              <p className="text-gray-600 mt-4 max-w-2xl whitespace-pre-line">{seller.bio}</p>
            )}

            <div className="flex items-center gap-4 mt-4">
              {seller.website_url && (
                <a
                  href={seller.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  ウェブサイト
                </a>
              )}
              {seller.twitter_url && (
                <a
                  href={seller.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          提供プロダクト ({products.length}件)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-500">まだプロダクトがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

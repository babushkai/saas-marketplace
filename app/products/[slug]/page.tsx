import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { ProductCard } from "@/components/products/ProductCard";
import { notFound } from "next/navigation";
import { getPricingLabel, getPricingColor } from "@/lib/utils";
import { InquiryForm } from "@/components/products/InquiryForm";
import { ShareButton } from "@/components/products/ShareButton";
import { ViewTracker } from "@/components/products/ViewTracker";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Product, Seller } from "@/types/database";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<(Product & { seller: Seller | null }) | null> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      seller:sellers(*)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Product & { seller: Seller | null };
}

async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", currentId)
    .limit(3);

  if (error || !data) {
    return [];
  }

  return data;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  // Default seller info if not available
  const seller = product.seller || {
    id: "",
    clerk_user_id: "",
    username: "unknown",
    display_name: "不明",
    company_name: null,
    bio: null,
    avatar_url: null,
    website_url: null,
    twitter_url: null,
    created_at: "",
    updated_at: "",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ViewTracker productId={product.id} />
      <Breadcrumb
        items={[
          { label: "プロダクト一覧", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                {product.logo_url ? (
                  <Image
                    src={product.logo_url}
                    alt={product.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-gray-600 mt-2 text-lg">{product.tagline}</p>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPricingColor(product.pricing_type)}`}
                  >
                    {getPricingLabel(product.pricing_type)}
                  </span>
                  {product.price_info && (
                    <span className="text-sm text-gray-600">
                      {product.price_info}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {product.website_url && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1 sm:flex-none justify-center"
                >
                  公式サイトを見る
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                <ShareButton title={product.name} text={product.tagline} />
              </div>
            )}
          </div>

          {/* Description Card */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              プロダクト詳細
            </h2>
            <div className="prose prose-gray max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {product.description.split("\n").map(line => line.trim()).join("\n")}
              </ReactMarkdown>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                関連プロダクト
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              提供企業
            </h2>
            <Link
              href={`/sellers/${seller.username}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                {seller.avatar_url ? (
                  <Image
                    src={seller.avatar_url}
                    alt={seller.display_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                    {seller.display_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {seller.display_name}
                </p>
                {seller.company_name && (
                  <p className="text-sm text-gray-500">
                    {seller.company_name}
                  </p>
                )}
              </div>
            </Link>
            {seller.bio && (
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">{seller.bio}</p>
            )}
          </div>

          {/* Inquiry Form */}
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              お問い合わせ
            </h2>
            <InquiryForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

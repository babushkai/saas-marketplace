import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProductCard } from "@/components/products/ProductCard";
import { notFound } from "next/navigation";
import { getPricingLabel, getPricingColor } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { PRODUCT_CATEGORIES, getCategoryColor } from "@/lib/categories";
import { InquiryForm } from "@/components/products/InquiryForm";
import { ShareButton } from "@/components/products/ShareButton";
import { ViewTracker } from "@/components/products/ViewTracker";
import { ScreenshotGallery } from "@/components/products/ScreenshotGallery";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getViewCount } from "@/lib/products";
import type { Product, Seller } from "@/types/database";

interface ProductPageProps {
  params: { slug: string };
}

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (isNaN(created)) return false;
  return Date.now() - created < 7 * 24 * 60 * 60 * 1000;
}

function getCategoryName(categoryId: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.id === categoryId)?.name ?? "その他";
}

async function getProduct(slug: string): Promise<(Product & { seller: Seller | null }) | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(`*, seller:sellers(*)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return data as Product & { seller: Seller | null };
}

async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data) return [];
  return data;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const [relatedProducts, viewCount] = await Promise.all([
    getRelatedProducts(product.category, product.id),
    getViewCount(product.id),
  ]);

  const productIsNew = isNew(product.created_at);
  const screenshots = product.screenshots ?? [];
  const categoryName = getCategoryName(product.category);
  const categoryColor = getCategoryColor(product.category);

  const seller = product.seller;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ViewTracker productId={product.id} />
      <Breadcrumb
        items={[
          { label: "プロダクト一覧", href: "/products" },
          { label: categoryName, href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Card */}
          <div className="card-elevated overflow-hidden">
            {/* Visual zone */}
            {screenshots.length > 0 ? (
              <div className="p-4 pb-0">
                <ScreenshotGallery screenshots={screenshots} />
              </div>
            ) : (
              <div className={`relative h-32 sm:h-40 ${categoryColor.gradient}`}>
                <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white">
                    {product.logo_url ? (
                      <Image
                        src={product.logo_url}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${categoryColor.text} opacity-60`}>
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Identity section */}
            <div className={`px-6 ${screenshots.length > 0 ? "pt-5" : "pt-16 sm:pt-20"}`}>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Logo (only when screenshots are present — logo isn't in the gradient banner) */}
                {screenshots.length > 0 && product.logo_url && (
                  <div className="relative w-14 h-14 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <Image
                      src={product.logo_url}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">{product.tagline}</p>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-gray-100">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getPricingColor(product.pricing_type)}`}
                >
                  {getPricingLabel(product.pricing_type)}
                </span>
                {product.price_info && (
                  <span className="text-sm font-medium text-gray-700">{product.price_info}</span>
                )}
                {productIsNew && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    新着
                  </span>
                )}
                {viewCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {viewCount}回閲覧
                  </span>
                )}
              </div>
            </div>

            {/* CTA bar */}
            <div className="mt-5 px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              {product.website_url ? (
                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg flex-1 sm:flex-none justify-center"
                >
                  公式サイトを見る
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <span className="text-sm text-gray-400 py-2">公式サイトは未登録です</span>
              )}
              <ShareButton title={product.name} text={product.tagline} />
            </div>
          </div>

          {/* Quick Info Panel */}
          <div className="card p-5">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <dt className="text-xs text-gray-500 font-medium uppercase tracking-wider">カテゴリー</dt>
                <dd className="mt-1">
                  <Link
                    href={`/products?category=${product.category}`}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text} hover:opacity-80 transition-opacity`}
                  >
                    {categoryName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 font-medium uppercase tracking-wider">料金体系</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{getPricingLabel(product.pricing_type)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 font-medium uppercase tracking-wider">価格</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{product.price_info || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 font-medium uppercase tracking-wider">掲載日</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{formatDate(product.created_at)}</dd>
              </div>
            </dl>
          </div>

          {/* Description Card */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              プロダクト詳細
            </h2>
            <div className="prose-product">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {product.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  関連プロダクト
                </h2>
                <Link
                  href={`/products?category=${product.category}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  もっと見る
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller Info — enhanced with gradient header band */}
          {seller ? (
            <div className="card overflow-visible">
              <div className={`h-16 rounded-t-xl ${categoryColor.gradient}`} />
              <div className="relative px-6 pb-6">
                {/* Overlapping avatar */}
                <div className="-mt-8 mb-4">
                  <Link href={`/sellers/${seller.username}`} className="block group">
                    <div className="relative w-16 h-16 bg-white rounded-full border-4 border-white shadow-sm overflow-hidden">
                      {seller.avatar_url ? (
                        <Image
                          src={seller.avatar_url}
                          alt={seller.display_name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
                          {seller.display_name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">提供企業</h2>
                <Link href={`/sellers/${seller.username}`} className="group">
                  <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {seller.display_name}
                  </p>
                </Link>
                {seller.company_name && (
                  <p className="text-sm text-gray-500 mt-0.5">{seller.company_name}</p>
                )}
                {seller.bio && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{seller.bio}</p>
                )}

                {/* Social links */}
                {(seller.website_url || seller.twitter_url) && (
                  <div className="flex items-center gap-3 mt-4">
                    {seller.website_url && (
                      <a
                        href={seller.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Website"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}
                    {seller.twitter_url && (
                      <a
                        href={seller.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="X (Twitter)"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}

                <Link
                  href={`/sellers/${seller.username}`}
                  className="mt-4 btn btn-outline w-full text-sm justify-center"
                >
                  プロフィールを見る
                </Link>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <p className="text-sm text-gray-400">出品者情報なし</p>
            </div>
          )}

          {/* Inquiry Form — with gradient header */}
          <div className="card overflow-hidden sticky top-24">
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 px-6 py-4 border-b border-primary-100">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                お問い合わせ
              </h2>
              <p className="text-sm text-primary-700/70 mt-1">導入検討中ですか？ 気軽にご相談ください。</p>
            </div>
            <div className="p-6">
              <InquiryForm productId={product.id} productName={product.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

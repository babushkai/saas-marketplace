import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPricingLabel, getPricingColor } from "@/lib/utils";
import { InquiryForm } from "@/components/products/InquiryForm";
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

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

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
    is_verified: false,
    created_at: "",
    updated_at: "",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="card p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                {product.logo_url ? (
                  <Image
                    src={product.logo_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  {product.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      認証済み
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{product.tagline}</p>

                <div className="flex items-center gap-3 mt-4">
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full sm:w-auto"
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
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              プロダクト詳細
            </h2>
            <div className="prose prose-gray max-w-none">
              {product.description.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-xl font-bold mt-6 mb-3">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="text-lg font-semibold mt-4 mb-2">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <li key={i} className="ml-4">
                      {line.replace("- ", "").replace(/\*\*/g, "")}
                    </li>
                  );
                }
                if (line.trim() === "") {
                  return <br key={i} />;
                }
                return (
                  <p key={i} className="text-gray-600">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                    {seller.display_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-gray-900 group-hover:text-primary-600">
                    {seller.display_name}
                  </p>
                  {seller.is_verified && (
                    <svg
                      className="w-4 h-4 text-blue-500 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-label="認証済み"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {seller.company_name && (
                  <p className="text-sm text-gray-500">
                    {seller.company_name}
                  </p>
                )}
              </div>
            </Link>
            {seller.bio && (
              <p className="mt-4 text-sm text-gray-600">{seller.bio}</p>
            )}
          </div>

          {/* Inquiry Form */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              お問い合わせ
            </h2>
            <InquiryForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

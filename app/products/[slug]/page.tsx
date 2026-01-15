import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPricingLabel, getPricingColor } from "@/lib/utils";
import { InquiryForm } from "@/components/products/InquiryForm";
import type { Product, Seller } from "@/types/database";

// Mock data for development
const mockProduct: Product & { seller: Seller } = {
  id: "1",
  seller_id: "seller-1",
  slug: "cloud-invoice",
  name: "クラウド請求書",
  tagline: "請求書作成から入金管理まで、すべてをクラウドで完結",
  description: `## クラウド請求書とは

中小企業向けの請求書管理SaaSです。請求書の作成から送付、入金管理までをクラウド上で完結できます。

### 主な機能

- **請求書作成**: テンプレートから簡単に請求書を作成
- **自動送付**: メールやPDFでの自動送付
- **入金管理**: 銀行口座との連携で入金を自動照合
- **レポート**: 売上・未回収レポートの自動生成

### こんな方におすすめ

- 請求書作成に時間がかかっている
- 入金管理をExcelで行っている
- 経理業務を効率化したい`,
  category: "finance",
  pricing_type: "freemium",
  price_info: "¥980/月〜",
  logo_url: null,
  screenshots: [],
  website_url: "https://example.com",
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  seller: {
    id: "seller-1",
    clerk_user_id: "user_xxx",
    username: "fintech-inc",
    display_name: "フィンテック株式会社",
    company_name: "フィンテック株式会社",
    bio: "中小企業のDXを推進するスタートアップです",
    avatar_url: null,
    website_url: "https://example.com",
    twitter_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  // In production, fetch from Supabase
  const product = params.slug === "cloud-invoice" ? mockProduct : null;

  if (!product) {
    notFound();
  }

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
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
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
              href={`/sellers/${product.seller.username}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                {product.seller.avatar_url ? (
                  <Image
                    src={product.seller.avatar_url}
                    alt={product.seller.display_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                    {product.seller.display_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-primary-600">
                  {product.seller.display_name}
                </p>
                {product.seller.company_name && (
                  <p className="text-sm text-gray-500">
                    {product.seller.company_name}
                  </p>
                )}
              </div>
            </Link>
            {product.seller.bio && (
              <p className="mt-4 text-sm text-gray-600">{product.seller.bio}</p>
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

import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/database";

// Mock data for development
const mockProducts: Product[] = [
  {
    id: "1",
    seller_id: "seller-1",
    slug: "cloud-invoice",
    name: "クラウド請求書",
    tagline: "請求書作成から入金管理まで、すべてをクラウドで完結",
    description: "中小企業向けの請求書管理SaaS",
    category: "finance",
    pricing_type: "freemium",
    price_info: "¥980/月〜",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    seller_id: "seller-1",
    slug: "team-chat-pro",
    name: "チームチャットPro",
    tagline: "チームコミュニケーションを加速する国産チャットツール",
    description: "日本企業向けのビジネスチャット",
    category: "communication",
    pricing_type: "paid",
    price_info: "¥500/ユーザー/月",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    seller_id: "seller-2",
    slug: "ai-writing-assistant",
    name: "AI文章アシスタント",
    tagline: "日本語に最適化されたAIライティング支援ツール",
    description: "日本語文章の校正・生成をAIでサポート",
    category: "productivity",
    pricing_type: "free",
    price_info: null,
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    seller_id: "seller-3",
    slug: "hr-management",
    name: "人事らくらく",
    tagline: "中小企業向け人事労務管理システム",
    description: "給与計算から勤怠管理まで一元化",
    category: "hr",
    pricing_type: "contact",
    price_info: null,
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const categories = [
  { id: "all", name: "すべて" },
  { id: "marketing", name: "マーケティング" },
  { id: "sales", name: "営業・CRM" },
  { id: "finance", name: "経理・財務" },
  { id: "hr", name: "人事・労務" },
  { id: "productivity", name: "業務効率化" },
  { id: "communication", name: "コミュニケーション" },
];

interface ProductsPageProps {
  searchParams: { category?: string; q?: string };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const selectedCategory = searchParams.category || "all";

  // Filter products (mock implementation)
  const filteredProducts =
    selectedCategory === "all"
      ? mockProducts
      : mockProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          プロダクト一覧
        </h1>
        <p className="text-gray-600">
          日本発のSaaS製品・サービスを探してみましょう
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Categories */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card p-4">
            <h2 className="font-semibold text-gray-900 mb-4">カテゴリー</h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={
                    category.id === "all"
                      ? "/products"
                      : `/products?category=${category.id}`
                  }
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="card p-4 mt-4">
            <h2 className="font-semibold text-gray-900 mb-4">料金体系</h2>
            <div className="space-y-2">
              {[
                { id: "free", name: "無料" },
                { id: "freemium", name: "フリーミアム" },
                { id: "paid", name: "有料" },
                { id: "contact", name: "要問合せ" },
              ].map((pricing) => (
                <label key={pricing.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">{pricing.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="プロダクトを検索..."
                className="input pl-10"
                defaultValue={searchParams.q}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredProducts.length}件のプロダクト
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当するプロダクトがありません</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

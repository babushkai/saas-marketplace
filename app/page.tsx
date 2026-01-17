import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Product } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const categories = [
  { id: "marketing", name: "マーケティング" },
  { id: "sales", name: "営業・CRM" },
  { id: "finance", name: "経理・財務" },
  { id: "hr", name: "人事・労務" },
  { id: "productivity", name: "業務効率化" },
  { id: "communication", name: "コミュニケーション" },
];

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }

  return data || [];
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return {};
  }

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_published", true);

  if (error || !data) {
    return {};
  }

  const counts: Record<string, number> = {};
  data.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return counts;
}

export default async function HomePage() {
  const [products, categoryCounts] = await Promise.all([
    getFeaturedProducts(),
    getCategoryCounts(),
  ]);
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            日本のSaaS・サービスを
            <br />
            見つけよう
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            国内発のSaaS製品・サービスを探せるマーケットプレイス。
            あなたのビジネスに最適なツールがきっと見つかります。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn btn-secondary text-gray-900">
              プロダクトを探す
            </Link>
            <Link
              href="/sign-up"
              className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20"
            >
              出品者として登録
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            カテゴリーから探す
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="card p-4 text-center hover:shadow-md transition-shadow"
              >
                <span className="font-medium text-gray-900">
                  {category.name}
                </span>
                <span className="block text-sm text-gray-500 mt-1">
                  {categoryCounts[category.id] || 0}件
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              注目のプロダクト
            </h2>
            <Link
              href="/products"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            あなたのSaaSを掲載しませんか？
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            日本のSaaSマーケットで、あなたのプロダクトを多くの企業にアピールしましょう。
          </p>
          <Link
            href="/sign-up"
            className="btn bg-primary-600 text-white hover:bg-primary-700"
          >
            無料で出品を始める
          </Link>
        </div>
      </section>
    </div>
  );
}

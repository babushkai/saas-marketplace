import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { StaggerGrid } from "@/components/ui/StaggerGrid";
import { Reveal } from "@/components/ui/Reveal";
import { Hero } from "@/components/home/Hero";
import { SectionHeading } from "@/components/home/SectionHeading";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getPopularProducts, getNewArrivals } from "@/lib/products";
import { HOMEPAGE_CATEGORIES, PRODUCT_CATEGORIES } from "@/lib/categories";
import type { Product } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const CATEGORY_ICONS: Record<string, string> = {
  marketing: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  sales: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  finance: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  hr: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  productivity: "M13 10V3L4 14h7v7l9-11h-7z",
  communication: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  development: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  design: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  other: "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z",
};

const CATEGORY_COLORS: Record<string, string> = {
  marketing: "bg-orange-100 text-orange-600",
  sales: "bg-blue-100 text-blue-600",
  finance: "bg-emerald-100 text-emerald-600",
  hr: "bg-purple-100 text-purple-600",
  productivity: "bg-amber-100 text-amber-600",
  communication: "bg-cyan-100 text-cyan-600",
  development: "bg-indigo-100 text-indigo-600",
  design: "bg-pink-100 text-pink-600",
  other: "bg-gray-100 text-gray-600",
};

const CATEGORY_BG_COLORS: Record<string, string> = {
  marketing: "bg-orange-500",
  sales: "bg-blue-500",
  finance: "bg-emerald-500",
  hr: "bg-purple-500",
  productivity: "bg-amber-500",
  communication: "bg-cyan-500",
  development: "bg-indigo-500",
  design: "bg-pink-500",
  other: "bg-gray-500",
};

async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_published", true);

  if (error || !data) return {};

  const counts: Record<string, number> = {};
  data.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}

export default async function HomePage() {
  const [categoryCounts, popularProducts, newArrivals] = await Promise.all([
    getCategoryCounts(),
    getPopularProducts(9),
    getNewArrivals(6),
  ]);

  const totalProducts = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  // Split the same popular-products fetch into a small hero social-proof strip
  // and the Trending Products grid below, so the two sections don't repeat
  // the same items back-to-back.
  const heroFeatured = popularProducts.slice(0, 3);
  const trendingProducts = popularProducts.slice(3, 9);

  return (
    <div>
      <Hero
        totalProducts={totalProducts}
        categoryCount={PRODUCT_CATEGORIES.length}
        featuredProducts={heroFeatured}
      />

      {/* Categories Section */}
      <Reveal as="section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Categories" title="カテゴリーから探す" href="/products" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOMEPAGE_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-card-premium hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className={`w-full h-2 ${CATEGORY_BG_COLORS[category.id] || "bg-gray-500"}`} />
                <div className="px-5 pb-5 pt-3 flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[category.id] || "bg-gray-100 text-gray-600"} group-hover:scale-110 transition-transform`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={CATEGORY_ICONS[category.id] || "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-gray-900 text-sm">
                      {category.name}
                    </span>
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {categoryCounts[category.id] || 0}件
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <Reveal as="section" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Trending"
              title="人気プロダクト"
              badge={{ label: "人気", color: "amber" }}
              href="/products?sort=popular"
            />
            {/* Mobile: horizontal scroll / Desktop: grid */}
            <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-thin">
              {trendingProducts.map((product) => (
                <div key={product.id} className="min-w-[280px] md:min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* New Arrivals */}
      <Reveal as="section" className={`py-16 ${trendingProducts.length > 0 ? "bg-white" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="New Arrivals"
            title="新着プロダクト"
            badge={{ label: "NEW", color: "green" }}
            href="/products"
          />
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </StaggerGrid>
        </div>
      </Reveal>

      {/* Value Proposition */}
      <Reveal as="section" className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="section-eyebrow justify-center">Why SaaSマーケット</span>
            <h2 className="section-title mx-auto mb-0">選ばれる理由</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "無料でプロダクトを掲載",
                desc: "初期費用ゼロ。フリープランなら永久無料で最大3プロダクトまで掲載可能。",
              },
              {
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                title: "すぐに問い合わせが届く",
                desc: "掲載後すぐに問い合わせフォームが有効に。リード獲得の機会を逃しません。",
              },
              {
                icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "国内B2B企業にリーチ",
                desc: "日本のSaaS市場に特化。ターゲット企業に直接プロダクトを届けられます。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-card-premium hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-5 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA Section */}
      <Reveal
        as="section"
        className="py-24 bg-gradient-to-br from-gray-900 via-primary-900 to-fuchsia-950 text-white relative overflow-hidden"
      >
        <div className="bg-grid-white absolute inset-0 opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-brand-tight mb-5 leading-[1.1]">
                あなたのSaaSを
                <br />
                掲載しませんか？
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                日本のSaaSマーケットで、あなたのプロダクトを多くの企業にアピールしましょう。
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-fuchsia-500 text-white font-semibold px-7 py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-fuchsia-900/40"
              >
                無料で出品を始める
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="space-y-4">
                {[
                  { step: "1", title: "アカウント作成", desc: "メールアドレスで簡単登録" },
                  { step: "2", title: "プロダクト情報を入力", desc: "名前・説明・料金体系を設定" },
                  { step: "3", title: "公開", desc: "審査なし、即時公開" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "カテゴリー一覧 - SaaSをカテゴリーから探す",
  description:
    "マーケティング、営業・CRM、経理・財務、人事・労務、業務効率化、コミュニケーション、開発、デザインなど、9つのカテゴリーからSaaS製品を探せます。",
  keywords: [
    "SaaSカテゴリー",
    "マーケティングツール",
    "CRMツール",
    "経理ソフト",
    "人事システム",
    "業務効率化",
    "ビジネスチャット",
  ],
  openGraph: {
    title: "カテゴリー一覧 - SaaSをカテゴリーから探す | SaaSマーケット",
    description:
      "9つのカテゴリーからSaaS製品を探せます。あなたのビジネスに最適なツールを見つけましょう。",
  },
};

const categoryInfo = [
  {
    id: "marketing",
    name: "マーケティング",
    description: "メールマーケティング、SNS管理、広告運用、SEO対策など",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    id: "sales",
    name: "営業・CRM",
    description: "顧客管理、営業支援、見積作成、商談管理など",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "finance",
    name: "経理・財務",
    description: "請求書管理、経費精算、会計ソフト、決算業務など",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "hr",
    name: "人事・労務",
    description: "採用管理、勤怠管理、給与計算、人事評価など",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "productivity",
    name: "業務効率化",
    description: "タスク管理、プロジェクト管理、ワークフロー自動化など",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "communication",
    name: "コミュニケーション",
    description: "ビジネスチャット、ビデオ会議、社内SNS、ナレッジ共有など",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: "development",
    name: "開発・エンジニアリング",
    description: "CI/CD、モニタリング、コードレビュー、開発ツールなど",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: "design",
    name: "デザイン",
    description: "UIデザイン、プロトタイピング、画像編集、動画制作など",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: "other",
    name: "その他",
    description: "上記カテゴリーに当てはまらないサービス",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
  },
];

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
  for (const product of data) {
    counts[product.category] = (counts[product.category] || 0) + 1;
  }
  return counts;
}

export default async function CategoriesPage() {
  const categoryCounts = await getCategoryCounts();
  const categories = categoryInfo.map((cat) => ({
    ...cat,
    count: categoryCounts[cat.id] || 0,
  }));
  const totalProducts = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            カテゴリー一覧
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {totalProducts}件のSaaS製品を{categoryInfo.length}つのカテゴリーから探せます。
            あなたのビジネスに最適なツールを見つけましょう。
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {category.count}件
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              お探しのカテゴリーがありませんか？
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              キーワードで検索するか、すべてのプロダクトを閲覧して
              最適なツールを見つけましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn btn-primary">
                すべてのプロダクトを見る
              </Link>
              <Link href="/search" className="btn btn-secondary">
                キーワードで検索
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

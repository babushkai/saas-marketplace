import Link from "next/link";
import { getDashboardData, getProfileCompleteness } from "@/lib/dashboard";
import { SellerGreeting } from "@/components/dashboard/SellerGreeting";
import { PLAN_LABELS } from "@/lib/plans";
import type { PlanTier } from "@/types/database";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

export default async function DashboardPage() {
  const { seller, stats, recentActivity } = await getDashboardData();
  const profile = getProfileCompleteness(seller);
  const plan = (seller?.plan as PlanTier) || "free";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          {seller ? (
            <SellerGreeting displayName={seller.display_name} />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">ダッシュボード</h1>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {PLAN_LABELS[plan]}プラン
            {stats.publishedProducts > 0 && ` · ${stats.publishedProducts}件公開中`}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          プロダクトを追加
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="プロダクト"
          value={stats.totalProducts}
          sub={`公開中 ${stats.publishedProducts}`}
        />
        <StatCard label="ページビュー" value={stats.totalViews} />
        <StatCard label="問い合わせ" value={stats.totalInquiries} />
        <StatCard
          label="未読"
          value={stats.unreadInquiries}
          highlight={stats.unreadInquiries > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">最近のアクティビティ</h2>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                まだアクティビティがありません
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentActivity.map((item, i) => (
                  <div key={`${item.date}-${i}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.subtitle}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(item.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile completeness */}
        <div>
          {profile.score < 100 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">プロフィール</h3>
                <span className="text-sm font-semibold text-gray-900">{profile.score}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div
                  className="bg-primary-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${profile.score}%` }}
                />
              </div>
              <div className="space-y-2.5">
                {profile.steps.map((step) => (
                  <div key={step.label} className="flex items-center gap-2 text-sm">
                    {step.done ? (
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-4 h-4 border border-gray-200 rounded-full flex-shrink-0" />
                    )}
                    <span className={step.done ? "text-gray-400 line-through" : "text-gray-700"}>{step.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/profile" className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-4">
                プロフィールを編集
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, highlight }: { label: string; value: number; sub?: string; highlight?: boolean }) {
  return (
    <div className={`card p-5 ${highlight ? "ring-1 ring-red-200" : ""}`}>
      <p className={`text-2xl font-semibold tracking-tight ${highlight ? "text-red-600" : "text-gray-900"}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

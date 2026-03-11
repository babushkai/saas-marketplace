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
      {/* Header with greeting */}
      <div className="mb-8">
        {seller ? (
          <SellerGreeting displayName={seller.display_name} />
        ) : (
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        )}
        <p className="text-gray-600 mt-1">
          {PLAN_LABELS[plan]}プラン
          {stats.totalProducts > 0 && ` · ${stats.publishedProducts}件のプロダクトを公開中`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="プロダクト" value={stats.totalProducts} icon={<BoxIcon />} color="blue" />
        <StatCard label="公開中" value={stats.publishedProducts} icon={<GlobeIcon />} color="green" />
        <StatCard label="ページビュー" value={stats.totalViews} icon={<EyeIcon />} color="sky" />
        <StatCard label="問い合わせ" value={stats.totalInquiries} icon={<ChatIcon />} color="purple" />
        <StatCard
          label="未読"
          value={stats.unreadInquiries}
          icon={<MailIcon />}
          color="red"
          highlight={stats.unreadInquiries > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Quick Actions + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary CTA */}
          <Link
            href="/dashboard/products/new"
            className="block card p-6 border-2 border-dashed border-primary-300 bg-gradient-to-r from-primary-50 to-blue-50 hover:from-primary-100 hover:to-blue-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">新しいプロダクトを追加</p>
                <p className="text-sm text-gray-600">SaaSやサービスをマーケットプレイスに出品しましょう</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Quick action row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/dashboard/products" className="card p-4 hover:bg-gray-50 transition-colors text-center group">
              <BoxIcon />
              <p className="text-sm font-medium text-gray-900 mt-2">プロダクト管理</p>
            </Link>
            <Link href="/dashboard/inquiries" className="card p-4 hover:bg-gray-50 transition-colors text-center group relative">
              <ChatIcon />
              <p className="text-sm font-medium text-gray-900 mt-2">お問い合わせ</p>
              {stats.unreadInquiries > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {stats.unreadInquiries}
                </span>
              )}
            </Link>
            <Link href="/dashboard/analytics" className="card p-4 hover:bg-gray-50 transition-colors text-center group">
              <ChartIcon />
              <p className="text-sm font-medium text-gray-900 mt-2">アクセス解析</p>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近のアクティビティ</h2>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">まだアクティビティがありません</p>
                <p className="text-gray-400 text-xs mt-1">プロダクトを公開するとお問い合わせが届きます</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === "inquiry" ? "bg-purple-100" : "bg-blue-100"
                    }`}>
                      {item.type === "inquiry" ? (
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subtitle} · {timeAgo(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Profile completeness + Guide */}
        <div className="space-y-6">
          {/* Profile Completeness */}
          {profile.score < 100 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">プロフィール完成度</h3>
                <span className="text-sm font-bold text-primary-600">{profile.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${profile.score}%` }}
                />
              </div>
              <div className="space-y-2">
                {profile.steps.map((step) => (
                  <div key={step.label} className="flex items-center gap-2 text-sm">
                    {step.done ? (
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                    )}
                    <span className={step.done ? "text-gray-400 line-through" : "text-gray-700"}>{step.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/profile" className="btn btn-secondary w-full mt-4 text-sm justify-center">
                プロフィールを編集
              </Link>
            </div>
          )}

          {/* Guide */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">はじめてのガイド</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">プロダクトを登録</p>
                  <p className="text-gray-500 text-xs">名前・説明・料金を入力して公開</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">お問い合わせを受付</p>
                  <p className="text-gray-500 text-xs">企業から直接メッセージが届きます</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">商談・成約</p>
                  <p className="text-gray-500 text-xs">返信して商談を進めましょう</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----- Icon components ----- */
function StatCard({ label, value, icon, color, highlight }: { label: string; value: number; icon: React.ReactNode; color: string; highlight?: boolean }) {
  const bgMap: Record<string, string> = { blue: "bg-blue-100", green: "bg-green-100", sky: "bg-sky-100", purple: "bg-purple-100", red: "bg-red-100" };
  const textMap: Record<string, string> = { blue: "text-blue-600", green: "text-green-600", sky: "text-sky-600", purple: "text-purple-600", red: "text-red-600" };
  return (
    <div className={`card p-4 ${highlight ? "ring-2 ring-red-200" : ""}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bgMap[color]} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span className={textMap[color]}>{icon}</span>
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className={`text-xl font-bold ${highlight ? "text-red-600" : "text-gray-900"}`}>{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function BoxIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>; }
function GlobeIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function EyeIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>; }
function ChatIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>; }
function MailIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>; }
function ChartIcon() { return <svg className="w-5 h-5 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>; }

import Link from "next/link";

export default function DashboardPage() {
  // Mock stats - in production, fetch from Supabase
  const stats = {
    products: 2,
    inquiries: 5,
    unreadInquiries: 3,
    views: 156,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">
          プロダクトの管理とお問い合わせの確認ができます
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-sm text-gray-600">公開プロダクト数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.products}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600">総お問い合わせ数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.inquiries}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600">未読のお問い合わせ</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {stats.unreadInquiries}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600">今月の閲覧数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.views}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            クイックアクション
          </h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/products/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  新しいプロダクトを追加
                </p>
                <p className="text-sm text-gray-500">
                  SaaSやサービスを出品しましょう
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/inquiries"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  お問い合わせを確認
                  {stats.unreadInquiries > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {stats.unreadInquiries}件の未読
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  見込み顧客からのメッセージを確認
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            はじめてのガイド
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">プロダクトを登録</p>
                <p className="text-gray-500">
                  SaaS名、説明、料金体系などを入力して公開
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">お問い合わせを受付</p>
                <p className="text-gray-500">
                  興味を持った企業からの問い合わせが届きます
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">商談・成約</p>
                <p className="text-gray-500">
                  お問い合わせに返信して商談を進めましょう
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Clerk to avoid build errors when not configured
const ClerkButton = dynamic(
  () =>
    import("@clerk/nextjs").then((mod) => ({
      default: ({ onClick, className, children }: { onClick: () => void; className: string; children: React.ReactNode }) => {
        const { openUserProfile } = mod.useClerk();
        return (
          <button onClick={() => openUserProfile()} className={className}>
            {children}
          </button>
        );
      },
    })),
  {
    ssr: false,
    loading: () => (
      <button className="btn btn-primary opacity-50" disabled>
        読み込み中...
      </button>
    ),
  }
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    emailInquiries: true,
    emailMarketing: false,
    emailUpdates: true,
    browserNotifications: true,
  });

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Save to database when notifications table is added
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    setSuccessMessage("通知設定を更新しました");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const tabs = [
    { id: "notifications", name: "通知設定" },
    { id: "billing", name: "請求・プラン" },
    { id: "security", name: "セキュリティ" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600 mt-1">
          アカウントの設定や通知の管理ができます
        </p>
        <p className="text-sm text-gray-500 mt-2">
          出品者プロフィールの編集は{" "}
          <Link href="/dashboard/profile" className="text-primary-600 hover:underline">
            プロフィールページ
          </Link>
          {" "}から行えます
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <form onSubmit={handleNotificationsSubmit} className="max-w-2xl">
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                メール通知
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">問い合わせ通知</p>
                    <p className="text-sm text-gray-500">
                      新しい問い合わせがあったときにメールを受け取る
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailInquiries}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailInquiries: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-primary-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      マーケティングメール
                    </p>
                    <p className="text-sm text-gray-500">
                      新機能や特別オファーについてのお知らせ
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailMarketing}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailMarketing: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-primary-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      プロダクトアップデート
                    </p>
                    <p className="text-sm text-gray-500">
                      重要な更新やセキュリティ情報
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailUpdates: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-primary-600 rounded"
                  />
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ブラウザ通知
              </h3>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    プッシュ通知を有効にする
                  </p>
                  <p className="text-sm text-gray-500">
                    ブラウザでリアルタイム通知を受け取る
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.browserNotifications}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      browserNotifications: e.target.checked,
                    })
                  }
                  className="h-5 w-5 text-primary-600 rounded"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? "保存中..." : "変更を保存"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="max-w-2xl">
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">現在のプラン</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                無料プラン
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              現在は無料プランをご利用中です。すべての機能をお試しいただけます。
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-gray-900">¥0</span>
              <span className="text-gray-600">/月</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                有料プランは近日公開予定です。より多くのプロダクト掲載や詳細なアナリティクス機能をご利用いただけるようになります。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="max-w-2xl space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              アカウントセキュリティ
            </h3>
            <p className="text-gray-600 mb-4">
              パスワードの変更、二要素認証の設定、その他のセキュリティ設定はClerkアカウント管理から行えます。
            </p>
            <ClerkButton onClick={() => {}} className="btn btn-primary">
              アカウント設定を開く
            </ClerkButton>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              セキュリティのヒント
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>強力なパスワードを使用してください（12文字以上推奨）</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>二要素認証を有効にしてアカウントを保護しましょう</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>他のサービスと同じパスワードを使い回さないでください</span>
              </li>
            </ul>
          </div>

          <div className="card p-6 border-red-200">
            <h3 className="text-lg font-medium text-red-600 mb-4">
              アカウントの削除
            </h3>
            <p className="text-gray-600 mb-4">
              アカウントを削除すると、すべてのデータが完全に削除されます。
              この操作は取り消せません。
            </p>
            <ClerkButton onClick={() => {}} className="btn bg-red-600 text-white hover:bg-red-700">
              アカウント管理へ
            </ClerkButton>
          </div>
        </div>
      )}
    </div>
  );
}

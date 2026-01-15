"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: "山田 太郎",
    email: "yamada@example.com",
    company: "株式会社サンプル",
    bio: "SaaSプロダクトの開発・提供を行っています。",
    website: "https://example.com",
    twitter: "@yamada",
  });

  const [notifications, setNotifications] = useState({
    emailInquiries: true,
    emailMarketing: false,
    emailUpdates: true,
    browserNotifications: true,
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement profile update
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccessMessage("プロフィールを更新しました");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement notifications update
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccessMessage("通知設定を更新しました");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const tabs = [
    { id: "profile", name: "プロフィール" },
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="max-w-2xl">
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <button type="button" className="btn btn-secondary text-sm">
                  画像を変更
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF (最大2MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="label">
                  お名前
                </label>
                <input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="label">
                会社名
              </label>
              <input
                id="company"
                type="text"
                value={profile.company}
                onChange={(e) =>
                  setProfile({ ...profile, company: e.target.value })
                }
                className="input"
              />
            </div>

            <div>
              <label htmlFor="bio" className="label">
                自己紹介
              </label>
              <textarea
                id="bio"
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="input resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="label">
                  ウェブサイト
                </label>
                <input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) =>
                    setProfile({ ...profile, website: e.target.value })
                  }
                  className="input"
                  placeholder="https://"
                />
              </div>
              <div>
                <label htmlFor="twitter" className="label">
                  Twitter
                </label>
                <input
                  id="twitter"
                  type="text"
                  value={profile.twitter}
                  onChange={(e) =>
                    setProfile({ ...profile, twitter: e.target.value })
                  }
                  className="input"
                  placeholder="@username"
                />
              </div>
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
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                スタンダード
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              5プロダクトまで掲載可能、無制限のPV
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-gray-900">¥4,980</span>
              <span className="text-gray-600">/月</span>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-primary">プランを変更</button>
              <button className="btn btn-secondary">請求履歴を見る</button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              支払い方法
            </h3>
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">VISA</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">**** **** **** 4242</p>
                <p className="text-sm text-gray-500">有効期限: 12/26</p>
              </div>
              <button className="ml-auto text-sm text-primary-600 hover:text-primary-700">
                変更
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="max-w-2xl space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              パスワードの変更
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="label">
                  現在のパスワード
                </label>
                <input
                  id="current-password"
                  type="password"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="label">
                  新しいパスワード
                </label>
                <input id="new-password" type="password" className="input" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="label">
                  新しいパスワード（確認）
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="input"
                />
              </div>
              <button className="btn btn-primary">パスワードを変更</button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              二要素認証
            </h3>
            <p className="text-gray-600 mb-4">
              二要素認証を有効にして、アカウントのセキュリティを強化しましょう。
            </p>
            <button className="btn btn-secondary">二要素認証を設定</button>
          </div>

          <div className="card p-6 border-red-200">
            <h3 className="text-lg font-medium text-red-600 mb-4">
              アカウントの削除
            </h3>
            <p className="text-gray-600 mb-4">
              アカウントを削除すると、すべてのデータが完全に削除されます。
              この操作は取り消せません。
            </p>
            <button className="btn bg-red-600 text-white hover:bg-red-700">
              アカウントを削除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

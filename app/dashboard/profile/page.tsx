"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    username: "yamada-corp",
    displayName: "株式会社ヤマダ",
    companyName: "株式会社ヤマダ",
    bio: "中小企業向けのクラウドソリューションを提供しています。\n\n2020年創業。請求書管理やプロジェクト管理など、業務効率化を支援するSaaSを開発・運営しています。",
    avatarUrl: "",
    websiteUrl: "https://example.com",
    twitterUrl: "https://twitter.com/yamada_corp",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement profile update API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccessMessage("プロフィールを更新しました");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">公開プロフィール</h1>
        <p className="text-gray-600 mt-1">
          購入者に表示される出品者プロフィールを編集します
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="card p-6 space-y-6">
              {/* Avatar */}
              <div>
                <label className="label">プロフィール画像</label>
                <div className="flex items-center gap-6 mt-2">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                    {profile.displayName.charAt(0)}
                  </div>
                  <div>
                    <button type="button" className="btn btn-secondary text-sm">
                      画像をアップロード
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      推奨: 400x400px以上、JPG/PNG形式、最大2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="label">
                  ユーザー名 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500">saas-marketplace.jp/sellers/</span>
                  <input
                    id="username"
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    className="input flex-1"
                    pattern="[a-z0-9-]+"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  小文字英数字とハイフンのみ使用可能
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="label">
                  表示名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={profile.displayName}
                  onChange={(e) =>
                    setProfile({ ...profile, displayName: e.target.value })
                  }
                  className="input mt-1"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="label">
                  会社名
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={profile.companyName}
                  onChange={(e) =>
                    setProfile({ ...profile, companyName: e.target.value })
                  }
                  className="input mt-1"
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="label">
                  自己紹介
                </label>
                <textarea
                  id="bio"
                  rows={5}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="input mt-1 resize-none"
                  placeholder="会社やサービスについて紹介してください"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Markdown形式で記述できます
                </p>
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="websiteUrl" className="label">
                  ウェブサイト
                </label>
                <input
                  id="websiteUrl"
                  type="url"
                  value={profile.websiteUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, websiteUrl: e.target.value })
                  }
                  className="input mt-1"
                  placeholder="https://"
                />
              </div>

              {/* Twitter URL */}
              <div>
                <label htmlFor="twitterUrl" className="label">
                  Twitter / X
                </label>
                <input
                  id="twitterUrl"
                  type="url"
                  value={profile.twitterUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, twitterUrl: e.target.value })
                  }
                  className="input mt-1"
                  placeholder="https://twitter.com/username"
                />
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
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <h2 className="text-sm font-medium text-gray-500 mb-4">
              プレビュー
            </h2>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">
                {profile.displayName.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900">
                {profile.displayName || "表示名"}
              </h3>
              {profile.companyName && (
                <p className="text-sm text-gray-600">{profile.companyName}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                @{profile.username || "username"}
              </p>
              {profile.bio && (
                <p className="text-sm text-gray-600 mt-4 text-left whitespace-pre-line line-clamp-4">
                  {profile.bio}
                </p>
              )}
              <div className="flex justify-center gap-3 mt-4">
                {profile.websiteUrl && (
                  <span className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                )}
                {profile.twitterUrl && (
                  <span className="text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                href={`/sellers/${profile.username}`}
                className="text-sm text-primary-600 hover:text-primary-700"
                target="_blank"
              >
                公開ページを見る →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

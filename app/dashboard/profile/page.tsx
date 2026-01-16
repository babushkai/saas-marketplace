"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageUpload } from "@/components/common/ImageUpload";

interface ProfileData {
  username: string;
  display_name: string;
  company_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  twitter_url: string | null;
}

export default function DashboardProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    display_name: "",
    company_name: "",
    bio: "",
    avatar_url: "",
    website_url: "",
    twitter_url: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/sellers?current=true");
        if (response.ok) {
          const data = await response.json();
          if (data.seller) {
            setProfile({
              username: data.seller.username || "",
              display_name: data.seller.display_name || "",
              company_name: data.seller.company_name || "",
              bio: data.seller.bio || "",
              avatar_url: data.seller.avatar_url || "",
              website_url: data.seller.website_url || "",
              twitter_url: data.seller.twitter_url || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    const payload = {
      username: profile.username,
      display_name: profile.display_name,
      company_name: profile.company_name || null,
      bio: profile.bio || null,
      avatar_url: profile.avatar_url || null,
      website_url: profile.website_url || null,
      twitter_url: profile.twitter_url || null,
    };

    console.log("Saving profile with payload:", payload);

    try {
      const response = await fetch("/api/sellers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.error || "更新に失敗しました");
      }

      setSuccessMessage("プロフィールを更新しました");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
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
                <ImageUpload
                  currentImage={profile.avatar_url}
                  onUpload={(url) => setProfile({ ...profile, avatar_url: url })}
                  type="avatar"
                  size="md"
                  shape="circle"
                  placeholder={profile.display_name?.charAt(0) || "?"}
                  className="mt-2"
                />
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
                    onChange={(e) => {
                      // Only allow lowercase letters, numbers, and hyphens
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setProfile({ ...profile, username: value });
                    }}
                    className="input flex-1"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  小文字英数字とハイフンのみ使用可能
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="display_name" className="label">
                  表示名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="display_name"
                  type="text"
                  value={profile.display_name}
                  onChange={(e) =>
                    setProfile({ ...profile, display_name: e.target.value })
                  }
                  className="input mt-1"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="company_name" className="label">
                  会社名
                </label>
                <input
                  id="company_name"
                  type="text"
                  value={profile.company_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, company_name: e.target.value })
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
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="input mt-1 resize-none"
                  placeholder="会社やサービスについて紹介してください"
                />
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="website_url" className="label">
                  ウェブサイト
                </label>
                <input
                  id="website_url"
                  type="url"
                  value={profile.website_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, website_url: e.target.value })
                  }
                  className="input mt-1"
                  placeholder="https://"
                />
              </div>

              {/* Twitter URL */}
              <div>
                <label htmlFor="twitter_url" className="label">
                  Twitter / X
                </label>
                <input
                  id="twitter_url"
                  type="url"
                  value={profile.twitter_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, twitter_url: e.target.value })
                  }
                  className="input mt-1"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? "保存中..." : "変更を保存"}
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
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4 overflow-hidden relative">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  profile.display_name?.charAt(0) || "?"
                )}
              </div>
              <h3 className="font-semibold text-gray-900">
                {profile.display_name || "表示名"}
              </h3>
              {profile.company_name && (
                <p className="text-sm text-gray-600">{profile.company_name}</p>
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
                {profile.website_url && (
                  <span className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                )}
                {profile.twitter_url && (
                  <span className="text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            {profile.username && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href={`/sellers/${profile.username}`}
                  className="text-sm text-primary-600 hover:text-primary-700"
                  target="_blank"
                >
                  公開ページを見る →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

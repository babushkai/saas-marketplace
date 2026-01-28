"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ImageUpload } from "@/components/common/ImageUpload";
import { FormField, TextareaField, SelectField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";
import type { PricingType } from "@/types/database";

const categories = [
  { id: "marketing", name: "マーケティング" },
  { id: "sales", name: "営業・CRM" },
  { id: "finance", name: "経理・財務" },
  { id: "hr", name: "人事・労務" },
  { id: "productivity", name: "業務効率化" },
  { id: "communication", name: "コミュニケーション" },
  { id: "development", name: "開発・エンジニアリング" },
  { id: "design", name: "デザイン" },
  { id: "other", name: "その他" },
];

const pricingTypes: { id: PricingType; name: string; description: string }[] = [
  { id: "free", name: "無料", description: "完全無料で利用可能" },
  { id: "freemium", name: "フリーミアム", description: "基本無料、有料プランあり" },
  { id: "paid", name: "有料", description: "有料プランのみ" },
  { id: "contact", name: "要問合せ", description: "料金は問い合わせ後に提示" },
];

// Validation functions
const validateUrl = (value: string): string | null => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return "有効なURLを入力してください";
  }
};

const validateTagline = (value: string): string | null => {
  if (value.length > 100) {
    return "100文字以内で入力してください";
  }
  return null;
};

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    // Validate required fields
    const errors: Record<string, string> = {};
    const name = formData.get("name") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const pricingType = formData.get("pricing_type") as string;
    const websiteUrl = formData.get("website_url") as string;

    if (!name?.trim()) errors.name = "プロダクト名は必須です";
    if (!tagline?.trim()) errors.tagline = "キャッチコピーは必須です";
    if (tagline && tagline.length > 100) errors.tagline = "100文字以内で入力してください";
    if (!description?.trim()) errors.description = "詳細説明は必須です";
    if (!category) errors.category = "カテゴリーを選択してください";
    if (!pricingType) errors.pricing_type = "料金タイプを選択してください";
    if (websiteUrl && validateUrl(websiteUrl)) errors.website_url = "有効なURLを入力してください";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      showToast("入力内容に誤りがあります", "error");
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const data = {
      name: name,
      tagline: tagline,
      description: description,
      category: category,
      pricing_type: pricingType as PricingType,
      price_info: formData.get("price_info") as string || null,
      website_url: websiteUrl || null,
      is_published: formData.get("is_published") === "true",
      logo_url: logoUrl,
      screenshots: screenshots,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("プロダクトの作成に失敗しました");
      }

      showToast("プロダクトを作成しました", "success");
      router.push("/dashboard/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      showToast("プロダクトの作成に失敗しました", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          プロダクト一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          新しいプロダクトを追加
        </h1>
        <p className="text-gray-600 mt-1">
          SaaSやサービスの情報を入力して出品しましょう
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl" noValidate>
        <div className="card p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              基本情報
            </h2>

            <div className="space-y-4">
              {/* Logo */}
              <div>
                <label className="label">ロゴ画像</label>
                <ImageUpload
                  currentImage={logoUrl}
                  onUpload={(url) => setLogoUrl(url)}
                  type="logo"
                  size="md"
                  shape="square"
                  className="mt-2"
                />
              </div>

              <FormField
                id="name"
                name="name"
                label="プロダクト名"
                required
                placeholder="例: クラウド請求書"
                error={fieldErrors.name}
              />

              <FormField
                id="tagline"
                name="tagline"
                label="キャッチコピー"
                required
                placeholder="例: 請求書作成から入金管理まで、すべてをクラウドで完結"
                maxLength={100}
                hint="100文字以内で簡潔に"
                validate={validateTagline}
                error={fieldErrors.tagline}
              />

              <TextareaField
                id="description"
                name="description"
                label="詳細説明"
                required
                rows={8}
                placeholder="プロダクトの特徴、機能、利用シーンなどを詳しく記載してください。Markdown形式で記述できます。"
                error={fieldErrors.description}
              />

              <SelectField
                id="category"
                name="category"
                label="カテゴリー"
                required
                placeholder="選択してください"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                error={fieldErrors.category}
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              料金体系
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label">
                  料金タイプ <span className="text-red-500">*</span>
                </label>
                <div
                  className={`grid grid-cols-2 gap-3 ${fieldErrors.pricing_type ? "ring-2 ring-red-500 ring-offset-2 rounded-lg" : ""}`}
                  role="radiogroup"
                  aria-label="料金タイプ"
                  id="pricing_type"
                >
                  {pricingTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="pricing_type"
                        value={type.id}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{type.name}</p>
                        <p className="text-xs text-gray-500">
                          {type.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {fieldErrors.pricing_type && (
                  <p className="text-sm text-red-600 mt-1" role="alert">
                    {fieldErrors.pricing_type}
                  </p>
                )}
              </div>

              <FormField
                id="price_info"
                name="price_info"
                label="料金詳細"
                placeholder="例: ¥980/月〜、¥500/ユーザー/月"
                hint="具体的な料金がある場合は記載してください"
              />
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              スクリーンショット
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              プロダクトの画面イメージを最大5枚までアップロードできます
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {screenshots.map((url, index) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                  <Image
                    src={url}
                    alt={`スクリーンショット ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setScreenshots(screenshots.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {screenshots.length < 5 && (
                <ImageUpload
                  currentImage={null}
                  onUpload={(url) => setScreenshots([...screenshots, url])}
                  type="screenshot"
                  size="lg"
                  shape="square"
                />
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              リンク
            </h2>

            <FormField
              id="website_url"
              name="website_url"
              type="url"
              label="公式サイトURL"
              placeholder="https://example.com"
              validate={validateUrl}
              error={fieldErrors.website_url}
            />
          </div>

          {/* Publish */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              公開設定
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                <input
                  type="radio"
                  name="is_published"
                  value="true"
                  defaultChecked
                />
                <div>
                  <p className="font-medium text-gray-900">公開する</p>
                  <p className="text-xs text-gray-500">
                    すぐにマーケットプレイスに掲載されます
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                <input type="radio" name="is_published" value="false" />
                <div>
                  <p className="font-medium text-gray-900">下書きとして保存</p>
                  <p className="text-xs text-gray-500">
                    あとから公開できます
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "保存中..." : "プロダクトを追加"}
            </button>
            <Link
              href="/dashboard/products"
              className="btn btn-secondary"
            >
              キャンセル
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { PricingType, Product } from "@/types/database";

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

// Mock data - replace with actual API call
const mockProduct: Product = {
  id: "1",
  seller_id: "seller-1",
  slug: "cloud-invoice",
  name: "クラウド請求書",
  tagline: "請求書作成から入金管理まで、すべてをクラウドで完結",
  description:
    "中小企業向けの請求書管理SaaS。\n\n## 主な機能\n- 請求書の作成・送付\n- 入金管理\n- 顧客管理\n- レポート機能",
  category: "finance",
  pricing_type: "freemium",
  price_info: "¥980/月〜",
  logo_url: null,
  screenshots: [],
  website_url: "https://example.com",
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // TODO: Fetch product from API
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProduct(mockProduct);
      } catch (err) {
        setError("プロダクトの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      tagline: formData.get("tagline") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      pricing_type: formData.get("pricing_type") as PricingType,
      price_info: (formData.get("price_info") as string) || null,
      website_url: (formData.get("website_url") as string) || null,
      is_published: formData.get("is_published") === "true",
    };

    try {
      // TODO: Implement API call
      console.log("Update product:", productId, data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  }

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

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          プロダクトが見つかりません
        </h2>
        <p className="text-gray-600 mb-4">
          指定されたプロダクトは存在しないか、削除されました。
        </p>
        <Link href="/dashboard/products" className="btn btn-primary">
          プロダクト一覧に戻る
        </Link>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-gray-900">プロダクトを編集</h1>
        <p className="text-gray-600 mt-1">{product.name}の情報を編集します</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              基本情報
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  プロダクト名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={product.name}
                  className="input"
                  placeholder="例: クラウド請求書"
                />
              </div>

              <div>
                <label htmlFor="tagline" className="label">
                  キャッチコピー <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  required
                  defaultValue={product.tagline}
                  className="input"
                  placeholder="例: 請求書作成から入金管理まで、すべてをクラウドで完結"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">100文字以内で簡潔に</p>
              </div>

              <div>
                <label htmlFor="description" className="label">
                  詳細説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={8}
                  defaultValue={product.description}
                  className="input resize-none"
                  placeholder="プロダクトの特徴、機能、利用シーンなどを詳しく記載してください。Markdown形式で記述できます。"
                />
              </div>

              <div>
                <label htmlFor="category" className="label">
                  カテゴリー <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue={product.category}
                  className="input"
                >
                  <option value="">選択してください</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
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
                <div className="grid grid-cols-2 gap-3">
                  {pricingTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
                    >
                      <input
                        type="radio"
                        name="pricing_type"
                        value={type.id}
                        defaultChecked={product.pricing_type === type.id}
                        required
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{type.name}</p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="price_info" className="label">
                  料金詳細
                </label>
                <input
                  type="text"
                  id="price_info"
                  name="price_info"
                  defaultValue={product.price_info || ""}
                  className="input"
                  placeholder="例: ¥980/月〜、¥500/ユーザー/月"
                />
                <p className="text-xs text-gray-500 mt-1">
                  具体的な料金がある場合は記載してください
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">リンク</h2>

            <div>
              <label htmlFor="website_url" className="label">
                公式サイトURL
              </label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                defaultValue={product.website_url || ""}
                className="input"
                placeholder="https://example.com"
              />
            </div>
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
                  defaultChecked={product.is_published}
                />
                <div>
                  <p className="font-medium text-gray-900">公開する</p>
                  <p className="text-xs text-gray-500">
                    マーケットプレイスに掲載されます
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                <input
                  type="radio"
                  name="is_published"
                  value="false"
                  defaultChecked={!product.is_published}
                />
                <div>
                  <p className="font-medium text-gray-900">非公開にする</p>
                  <p className="text-xs text-gray-500">
                    マーケットプレイスから非表示になります
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
              {isSubmitting ? "保存中..." : "変更を保存"}
            </button>
            <Link href="/dashboard/products" className="btn btn-secondary">
              キャンセル
            </Link>
          </div>
        </div>
      </form>

      {/* Delete Section */}
      <div className="max-w-2xl mt-8">
        <div className="card p-6 border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            プロダクトを削除
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            プロダクトを削除すると、すべてのデータが完全に削除されます。
            この操作は取り消せません。
          </p>
          <button className="btn bg-red-600 text-white hover:bg-red-700">
            プロダクトを削除
          </button>
        </div>
      </div>
    </div>
  );
}

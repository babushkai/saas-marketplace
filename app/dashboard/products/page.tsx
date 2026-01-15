import Link from "next/link";
import Image from "next/image";
import { getPricingLabel, getPricingColor, formatDate } from "@/lib/utils";
import type { Product } from "@/types/database";

// Mock data for development
const mockProducts: Product[] = [
  {
    id: "1",
    seller_id: "seller-1",
    slug: "cloud-invoice",
    name: "クラウド請求書",
    tagline: "請求書作成から入金管理まで、すべてをクラウドで完結",
    description: "中小企業向けの請求書管理SaaS",
    category: "finance",
    pricing_type: "freemium",
    price_info: "¥980/月〜",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    seller_id: "seller-1",
    slug: "expense-tracker",
    name: "経費精算くん",
    tagline: "スマホで撮影するだけで経費精算が完了",
    description: "OCRで領収書を自動読み取り",
    category: "finance",
    pricing_type: "paid",
    price_info: "¥300/ユーザー/月",
    logo_url: null,
    screenshots: [],
    website_url: "https://example.com",
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ProductsManagementPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プロダクト管理</h1>
          <p className="text-gray-600 mt-1">登録したプロダクトの管理ができます</p>
        </div>
        <Link href="/dashboard/products/new" className="btn btn-primary">
          <svg
            className="w-5 h-5 mr-2"
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
          新規追加
        </Link>
      </div>

      {mockProducts.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            まだプロダクトがありません
          </h3>
          <p className="text-gray-500 mb-4">
            最初のプロダクトを追加して、出品を始めましょう
          </p>
          <Link href="/dashboard/products/new" className="btn btn-primary">
            プロダクトを追加
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プロダクト
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  料金
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.logo_url ? (
                          <Image
                            src={product.logo_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.tagline}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPricingColor(product.pricing_type)}`}
                    >
                      {getPricingLabel(product.pricing_type)}
                    </span>
                    {product.price_info && (
                      <p className="text-xs text-gray-500 mt-1">
                        {product.price_info}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.is_published ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        公開中
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        下書き
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(product.updated_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="プレビュー"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600"
                        title="編集"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

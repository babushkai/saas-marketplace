import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-primary-600">
              SaaSマーケット
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              日本発のSaaS製品・サービスを見つけるマーケットプレイス。
              あなたのビジネスを加速させるツールがここにあります。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              プロダクト
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  プロダクト一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  カテゴリー
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              出品者向け
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  出品者登録
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ダッシュボード
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} SaaSマーケット. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

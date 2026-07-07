import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-2xl shadow-inner mb-6">
          <span className="text-5xl">🔍</span>
        </div>
        <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          ページが見つかりませんでした
        </h1>
        <p className="text-gray-500 mb-8">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn btn-primary btn-lg">
            ホームに戻る
          </Link>
          <Link href="/products" className="btn btn-outline btn-lg">
            プロダクトを探す
          </Link>
        </div>
      </div>
    </div>
  );
}

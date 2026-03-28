import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-2xl shadow-inner mb-6">
          <span className="text-5xl">📦</span>
        </div>
        <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          プロダクトが見つかりませんでした
        </h1>
        <p className="text-gray-500 mb-8">
          このURLのプロダクトは存在しないか、非公開になっています。
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/products" className="btn btn-primary btn-lg">
            プロダクトを探す
          </Link>
          <Link href="/" className="btn btn-outline btn-lg">
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

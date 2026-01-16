import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog/posts";

export const metadata = {
  title: "ブログ | SaaSマーケット",
  description: "SaaS比較、業務効率化、DX推進に関する情報を発信しています。",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ブログ</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            SaaS比較、業務効率化、DX推進に関する情報を発信しています
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Link
            href="/blog"
            className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
          >
            すべて
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${encodeURIComponent(category)}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="card overflow-hidden group">
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white/80 text-6xl font-bold">
                  {post.title.charAt(0)}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.readingTime}分で読める
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    続きを読む →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">記事がありません</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              SaaSを探していますか？
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              SaaSマーケットでは、日本発のSaaS製品を簡単に比較・検索できます。
            </p>
            <Link href="/products" className="btn btn-primary">
              プロダクトを探す
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

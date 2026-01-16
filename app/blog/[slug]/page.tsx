import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | SaaSマーケット`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-gray-700">
                ブログ
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {post.readingTime}分で読める
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium">
                {post.author.name.charAt(0)}
              </div>
              <span>{post.author.name}</span>
            </div>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-gray max-w-none">
          {post.content.split("\n").map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("#### ")) {
              return (
                <h4 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                  {paragraph.replace("#### ", "")}
                </h4>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <li key={index} className="text-gray-700 ml-4">
                  {paragraph.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
                </li>
              );
            }
            if (paragraph.startsWith("1. ") || paragraph.startsWith("2. ") || paragraph.startsWith("3. ") || paragraph.startsWith("4. ") || paragraph.startsWith("5. ")) {
              return (
                <li key={index} className="text-gray-700 ml-4 list-decimal">
                  {paragraph.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                </li>
              );
            }
            if (paragraph.trim() === "") {
              return null;
            }
            return (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph.replace(/\*\*(.*?)\*\*/g, "$1")}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            SaaSを探していますか？
          </h3>
          <p className="text-gray-600 mb-4">
            SaaSマーケットでは、日本発のSaaS製品を簡単に比較・検索できます。
          </p>
          <Link href="/products" className="btn btn-primary">
            プロダクトを探す →
          </Link>
        </div>

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">この記事をシェア</p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://saas-marketplace-zeta.vercel.app/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://saas-marketplace-zeta.vercel.app/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            ブログ一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
}

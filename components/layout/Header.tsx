"use client";

import Link from "next/link";

// Mock auth state for UI preview
const MOCK_SIGNED_IN = true;

export function Header() {
  const isSignedIn = MOCK_SIGNED_IN;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              SaaSマーケット
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                プロダクト一覧
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                カテゴリー
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  ダッシュボード
                </Link>
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  U
                </div>
              </>
            ) : (
              <>
                <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  ログイン
                </button>
                <button className="btn btn-primary text-sm">
                  無料で始める
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

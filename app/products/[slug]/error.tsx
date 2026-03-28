"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Product page error:", error.message, error.digest ? `(digest: ${error.digest})` : "");
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-2xl mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          エラーが発生しました
        </h1>
        <p className="text-gray-500 mb-8">
          申し訳ありません。プロダクトの読み込み中に問題が発生しました。
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-primary">
            もう一度試す
          </button>
          <Link href="/products" className="btn btn-outline">
            一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

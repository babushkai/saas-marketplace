"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export function ProductCreatedCelebration() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("created");

  useEffect(() => {
    if (slug) {
      // Clean URL to prevent re-trigger on refresh
      router.replace("/dashboard/products", { scroll: false });
    }
  }, [slug, router]);

  if (!slug) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center animate-scale-in">
        {/* Celebration icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          プロダクトを公開しました!
        </h2>
        <p className="text-gray-600 mb-6">
          おめでとうございます! あなたのプロダクトがマーケットプレイスに掲載されました。
        </p>

        <div className="space-y-3">
          <Link
            href={`/products/${slug}`}
            target="_blank"
            className="btn btn-primary w-full justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            公開ページを見る
          </Link>
          <button
            onClick={() => router.push("/dashboard/products")}
            className="btn btn-secondary w-full"
          >
            プロダクト管理に戻る
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function ProductCreatedCelebration() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramSlug = searchParams.get("created");
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (paramSlug) {
      setSlug(paramSlug);
      // Defer navigation so state paint lands before re-render
      setTimeout(() => router.replace("/dashboard/products", { scroll: false }), 0);
    }
  }, [paramSlug, router]);

  useEffect(() => {
    if (!slug) return;
    const timer = setTimeout(() => setSlug(null), 6000);
    return () => clearTimeout(timer);
  }, [slug]);

  if (!slug) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-[51] animate-slide-down">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm">
            <span className="font-medium">公開しました</span>
            <span className="mx-2 opacity-50">—</span>
            <a
              href={`/products/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:no-underline"
            >
              公開ページを見る ↗
            </a>
          </p>
          <button
            onClick={() => setSlug(null)}
            className="text-white/70 hover:text-white p-1"
            aria-label="閉じる"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

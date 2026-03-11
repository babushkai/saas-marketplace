"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AnalyticsData {
  summary: {
    totalProducts: number;
    publishedProducts: number;
    totalInquiries: number;
    unreadInquiries: number;
  };
  topProducts: {
    name: string;
    inquiries: number;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const summary = data?.summary;
  const topProducts = data?.topProducts || [];
  const maxInquiries = topProducts.length > 0 ? topProducts[0].inquiries : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">アクセス解析</h1>
        <p className="text-gray-600 mt-1">
          プロダクトと問い合わせの状況を確認できます
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">総プロダクト数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary?.totalProducts ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">公開中</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary?.publishedProducts ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">総問い合わせ数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary?.totalInquiries ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">未読の問い合わせ</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {summary?.unreadInquiries ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products by Inquiries */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">問い合わせが多いプロダクト</h3>
        {topProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">まだ問い合わせデータがありません</p>
            <Link href="/dashboard/products" className="text-sm text-primary-600 hover:text-primary-700">
              プロダクトを公開して問い合わせを受け付けましょう
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-40 truncate">{product.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((product.inquiries / maxInquiries) * 100, 10)}%` }}
                  >
                    <span className="text-xs font-medium text-white">{product.inquiries}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

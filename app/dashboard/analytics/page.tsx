"use client";

import { useState } from "react";

// Mock analytics data
const mockData = {
  summary: {
    totalViews: 12453,
    totalInquiries: 47,
    conversionRate: 0.38,
    avgTimeOnPage: 142,
  },
  viewsByDate: [
    { date: "1/9", views: 320 },
    { date: "1/10", views: 450 },
    { date: "1/11", views: 380 },
    { date: "1/12", views: 520 },
    { date: "1/13", views: 410 },
    { date: "1/14", views: 380 },
    { date: "1/15", views: 490 },
  ],
  topProducts: [
    { name: "クラウド請求書", views: 4521, inquiries: 23 },
    { name: "チームチャットPro", views: 3892, inquiries: 15 },
    { name: "AI文章アシスタント", views: 2340, inquiries: 8 },
    { name: "営業管理CRM", views: 1700, inquiries: 1 },
  ],
  trafficSources: [
    { source: "検索エンジン", percentage: 42 },
    { source: "直接アクセス", percentage: 28 },
    { source: "SNS", percentage: 18 },
    { source: "外部サイト", percentage: 12 },
  ],
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7days");

  const maxViews = Math.max(...mockData.viewsByDate.map((d) => d.views));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">アクセス解析</h1>
          <p className="text-gray-600 mt-1">
            プロダクトページのアクセス状況を確認できます
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input w-auto"
        >
          <option value="7days">過去7日間</option>
          <option value="30days">過去30日間</option>
          <option value="90days">過去90日間</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">総ページビュー</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockData.summary.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+12.5% 前期比</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">総問い合わせ数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockData.summary.totalInquiries}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+8.3% 前期比</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">コンバージョン率</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(mockData.summary.conversionRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">-2.1% 前期比</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">平均滞在時間</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.floor(mockData.summary.avgTimeOnPage / 60)}分{mockData.summary.avgTimeOnPage % 60}秒
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+5.2% 前期比</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Views Chart */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">ページビュー推移</h2>
          <div className="h-64 flex items-end gap-2">
            {mockData.viewsByDate.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                  style={{ height: `${(day.views / maxViews) * 100}%` }}
                  title={`${day.views} views`}
                />
                <span className="text-xs text-gray-500 mt-2">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">流入元</h2>
          <div className="space-y-4">
            {mockData.trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{source.source}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {source.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">プロダクト別パフォーマンス</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  プロダクト名
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  ページビュー
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  問い合わせ
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  CVR
                </th>
              </tr>
            </thead>
            <tbody>
              {mockData.topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {product.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {product.inquiries}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${
                      (product.inquiries / product.views) * 100 > 0.4
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}>
                      {((product.inquiries / product.views) * 100).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

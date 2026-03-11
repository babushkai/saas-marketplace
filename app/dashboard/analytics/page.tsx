"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Period = "7d" | "30d" | "90d";

interface AnalyticsData {
  summary: {
    totalProducts: number;
    publishedProducts: number;
    totalInquiries: number;
    unreadInquiries: number;
    totalViews: number;
    inquiryTrend: number | null;
    viewTrend: number | null;
  };
  topProducts: { name: string; inquiries: number }[];
  timeSeries: { date: string; views: number; inquiries: number }[];
  productBreakdown: {
    id: string;
    name: string;
    isPublished: boolean;
    views: number;
    inquiries: number;
    conversionRate: number;
  }[];
}

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7日間",
  "30d": "30日間",
  "90d": "90日間",
};

function TrendBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-gray-400">N/A</span>;
  const isPositive = value > 0;
  const isZero = value === 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isZero ? "text-gray-500" : isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      {!isZero && (
        <svg className={`w-3 h-3 ${isPositive ? "" : "rotate-180"}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {isZero ? "±0%" : `${isPositive ? "+" : ""}${value}%`}
    </span>
  );
}

function TrendChart({ data, period }: { data: AnalyticsData["timeSeries"]; period: Period }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        データがありません
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.views, d.inquiries)), 1);
  const w = 600;
  const h = 140;
  const padTop = 10;
  const padBottom = 24;
  const padLeft = 0;
  const padRight = 0;
  const chartH = h - padTop - padBottom;
  const chartW = w - padLeft - padRight;

  const toX = (i: number) => padLeft + (i / Math.max(data.length - 1, 1)) * chartW;
  const toY = (v: number) => padTop + chartH - (v / maxVal) * chartH;

  const viewsPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.views)}`).join(" ");
  const inquiriesPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.inquiries)}`).join(" ");

  // Show date labels at intervals
  const labelInterval = period === "7d" ? 1 : period === "30d" ? 5 : 15;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={padLeft}
            y1={padTop + chartH * (1 - frac)}
            x2={w - padRight}
            y2={padTop + chartH * (1 - frac)}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}
        {/* Views line */}
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={viewsPath.replace(/[ML]/g, (m) => (m === "M" ? "" : " ")).trim()} />
        {/* Inquiries line */}
        <polyline fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={inquiriesPath.replace(/[ML]/g, (m) => (m === "M" ? "" : " ")).trim()} />
        {/* Date labels */}
        {data.map((d, i) =>
          i % labelInterval === 0 || i === data.length - 1 ? (
            <text key={i} x={toX(i)} y={h - 4} textAnchor="middle" className="fill-gray-400" fontSize="9">
              {new Date(d.date + "T00:00:00").toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
            </text>
          ) : null
        )}
        {/* Y-axis max label */}
        <text x={padLeft + 2} y={padTop + 8} className="fill-gray-400" fontSize="9">
          {maxVal}
        </text>
      </svg>
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-blue-500 rounded" />
          <span className="text-xs text-gray-500">ページビュー</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-purple-500 rounded" />
          <span className="text-xs text-gray-500">問い合わせ</span>
        </div>
      </div>
    </div>
  );
}

type SortKey = "name" | "views" | "inquiries" | "conversionRate";
type SortDir = "asc" | "desc";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<Period>("30d");
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchData = useCallback((p: Period) => {
    setIsLoading(true);
    setError(false);
    fetch(`/api/analytics?period=${p}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const summary = data?.summary;
  const topProducts = data?.topProducts || [];
  const maxInquiries = topProducts.length > 0 ? topProducts[0].inquiries : 0;
  const timeSeries = data?.timeSeries || [];

  const sortedBreakdown = [...(data?.productBreakdown || [])].sort((a, b) => {
    const aVal = sortKey === "name" ? a.name : a[sortKey];
    const bVal = sortKey === "name" ? b.name : b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const globalCvr =
    summary && summary.totalViews > 0
      ? Math.round((summary.totalInquiries / summary.totalViews) * 1000) / 10
      : 0;

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">データの取得に失敗しました</p>
          <button onClick={() => fetchData(period)} className="btn btn-primary text-sm">
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">アクセス解析</h1>
          <p className="text-gray-600 mt-1">プロダクトのパフォーマンスを確認できます</p>
        </div>
        {/* Period Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading overlay for period switch */}
      <div className={isLoading ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <SummaryCard
            label="総プロダクト数"
            value={summary?.totalProducts ?? 0}
            icon={<BoxIcon />}
            color="blue"
          />
          <SummaryCard
            label="公開中"
            value={summary?.publishedProducts ?? 0}
            icon={<CheckIcon />}
            color="green"
          />
          <SummaryCard
            label="ページビュー"
            value={summary?.totalViews ?? 0}
            icon={<EyeIcon />}
            color="sky"
            trend={summary?.viewTrend ?? null}
          />
          <SummaryCard
            label="問い合わせ数"
            value={summary?.totalInquiries ?? 0}
            icon={<ChatIcon />}
            color="purple"
            trend={summary?.inquiryTrend ?? null}
          />
          <SummaryCard
            label="未読"
            value={summary?.unreadInquiries ?? 0}
            icon={<MailIcon />}
            color="primary"
          />
          <SummaryCard
            label="CVR"
            value={`${globalCvr}%`}
            icon={<TargetIcon />}
            color="amber"
          />
        </div>

        {/* Trend Chart */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">日別トレンド</h3>
          <TrendChart data={timeSeries} period={period} />
        </div>

        {/* Per-product Breakdown Table */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            プロダクト別パフォーマンス
            <span className="text-sm font-normal text-gray-500 ml-2">({PERIOD_LABELS[period]})</span>
          </h3>
          {sortedBreakdown.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">プロダクトがまだありません</p>
              <Link href="/dashboard/products/new" className="text-sm text-primary-600 hover:text-primary-700">
                プロダクトを登録する
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <SortableHeader label="プロダクト名" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                    <SortableHeader label="ビュー数" sortKey="views" currentKey={sortKey} dir={sortDir} onSort={handleSort} align="right" />
                    <SortableHeader label="問い合わせ" sortKey="inquiries" currentKey={sortKey} dir={sortDir} onSort={handleSort} align="right" />
                    <SortableHeader label="CVR" sortKey="conversionRate" currentKey={sortKey} dir={sortDir} onSort={handleSort} align="right" />
                  </tr>
                </thead>
                <tbody>
                  {sortedBreakdown.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {product.name}
                          </span>
                          {!product.isPublished && (
                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">非公開</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-700">{product.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-700">{product.inquiries.toLocaleString()}</td>
                      <td className="py-3 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${Math.min(product.conversionRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-700 w-12 text-right">{product.conversionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products by Inquiries (all-time) */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-1">問い合わせが多いプロダクト</h3>
          <p className="text-xs text-gray-500 mb-4">累計</p>
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
    </div>
  );
}

/* ----- Subcomponents ----- */

function SummaryCard({
  label,
  value,
  icon,
  color,
  trend,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: number | null;
}) {
  const bgMap: Record<string, string> = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    sky: "bg-sky-100",
    purple: "bg-purple-100",
    primary: "bg-primary-100",
    amber: "bg-amber-100",
  };
  const textMap: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    sky: "text-sky-600",
    purple: "text-purple-600",
    primary: "text-primary-600",
    amber: "text-amber-600",
  };
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 truncate">{label}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend !== undefined && <div className="mt-1"><TrendBadge value={trend} /></div>}
        </div>
        <div className={`w-9 h-9 ${bgMap[color]} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span className={textMap[color]}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  sortKey: key,
  currentKey,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const isActive = key === currentKey;
  return (
    <th
      className={`py-2 px-4 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700 select-none ${
        align === "right" ? "text-right" : "text-left"
      }`}
      onClick={() => onSort(key)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <svg className={`w-3 h-3 ${dir === "asc" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    </th>
  );
}

/* ----- Icons ----- */
function BoxIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <circle cx="12" cy="12" r="6" strokeWidth={2} />
      <circle cx="12" cy="12" r="2" strokeWidth={2} />
    </svg>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_PERIODS = ["7d", "30d", "90d"] as const;
type Period = (typeof VALID_PERIODS)[number];

function getPeriodDays(period: Period): number {
  switch (period) {
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
  }
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "データベースエラー" }, { status: 503 });
  }

  // Parse period
  const raw = request.nextUrl.searchParams.get("period") || "30d";
  const period: Period = VALID_PERIODS.includes(raw as Period) ? (raw as Period) : "30d";
  const days = getPeriodDays(period);
  const startDate = daysAgo(days);
  const prevStartDate = daysAgo(days * 2);
  const now = new Date().toISOString();

  // Get seller
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  const empty = {
    summary: { totalProducts: 0, publishedProducts: 0, totalInquiries: 0, unreadInquiries: 0, totalViews: 0, inquiryTrend: null, viewTrend: null },
    topProducts: [],
    timeSeries: [],
    productBreakdown: [],
  };

  if (!seller) {
    return NextResponse.json(empty);
  }

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, is_published")
    .eq("seller_id", seller.id);

  const allProducts = products || [];
  const publishedProducts = allProducts.filter((p) => p.is_published);
  const productIds = allProducts.map((p) => p.id);

  if (productIds.length === 0) {
    return NextResponse.json({
      ...empty,
      summary: { ...empty.summary, totalProducts: allProducts.length, publishedProducts: publishedProducts.length },
    });
  }

  // Run all queries in parallel
  const [
    { count: totalInquiries },
    { count: unreadCount },
    { count: totalViews },
    { count: prevInquiries },
    { count: prevViews },
    timeSeriesResult,
    breakdownResult,
  ] = await Promise.all([
    // Current period inquiry count
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .in("product_id", productIds)
      .gte("created_at", startDate)
      .lt("created_at", now),
    // Unread inquiries (all-time)
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .in("product_id", productIds)
      .eq("is_read", false),
    // Current period view count
    supabase
      .from("product_views")
      .select("*", { count: "exact", head: true })
      .in("product_id", productIds)
      .gte("viewed_at", startDate)
      .lt("viewed_at", now),
    // Previous period inquiry count (for trend)
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .in("product_id", productIds)
      .gte("created_at", prevStartDate)
      .lt("created_at", startDate),
    // Previous period view count (for trend)
    supabase
      .from("product_views")
      .select("*", { count: "exact", head: true })
      .in("product_id", productIds)
      .gte("viewed_at", prevStartDate)
      .lt("viewed_at", startDate),
    // Time-series via RPC
    supabase.rpc("get_analytics_timeseries", {
      p_product_ids: productIds,
      p_start_date: startDate,
      p_end_date: now,
    }),
    // Per-product breakdown via RPC
    supabase.rpc("get_product_breakdown", {
      p_product_ids: productIds,
      p_start_date: startDate,
      p_end_date: now,
    }),
  ]);

  // Compute trends (% change vs previous period, null if prev is 0)
  const computeTrend = (current: number, previous: number): number | null => {
    if (previous === 0) return current > 0 ? 100 : null;
    return Math.round(((current - previous) / previous) * 100);
  };

  const curInquiries = totalInquiries ?? 0;
  const curViews = totalViews ?? 0;
  const inquiryTrend = computeTrend(curInquiries, prevInquiries ?? 0);
  const viewTrend = computeTrend(curViews, prevViews ?? 0);

  // Time series
  const timeSeries = (timeSeriesResult.data || []).map((row: { day: string; views: number; inquiries: number }) => ({
    date: row.day,
    views: Number(row.views),
    inquiries: Number(row.inquiries),
  }));

  // Per-product breakdown with names and CVR
  const productNameMap = new Map(allProducts.map((p) => [p.id, p.name]));
  const productPublishedMap = new Map(allProducts.map((p) => [p.id, p.is_published]));
  const productBreakdown = (breakdownResult.data || [])
    .map((row: { product_id: string; views: number; inquiries: number }) => {
      const views = Number(row.views);
      const inquiries = Number(row.inquiries);
      return {
        id: row.product_id,
        name: productNameMap.get(row.product_id) || "不明",
        isPublished: productPublishedMap.get(row.product_id) ?? false,
        views,
        inquiries,
        conversionRate: views > 0 ? Math.round((inquiries / views) * 1000) / 10 : 0,
      };
    })
    .sort((a: { views: number }, b: { views: number }) => b.views - a.views);

  // Top products by inquiry count (all-time, derived from breakdown data)
  // Use productBreakdown which already has per-product inquiry counts from the RPC
  // For all-time top products, we use the breakdown's inquiry data (period-scoped)
  // since the RPC already aggregated it efficiently in SQL
  const topProducts = [...productBreakdown]
    .filter((p: { inquiries: number }) => p.inquiries > 0)
    .sort((a: { inquiries: number }, b: { inquiries: number }) => b.inquiries - a.inquiries)
    .slice(0, 5)
    .map((p: { name: string; inquiries: number }) => ({ name: p.name, inquiries: p.inquiries }));

  return NextResponse.json({
    summary: {
      totalProducts: allProducts.length,
      publishedProducts: publishedProducts.length,
      totalInquiries: curInquiries,
      unreadInquiries: unreadCount ?? 0,
      totalViews: curViews,
      inquiryTrend,
      viewTrend,
    },
    topProducts,
    timeSeries,
    productBreakdown,
  });
}

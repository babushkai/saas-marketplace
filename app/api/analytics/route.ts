import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "データベースエラー" }, { status: 503 });
  }

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) {
    return NextResponse.json({
      summary: { totalProducts: 0, publishedProducts: 0, totalInquiries: 0, unreadInquiries: 0 },
      topProducts: [],
    });
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
      summary: { totalProducts: allProducts.length, publishedProducts: publishedProducts.length, totalInquiries: 0, unreadInquiries: 0 },
      topProducts: [],
    });
  }

  // Count inquiries efficiently
  const { count: totalInquiries } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("product_id", productIds);

  const { count: unreadCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("product_id", productIds)
    .eq("is_read", false);

  // Fetch inquiries with product_id for top products ranking (limited)
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("product_id")
    .in("product_id", productIds);

  // Top products by inquiry count
  const allInquiries = inquiries || [];
  const inquiryCountByProduct = new Map<string, number>();
  for (const inq of allInquiries) {
    inquiryCountByProduct.set(inq.product_id, (inquiryCountByProduct.get(inq.product_id) || 0) + 1);
  }

  const productNameMap = new Map(allProducts.map((p) => [p.id, p.name]));
  const topProducts = Array.from(inquiryCountByProduct.entries())
    .map(([productId, count]) => ({ name: productNameMap.get(productId) || "不明", inquiries: count }))
    .sort((a, b) => b.inquiries - a.inquiries)
    .slice(0, 5);

  return NextResponse.json({
    summary: {
      totalProducts: allProducts.length,
      publishedProducts: publishedProducts.length,
      totalInquiries: totalInquiries ?? 0,
      unreadInquiries: unreadCount ?? 0,
    },
    topProducts,
  });
}

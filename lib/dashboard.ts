import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Seller } from "@/types/database";

export interface DashboardData {
  seller: Pick<Seller, "id" | "display_name" | "avatar_url" | "bio" | "company_name" | "website_url" | "twitter_url" | "plan"> | null;
  stats: {
    totalProducts: number;
    publishedProducts: number;
    totalInquiries: number;
    unreadInquiries: number;
    totalViews: number;
  };
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: "inquiry" | "product";
  title: string;
  subtitle: string;
  date: string;
}

export async function getDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    seller: null,
    stats: { totalProducts: 0, publishedProducts: 0, totalInquiries: 0, unreadInquiries: 0, totalViews: 0 },
    recentActivity: [],
  };

  const { userId } = await auth();
  if (!userId) return empty;

  const supabase = createServerSupabaseClient();
  if (!supabase) return empty;

  // Single seller lookup
  const { data: seller } = await supabase
    .from("sellers")
    .select("id, display_name, avatar_url, bio, company_name, website_url, twitter_url, plan")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) return empty;

  // Get all products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, is_published")
    .eq("seller_id", seller.id);

  const allProducts = products || [];
  const publishedProducts = allProducts.filter((p) => p.is_published);
  const productIds = allProducts.map((p) => p.id);

  if (productIds.length === 0) {
    return {
      seller,
      stats: { totalProducts: 0, publishedProducts: 0, totalInquiries: 0, unreadInquiries: 0, totalViews: 0 },
      recentActivity: [],
    };
  }

  // Run all queries in parallel (no RPC needed — just counts + recent inquiries)
  const [
    { count: totalInquiries },
    { count: unreadInquiries },
    { count: totalViews },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from("inquiries").select("*", { count: "exact", head: true }).in("product_id", productIds),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).in("product_id", productIds).eq("is_read", false),
    supabase.from("product_views").select("*", { count: "exact", head: true }).in("product_id", productIds),
    supabase.from("inquiries").select("id, sender_name, sender_company, product_id, created_at").in("product_id", productIds).order("created_at", { ascending: false }).limit(5),
  ]);

  // Build activity feed from recent inquiries
  const productNameMap = new Map(allProducts.map((p) => [p.id, p.name]));
  const recentActivity: ActivityItem[] = (recentInquiries || []).map((inq) => ({
    type: "inquiry" as const,
    title: `${inq.sender_company || inq.sender_name}さんからお問い合わせ`,
    subtitle: productNameMap.get(inq.product_id) || "",
    date: inq.created_at,
  }));

  return {
    seller,
    stats: {
      totalProducts: allProducts.length,
      publishedProducts: publishedProducts.length,
      totalInquiries: totalInquiries ?? 0,
      unreadInquiries: unreadInquiries ?? 0,
      totalViews: totalViews ?? 0,
    },
    recentActivity,
  };
}

export function getProfileCompleteness(seller: DashboardData["seller"]): { score: number; steps: { label: string; done: boolean }[] } {
  if (!seller) return { score: 0, steps: [] };

  const steps = [
    { label: "表示名を設定", done: !!seller.display_name },
    { label: "アバター画像を追加", done: !!seller.avatar_url },
    { label: "自己紹介を記入", done: !!seller.bio },
    { label: "会社名を設定", done: !!seller.company_name },
    { label: "ウェブサイトを追加", done: !!seller.website_url },
  ];
  const done = steps.filter((s) => s.done).length;
  return { score: Math.round((done / steps.length) * 100), steps };
}

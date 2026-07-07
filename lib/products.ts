import { createServerSupabaseClient } from "@/lib/supabase";
import type { Product, ProductWithStats } from "@/types/database";

/**
 * Fetch popular products by view count using the existing get_product_breakdown RPC.
 * Strategy: get all published product IDs, call RPC for view counts in the last 30 days,
 * sort by views, then fetch the top N product rows.
 */
export async function getPopularProducts(limit: number): Promise<ProductWithStats[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];

  // Cap at 500 IDs to avoid degraded query planning on large IN clauses.
  // For larger catalogs, a dedicated RPC with ranking in Postgres is preferred.
  const { data: allProducts } = await supabase
    .from("products")
    .select("id")
    .eq("is_published", true)
    .limit(500);

  if (!allProducts || allProducts.length === 0) return [];

  const productIds = allProducts.map((p) => p.id);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: breakdown } = await supabase.rpc("get_product_breakdown", {
    p_product_ids: productIds,
    p_start_date: thirtyDaysAgo.toISOString(),
    p_end_date: now.toISOString(),
  });

  if (!breakdown || breakdown.length === 0) return [];

  const sorted = [...breakdown]
    .sort((a, b) => Number(b.views) - Number(a.views))
    .filter((b) => Number(b.views) > 0)
    .slice(0, limit);

  if (sorted.length === 0) return [];

  const topIds = sorted.map((b) => b.product_id);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", topIds)
    .eq("is_published", true);

  if (!products) return [];

  const viewMap = new Map(sorted.map((b) => [b.product_id, Number(b.views)]));
  return products
    .map((p) => ({ ...p, view_count: viewMap.get(p.id) ?? 0 }))
    .sort((a, b) => b.view_count - a.view_count);
}

export async function getNewArrivals(limit: number): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }

  return data || [];
}

export async function getViewCount(productId: string): Promise<number> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const { count } = await supabase
    .from("product_views")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId)
    .gte("viewed_at", thirtyDaysAgo.toISOString());

  return count ?? 0;
}

export async function getProductViewCounts(productIds: string[]): Promise<Record<string, number>> {
  const supabase = createServerSupabaseClient();
  if (!supabase || productIds.length === 0) return {};

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: breakdown } = await supabase.rpc("get_product_breakdown", {
    p_product_ids: productIds,
    p_start_date: thirtyDaysAgo.toISOString(),
    p_end_date: now.toISOString(),
  });

  if (!breakdown) return {};

  const counts: Record<string, number> = {};
  for (const row of breakdown) {
    counts[row.product_id] = Number(row.views);
  }
  return counts;
}

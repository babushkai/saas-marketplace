import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Japanese second-level domains: "example.co.jp" is the registrable part, not "co.jp"
const JP_SECOND_LEVEL = new Set(["co", "or", "ne", "ac", "go", "gr", "ed", "lg", "ad"]);

// Shared hosting: owning an address here proves nothing about owning a product hosted here
const SHARED_HOSTS = new Set([
  "vercel.app",
  "netlify.app",
  "github.io",
  "pages.dev",
  "web.app",
  "firebaseapp.com",
  "herokuapp.com",
  "notion.site",
  "studio.site",
  "wixsite.com",
  "jimdofree.com",
  "webflow.io",
  "framer.website",
]);

/** "https://www.smarthr.jp/x" → "smarthr.jp", "app.example.co.jp" → "example.co.jp" */
export function registrableDomain(hostOrUrl: string): string | null {
  let host = hostOrUrl.trim().toLowerCase();
  try {
    if (host.includes("://")) host = new URL(host).hostname;
  } catch {
    return null;
  }
  host = host.replace(/\.$/, "");
  const labels = host.split(".").filter(Boolean);
  if (labels.length < 2) return null;
  const tld = labels[labels.length - 1];
  const sld = labels[labels.length - 2];
  const take = tld === "jp" && JP_SECOND_LEVEL.has(sld) && labels.length >= 3 ? 3 : 2;
  return labels.slice(-take).join(".");
}

/** Domain whose verified email addresses can claim instantly, or null (no site / shared hosting). */
export function claimableDomain(websiteUrl: string | null): string | null {
  if (!websiteUrl) return null;
  const site = registrableDomain(websiteUrl);
  return site && !SHARED_HOSTS.has(site) ? site : null;
}

/**
 * True when one of the user's verified email addresses is on the same
 * registrable domain as the product's website. Shared hosting never matches.
 */
export function emailMatchesWebsite(verifiedEmails: string[], websiteUrl: string | null): string | null {
  const site = claimableDomain(websiteUrl);
  if (!site) return null;
  for (const email of verifiedEmails) {
    const at = email.lastIndexOf("@");
    if (at < 0) continue;
    if (registrableDomain(email.slice(at + 1)) === site) return email;
  }
  return null;
}

/** Admins are listed in ADMIN_CLERK_USER_IDS (comma-separated Clerk user IDs). */
export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const ids = (process.env.ADMIN_CLERK_USER_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.includes(userId);
}

/** Same auto-create behaviour as GET /api/sellers?current=true */
export async function getOrCreateSellerId(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from("sellers")
    .select("id")
    .eq("clerk_user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("sellers")
    .insert({
      clerk_user_id: userId,
      username: `user-${userId.slice(-8).toLowerCase()}`,
      display_name: "新規出品者",
    })
    .select("id")
    .single();
  if (error || !created) {
    console.error("Failed to create seller for claim:", error);
    return null;
  }
  return created.id;
}

/**
 * Move an unclaimed product to the claimant. Conditional on the product still
 * being unclaimed, so two simultaneous claims can't both win.
 */
export async function transferProduct(
  supabase: SupabaseClient,
  productId: string,
  sellerId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("products")
    .update({ seller_id: sellerId, listing_status: "claimed", updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("listing_status", "unclaimed")
    .select("id");
  if (error) {
    console.error("Failed to transfer product:", error);
    return false;
  }
  return (data?.length ?? 0) === 1;
}

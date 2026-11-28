import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { emailMatchesWebsite, getOrCreateSellerId, transferProduct } from "@/lib/claims";

export const dynamic = "force-dynamic";

// POST /api/claims — request ownership of an unclaimed listing.
// Verified email on the product's own domain → transferred immediately.
// Otherwise → queued for manual review.
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  let productId: unknown;
  try {
    ({ product_id: productId } = await request.json());
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }
  if (typeof productId !== "string" || !productId) {
    return NextResponse.json({ error: "product_id が必要です" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "データベースが設定されていません" }, { status: 503 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_published", true)
    .maybeSingle();

  if (!product) {
    return NextResponse.json({ error: "プロダクトが見つかりません" }, { status: 404 });
  }
  if (product.listing_status !== "unclaimed") {
    return NextResponse.json({ error: "このページはすでに提供企業が管理しています" }, { status: 409 });
  }

  const user = await currentUser();
  const verifiedEmails = (user?.emailAddresses ?? [])
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress.toLowerCase());

  if (verifiedEmails.length === 0) {
    return NextResponse.json(
      { error: "確認済みのメールアドレスがありません。メールアドレスを確認してから再度お試しください" },
      { status: 400 }
    );
  }

  const matched = emailMatchesWebsite(verifiedEmails, product.website_url);

  if (matched) {
    const sellerId = await getOrCreateSellerId(supabase, userId);
    if (!sellerId) {
      return NextResponse.json({ error: "出品者プロフィールの作成に失敗しました" }, { status: 500 });
    }
    const ok = await transferProduct(supabase, product.id, sellerId);
    if (!ok) {
      return NextResponse.json({ error: "このページはすでに提供企業が管理しています" }, { status: 409 });
    }
    await supabase.from("claim_requests").insert({
      product_id: product.id,
      clerk_user_id: userId,
      email: matched,
      status: "approved",
      method: "domain_match",
      decided_at: new Date().toISOString(),
    });
    // Close any other open requests for the same product
    await supabase
      .from("claim_requests")
      .update({ status: "rejected", method: "manual", note: "別の申請が承認されました", decided_at: new Date().toISOString() })
      .eq("product_id", product.id)
      .eq("status", "pending");
    return NextResponse.json({ status: "approved" });
  }

  const primary =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress.toLowerCase() ??
    verifiedEmails[0];

  const { error } = await supabase.from("claim_requests").insert({
    product_id: product.id,
    clerk_user_id: userId,
    email: primary,
    status: "pending",
  });

  // 23505 = unique violation: this user already has an open request for this product
  if (error && error.code !== "23505") {
    console.error("Failed to create claim request:", error);
    return NextResponse.json({ error: "申請の送信に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ status: "pending" });
}

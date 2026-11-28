import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getOrCreateSellerId, isAdmin, transferProduct } from "@/lib/claims";

export const dynamic = "force-dynamic";

// POST /api/admin/claims/:id  { action: "approve" | "reject" }
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  let action: unknown;
  try {
    ({ action } = await request.json());
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action は approve または reject です" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "データベースが設定されていません" }, { status: 503 });
  }

  const { data: claim } = await supabase
    .from("claim_requests")
    .select("*")
    .eq("id", params.id)
    .eq("status", "pending")
    .maybeSingle();
  if (!claim) {
    return NextResponse.json({ error: "未処理の申請が見つかりません" }, { status: 404 });
  }

  const now = new Date().toISOString();

  if (action === "reject") {
    await supabase
      .from("claim_requests")
      .update({ status: "rejected", method: "manual", decided_at: now })
      .eq("id", claim.id);
    return NextResponse.json({ status: "rejected" });
  }

  const sellerId = await getOrCreateSellerId(supabase, claim.clerk_user_id);
  if (!sellerId) {
    return NextResponse.json({ error: "出品者プロフィールの作成に失敗しました" }, { status: 500 });
  }

  const ok = await transferProduct(supabase, claim.product_id, sellerId);
  if (!ok) {
    await supabase
      .from("claim_requests")
      .update({ status: "rejected", method: "manual", note: "すでに別の申請者が管理しています", decided_at: now })
      .eq("id", claim.id);
    return NextResponse.json({ error: "このページはすでに管理者がいます" }, { status: 409 });
  }

  await supabase
    .from("claim_requests")
    .update({ status: "approved", method: "manual", decided_at: now })
    .eq("id", claim.id);

  // Close any other open requests for the same product
  await supabase
    .from("claim_requests")
    .update({ status: "rejected", method: "manual", note: "別の申請が承認されました", decided_at: now })
    .eq("product_id", claim.product_id)
    .eq("status", "pending");

  return NextResponse.json({ status: "approved" });
}

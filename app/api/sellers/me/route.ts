import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
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
    .select("id, plan, stripe_subscription_id")
    .eq("clerk_user_id", userId)
    .single();

  if (!seller) {
    return NextResponse.json({ seller: { plan: "free", hasSubscription: false } });
  }

  return NextResponse.json({
    seller: {
      plan: seller.plan || "free",
      hasSubscription: !!seller.stripe_subscription_id,
    },
  });
}

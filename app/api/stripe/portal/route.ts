import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getStripe, isStripeConfigured } from "@/lib/stripe.server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "stripe_not_configured", message: "Stripeが設定されていません" }, { status: 503 });
    }

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
      .select("stripe_customer_id")
      .eq("clerk_user_id", userId)
      .single();

    if (!seller?.stripe_customer_id) {
      return NextResponse.json({ error: "サブスクリプションが見つかりません" }, { status: 404 });
    }

    const stripe = getStripe();
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: seller.stripe_customer_id,
      return_url: `${origin}/dashboard/settings?tab=billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json({ error: "ポータルの作成に失敗しました" }, { status: 500 });
  }
}

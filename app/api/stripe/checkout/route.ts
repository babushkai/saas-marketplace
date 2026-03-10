import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/stripe.server";
import type { PlanTier } from "@/types/database";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { plan } = (await request.json()) as { plan: PlanTier };

    if (!plan || !["standard", "pro"].includes(plan)) {
      return NextResponse.json({ error: "無効なプランです" }, { status: 400 });
    }

    const priceId = STRIPE_PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Stripe Price IDが設定されていません" }, { status: 503 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "データベースエラー" }, { status: 503 });
    }

    const { data: seller } = await supabase
      .from("sellers")
      .select("id, stripe_customer_id")
      .eq("clerk_user_id", userId)
      .single();

    if (!seller) {
      return NextResponse.json({ error: "出品者プロフィールが見つかりません" }, { status: 404 });
    }

    const stripe = getStripe();
    let customerId = seller.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { seller_id: seller.id, clerk_user_id: userId },
      });
      customerId = customer.id;

      await supabase
        .from("sellers")
        .update({ stripe_customer_id: customerId })
        .eq("id", seller.id);
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      currency: "jpy",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/settings?tab=billing&success=1`,
      cancel_url: `${origin}/dashboard/settings?tab=billing`,
      metadata: { seller_id: seller.id, target_plan: plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "チェックアウトの作成に失敗しました" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getStripe, PLAN_BY_PRICE_ID, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe.server";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

const VALID_PAID_PLANS = ["standard", "pro"];

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const targetPlan = session.metadata?.target_plan;

        if (!targetPlan || !VALID_PAID_PLANS.includes(targetPlan) || !subscriptionId) break;

        // Idempotency: check if already updated
        const { data: existing } = await supabase
          .from("sellers")
          .select("plan, stripe_subscription_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (existing?.plan === targetPlan && existing?.stripe_subscription_id === subscriptionId) {
          break;
        }

        await supabase
          .from("sellers")
          .update({ plan: targetPlan, stripe_subscription_id: subscriptionId })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.status !== "active") break;

        const priceId = subscription.items.data[0]?.price.id;
        const newPlan = priceId ? PLAN_BY_PRICE_ID[priceId] : undefined;
        if (!newPlan) break;

        const customerId = subscription.customer as string;

        // Try lookup by subscription ID first, fall back to customer ID
        let { data: seller } = await supabase
          .from("sellers")
          .select("id, plan, stripe_subscription_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (!seller) {
          const { data: fallback } = await supabase
            .from("sellers")
            .select("id, plan, stripe_subscription_id")
            .eq("stripe_customer_id", customerId)
            .single();
          seller = fallback;
        }

        if (!seller || seller.plan === newPlan) break;

        await supabase
          .from("sellers")
          .update({ plan: newPlan, stripe_subscription_id: subscription.id })
          .eq("id", seller.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: seller } = await supabase
          .from("sellers")
          .select("id, plan")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (!seller || seller.plan === "free") break;

        await supabase
          .from("sellers")
          .update({ plan: "free", stripe_subscription_id: null })
          .eq("id", seller.id);
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

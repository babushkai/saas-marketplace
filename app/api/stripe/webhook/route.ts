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

        const { error: updateErr } = await supabase
          .from("sellers")
          .update({ plan: targetPlan, stripe_subscription_id: subscriptionId })
          .eq("stripe_customer_id", customerId);
        if (updateErr) {
          console.error("Failed to update seller plan on checkout:", updateErr);
          return NextResponse.json({ error: "DB update failed" }, { status: 500 });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Lookup seller by subscription ID, then customer ID
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

        if (!seller) break;

        if (subscription.status === "active") {
          const priceId = subscription.items.data[0]?.price.id;
          const newPlan = priceId ? PLAN_BY_PRICE_ID[priceId] : undefined;
          if (!newPlan || seller.plan === newPlan) break;

          const { error: updateErr } = await supabase
            .from("sellers")
            .update({ plan: newPlan, stripe_subscription_id: subscription.id })
            .eq("id", seller.id);
          if (updateErr) {
            console.error("Failed to update seller plan on subscription change:", updateErr);
            return NextResponse.json({ error: "DB update failed" }, { status: 500 });
          }
        } else if (subscription.status === "past_due" || subscription.status === "unpaid") {
          console.warn(`Subscription ${subscription.id} is ${subscription.status} for seller ${seller.id}`);
          // Don't downgrade yet — Stripe will retry. Downgrade happens on subscription.deleted.
        } else if (subscription.status === "canceled" || subscription.status === "incomplete_expired") {
          if (seller.plan === "free") break;
          const { error: cancelErr } = await supabase
            .from("sellers")
            .update({ plan: "free", stripe_subscription_id: null })
            .eq("id", seller.id);
          if (cancelErr) {
            console.error("Failed to downgrade seller on cancellation:", cancelErr);
            return NextResponse.json({ error: "DB update failed" }, { status: 500 });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.warn(`Payment failed for customer ${customerId}, invoice ${invoice.id}, attempt ${invoice.attempt_count}`);
        // Stripe auto-retries. Plan downgrade is handled by subscription.deleted after all retries exhausted.
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

        const { error: deleteErr } = await supabase
          .from("sellers")
          .update({ plan: "free", stripe_subscription_id: null })
          .eq("id", seller.id);
        if (deleteErr) {
          console.error("Failed to downgrade seller on subscription deleted:", deleteErr);
          return NextResponse.json({ error: "DB update failed" }, { status: 500 });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

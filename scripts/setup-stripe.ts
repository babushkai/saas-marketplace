/**
 * Stripe Setup Script
 *
 * Creates products and prices in Stripe for the SaaS Marketplace pricing plans.
 * Idempotent — safe to run multiple times.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_xxx npx tsx scripts/setup-stripe.ts
 *
 * Or set STRIPE_SECRET_KEY in .env.local and run:
 *   npm run setup:stripe
 */

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error("Error: STRIPE_SECRET_KEY environment variable is required.");
  console.error("Usage: STRIPE_SECRET_KEY=sk_test_xxx npx tsx scripts/setup-stripe.ts");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

const PLANS = [
  { tier: "standard", name: "スタンダードプラン", amount: 980 },
  { tier: "pro", name: "プロプラン", amount: 2980 },
] as const;

async function findOrCreateProduct(name: string, tier: string): Promise<string> {
  // Search for existing product by metadata
  const existing = await stripe.products.list({ limit: 100, active: true });
  const found = existing.data.find(
    (p) => p.metadata.plan_tier === tier && p.active
  );

  if (found) {
    console.log(`  Found existing product: ${found.name} (${found.id})`);
    return found.id;
  }

  const product = await stripe.products.create({
    name,
    metadata: { plan_tier: tier },
  });
  console.log(`  Created product: ${product.name} (${product.id})`);
  return product.id;
}

async function findOrCreatePrice(
  productId: string,
  amount: number,
  tier: string
): Promise<string> {
  // Search for existing price
  const existing = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });
  const found = existing.data.find(
    (p) =>
      p.unit_amount === amount &&
      p.currency === "jpy" &&
      p.recurring?.interval === "month"
  );

  if (found) {
    console.log(`  Found existing price: ¥${amount}/month (${found.id})`);
    return found.id;
  }

  const price = await stripe.prices.create({
    product: productId,
    unit_amount: amount,
    currency: "jpy",
    recurring: { interval: "month" },
    metadata: { plan_tier: tier },
  });
  console.log(`  Created price: ¥${amount}/month (${price.id})`);
  return price.id;
}

async function main() {
  console.log("Setting up Stripe products and prices...\n");

  const envLines: string[] = [];

  for (const plan of PLANS) {
    console.log(`${plan.name} (¥${plan.amount}/month):`);
    const productId = await findOrCreateProduct(plan.name, plan.tier);
    const priceId = await findOrCreatePrice(productId, plan.amount, plan.tier);
    const envKey =
      plan.tier === "standard" ? "STRIPE_PRICE_STANDARD" : "STRIPE_PRICE_PRO";
    envLines.push(`${envKey}=${priceId}`);
    console.log();
  }

  console.log("=".repeat(50));
  console.log("Add these to your .env.local and Vercel environment:");
  console.log("=".repeat(50));
  for (const line of envLines) {
    console.log(line);
  }
  console.log();
  console.log("Don't forget to also set up a webhook endpoint:");
  console.log("  URL: https://your-domain.com/api/stripe/webhook");
  console.log("  Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted");
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});

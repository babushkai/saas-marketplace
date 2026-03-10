import "server-only";
import Stripe from "stripe";
import type { PlanTier } from "@/types/database";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return stripeInstance;
}

export const STRIPE_PRICE_IDS: Partial<Record<PlanTier, string>> = {
  standard: process.env.STRIPE_PRICE_STANDARD || "",
  pro: process.env.STRIPE_PRICE_PRO || "",
};

export const PLAN_BY_PRICE_ID: Record<string, PlanTier> = Object.fromEntries(
  Object.entries(STRIPE_PRICE_IDS)
    .filter(([, priceId]) => priceId)
    .map(([plan, priceId]) => [priceId, plan as PlanTier])
);

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

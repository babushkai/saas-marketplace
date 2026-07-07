-- Add subscription plan columns to sellers table
-- Run via: Supabase Dashboard > SQL Editor > paste and execute
-- Safe to re-run: uses IF NOT EXISTS
ALTER TABLE sellers
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Validate plan values
ALTER TABLE sellers
  ADD CONSTRAINT sellers_plan_check CHECK (plan IN ('free', 'standard', 'pro'));

-- Indexes for Stripe lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_sellers_stripe_customer_id
  ON sellers (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sellers_stripe_subscription_id
  ON sellers (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

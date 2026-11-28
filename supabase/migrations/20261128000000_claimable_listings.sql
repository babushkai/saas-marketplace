-- Claimable listings: pages for well-known SaaS created by the editorial team
-- from public information, which the vendor can later take over.
-- Run via: Supabase Dashboard > SQL Editor > paste and execute
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT

-- 1) Listing status. Every existing product stays 'claimed'.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS listing_status TEXT NOT NULL DEFAULT 'claimed';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_listing_status_check') THEN
    ALTER TABLE products
      ADD CONSTRAINT products_listing_status_check
      CHECK (listing_status IN ('claimed', 'unclaimed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_listing_status
  ON products (listing_status) WHERE listing_status = 'unclaimed';

-- 2) House seller that owns unclaimed listings.
--    Not a Clerk user: nobody can sign in as it.
INSERT INTO sellers (clerk_user_id, username, display_name, bio)
VALUES (
  'system:editorial',
  'editorial',
  'SaaSマーケット編集部',
  '公開情報をもとに、編集部がプロダクトの紹介ページを作成しています。提供企業の方は各ページから管理を引き継げます。'
)
ON CONFLICT DO NOTHING;

-- 3) Claim requests
CREATE TABLE IF NOT EXISTS claim_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  -- 'domain_match' = approved automatically, 'manual' = reviewed by an admin
  method TEXT CHECK (method IN ('domain_match', 'manual')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_claim_requests_status ON claim_requests (status, created_at DESC);

-- One open request per user per product
CREATE UNIQUE INDEX IF NOT EXISTS idx_claim_requests_one_pending
  ON claim_requests (product_id, clerk_user_id) WHERE status = 'pending';

-- Only the server (service role) touches this table
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

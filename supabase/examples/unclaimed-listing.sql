-- Template: add an editorial (unclaimed) listing owned by SaaSマーケット編集部.
-- Requires migrations/20261128000000_claimable_listings.sql.
--
-- Rules for editorial pages:
--   * Write the tagline/description in your own words from the official site.
--     Do not copy their copy.
--   * Facts only (features, pricing range), as of the date you checked.
--   * Leave logo_url and screenshots empty. They are hidden until claimed anyway.
--   * website_url must be the official domain. It decides who can claim instantly.
--   * Insert unpublished, review on the site, then publish.

INSERT INTO products (
  seller_id, slug, name, tagline, description, category,
  pricing_type, price_info, website_url, is_published, listing_status
)
SELECT
  s.id,
  'example-saas',                                  -- URL slug (unique)
  'Example SaaS',                                  -- product name
  '一行で何ができるかを説明',                          -- tagline
  E'## 概要\n\n自分の言葉で書いた説明。\n\n## 主な機能\n\n- 機能A\n- 機能B',
  'productivity',                                  -- marketing|sales|finance|hr|productivity|communication|development|design|other
  'freemium',                                      -- free|paid|freemium|contact
  '無料プランあり／有料プランは月額○○円〜（2026年11月時点）',
  'https://www.example.co.jp',                     -- official site
  false,                                           -- publish after review
  'unclaimed'
FROM sellers s
WHERE s.clerk_user_id = 'system:editorial';

-- Publish after review:
-- UPDATE products SET is_published = true WHERE slug = 'example-saas';

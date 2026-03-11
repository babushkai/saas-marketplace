-- Product views tracking table
CREATE TABLE product_views (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  session_id  text NOT NULL,
  viewed_at   timestamptz NOT NULL DEFAULT now()
);

-- One view per product per session (dedup)
CREATE UNIQUE INDEX product_views_dedup
  ON product_views (product_id, session_id);

-- Fast range queries by product + time
CREATE INDEX product_views_product_time
  ON product_views (product_id, viewed_at DESC);

-- RLS: allow anon insert, restrict select to product owners
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert product views" ON product_views
  FOR INSERT WITH CHECK (true);

-- Service role bypasses RLS; no SELECT policy needed for anon/authenticated
-- Analytics API uses service role client for reads

-- RPC function for time-series aggregation (avoids fetching raw rows into JS)
CREATE OR REPLACE FUNCTION get_analytics_timeseries(
  p_product_ids uuid[],
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS TABLE(day date, views bigint, inquiries bigint) AS $$
BEGIN
  RETURN QUERY
  WITH days AS (
    SELECT generate_series(p_start_date::date, p_end_date::date, '1 day'::interval)::date AS d
  ),
  view_counts AS (
    SELECT viewed_at::date AS d, count(*) AS cnt
    FROM product_views
    WHERE product_id = ANY(p_product_ids)
      AND viewed_at >= p_start_date
      AND viewed_at < p_end_date + interval '1 day'
    GROUP BY 1
  ),
  inquiry_counts AS (
    SELECT created_at::date AS d, count(*) AS cnt
    FROM inquiries
    WHERE product_id = ANY(p_product_ids)
      AND created_at >= p_start_date
      AND created_at < p_end_date + interval '1 day'
    GROUP BY 1
  )
  SELECT
    days.d AS day,
    COALESCE(vc.cnt, 0) AS views,
    COALESCE(ic.cnt, 0) AS inquiries
  FROM days
  LEFT JOIN view_counts vc ON vc.d = days.d
  LEFT JOIN inquiry_counts ic ON ic.d = days.d
  ORDER BY days.d;
END;
$$ LANGUAGE plpgsql STABLE;

-- RPC function for per-product breakdown
CREATE OR REPLACE FUNCTION get_product_breakdown(
  p_product_ids uuid[],
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS TABLE(product_id uuid, views bigint, inquiries bigint) AS $$
BEGIN
  RETURN QUERY
  WITH view_counts AS (
    SELECT pv.product_id AS pid, count(*) AS cnt
    FROM product_views pv
    WHERE pv.product_id = ANY(p_product_ids)
      AND pv.viewed_at >= p_start_date
      AND pv.viewed_at < p_end_date + interval '1 day'
    GROUP BY 1
  ),
  inquiry_counts AS (
    SELECT inq.product_id AS pid, count(*) AS cnt
    FROM inquiries inq
    WHERE inq.product_id = ANY(p_product_ids)
      AND inq.created_at >= p_start_date
      AND inq.created_at < p_end_date + interval '1 day'
    GROUP BY 1
  )
  SELECT
    pid AS product_id,
    COALESCE(vc.cnt, 0) AS views,
    COALESCE(ic.cnt, 0) AS inquiries
  FROM unnest(p_product_ids) AS pid
  LEFT JOIN view_counts vc ON vc.pid = pid
  LEFT JOIN inquiry_counts ic ON ic.pid = pid;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE TABLE IF NOT EXISTS conspiracy_reports (
  id SERIAL PRIMARY KEY,
  unique_key TEXT UNIQUE NOT NULL,
  created_date TIMESTAMPTZ NOT NULL,
  borough TEXT,
  complaint_type TEXT,
  descriptor TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  conspiracy_category TEXT NOT NULL,
  conspiracy_categories TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  conspiracy_score INTEGER NOT NULL CHECK (
    conspiracy_score >= 1
    AND conspiracy_score <= 100
  ),
  matched_keywords TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  classification_details JSONB NOT NULL DEFAULT '{}'::JSONB,
  inserted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conspiracy_reports
  ADD COLUMN IF NOT EXISTS conspiracy_categories TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE conspiracy_reports
  ADD COLUMN IF NOT EXISTS matched_keywords TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE conspiracy_reports
  ADD COLUMN IF NOT EXISTS classification_details JSONB NOT NULL DEFAULT '{}'::JSONB;

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_created_date
  ON conspiracy_reports (created_date DESC);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_category
  ON conspiracy_reports (conspiracy_category);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_borough
  ON conspiracy_reports (borough);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_score
  ON conspiracy_reports (conspiracy_score DESC);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_categories_gin
  ON conspiracy_reports USING GIN (conspiracy_categories);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_keywords_gin
  ON conspiracy_reports USING GIN (matched_keywords);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_borough_score_date
  ON conspiracy_reports (borough, conspiracy_score DESC, created_date DESC);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_search
  ON conspiracy_reports USING GIN (
    to_tsvector(
      'english',
      COALESCE(complaint_type, '') || ' ' || COALESCE(descriptor, '')
    )
  );

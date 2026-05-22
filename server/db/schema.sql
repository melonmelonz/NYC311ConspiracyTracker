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
  conspiracy_score INTEGER NOT NULL CHECK (
    conspiracy_score >= 1
    AND conspiracy_score <= 100
  ),
  inserted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_created_date
  ON conspiracy_reports (created_date DESC);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_category
  ON conspiracy_reports (conspiracy_category);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_borough
  ON conspiracy_reports (borough);

CREATE INDEX IF NOT EXISTS idx_conspiracy_reports_score
  ON conspiracy_reports (conspiracy_score DESC);

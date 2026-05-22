import { query } from "./pool.js";

const REPORT_COLUMNS = `
  id,
  unique_key,
  created_date,
  borough,
  complaint_type,
  descriptor,
  latitude,
  longitude,
  conspiracy_category,
  conspiracy_categories,
  conspiracy_score,
  matched_keywords,
  classification_details
`;

export async function upsertConspiracyReports(reports) {
  if (!reports.length) return [];

  const savedReports = [];
  const chunkSize = 400;

  for (let start = 0; start < reports.length; start += chunkSize) {
    const reportChunk = reports.slice(start, start + chunkSize);
    const values = [];
    const placeholders = reportChunk.map((report, index) => {
      const base = index * 12;
      const reportCategories = report.conspiracy_categories?.length
        ? report.conspiracy_categories
        : [report.conspiracy_category];
      const matchedKeywords = report.matched_keywords || [];
      const classificationDetails = report.classification_details || {};

      values.push(
        report.unique_key,
        report.created_date,
        report.borough,
        report.complaint_type,
        report.descriptor,
        report.latitude,
        report.longitude,
        report.conspiracy_category,
        reportCategories,
        report.conspiracy_score,
        matchedKeywords,
        JSON.stringify(classificationDetails),
      );

      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}::TEXT[], $${base + 10}, $${base + 11}::TEXT[], $${base + 12}::JSONB)`;
    });

    /*
      Database query note:
      Live NYC 311 sync can now classify thousands of rows per refresh. The
      query below performs a batched parameterized upsert, which is far cheaper
      than one INSERT per report while preserving the unique_key de-duplication.
    */
    const result = await query(
      `
        INSERT INTO conspiracy_reports (
          unique_key,
          created_date,
          borough,
          complaint_type,
          descriptor,
          latitude,
          longitude,
          conspiracy_category,
          conspiracy_categories,
          conspiracy_score,
          matched_keywords,
          classification_details
        ) VALUES ${placeholders.join(", ")}
        ON CONFLICT (unique_key) DO UPDATE SET
          created_date = EXCLUDED.created_date,
          borough = EXCLUDED.borough,
          complaint_type = EXCLUDED.complaint_type,
          descriptor = EXCLUDED.descriptor,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          conspiracy_category = EXCLUDED.conspiracy_category,
          conspiracy_categories = EXCLUDED.conspiracy_categories,
          conspiracy_score = EXCLUDED.conspiracy_score,
          matched_keywords = EXCLUDED.matched_keywords,
          classification_details = EXCLUDED.classification_details,
          updated_at = NOW()
        RETURNING ${REPORT_COLUMNS};
      `,
      values,
    );

    savedReports.push(...result.rows);
  }

  return savedReports;
}

export async function getReports({
  category,
  borough,
  search,
  minScore = 1,
  limit = 80,
} = {}) {
  const values = [];
  const clauses = ["conspiracy_score >= $1"];
  values.push(Number(minScore));

  if (category) {
    values.push(category.toUpperCase());
    clauses.push(
      `(conspiracy_category = $${values.length} OR conspiracy_categories @> ARRAY[$${values.length}]::TEXT[])`,
    );
  }

  if (borough) {
    values.push(borough.toUpperCase());
    clauses.push(`borough = $${values.length}`);
  }

  if (search) {
    values.push(search);
    const textSearchIndex = values.length;
    values.push(`%${search}%`);
    const wildcardIndex = values.length;
    clauses.push(`
      (
        to_tsvector('english', COALESCE(complaint_type, '') || ' ' || COALESCE(descriptor, ''))
          @@ plainto_tsquery('english', $${textSearchIndex})
        OR complaint_type ILIKE $${wildcardIndex}
        OR descriptor ILIKE $${wildcardIndex}
        OR conspiracy_category ILIKE $${wildcardIndex}
        OR borough ILIKE $${wildcardIndex}
        OR EXISTS (
          SELECT 1
          FROM unnest(conspiracy_categories) AS category_names(category_name)
          WHERE category_name ILIKE $${wildcardIndex}
        )
      )
    `);
  }

  values.push(Number(limit));

  /*
    Database query note:
    The WHERE clause is built from sanitized parameter placeholders only. This
    keeps search/filter routes flexible without string-concatenating user input
    directly into SQL.
  */
  const result = await query(
    `
      SELECT ${REPORT_COLUMNS}
      FROM conspiracy_reports
      WHERE ${clauses.join(" AND ")}
      ORDER BY conspiracy_score DESC, created_date DESC
      LIMIT $${values.length};
    `,
    values,
  );

  return result.rows;
}

export async function getStats() {
  /*
    Database query note:
    The stats endpoint asks PostgreSQL for grouped aggregates so the frontend
    receives chart-ready data instead of doing expensive counting in the browser.
  */
  const [summary, byCategory, byBorough, trend] = await Promise.all([
    query(`
      WITH category_rows AS (
        SELECT unnest(
          CASE
            WHEN array_length(conspiracy_categories, 1) > 0 THEN conspiracy_categories
            ELSE ARRAY[conspiracy_category]
          END
        ) AS category
        FROM conspiracy_reports
      ),
      borough_rows AS (
        SELECT borough, COUNT(*) AS borough_count
        FROM conspiracy_reports
        GROUP BY borough
        ORDER BY borough_count DESC
        LIMIT 1
      )
      SELECT
        (SELECT COUNT(*)::INT FROM conspiracy_reports) AS total_reports,
        (SELECT COUNT(*)::INT FROM conspiracy_reports) AS conspiracy_reports,
        (SELECT COUNT(DISTINCT category)::INT FROM category_rows) AS active_categories,
        COALESCE((SELECT borough FROM borough_rows), 'UNKNOWN') AS top_borough;
    `),
    query(`
      SELECT category AS name, COUNT(*)::INT AS value
      FROM conspiracy_reports,
      LATERAL unnest(
        CASE
          WHEN array_length(conspiracy_categories, 1) > 0 THEN conspiracy_categories
          ELSE ARRAY[conspiracy_category]
        END
      ) AS category_rows(category)
      GROUP BY category
      ORDER BY value DESC;
    `),
    query(`
      SELECT borough AS name, COUNT(*)::INT AS reports, ROUND(AVG(conspiracy_score))::INT AS intensity
      FROM conspiracy_reports
      GROUP BY borough
      ORDER BY reports DESC;
    `),
    query(`
      SELECT TO_CHAR(DATE_TRUNC('day', created_date), 'Mon DD') AS date,
             COUNT(*)::INT AS reports,
             ROUND(AVG(conspiracy_score))::INT AS intensity
      FROM conspiracy_reports
      WHERE created_date >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_date)
      ORDER BY DATE_TRUNC('day', created_date);
    `),
  ]);

  return {
    summary: summary.rows[0],
    byCategory: byCategory.rows,
    byBorough: byBorough.rows,
    trend: trend.rows,
  };
}

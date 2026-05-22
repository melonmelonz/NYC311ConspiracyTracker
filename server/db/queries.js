import { query } from './pool.js';

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
  conspiracy_score
`;

export async function upsertConspiracyReports(reports) {
  if (!reports.length) return [];

  const savedReports = [];

  for (const report of reports) {
    /*
      Database query note:
      Each live NYC 311 report is keyed by unique_key. ON CONFLICT lets the
      app refresh category/score/details without duplicating the same complaint
      every time the live API is polled.
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
          conspiracy_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (unique_key) DO UPDATE SET
          created_date = EXCLUDED.created_date,
          borough = EXCLUDED.borough,
          complaint_type = EXCLUDED.complaint_type,
          descriptor = EXCLUDED.descriptor,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          conspiracy_category = EXCLUDED.conspiracy_category,
          conspiracy_score = EXCLUDED.conspiracy_score,
          updated_at = NOW()
        RETURNING ${REPORT_COLUMNS};
      `,
      [
        report.unique_key,
        report.created_date,
        report.borough,
        report.complaint_type,
        report.descriptor,
        report.latitude,
        report.longitude,
        report.conspiracy_category,
        report.conspiracy_score
      ]
    );

    savedReports.push(result.rows[0]);
  }

  return savedReports;
}

export async function getReports({
  category,
  borough,
  search,
  minScore = 1,
  limit = 80
} = {}) {
  const values = [];
  const clauses = ['conspiracy_score >= $1'];
  values.push(Number(minScore));

  if (category) {
    values.push(category.toUpperCase());
    clauses.push(`conspiracy_category = $${values.length}`);
  }

  if (borough) {
    values.push(borough.toUpperCase());
    clauses.push(`borough = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    clauses.push(`
      (
        complaint_type ILIKE $${values.length}
        OR descriptor ILIKE $${values.length}
        OR conspiracy_category ILIKE $${values.length}
        OR borough ILIKE $${values.length}
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
      WHERE ${clauses.join(' AND ')}
      ORDER BY created_date DESC, conspiracy_score DESC
      LIMIT $${values.length};
    `,
    values
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
      SELECT
        COUNT(*)::INT AS total_reports,
        COUNT(*)::INT AS conspiracy_reports,
        COUNT(DISTINCT conspiracy_category)::INT AS active_categories,
        COALESCE(
          (ARRAY_AGG(borough ORDER BY borough_count DESC))[1],
          'UNKNOWN'
        ) AS top_borough
      FROM (
        SELECT *, COUNT(*) OVER (PARTITION BY borough) AS borough_count
        FROM conspiracy_reports
      ) ranked;
    `),
    query(`
      SELECT conspiracy_category AS name, COUNT(*)::INT AS value
      FROM conspiracy_reports
      GROUP BY conspiracy_category
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
    `)
  ]);

  return {
    summary: summary.rows[0],
    byCategory: byCategory.rows,
    byBorough: byBorough.rows,
    trend: trend.rows
  };
}

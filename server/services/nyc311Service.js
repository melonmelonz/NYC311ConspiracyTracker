const NYC_API_URL =
  process.env.NYC_311_API_URL ||
  "https://data.cityofnewyork.us/resource/erm2-nwe9.json";
const HISTORICAL_START_DATE =
  process.env.NYC_311_START_DATE || "2005-01-01T00:00:00";

const SELECTED_FIELDS = [
  "unique_key",
  "created_date",
  "borough",
  "complaint_type",
  "descriptor",
  "latitude",
  "longitude",
].join(",");

const SUSPICIOUS_FETCH_TERMS = [
  "ghost",
  "haunted",
  "demon",
  "alien",
  "ufo",
  "creature",
  "mutant",
  "rats",
  "pigeons",
  "watching",
  "surveillance",
  "mind control",
  "government",
  "strange",
  "mysterious",
  "unexplained",
  "chanting",
  "ritual",
  "humming",
  "buzzing",
  "vibrations",
  "screaming",
  "voices",
  "shadow",
  "lurking",
  "experiment",
  "radiation",
  "chemical",
  "underground",
  "tunnel",
  "subway creature",
  "portal",
  "lights",
  "signals",
  "frequencies",
  "paranoia",
  "spy",
  "weird",
  "odd",
  "suspicious",
  "creepy",
  "unknown",
  "monster",
];

function socrataString(value) {
  return String(value).toUpperCase().replace(/'/g, "''");
}

function buildSuspiciousSearch() {
  return SUSPICIOUS_FETCH_TERMS.map((term) => {
    const safeTerm = String(term).replace(/'/g, "''").toLowerCase();
    return [
      `LOWER(complaint_type) LIKE '%${safeTerm}%'`,
      `LOWER(descriptor) LIKE '%${safeTerm}%'`,
    ].join(" OR ");
  }).join(" OR ");
}

function numericEnv(value, fallback) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function buildPageUrl({ pageSize, offset, borough }) {
  const searchClause = buildSuspiciousSearch();
  const whereParts = [
    `created_date >= '${HISTORICAL_START_DATE}'`,
    "latitude IS NOT NULL AND longitude IS NOT NULL",
  ];

  if (borough) {
    whereParts.push(`borough='${socrataString(borough)}'`);
  }

  if (searchClause) {
    whereParts.push(`(${searchClause})`);
  }

  const params = new URLSearchParams({
    $select: SELECTED_FIELDS,
    $order: "created_date DESC",
    $limit: String(pageSize),
    $offset: String(offset),
    $where: whereParts.join(" AND "),
  });

  if (process.env.NYC_APP_TOKEN) {
    params.set("$$app_token", process.env.NYC_APP_TOKEN);
  }

  return `${NYC_API_URL}?${params.toString()}`;
}

async function fetch311Page({ pageSize, offset, borough }) {
  const response = await fetch(buildPageUrl({ pageSize, offset, borough }));

  if (!response.ok) {
    throw new Error(`NYC 311 API request failed with ${response.status}`);
  }

  return response.json();
}

export async function fetchRecent311Complaints({
  limit = numericEnv(process.env.NYC_311_TARGET_RECORDS, 10000),
  pageSize = numericEnv(process.env.NYC_311_PAGE_SIZE, 1000),
  maxPages = numericEnv(process.env.NYC_311_MAX_PAGES, 10),
  borough,
} = {}) {
  const targetRecords = Math.max(1, Number(limit));
  const safePageSize = Math.min(Math.max(1, Number(pageSize)), 1000);
  const safeMaxPages = Math.max(1, Number(maxPages));
  const collected = [];
  const seen = new Set();

  /*
    NYC Open Data pagination:
    Socrata caps practical page sizes, so we fetch sequential pages with
    $limit/$offset (for example ?$limit=1000&$offset=0) until we hit the target,
    a short page, or the configured page cap. This gives the classifier a much
    deeper report pool before irrelevant complaints are filtered out.
  */
  for (
    let page = 0;
    page < safeMaxPages && collected.length < targetRecords;
    page += 1
  ) {
    const offset = page * safePageSize;
    const pageRows = await fetch311Page({
      pageSize: safePageSize,
      offset,
      borough,
    });

    for (const row of pageRows) {
      if (row.unique_key && !seen.has(row.unique_key)) {
        seen.add(row.unique_key);
        collected.push(row);
      }

      if (collected.length >= targetRecords) {
        break;
      }
    }

    if (pageRows.length < safePageSize) {
      break;
    }
  }

  return collected;
}

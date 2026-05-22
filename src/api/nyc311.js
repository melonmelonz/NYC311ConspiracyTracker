const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json";

// Complaint types most likely to contain anomalous/conspiracy-adjacent content
const INTERESTING_TYPES = [
  "Noise - Residential",
  "Noise - Street/Sidewalk",
  "Noise - Commercial",
  "Noise - Vehicle",
  "Noise",
  "Animal Abuse",
  "Animal in a+Park",
  "Rodent",
  "Sewer",
  "Air Quality",
  "Hazardous Materials",
  "Water Quality",
  "Radioactive Material",
  "Electrical",
  "General Construction/Plumbing",
  "Industrial Waste",
  "Drinking Water",
  "Underground Facility Complaint",
  "Tunnel Condition",
  "Non-Emergency Police Matter",
  "Homeless Person Assistance",
  "Derelict Vehicles",
  "Illegal Fireworks",
  "Unsanitary Animal Pvt Property",
  "Dead/Dying Tree",
  "Standing Water",
  "Water System",
  "Maintenance or Facility",
  "Elevator",
  "Pest Control - Making Visit",
  "Damaged Tree",
];

function buildQuery({ limit = 1000, offset = 0, borough, dateAfter }) {
  const params = new URLSearchParams({
    $limit: String(limit),
    $offset: String(offset),
    $order: "created_date DESC",
  });

  const whereClauses = [];

  // Filter to interesting complaint types
  const typeList = INTERESTING_TYPES.map((t) => `'${t}'`).join(",");
  whereClauses.push(`complaint_type in(${typeList})`);

  if (borough) {
    whereClauses.push(`borough='${borough.toUpperCase()}'`);
  }

  if (dateAfter) {
    whereClauses.push(`created_date > '${dateAfter}'`);
  }

  if (whereClauses.length) {
    params.set("$where", whereClauses.join(" AND "));
  }

  return `${BASE_URL}?${params.toString()}`;
}

export async function fetchNYC311Data({
  limit = 1000,
  offset = 0,
  borough,
  dateAfter,
} = {}) {
  const url = buildQuery({ limit, offset, borough, dateAfter });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`NYC 311 API error: ${response.status}`);
  }

  return response.json();
}

// Fetch multiple pages for a richer dataset
export async function fetchNYC311Batch({
  pages = 3,
  pageSize = 1000,
  borough,
  dateAfter,
} = {}) {
  const results = [];

  for (let i = 0; i < pages; i++) {
    const data = await fetchNYC311Data({
      limit: pageSize,
      offset: i * pageSize,
      borough,
      dateAfter,
    });
    results.push(...data);
    // If we got fewer than requested, no more pages
    if (data.length < pageSize) break;
  }

  return results;
}

const NYC_API_URL =
  process.env.NYC_311_API_URL || 'https://data.cityofnewyork.us/resource/erm2-nwe9.json';

const SELECTED_FIELDS = [
  'unique_key',
  'created_date',
  'borough',
  'complaint_type',
  'descriptor',
  'latitude',
  'longitude'
].join(',');

function socrataString(value) {
  return String(value).toUpperCase().replace(/'/g, "''");
}

export async function fetchRecent311Complaints({ limit = 500, borough } = {}) {
  const params = new URLSearchParams({
    $select: SELECTED_FIELDS,
    $order: 'created_date DESC',
    $limit: String(limit),
    $where: 'latitude IS NOT NULL AND longitude IS NOT NULL'
  });

  if (borough) {
    params.set(
      '$where',
      `latitude IS NOT NULL AND longitude IS NOT NULL AND borough='${socrataString(borough)}'`
    );
  }

  if (process.env.NYC_APP_TOKEN) {
    params.set('$$app_token', process.env.NYC_APP_TOKEN);
  }

  const response = await fetch(`${NYC_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`NYC 311 API request failed with ${response.status}`);
  }

  return response.json();
}

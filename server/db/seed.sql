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
) VALUES
(
  'seed-phantom-frequency-001',
  NOW() - INTERVAL '2 hours',
  'BROOKLYN',
  'Noise - Residential',
  'Persistent humming and strange noises reported near basement walls.',
  40.6782,
  -73.9442,
  'NOISE PHENOMENA',
  82
),
(
  'seed-watchers-002',
  NOW() - INTERVAL '7 hours',
  'MANHATTAN',
  'Illegal Parking',
  'Caller reports camera watching and possible surveillance equipment on a pole.',
  40.7831,
  -73.9712,
  'SURVEILLANCE',
  76
),
(
  'seed-vibration-grid-003',
  NOW() - INTERVAL '1 day',
  'QUEENS',
  'Noise',
  'Underground vibrations and subway noises continue after service ends.',
  40.7282,
  -73.7949,
  'UNDERGROUND CONSPIRACY',
  88
),
(
  'seed-unmarked-tests-004',
  NOW() - INTERVAL '2 days',
  'BRONX',
  'Air Quality',
  'Chemical smell and suspected testing from unmarked street equipment.',
  40.8448,
  -73.8648,
  'GOVERNMENT EXPERIMENT',
  91
),
(
  'seed-lights-005',
  NOW() - INTERVAL '4 days',
  'STATEN ISLAND',
  'General',
  'Unidentified lights hovering over shoreline, described as possible spacecraft.',
  40.5795,
  -74.1502,
  'ALIEN ACTIVITY',
  93
)
ON CONFLICT (unique_key) DO NOTHING;

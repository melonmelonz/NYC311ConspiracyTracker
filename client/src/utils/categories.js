export const categoryColors = {
  PARANORMAL: '#9d4edd',
  SURVEILLANCE: '#00ff88',
  'ALIEN ACTIVITY': '#3a86ff',
  'UNDERGROUND CONSPIRACY': '#b6461b',
  'GOVERNMENT EXPERIMENT': '#c1121f',
  'CULT ACTIVITY': '#8b0000',
  'ANIMAL CONSPIRACY': '#b8a98f',
  'NOISE PHENOMENA': '#00d26a'
};

export const boroughs = ['BROOKLYN', 'MANHATTAN', 'QUEENS', 'BRONX', 'STATEN ISLAND'];

export const categories = Object.keys(categoryColors);

export function getCategoryColor(category) {
  return categoryColors[category] || '#d9d2c5';
}

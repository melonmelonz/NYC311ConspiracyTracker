import { CATEGORY_CONFIG } from "./classifier";

export const categoryColors = Object.fromEntries(
  CATEGORY_CONFIG.map((c) => [c.name, c.color])
);

export const boroughs = ["BROOKLYN", "MANHATTAN", "QUEENS", "BRONX", "STATEN ISLAND"];

export const categories = CATEGORY_CONFIG.map((c) => c.name);

export function getCategoryColor(category) {
  return categoryColors[category] || "#d9d2c5";
}

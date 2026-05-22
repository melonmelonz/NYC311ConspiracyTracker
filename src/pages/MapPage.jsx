import { useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import FilterBar from "../components/FilterBar";
import LoadingState from "../components/LoadingState";
import { useAnomalies } from "../hooks/useAnomalies";
import { getCategoryColor } from "../utils/categories";
import { formatDate } from "../utils/formatters";

const markerIconCache = new Map();

function createMarkerIcon(category, score) {
  const color = getCategoryColor(category);
  const scoreBucket = Math.round(Number(score || 1) / 10) * 10;
  const cacheKey = `${category}:${scoreBucket}`;

  if (markerIconCache.has(cacheKey)) {
    return markerIconCache.get(cacheKey);
  }

  const icon = L.divIcon({
    className: "conspiracy-marker",
    html: `<span style="--marker-color:${color}; --marker-size:${Math.max(18, Math.min(42, scoreBucket / 2))}px"></span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -18],
  });

  markerIconCache.set(cacheKey, icon);
  return icon;
}

export default function MapPage() {
  const [filters, setFilters] = useState({ minScore: 1 });
  const { anomalies, loading } = useAnomalies({
    borough: filters.borough,
    category: filters.category,
    search: filters.search,
    minScore: filters.minScore,
  });

  // Only show reports with valid coordinates, cap at 200 for performance
  const geoReports = useMemo(
    () =>
      anomalies
        .filter((a) => a.latitude && a.longitude && Number(a.latitude) !== 0)
        .slice(0, 200),
    [anomalies]
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 border-b border-paper/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.28em] text-alien">NYC Heat Map</p>
          <h2 className="mt-2 font-display text-6xl leading-none text-aged">Anomaly Hotspots</h2>
        </div>
        <p className="font-marker text-3xl text-paper">LIVE SIGNAL MAP</p>
      </section>

      <FilterBar filters={filters} onChange={setFilters} />

      <section className="relative overflow-hidden rounded-[6px] border border-paper/10 bg-black shadow-evidence">
        {loading ? (
          <LoadingState label="TRIANGULATING BOROUGH SIGNALS" />
        ) : (
          <MapContainer
            center={[40.7128, -74.006]}
            zoom={11}
            scrollWheelZoom
            preferCanvas
            className="h-[72vh] min-h-[34rem] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {geoReports.map((report) => {
              const cats = report.conspiracy_categories?.length
                ? report.conspiracy_categories
                : [report.conspiracy_category];

              return (
                <Marker
                  key={report.unique_key}
                  position={[Number(report.latitude), Number(report.longitude)]}
                  icon={createMarkerIcon(cats[0], report.conspiracy_score)}
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{cats.join(" / ")}</strong>
                      <span>{report.borough}</span>
                      <span>{formatDate(report.created_date)}</span>
                      <p>{report.descriptor}</p>
                      <b>Score {report.conspiracy_score}</b>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
        <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-[6px] border border-surveillance/30 bg-matte/80 px-4 py-3 shadow-terminal backdrop-blur">
          <p className="font-body text-xs uppercase tracking-[0.25em] text-surveillance">LIVE MAP FEED</p>
          <p className="mt-1 font-display text-4xl text-aged">{geoReports.length}</p>
        </div>
      </section>
    </div>
  );
}

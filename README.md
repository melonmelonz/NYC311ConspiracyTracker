# NYC 311 Anomaly Tracker

A live conspiracy/paranormal intelligence dashboard built on NYC's real 311 complaint data. Fetches complaints directly from the [NYC Open Data Socrata API](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9), classifies them in-browser using keyword analysis and scoring, and displays results across a dashboard, case file feed, interactive map, and analytics suite.

Originally forked from [destinyheather92/NYC311ConspiracyTracker](https://github.com/destinyheather92/NYC311ConspiracyTracker) and rebuilt as a pure client-side app (no server/database required).

## Stack

- **React 18** + **Vite** (static SPA)
- **Tailwind CSS** (dark intelligence theme)
- **Recharts** (data visualization)
- **Leaflet** + **React-Leaflet** (interactive map)
- **NYC Open Data Socrata API** (live 311 data, no API key required)

No backend, no database. The app fetches live data from the public NYC API and classifies everything client-side.

## Running Locally

```bash
# Clone the repo
git clone https://github.com/melonmelonz/NYC311ConspiracyTracker.git
cd NYC311ConspiracyTracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. This is a static site -- serve it from any static host (Cloudflare Pages, Netlify, Vercel, etc.).

## How It Works

1. **Fetch**: On page load, the app fetches ~3000 recent NYC 311 complaints from the Socrata API, filtering for complaint types likely to contain anomalous content (noise, air quality, sewer, animal, hazmat, etc.)

2. **Classify**: Each complaint runs through a client-side classifier that scores it against 9 conspiracy categories:
   - Paranormal, Surveillance, Alien Activity, Underground, Gov Experiment, Cult Activity, Animal Anomaly, Noise Phenomena, Oddity

3. **Score**: Reports get a conspiracy score (1-100) based on keyword rarity, suspicious language, category overlap, keyword density, and location data

4. **Display**: Classified anomalies populate the dashboard, case feed, interactive map (dark Carto tiles), and analytics charts

## Pages

- **Dashboard** -- overview stats, trend chart, category breakdown, recent feed
- **Case Feed** -- filterable list of all classified reports with search, borough/category filters, and score threshold
- **Heat Map** -- Leaflet map with color-coded markers sized by conspiracy score
- **Analytics** -- temporal trends, borough distribution, category pie chart, radar intensity

## API

This app calls the NYC Open Data Socrata API directly from the browser:

```
GET https://data.cityofnewyork.us/resource/erm2-nwe9.json
    ?$limit=1000
    &$offset=0
    &$order=created_date DESC
    &$where=complaint_type in('Noise - Residential', 'Air Quality', ...)
```

No API key is required. The Socrata API is public and CORS-enabled. An optional app token can improve rate limits but is not needed for normal use.

## Project Structure

```
src/
  api/nyc311.js          -- Socrata API client (fetch + pagination)
  utils/classifier.js    -- Conspiracy classification engine
  utils/categories.js    -- Category colors and names
  utils/formatters.js    -- Date and number formatting
  hooks/useAnomalies.js  -- React hooks for data fetching + caching
  components/            -- Reusable UI components
  pages/                 -- Dashboard, Reports, MapPage, Analytics
  index.css              -- Dark theme styles + animations
```

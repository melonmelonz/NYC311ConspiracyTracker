# 311 Conspiracy Tracker

A full-stack PERN application that pulls NYC 311 complaints from NYC Open Data, classifies uncanny reports with a server-side keyword system, stores them in PostgreSQL, and renders a dark conspiracy-intelligence dashboard.

## Stack

- PostgreSQL
- Express.js
- React.js with Vite
- Node.js
- Axios
- Recharts
- React Router
- Leaflet.js
- Tailwind CSS

## Project Structure

```text
311ConspiracyTracker/
  client/        React + Vite frontend
  server/        Express API, services, PostgreSQL queries
```

Backend folders required by the brief are included: `routes`, `controllers`, `services`, `db`, `middleware`, and `utils`.

## Setup

1. Create a PostgreSQL database.

```sql
CREATE DATABASE conspiracy_tracker;
```

2. Copy the backend environment file.

```powershell
Copy-Item server\.env.example server\.env
```

3. Update `server/.env`.

```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/conspiracy_tracker
CLIENT_ORIGIN=http://localhost:5173
NYC_311_API_URL=https://data.cityofnewyork.us/resource/erm2-nwe9.json
NYC_APP_TOKEN=
```

`NYC_APP_TOKEN` is optional, but adding a Socrata app token improves live API reliability.

4. Run the schema and seed SQL.

```powershell
psql -d conspiracy_tracker -f server\db\schema.sql
psql -d conspiracy_tracker -f server\db\seed.sql
```

5. Install dependencies.

```powershell
npm.cmd install
npm.cmd run install:all
```

6. Start the app.

```powershell
npm.cmd run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## API Routes

- `GET /api/reports`
- `GET /api/reports/category/:category`
- `GET /api/reports/borough/:borough`
- `GET /api/reports/search?q=`
- `GET /api/stats`
- `GET /api/map-data`

Most report routes accept query filters:

- `limit`
- `borough`
- `category`
- `q`
- `minScore`

## How Classification Works

The backend fetches live 311 data from:

`https://data.cityofnewyork.us/resource/erm2-nwe9.json`

It examines `complaint_type` and `descriptor`, matches them against category keyword lists, calculates a deterministic conspiracy score from keyword density and report details, filters out irrelevant complaints, and stores only conspiracy-related results.

If PostgreSQL or the NYC API is unavailable during local development, the API falls back to seeded in-memory reports so the interface remains testable.

## Image Placeholders

The React components include obvious placeholder zones and source comments such as:

```html
<!-- INSERT CUSTOM CONSPIRACY IMAGE HERE -->
```

and visible placeholder panels for future witness photos, evidence boards, posters, and pinned investigation images.

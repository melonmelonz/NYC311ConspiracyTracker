import {
  AlertTriangle,
  Archive,
  FolderKanban,
  MapPinned,
  RadioTower
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import ChartPanel from '../components/ChartPanel';
import ClassifiedStamp from '../components/ClassifiedStamp';
import EmptyState from '../components/EmptyState';
import EvidenceCard from '../components/EvidenceCard';
import EvidenceImagePlaceholder from '../components/EvidenceImagePlaceholder';
import LoadingState from '../components/LoadingState';
import StatCard from '../components/StatCard';
import { useReports, useStats } from '../hooks/useReports';
import { getCategoryColor } from '../utils/categories';
import { compactNumber } from '../utils/formatters';
import evidenceWall from '../assets/evidence-wall.png';

function chartTooltipStyle() {
  return {
    background: '#0a0a0a',
    border: '1px solid rgba(184,169,143,0.25)',
    borderRadius: 6,
    color: '#d9d2c5'
  };
}

export default function Dashboard() {
  const { reports, loading } = useReports({ limit: 8, minScore: 1 });
  const { stats, loading: statsLoading } = useStats();
  const summary = stats?.summary || {};
  const byCategory = stats?.byCategory || [];
  const byBorough = stats?.byBorough || [];
  const trend = stats?.trend || [];

  return (
    <div className="space-y-6">
      <section className="hero-board relative min-h-[32rem] overflow-hidden rounded-[6px] border border-paper/10 shadow-evidence">
        <img src={evidenceWall} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-matte via-matte/78 to-matte/35" />
        <div className="red-string string-a" />
        <div className="red-string string-b" />
        <div className="relative z-10 grid min-h-[32rem] content-between gap-8 p-5 sm:p-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl self-center">
            <ClassifiedStamp>CLASSIFIED</ClassifiedStamp>
            <h2 className="mt-6 font-display text-7xl leading-none text-aged sm:text-8xl lg:text-9xl">
              311 Conspiracy Tracker
            </h2>
            <p className="mt-5 max-w-2xl font-marker text-3xl leading-tight text-paper">
              Evidence intake, anomaly scoring, borough signal mapping.
            </p>
          </div>
          <div className="self-end xl:self-center">
            <div className="classified-panel max-w-md">
              <div className="mb-4 flex items-center justify-between">
                <span className="live-dot" />
                <ClassifiedStamp tone="green">ACTIVE CASE</ClassifiedStamp>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-paper/10 bg-black/35 p-3">
                  <p className="font-body text-xs uppercase tracking-[0.24em] text-muted">Signal</p>
                  <p className="font-display text-4xl text-surveillance">LIVE</p>
                </div>
                <div className="border border-paper/10 bg-black/35 p-3">
                  <p className="font-body text-xs uppercase tracking-[0.24em] text-muted">Protocol</p>
                  <p className="font-display text-4xl text-crimson">311</p>
                </div>
              </div>
              <EvidenceImagePlaceholder label="WITNESS PHOTO SLOT" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Archive}
          label="Total Reports"
          value={compactNumber(summary.total_reports || summary.conspiracy_reports || reports.length)}
          detail="Records in the local evidence vault"
          accent="#b8a98f"
        />
        <StatCard
          icon={AlertTriangle}
          label="Conspiracy Reports"
          value={compactNumber(summary.conspiracy_reports || reports.length)}
          detail="Relevant complaints after classification"
          accent="#c1121f"
        />
        <StatCard
          icon={FolderKanban}
          label="Active Categories"
          value={summary.active_categories || byCategory.length || 0}
          detail="Open anomaly families"
          accent="#00ff88"
        />
        <StatCard
          icon={MapPinned}
          label="Top Borough"
          value={summary.top_borough || 'UNKNOWN'}
          detail="Highest current signal density"
          accent="#3a86ff"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartPanel title="Conspiracy Trend Graph" eyebrow="SIGNAL TRACE">
          <div className="h-80">
            {statsLoading ? (
              <LoadingState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c1121f" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#c1121f" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(184,169,143,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle()} />
                  <Area
                    type="monotone"
                    dataKey="reports"
                    stroke="#c1121f"
                    strokeWidth={3}
                    fill="url(#trendGlow)"
                  />
                  <Area
                    type="monotone"
                    dataKey="intensity"
                    stroke="#00ff88"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartPanel>

        <ChartPanel title="Category Pie Chart" eyebrow="CASE SPLIT">
          <div className="h-80">
            {statsLoading ? (
              <LoadingState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={64}
                    outerRadius={112}
                    paddingAngle={4}
                  >
                    {byCategory.map((entry) => (
                      <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle()} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ChartPanel title="Borough Analytics" eyebrow="BOROUGH GRID">
          <div className="h-80">
            {statsLoading ? (
              <LoadingState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byBorough}>
                  <CartesianGrid stroke="rgba(184,169,143,0.08)" vertical={false} />
                  <XAxis dataKey="name" stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle()} />
                  <Bar dataKey="reports" fill="#b6461b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="intensity" fill="#00ff88" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartPanel>

        <ChartPanel
          title="Recent Conspiracy Feed"
          eyebrow="LIVE CASE FILES"
          action={
            <div className="flex items-center gap-2 text-surveillance">
              <RadioTower size={18} />
              <span className="live-dot" />
            </div>
          }
        >
          {loading ? (
            <LoadingState />
          ) : reports.length ? (
            <div className="grid gap-3">
              {reports.slice(0, 5).map((report) => (
                <EvidenceCard key={report.unique_key} report={report} compact />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ChartPanel>
      </section>
    </div>
  );
}

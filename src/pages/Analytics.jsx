import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart, Pie, PieChart, Radar, RadarChart,
  PolarAngleAxis, PolarGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import ChartPanel from "../components/ChartPanel";
import LoadingState from "../components/LoadingState";
import { useAnomalies, useAnomalyStats } from "../hooks/useAnomalies";
import { getCategoryColor } from "../utils/categories";

const tooltipStyle = {
  background: "#0a0a0a",
  border: "1px solid rgba(184,169,143,0.25)",
  borderRadius: 6,
  color: "#d9d2c5",
};

export default function Analytics() {
  const { allAnomalies, loading } = useAnomalies();
  const { byCategory, byBorough, trend } = useAnomalyStats(allAnomalies);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 border-b border-paper/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.28em] text-surveillance">
            Anomaly Analytics
          </p>
          <h2 className="mt-2 font-display text-6xl leading-none text-aged">
            Pattern Evidence Lab
          </h2>
        </div>
        <p className="font-marker text-3xl text-paper">DATA LEAVES A TRACE</p>
      </section>

      {loading ? (
        <LoadingState label="ASSEMBLING ANALYTIC DOSSIERS" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartPanel title="Reports Over Time" eyebrow="TEMPORAL TRACE">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid stroke="rgba(184,169,143,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="reports" stroke="#c1121f" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>

          <ChartPanel title="Reports By Borough" eyebrow="BOROUGH FILES">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byBorough} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid stroke="rgba(184,169,143,0.08)" horizontal={false} />
                  <XAxis type="number" stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={105} stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="reports" fill="#b6461b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>

          <ChartPanel title="Category Distribution" eyebrow="ANOMALY SPLIT">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={118}>
                    {byCategory.map((entry) => (
                      <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>

          <ChartPanel title="Borough Intensity" eyebrow="SIGNAL PRESSURE">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={byBorough}>
                  <PolarGrid stroke="rgba(184,169,143,0.16)" />
                  <PolarAngleAxis dataKey="name" stroke="#8c8c8c" />
                  <Radar dataKey="intensity" stroke="#00ff88" fill="#00ff88" fillOpacity={0.24} />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>

          <ChartPanel title="Anomaly Activity Trend" eyebrow="INTENSITY OVERLAY" className="xl:col-span-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <CartesianGrid stroke="rgba(184,169,143,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8c8c8c" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="reports" stroke="#9d4edd" strokeWidth={3} fill="#9d4edd" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>
        </div>
      )}
    </div>
  );
}

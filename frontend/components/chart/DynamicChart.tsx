"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from "recharts";
import { getChartType, getChartConfig, formatNumber } from "@/lib/insights";

interface DynamicChartProps {
  results: Record<string, unknown>[];
  title?: string;
}

const COLORS = [
  "#16A34A", "#0EA5E9", "#8B5CF6", "#F59E0B", "#EF4444",
  "#06B6D4", "#EC4899", "#84CC16", "#F97316", "#6366F1",
];

const TOOLTIP_STYLE = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 13,
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
};

function tickFormatter(v: unknown): string {
  if (typeof v !== "number") return String(v);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

function CustomTooltip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: 6, fontSize: 12 }}>{String(label)}</div>
      {(payload as Array<{ name: string; value: unknown; color: string }>).map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
            {p.name.replace(/_/g, " ")}: <strong style={{ color: "var(--color-text)" }}>{formatNumber(p.value)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DynamicChart({ results, title }: DynamicChartProps) {
  if (results.length === 0) return null;

  const chartType = getChartType(results);
  const config = getChartConfig(results);

  const chartTitle = title ?? (config
    ? `${config.valueKey.replace(/_/g, " ")} by ${config.categoryKey.replace(/_/g, " ")}`
    : "Results");

  const axisStyle = { fontSize: 11, fill: "var(--color-text-muted)" };

  const wrapperStyle: React.CSSProperties = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 14,
    padding: "20px 20px 16px",
    boxShadow: "var(--shadow-sm)",
    animation: "fadeIn 0.4s ease forwards",
  };

  // ── KPI ──────────────────────────────────────────────────────────────────────
  if (chartType === "kpi" || !config) return null; // handled by KPICard

  // ── PIE ──────────────────────────────────────────────────────────────────────
  if (chartType === "pie") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={results}
              dataKey={config.valueKey}
              nameKey={config.categoryKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={3}
              label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {results.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── HORIZONTAL BAR ────────────────────────────────────────────────────────────
  if (chartType === "horizontal-bar") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={Math.max(280, results.length * 36)}>
          <BarChart
            data={results}
            layout="vertical"
            margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
            <XAxis type="number" tick={axisStyle} tickFormatter={tickFormatter} />
            <YAxis
              type="category"
              dataKey={config.categoryKey}
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={config.valueKey} fill="#16A34A" radius={[0, 6, 6, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── LINE ─────────────────────────────────────────────────────────────────────
  if (chartType === "line") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={results} margin={{ top: 4, right: 20, left: 8, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey={config.categoryKey} tick={axisStyle} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={axisStyle} tickFormatter={tickFormatter} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey={config.valueKey} stroke="#16A34A" strokeWidth={2.5} dot={{ fill: "#16A34A", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── AREA ──────────────────────────────────────────────────────────────────────
  if (chartType === "area") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={results} margin={{ top: 4, right: 20, left: 8, bottom: 60 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey={config.categoryKey} tick={axisStyle} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={axisStyle} tickFormatter={tickFormatter} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={config.valueKey} stroke="#16A34A" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: "#16A34A", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── BAR (default) ─────────────────────────────────────────────────────────────
  return (
    <div style={wrapperStyle}>
      <h3 style={headerStyle}>{chartTitle}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={results} margin={{ top: 4, right: 20, left: 8, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey={config.categoryKey}
            tick={axisStyle}
            angle={results.length > 8 ? -35 : 0}
            textAnchor={results.length > 8 ? "end" : "middle"}
            interval={0}
          />
          <YAxis tick={axisStyle} tickFormatter={tickFormatter} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={config.valueKey} fill="#16A34A" radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-text)",
  margin: "0 0 16px",
  textTransform: "capitalize",
};

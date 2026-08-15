"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { getChartType, getChartConfig, formatNumber, type ChartType } from "@/lib/insights";


interface DynamicChartProps {
  results: Record<string, unknown>[];
  title?: string;
  question?: string;
  semanticQuery?: Record<string, unknown>;
  forceChartType?: ChartType;
}

const PALETTE = [
  "#16A34A", "#0EA5E9", "#8B5CF6", "#F59E0B", "#EF4444",
  "#06B6D4", "#EC4899", "#84CC16", "#F97316", "#6366F1",
];

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 13,
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
};

function tickFormatter(v: unknown): string {
  if (typeof v !== "number") return String(v);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

function truncateLabel(v: unknown, maxLen = 14): string {
  const s = String(v ?? "");
  return s.length > maxLen ? s.slice(0, maxLen - 1) + "…" : s;
}

function CustomTooltip({ active, payload, label }: Record<string, unknown>) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ fontWeight: 700, color: "var(--color-text)", marginBottom: 8, fontSize: 12, borderBottom: "1px solid var(--color-border)", paddingBottom: 6 }}>
        {String(label)}
      </div>
      {(payload as Array<{ name: string; value: unknown; color: string }>).map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
            {p.name.replace(/_/g, " ")}:{" "}
            <strong style={{ color: "var(--color-text)" }}>{formatNumber(p.value)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

// Single KPI card rendered inline when chart type is kpi
function SingleKPIDisplay({ results }: { results: Record<string, unknown>[] }) {
  const row = results[0];
  const entries = Object.entries(row);

  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: 14,
      padding: "28px 32px",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
      animation: "fadeIn 0.4s ease forwards",
    }}>
      {entries.map(([key, val]) => (
        <div key={key} style={{ flex: "1 1 180px" }}>
          <div style={{
            height: 3,
            width: 40,
            background: "linear-gradient(90deg, #16A34A, #4ADE80)",
            borderRadius: 2,
            marginBottom: 12,
          }} />
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 6,
          }}>
            {key.replace(/_/g, " ")}
          </div>
          <div style={{
            fontSize: 36,
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>
            {typeof val === "number" ? formatNumber(val) : String(val ?? "—")}
          </div>
        </div>
      ))}
    </div>
  );
}

const AXIS_STYLE = { fontSize: 11, fill: "var(--color-text-muted)" } as const;

export default function DynamicChart({ results, title, question, semanticQuery, forceChartType }: DynamicChartProps) {
  if (results.length === 0) return null;

  const chartType = forceChartType ?? getChartType(results, semanticQuery);
  const config = getChartConfig(results);

  // Auto-generate a meaningful title
  const chartTitle =
    title ??
    (config
      ? `${config.valueKey.replace(/_/g, " ")} by ${config.categoryKey.replace(/_/g, " ")}`
      : question ?? "Results");

  const wrapperStyle: React.CSSProperties = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 14,
    padding: "20px 20px 16px",
    boxShadow: "var(--shadow-sm)",
    animation: "fadeIn 0.4s ease forwards",
  };

  // ── KPI / Multi-KPI ───────────────────────────────────────────────────────
  if (chartType === "kpi" || chartType === "multi-kpi") {
    return <SingleKPIDisplay results={results} />;
  }

  // No config means we can't render anything meaningful
  if (!config) return null;

  const { categoryKey, valueKey } = config;

  // ── DONUT ─────────────────────────────────────────────────────────────────
  if (chartType === "donut") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={results}
              dataKey={valueKey}
              nameKey={categoryKey}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={55}
              paddingAngle={3}
              label={({ name, percent }) =>
                `${truncateLabel(name, 12)} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {results.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── PIE (legacy fallback) ─────────────────────────────────────────────────
  if (chartType === "pie") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={results}
              dataKey={valueKey}
              nameKey={categoryKey}
              cx="50%"
              cy="50%"
              outerRadius={110}
              paddingAngle={3}
              label={({ name, percent }) =>
                `${truncateLabel(name, 12)} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {results.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── HORIZONTAL BAR ────────────────────────────────────────────────────────
  if (chartType === "horizontal-bar") {
    const chartH = Math.max(300, results.length * 38);
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={chartH}>
          <BarChart
            data={results}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
          >
            <defs>
              <linearGradient id="hBarGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#16A34A" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
            <XAxis type="number" tick={AXIS_STYLE} tickFormatter={tickFormatter} />
            <YAxis
              type="category"
              dataKey={categoryKey}
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              width={120}
              tickFormatter={(v) => truncateLabel(v, 16)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={valueKey} fill="url(#hBarGrad)" radius={[0, 6, 6, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── LINE ──────────────────────────────────────────────────────────────────
  if (chartType === "line") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={results} margin={{ top: 8, right: 24, left: 8, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey={categoryKey}
              tick={AXIS_STYLE}
              angle={-35}
              textAnchor="end"
              interval={0}
              tickFormatter={(v) => truncateLabel(v, 12)}
            />
            <YAxis tick={AXIS_STYLE} tickFormatter={tickFormatter} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={valueKey}
              stroke="#16A34A"
              strokeWidth={2.5}
              dot={{ fill: "#16A34A", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#4ADE80" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── AREA ──────────────────────────────────────────────────────────────────
  if (chartType === "area") {
    return (
      <div style={wrapperStyle}>
        <h3 style={headerStyle}>{chartTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={results} margin={{ top: 8, right: 24, left: 8, bottom: 60 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey={categoryKey}
              tick={AXIS_STYLE}
              angle={-35}
              textAnchor="end"
              interval={0}
              tickFormatter={(v) => truncateLabel(v, 12)}
            />
            <YAxis tick={AXIS_STYLE} tickFormatter={tickFormatter} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={valueKey}
              stroke="#16A34A"
              strokeWidth={2.5}
              fill="url(#areaGrad)"
              dot={{ fill: "#16A34A", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#4ADE80" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── BAR (default, sorted descending for rankings) ─────────────────────────
  const isRanking =
    typeof semanticQuery?.limit === "number" && (semanticQuery.limit as number) < 100;
  const displayData = isRanking
    ? [...results].sort((a, b) => {
        const av = typeof a[valueKey] === "number" ? (a[valueKey] as number) : 0;
        const bv = typeof b[valueKey] === "number" ? (b[valueKey] as number) : 0;
        return bv - av;
      })
    : results;

  const rotateLabels = results.length > 6;

  return (
    <div style={wrapperStyle}>
      <h3 style={headerStyle}>{chartTitle}</h3>
      <ResponsiveContainer width="100%" height={rotateLabels ? 320 : 280}>
        <BarChart
          data={displayData}
          margin={{ top: 8, right: 24, left: 8, bottom: rotateLabels ? 70 : 20 }}
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#16A34A" stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey={categoryKey}
            tick={AXIS_STYLE}
            angle={rotateLabels ? -35 : 0}
            textAnchor={rotateLabels ? "end" : "middle"}
            interval={0}
            tickFormatter={(v) => truncateLabel(v, 14)}
          />
          <YAxis tick={AXIS_STYLE} tickFormatter={tickFormatter} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={valueKey}
            fill="url(#barGrad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={52}
          />
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
  letterSpacing: "-0.01em",
};

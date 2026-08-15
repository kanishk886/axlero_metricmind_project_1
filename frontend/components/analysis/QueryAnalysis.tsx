"use client";

import React from "react";
import DynamicChart from "@/components/chart/DynamicChart";
import {
  generateInsights,
  generateKPISummary,
  generateResultSummary,
  formatNumber,
  getChartType,
  getChartConfig,
  type Insight,
} from "@/lib/insights";
import type { QueryResponse } from "@/lib/api";

interface QueryAnalysisProps {
  question: string;
  data: QueryResponse;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      color: "var(--color-text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: 14,
      padding: "22px 24px",
      boxShadow: "var(--shadow-sm)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Result Summary ────────────────────────────────────────────────────────────

function ResultSummarySection({ summary }: { summary: string }) {
  return (
    <Card>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 40,
          height: 40,
          background: "var(--color-primary-light)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-primary)",
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Result Summary
          </div>
          <p style={{ fontSize: 14.5, color: "var(--color-text)", lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
            {summary}
          </p>
        </div>
      </div>
    </Card>
  );
}

// ── Query Understanding ───────────────────────────────────────────────────────

function Tag({ label, value, color }: { label: string; value: string; color: string }) {
  const COLORS: Record<string, { bg: string; text: string }> = {
    green: { bg: "var(--color-primary-light)", text: "var(--color-primary)" },
    blue:  { bg: "rgba(14,165,233,0.1)", text: "#0EA5E9" },
    amber: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
    purple:{ bg: "rgba(139,92,246,0.1)", text: "#8B5CF6" },
    slate: { bg: "var(--color-surface-3)", text: "var(--color-text-secondary)" },
  };
  const c = COLORS[color] ?? COLORS.slate;
  return (
    <div>
      <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 12px",
        background: c.bg,
        color: c.text,
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
      }}>
        {value}
      </span>
    </div>
  );
}

function QueryUnderstandingSection({ semantic_query }: { semantic_query: Record<string, unknown> }) {
  const measure = typeof semantic_query.measure === "string"
    ? semantic_query.measure.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  const dimensions =
    Array.isArray(semantic_query.dimensions) && semantic_query.dimensions.length > 0
      ? (semantic_query.dimensions as string[])
          .map((d) => d.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
          .join(", ")
      : "None";

  const filters =
    Array.isArray(semantic_query.filters) && semantic_query.filters.length > 0
      ? (semantic_query.filters as Array<{ member: string; operator: string; values: string[] }>)
          .map((f) => `${f.member.replace(/_/g, " ")} ${f.operator} ${f.values.join(", ")}`)
          .join(" · ")
      : null;

  const limit =
    typeof semantic_query.limit === "number" && semantic_query.limit < 100
      ? `Top ${semantic_query.limit}`
      : null;

  const order =
    typeof semantic_query.order === "string" && semantic_query.order
      ? semantic_query.order.toUpperCase()
      : null;

  return (
    <Card>
      <SectionLabel>Query Understanding</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Tag label="Measure" value={measure} color="green" />
        <Tag label="Dimension" value={dimensions} color="blue" />
        {filters && <Tag label="Filter" value={filters} color="amber" />}
        {limit && <Tag label="Limit" value={limit} color="purple" />}
        {order && <Tag label="Sort" value={order} color="slate" />}
      </div>
    </Card>
  );
}

// ── KPI Summary Cards ─────────────────────────────────────────────────────────

function SummaryMetricCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{
      background: "var(--color-surface-2)",
      border: "1px solid var(--color-border)",
      borderRadius: 12,
      padding: "16px 18px",
      flex: "1 1 160px",
      minWidth: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* accent bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: accent ?? "linear-gradient(90deg, #16A34A, #4ADE80)",
        borderRadius: "12px 12px 0 0",
      }} />
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: "var(--color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 8,
        marginTop: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 20,
        fontWeight: 800,
        color: "var(--color-text)",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        wordBreak: "break-word",
      }}>
        {typeof value === "number" ? formatNumber(value) : value}
      </div>
    </div>
  );
}

function KPISummarySection({ results, semanticQuery }: {
  results: Record<string, unknown>[];
  semanticQuery: Record<string, unknown>;
}) {
  const kpi = generateKPISummary(results, semanticQuery);
  if (!kpi) return null;

  return (
    <Card>
      <SectionLabel>KPI Summary</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <SummaryMetricCard label={kpi.totalLabel} value={kpi.totalValue} accent="linear-gradient(90deg,#16A34A,#4ADE80)" />
        {kpi.highestLabel && kpi.highestValue && (
          <SummaryMetricCard label={kpi.highestLabel} value={kpi.highestValue} accent="linear-gradient(90deg,#0EA5E9,#38BDF8)" />
        )}
        {kpi.lowestLabel && kpi.lowestValue && (
          <SummaryMetricCard label={kpi.lowestLabel} value={kpi.lowestValue} accent="linear-gradient(90deg,#F59E0B,#FCD34D)" />
        )}
        {kpi.avgLabel && kpi.avgValue && (
          <SummaryMetricCard label={kpi.avgLabel} value={kpi.avgValue} accent="linear-gradient(90deg,#8B5CF6,#C4B5FD)" />
        )}
        {kpi.countLabel && kpi.countValue !== undefined && (
          <SummaryMetricCard label={kpi.countLabel} value={kpi.countValue} accent="linear-gradient(90deg,#6366F1,#818CF8)" />
        )}
      </div>
    </Card>
  );
}

// ── Key Insights ──────────────────────────────────────────────────────────────

const INSIGHT_CONFIG: Record<Insight["type"], { bg: string; border: string; dot: string; numBg: string; numText: string }> = {
  positive: {
    bg: "rgba(22,163,74,0.06)",
    border: "rgba(22,163,74,0.18)",
    dot: "#16A34A",
    numBg: "rgba(22,163,74,0.12)",
    numText: "#16A34A",
  },
  neutral: {
    bg: "var(--color-surface-2)",
    border: "var(--color-border)",
    dot: "#0EA5E9",
    numBg: "rgba(14,165,233,0.1)",
    numText: "#0EA5E9",
  },
  info: {
    bg: "transparent",
    border: "var(--color-border)",
    dot: "#64748B",
    numBg: "var(--color-surface-3)",
    numText: "var(--color-text-muted)",
  },
  warning: {
    bg: "rgba(239,68,68,0.04)",
    border: "rgba(239,68,68,0.18)",
    dot: "#EF4444",
    numBg: "rgba(239,68,68,0.1)",
    numText: "#EF4444",
  },
};

function InsightRow({ insight, index }: { insight: Insight; index: number }) {
  const c = INSIGHT_CONFIG[insight.type];
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 16px",
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      transition: "transform 150ms",
    }}>
      {/* Number badge */}
      <div style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: c.numBg,
        color: c.numText,
        fontSize: 11,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
      }}>
        {index + 1}
      </div>
      <p style={{ fontSize: 14, color: "var(--color-text)", lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
        {insight.text}
      </p>
    </div>
  );
}

function KeyInsightsSection({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <SectionLabel>Key Insights</SectionLabel>
        <span style={{
          padding: "2px 8px",
          borderRadius: 10,
          background: "var(--color-primary-light)",
          color: "var(--color-primary)",
          fontSize: 11,
          fontWeight: 700,
          marginTop: -14,
          marginLeft: 2,
        }}>
          {insights.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {insights.map((insight, i) => (
          <InsightRow key={i} insight={insight} index={i} />
        ))}
      </div>

      <div style={{
        marginTop: 16,
        padding: "8px 12px",
        background: "var(--color-surface-2)",
        borderRadius: 8,
        fontSize: 11.5,
        color: "var(--color-text-muted)",
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        All insights are computed directly from the returned query results — no AI assumptions or hallucinations.
      </div>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QueryAnalysis({ question, data }: QueryAnalysisProps) {
  const { semantic_query, results } = data;

  const insights = generateInsights(question, semantic_query, results);
  const summary = generateResultSummary(question, semantic_query, results);
  const chartType = getChartType(results, semantic_query);
  const chartConfig = getChartConfig(results);
  const showChart = results.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.4s ease forwards" }}>

      {/* ── Query Text ── */}
      <Card>
        <SectionLabel>Query</SectionLabel>
        <div style={{
          padding: "12px 18px",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: 10,
          fontSize: 15.5,
          fontWeight: 500,
          color: "var(--color-text)",
          fontStyle: "italic",
          lineHeight: 1.5,
        }}>
          "{question}"
        </div>
      </Card>

      {/* ── Result Summary ── */}
      <ResultSummarySection summary={summary} />

      {/* ── Query Understanding ── */}
      <QueryUnderstandingSection semantic_query={semantic_query} />

      {/* ── KPI Summary ── */}
      <KPISummarySection results={results} semanticQuery={semantic_query} />

      {/* ── Visual Analysis ── */}
      {showChart && (
        <div>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 14,
            paddingLeft: 2,
          }}>
            Visual Analysis
          </div>
          <DynamicChart
            results={results}
            semanticQuery={semantic_query}
            question={question}
          />
          {/* Chart type badge */}
          <div style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "flex-end",
          }}>
            <span style={{
              padding: "3px 10px",
              borderRadius: 20,
              background: "var(--color-surface-2)",
              color: "var(--color-text-muted)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              border: "1px solid var(--color-border)",
            }}>
              {chartType.replace(/-/g, " ")} chart
            </span>
          </div>
        </div>
      )}

      {/* ── Key Insights ── */}
      <KeyInsightsSection insights={insights} />

    </div>
  );
}

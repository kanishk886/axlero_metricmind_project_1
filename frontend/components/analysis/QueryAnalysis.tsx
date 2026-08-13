"use client";

import DynamicChart from "@/components/chart/DynamicChart";
import { generateInsights, generateKPISummary, formatNumber } from "@/lib/insights";
import type { QueryResponse } from "@/lib/api";

interface QueryAnalysisProps {
  question: string;
  data: QueryResponse;
}

function InsightBullet({ text, type }: { text: string; type: "positive" | "neutral" | "info" }) {
  const colors = {
    positive: { bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.2)", dot: "#16A34A", text: "var(--color-text)" },
    neutral:  { bg: "var(--color-surface-2)", border: "var(--color-border)", dot: "#0EA5E9", text: "var(--color-text)" },
    info:     { bg: "rgba(14,165,233,0.06)", border: "rgba(14,165,233,0.2)", dot: "#64748B", text: "var(--color-text-secondary)" },
  }[type];

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "10px 14px",
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
    }}>
      <div style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: colors.dot,
        flexShrink: 0,
        marginTop: 5,
      }} />
      <span style={{ fontSize: 13.5, color: colors.text, lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: "var(--color-surface-2)",
      border: "1px solid var(--color-border)",
      borderRadius: 10,
      padding: "14px 16px",
      flex: "1 1 140px",
      minWidth: 0,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
        {typeof value === "number" ? formatNumber(value) : value}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function QueryAnalysis({ question, data }: QueryAnalysisProps) {
  const { semantic_query, results } = data;

  const insights = generateInsights(question, semantic_query, results);
  const kpiSummary = generateKPISummary(results, semantic_query);

  const measure = typeof semantic_query.measure === "string"
    ? semantic_query.measure.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  const dimensions = Array.isArray(semantic_query.dimensions) && semantic_query.dimensions.length > 0
    ? (semantic_query.dimensions as string[]).map((d) => d.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())).join(", ")
    : "None";

  const filters = Array.isArray(semantic_query.filters) && semantic_query.filters.length > 0
    ? (semantic_query.filters as Array<{ member: string; operator: string; values: string[] }>)
        .map((f) => `${f.member.replace(/_/g, " ")} ${f.operator} ${f.values.join(", ")}`)
        .join(" · ")
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.4s ease forwards" }}>

      {/* Query card */}
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "20px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Query
        </div>
        <div style={{
          padding: "10px 16px",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 500,
          color: "var(--color-text)",
          fontStyle: "italic",
        }}>
          "{question}"
        </div>
      </div>

      {/* Query Understanding */}
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "20px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
          Query Understanding
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ minWidth: 80 }}>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 3 }}>Measure</div>
              <span style={{
                display: "inline-block",
                padding: "4px 10px",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
              }}>
                {measure}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 3 }}>Dimension</div>
              <span style={{
                display: "inline-block",
                padding: "4px 10px",
                background: "rgba(14,165,233,0.1)",
                color: "#0EA5E9",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
              }}>
                {dimensions}
              </span>
            </div>
            {filters && (
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 3 }}>Filter</div>
                <span style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  background: "rgba(245,158,11,0.1)",
                  color: "#F59E0B",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {filters}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      {kpiSummary && (
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "20px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
            KPI Summary
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <SummaryCard label={kpiSummary.totalLabel} value={kpiSummary.totalValue} />
            {kpiSummary.highestLabel && kpiSummary.highestValue && (
              <SummaryCard label={kpiSummary.highestLabel} value={kpiSummary.highestValue} />
            )}
            {kpiSummary.lowestLabel && kpiSummary.lowestValue && (
              <SummaryCard label={kpiSummary.lowestLabel} value={kpiSummary.lowestValue} />
            )}
            {kpiSummary.countLabel && kpiSummary.countValue !== undefined && (
              <SummaryCard label={kpiSummary.countLabel} value={kpiSummary.countValue} />
            )}
          </div>
        </div>
      )}

      {/* Visualization */}
      {results.length > 1 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, paddingLeft: 2 }}>
            Visual Analysis
          </div>
          <DynamicChart results={results} />
        </div>
      )}

      {/* Key Insights */}
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "20px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Key Insights
          </div>
          <span style={{
            padding: "2px 7px",
            borderRadius: 10,
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            fontSize: 11,
            fontWeight: 600,
          }}>
            {insights.length}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {insights.map((insight, i) => (
            <InsightBullet key={i} text={insight.text} type={insight.type} />
          ))}
        </div>
        <div style={{
          marginTop: 14,
          padding: "8px 12px",
          background: "var(--color-surface-2)",
          borderRadius: 6,
          fontSize: 11.5,
          color: "var(--color-text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          All insights are derived directly from the returned query results — no AI assumptions or hallucinations.
        </div>
      </div>
    </div>
  );
}

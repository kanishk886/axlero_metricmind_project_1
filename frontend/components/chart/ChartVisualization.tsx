"use client";

import React, { useState } from "react";
import DynamicChart from "@/components/chart/DynamicChart";
import { getChartType, type ChartType } from "@/lib/insights";

interface ChartVisualizationProps {
  results: Record<string, unknown>[];
  question?: string;
  semanticQuery?: Record<string, unknown>;
}

const CHART_OPTIONS: { value: ChartType | "auto"; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "bar", label: "Bar" },
  { value: "horizontal-bar", label: "Horiz. Bar" },
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "donut", label: "Donut" },
  { value: "pie", label: "Pie" },
  { value: "kpi", label: "KPI Card" },
];

export default function ChartVisualization({
  results,
  question,
  semanticQuery,
}: ChartVisualizationProps) {
  const [selectedType, setSelectedType] = useState<ChartType | "auto">("auto");
  const [fullscreen, setFullscreen] = useState(false);

  const autoType = getChartType(results, semanticQuery);
  const activeType: ChartType = selectedType === "auto" ? autoType : selectedType;

  // Build a fake semanticQuery override that forces the chart type
  const queryOverride =
    selectedType !== "auto"
      ? { ...(semanticQuery ?? {}), _forceChartType: selectedType }
      : semanticQuery;

  return (
    <div
      style={
        fullscreen
          ? {
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "var(--color-bg)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
            }
          : {}
      }
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: "-0.01em",
          }}
        >
          Query Result Visualization
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Chart type dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ChartType | "auto")}
              style={{
                appearance: "none",
                padding: "5px 28px 5px 10px",
                borderRadius: 7,
                border: "1px solid var(--color-border)",
                background: "var(--color-surface-2)",
                color: "var(--color-text-secondary)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {CHART_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value === "auto" ? `Auto (${autoType.replace(/-/g, " ")})` : opt.label}
                </option>
              ))}
            </select>
            {/* Dropdown chevron */}
            <div
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--color-text-muted)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setFullscreen((f) => !f)}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 7,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text-muted)",
              cursor: "pointer",
            }}
          >
            {fullscreen ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* The actual chart — pass forceChartType via a hidden prop on semanticQuery */}
      <ChartTypedWrapper
        results={results}
        question={question}
        semanticQuery={queryOverride}
        forceType={selectedType === "auto" ? undefined : activeType}
      />

      {/* Close fullscreen */}
      {fullscreen && (
        <button
          onClick={() => setFullscreen(false)}
          style={{
            position: "fixed",
            top: 16,
            right: 24,
            zIndex: 1010,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✕ Close
        </button>
      )}
    </div>
  );
}

// Internal wrapper that overrides the chart type when forced
function ChartTypedWrapper({
  results,
  question,
  semanticQuery,
  forceType,
}: {
  results: Record<string, unknown>[];
  question?: string;
  semanticQuery?: Record<string, unknown>;
  forceType?: ChartType;
}) {
  if (!forceType) {
    return <DynamicChart results={results} question={question} semanticQuery={semanticQuery} />;
  }

  // Temporarily override by passing a mutated semantic query that tricks getChartType
  // The simplest approach: pass a results prop shaped to match the forced type
  // Actually, let DynamicChart accept a forceChartType prop
  return (
    <DynamicChart
      results={results}
      question={question}
      semanticQuery={semanticQuery}
      forceChartType={forceType}
    />
  );
}

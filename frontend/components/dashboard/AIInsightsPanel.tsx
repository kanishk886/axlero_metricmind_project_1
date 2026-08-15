"use client";

import React from "react";
import {
  generateInsights,
  generateResultSummary,
  generateSuggestions,
} from "@/lib/insights";
import type { QueryResponse } from "@/lib/api";

interface AIInsightsPanelProps {
  question: string;
  data: QueryResponse;
  queryTime?: number | null;
  executedAt?: Date | null;
  onNavigateAnalysis?: () => void;
  onDownloadCSV?: () => void;
}

function PanelSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--color-border)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ color: "var(--color-primary)", display: "flex" }}>{icon}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function BulletPoint({ text, color }: { text: string; color?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 7,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color ?? "var(--color-primary)",
          flexShrink: 0,
          marginTop: 5,
        }}
      />
      <span
        style={{
          fontSize: 12.5,
          color: "var(--color-text-secondary)",
          lineHeight: 1.55,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{label}</span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          textAlign: "right",
          maxWidth: "55%",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        background: "none",
        border: "none",
        padding: "7px 0",
        cursor: "pointer",
        color: "var(--color-text-secondary)",
        fontSize: 12.5,
        fontWeight: 500,
        textAlign: "left",
        borderRadius: 6,
        transition: "color 150ms",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-primary)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)")
      }
    >
      <span style={{ display: "flex", color: "inherit", opacity: 0.7 }}>{icon}</span>
      {label}
    </button>
  );
}

export default function AIInsightsPanel({
  question,
  data,
  queryTime,
  executedAt,
  onNavigateAnalysis,
  onDownloadCSV,
}: AIInsightsPanelProps) {
  const { semantic_query, results } = data;
  const insights = generateInsights(question, semantic_query, results);
  const summary = generateResultSummary(question, semantic_query, results);
  const suggestions = generateSuggestions(question, semantic_query, results);

  // Show top 4 key observations (positive + neutral)
  const keyObservations = insights
    .filter((i) => i.type === "positive" || i.type === "neutral")
    .slice(0, 4);

  const executedAtStr = executedAt
    ? executedAt.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div
      style={{
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        borderLeft: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 18px 14px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          position: "sticky",
          top: 0,
          background: "var(--color-surface)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "var(--color-primary-light)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
            flexShrink: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: "-0.01em",
          }}
        >
          AI Insights
        </span>
      </div>

      {/* Summary */}
      <PanelSection
        title="Summary"
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        }
      >
        <p
          style={{
            fontSize: 12.5,
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {summary}
        </p>
      </PanelSection>

      {/* Key Observations */}
      {keyObservations.length > 0 && (
        <PanelSection
          title="Key Observations"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        >
          {keyObservations.map((obs, i) => (
            <BulletPoint key={i} text={obs.text} />
          ))}
        </PanelSection>
      )}

      {/* Suggestions */}
      <PanelSection
        title="Suggestions"
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      >
        {suggestions.map((s, i) => (
          <BulletPoint key={i} text={s} color="#8B5CF6" />
        ))}
      </PanelSection>

      {/* Query Details */}
      <PanelSection
        title="Query Details"
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        {queryTime != null && (
          <DetailRow label="Query Time" value={`${queryTime.toFixed(1)}s`} />
        )}
        <DetailRow label="Data Source" value="Snowflake" />
        <DetailRow label="AI Model" value="llama3.2:3b" />
        <DetailRow label="Rows Returned" value={String(results.length)} />
        <DetailRow label="Executed At" value={executedAtStr} />
      </PanelSection>

      {/* Quick Actions */}
      <PanelSection
        title="Quick Actions"
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        }
      >
        <QuickActionButton
          label="View full analysis"
          onClick={onNavigateAnalysis}
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <QuickActionButton
          label="Download CSV"
          onClick={onDownloadCSV}
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          }
        />
        <QuickActionButton
          label="Copy query to clipboard"
          onClick={() => navigator.clipboard.writeText(question).catch(() => {})}
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          }
        />
        <QuickActionButton
          label="View query history"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="12 8 12 12 14 14" /><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
            </svg>
          }
        />
      </PanelSection>
    </div>
  );
}

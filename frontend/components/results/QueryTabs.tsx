"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/insights";
import type { QueryResponse } from "@/lib/api";

interface QueryTabsProps {
  data: QueryResponse;
}

type Tab = "results" | "semantic" | "cube" | "sql";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function downloadCSV(results: Record<string, unknown>[]) {
  if (results.length === 0) return;
  const headers = Object.keys(results[0]);
  const rows = results.map((row) =>
    headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "metricmind_results.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 6,
        border: "1px solid var(--color-border)",
        background: copied ? "var(--color-primary-light)" : "var(--color-surface-2)",
        color: copied ? "var(--color-primary)" : "var(--color-text-secondary)",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 150ms",
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function QueryTabs({ data }: QueryTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("results");
  const results = data.results;
  const resultColumns = results.length > 0 ? Object.keys(results[0]) : [];

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "results", label: "Results", count: results.length },
    { id: "semantic", label: "Semantic Query" },
    { id: "cube", label: "Cube Query" },
    { id: "sql", label: "Generated SQL" },
  ];

  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
      animation: "fadeIn 0.4s ease forwards",
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface-2)",
        overflowX: "auto",
      }}>
        {TABS.map(({ id, label, count }) => (
          <button
            key={id}
            id={`tab-${id}`}
            onClick={() => setActiveTab(id)}
            style={{
              padding: "12px 18px",
              fontSize: 13.5,
              fontWeight: activeTab === id ? 600 : 500,
              color: activeTab === id ? "var(--color-primary)" : "var(--color-text-muted)",
              borderBottom: `2px solid ${activeTab === id ? "var(--color-primary)" : "transparent"}`,
              background: "transparent",
              border: "none",
              borderBottomStyle: "solid",
              borderBottomWidth: 2,
              borderBottomColor: activeTab === id ? "var(--color-primary)" : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              transition: "color 150ms",
              paddingBottom: 12,
            }}
          >
            {label}
            {count !== undefined && (
              <span style={{
                padding: "1px 6px",
                borderRadius: 10,
                background: activeTab === id ? "var(--color-primary-light)" : "var(--color-surface-3)",
                color: activeTab === id ? "var(--color-primary)" : "var(--color-text-muted)",
                fontSize: 11,
                fontWeight: 600,
              }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "20px" }}>

        {/* ── RESULTS ── */}
        {activeTab === "results" && (
          <div>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-muted)", fontSize: 13.5 }}>
                No records returned for this query.
              </div>
            ) : (
              <>
                <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid var(--color-border)" }}>
                  <table id="results-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {resultColumns.map((col) => (
                          <th key={col} style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--color-text-muted)",
                            background: "var(--color-surface-2)",
                            borderBottom: "1px solid var(--color-border)",
                            whiteSpace: "nowrap",
                          }}>
                            {col.replace(/_/g, " ")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, ri) => (
                        <tr key={ri} style={{ transition: "background 100ms" }}
                          onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-surface-2)")}
                          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {resultColumns.map((col) => (
                            <td key={col} style={{
                              padding: "10px 14px",
                              fontSize: 13.5,
                              color: "var(--color-text-secondary)",
                              borderBottom: ri < results.length - 1 ? "1px solid var(--color-border)" : "none",
                              fontVariantNumeric: "tabular-nums",
                            }}>
                              {typeof row[col] === "number"
                                ? formatNumber(row[col])
                                : String(row[col] ?? "—")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Download CSV */}
                <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    id="download-csv-btn"
                    onClick={() => downloadCSV(results)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface-2)",
                      color: "var(--color-text-secondary)",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 150ms",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download CSV
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SEMANTIC QUERY ── */}
        {activeTab === "semantic" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <CopyButton text={JSON.stringify(data.semantic_query, null, 2)} />
            </div>
            <pre
              id="semantic-query-json"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                padding: "16px",
                fontSize: 12.5,
                fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
                color: "var(--color-text-secondary)",
                overflowX: "auto",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {JSON.stringify(data.semantic_query, null, 2)}
            </pre>
          </div>
        )}

        {/* ── CUBE QUERY ── */}
        {activeTab === "cube" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <CopyButton text={JSON.stringify(data.cube_query, null, 2)} />
            </div>
            <pre
              id="cube-query-json"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                padding: "16px",
                fontSize: 12.5,
                fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
                color: "var(--color-text-secondary)",
                overflowX: "auto",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {JSON.stringify(data.cube_query, null, 2)}
            </pre>
          </div>
        )}

        {/* ── GENERATED SQL ── */}
        {activeTab === "sql" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <CopyButton text={data.sql} />
            </div>
            <pre
              id="generated-sql"
              style={{
                background: "#0F172A",
                borderRadius: 10,
                padding: "18px",
                fontSize: 12.5,
                fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
                color: "#4ADE80",
                overflowX: "auto",
                lineHeight: 1.7,
                margin: 0,
                border: "1px solid #1E293B",
              }}
            >
              {data.sql}
            </pre>

            {data.parameters.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  SQL Parameters
                </p>
                <pre
                  id="sql-parameters"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 12.5,
                    fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
                    color: "var(--color-text-secondary)",
                    margin: 0,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(data.parameters)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

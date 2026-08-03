"use client";

/**
 * app/page.tsx
 *
 * MetricMind — single-page UI.
 *
 * Sections:
 *   1. Header
 *   2. Query input + example buttons
 *   3. Loading / error state
 *   4. Results: table, bar chart (multi-row) or KPI card (single row)
 *   5. Details tabs: Results | Semantic Query | Cube Query | Generated SQL
 *   6. Download CSV button
 */

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { runQuery, type QueryResponse } from "@/lib/api";

// ─── Example questions ────────────────────────────────────────────────────────
const EXAMPLES = [
  "Total sales",
  "Top 5 regions by sales",
  "Sales by ship mode",
  "Average sales by segment",
  "Show sales for Africa",
];

// ─── Tab names ────────────────────────────────────────────────────────────────
type Tab = "results" | "semantic" | "cube" | "sql";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Decide whether the result set should be shown as a bar chart.
 * Condition: exactly one string column and exactly one numeric column.
 */
function getChartConfig(
  results: Record<string, unknown>[]
): { categoryKey: string; valueKey: string } | null {
  if (results.length === 0) return null;

  const keys = Object.keys(results[0]);
  if (keys.length !== 2) return null;

  const [a, b] = keys;
  const firstRow = results[0];

  // Check which key is numeric
  if (typeof firstRow[a] === "number" && typeof firstRow[b] === "string") {
    return { categoryKey: b, valueKey: a };
  }
  if (typeof firstRow[b] === "number" && typeof firstRow[a] === "string") {
    return { categoryKey: a, valueKey: b };
  }

  return null;
}

/**
 * Check if the result is a single scalar value (e.g. "Total sales").
 */
function isSingleKPI(results: Record<string, unknown>[]): boolean {
  return results.length === 1 && Object.keys(results[0]).length === 1;
}

/**
 * Convert results array to a CSV string and trigger a download.
 */
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

/**
 * Pretty-print a number (add commas, 2 decimal places for floats).
 */
function formatNumber(value: unknown): string {
  if (typeof value !== "number") return String(value);
  return value % 1 === 0
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QueryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("results");

  // ── Run query ──────────────────────────────────────────────────────────────
  async function handleRunQuery() {
    const trimmed = question.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setData(null);
    setActiveTab("results");

    try {
      const result = await runQuery(trimmed);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // ── Handle Enter key ───────────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleRunQuery();
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const results = data?.results ?? [];
  const chartConfig = results.length > 0 ? getChartConfig(results) : null;
  const kpi = isSingleKPI(results);
  const resultColumns = results.length > 0 ? Object.keys(results[0]) : [];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          {/* Logo dot */}
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">MetricMind</h1>
            <p className="text-xs text-gray-500 mt-0.5">AI Powered Semantic BI Engine</p>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── Query card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label htmlFor="question-input" className="block text-sm font-medium text-gray-700 mb-2">
            Ask a business question
          </label>

          {/* Input row */}
          <div className="flex gap-3">
            <input
              id="question-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a business question..."
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500
                         focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              id="run-query-btn"
              onClick={handleRunQuery}
              disabled={loading || !question.trim()}
              className="px-5 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium
                         hover:bg-green-600 active:bg-green-700 transition-colors
                         disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Running..." : "Run Query"}
            </button>
          </div>

          {/* Example buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 self-center">Try:</span>
            {EXAMPLES.map((example) => (
              <button
                id={`example-${example.replace(/\s+/g, "-").toLowerCase()}`}
                key={example}
                onClick={() => setQuestion(example)}
                disabled={loading}
                className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-xs
                           text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex items-center justify-center gap-3">
            {/* Spinner */}
            <svg
              className="animate-spin h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm text-gray-600">Analyzing your question...</span>
          </div>
        )}

        {/* ── Error state ── */}
        {error && !loading && (
          <div
            id="error-message"
            className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-3 items-start"
          >
            <span className="text-red-500 text-lg leading-none">⚠</span>
            <div>
              <p className="text-sm font-medium text-red-800">Something went wrong</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {data && !loading && (
          <div className="space-y-4">

            {/* ── KPI Card (single scalar result) ── */}
            {kpi && (
              <div
                id="kpi-card"
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
              >
                <p className="text-sm text-gray-500 mb-1 capitalize">
                  {resultColumns[0]?.replace(/_/g, " ")}
                </p>
                <p className="text-5xl font-bold text-green-600">
                  {formatNumber(results[0][resultColumns[0]])}
                </p>
              </div>
            )}

            {/* ── Bar chart (categorical + numeric) ── */}
            {!kpi && chartConfig && results.length > 1 && (
              <div
                id="bar-chart-section"
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-sm font-semibold text-gray-700 mb-4 capitalize">
                  {chartConfig.valueKey.replace(/_/g, " ")} by{" "}
                  {chartConfig.categoryKey.replace(/_/g, " ")}
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={results}
                    margin={{ top: 4, right: 16, left: 16, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey={chartConfig.categoryKey}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(v) =>
                        typeof v === "number"
                          ? v >= 1_000_000
                            ? `${(v / 1_000_000).toFixed(1)}M`
                            : v >= 1_000
                            ? `${(v / 1_000).toFixed(0)}K`
                            : String(v)
                          : v
                      }
                    />
                    <Tooltip
                      formatter={(value: unknown) => [formatNumber(value), chartConfig.valueKey.replace(/_/g, " ")]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey={chartConfig.valueKey} fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Details tabs ── */}
            <div
              id="details-section"
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Tab bar */}
              <div className="flex border-b border-gray-200">
                {(
                  [
                    { id: "results", label: "Results" },
                    { id: "semantic", label: "Semantic Query" },
                    { id: "cube", label: "Cube Query" },
                    { id: "sql", label: "Generated SQL" },
                  ] as { id: Tab; label: string }[]
                ).map(({ id, label }) => (
                  <button
                    key={id}
                    id={`tab-${id}`}
                    onClick={() => setActiveTab(id)}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === id
                        ? "border-green-500 text-green-600 bg-green-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-5">

                {/* Results table */}
                {activeTab === "results" && (
                  <div>
                    {results.length === 0 ? (
                      <p className="text-sm text-gray-500">No records found for this query.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table id="results-table" className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              {resultColumns.map((col) => (
                                <th
                                  key={col}
                                  className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                                >
                                  {col.replace(/_/g, " ")}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                {resultColumns.map((col) => (
                                  <td key={col} className="px-4 py-2.5 text-gray-700">
                                    {typeof row[col] === "number"
                                      ? formatNumber(row[col])
                                      : String(row[col] ?? "")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Download CSV */}
                    {results.length > 0 && (
                      <div className="mt-4 flex justify-end">
                        <button
                          id="download-csv-btn"
                          onClick={() => downloadCSV(results)}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600
                                     hover:bg-green-50 hover:border-green-300 hover:text-green-700
                                     transition-colors flex items-center gap-2"
                        >
                          ↓ Download CSV
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Semantic Query JSON */}
                {activeTab === "semantic" && (
                  <pre
                    id="semantic-query-json"
                    className="text-xs text-gray-700 bg-gray-50 rounded-lg p-4 overflow-x-auto
                               font-mono leading-relaxed border border-gray-200"
                  >
                    {JSON.stringify(data.semantic_query, null, 2)}
                  </pre>
                )}

                {/* Cube Query JSON */}
                {activeTab === "cube" && (
                  <pre
                    id="cube-query-json"
                    className="text-xs text-gray-700 bg-gray-50 rounded-lg p-4 overflow-x-auto
                               font-mono leading-relaxed border border-gray-200"
                  >
                    {JSON.stringify(data.cube_query, null, 2)}
                  </pre>
                )}

                {/* Generated SQL */}
                {activeTab === "sql" && (
                  <div className="space-y-4">
                    <pre
                      id="generated-sql"
                      className="text-xs text-gray-800 bg-gray-900 text-green-300 rounded-lg p-4
                                 overflow-x-auto font-mono leading-relaxed"
                    >
                      {data.sql}
                    </pre>

                    {data.parameters.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          SQL Parameters
                        </p>
                        <p
                          id="sql-parameters"
                          className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2
                                     border border-gray-200 font-mono"
                        >
                          {JSON.stringify(data.parameters)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

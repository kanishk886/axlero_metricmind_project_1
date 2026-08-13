"use client";

/**
 * app/dashboard/page.tsx
 *
 * Main MetricMind dashboard.
 *
 * Data flow (UNCHANGED from existing backend):
 *   User question → runQuery() → POST /query → FastAPI → LangChain → Ollama → Snowflake → results
 *
 * The lib/api.ts runQuery function is called exactly as before.
 * No backend routes, Python files, or response fields are modified.
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../providers";
import { runQuery, type QueryResponse } from "@/lib/api";
import { saveQuery, getHistory, deleteQuery, clearHistory, type HistoryEntry } from "@/lib/history";

import Sidebar, { type SidebarPage } from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import QueryInput from "@/components/query/QueryInput";
import LoadingState from "@/components/query/LoadingState";
import KPICard, { deriveKPICards } from "@/components/kpi/KPICard";
import DynamicChart from "@/components/chart/DynamicChart";
import QueryTabs from "@/components/results/QueryTabs";
import QueryHistory from "@/components/history/QueryHistory";
import QueryAnalysis from "@/components/analysis/QueryAnalysis";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

// ─── Settings placeholder ─────────────────────────────────────────────────────

function SettingsPage() {
  return (
    <div style={{ padding: "24px", maxWidth: 600 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text)", margin: "0 0 6px" }}>Settings</h2>
      <p style={{ color: "var(--color-text-muted)", fontSize: 14, margin: "0 0 24px" }}>Manage your MetricMind workspace preferences.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { label: "Backend URL", value: "http://localhost:8000", desc: "FastAPI backend endpoint" },
          { label: "AI Model", value: "llama3.2:3b via Ollama", desc: "Language model used for query planning" },
          { label: "Data Source", value: "Snowflake", desc: "Connected data warehouse" },
          { label: "Query History", value: "localStorage (per user)", desc: "Where query history is stored" },
        ].map((item) => (
          <div key={item.label} style={{
            padding: "16px 18px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 10,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-text)" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{item.desc}</div>
              </div>
              <span style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "var(--color-surface-2)",
                color: "var(--color-text-secondary)",
                fontSize: 12.5,
                fontFamily: "monospace",
                fontWeight: 500,
              }}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();

  // ── State ───────────────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState<SidebarPage>("dashboard");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QueryResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    if (user) {
      setHistory(getHistory(user.id));
    }
  }, [user]);

  // ── Run Query (calls existing POST /query — UNCHANGED) ──────────────────────
  const handleRunQuery = useCallback(async (q?: string) => {
    const trimmed = (q ?? question).trim();
    if (!trimmed || !user) return;

    // Set question if triggered from history/suggestion
    if (q) setQuestion(q);

    setLoading(true);
    setError(null);
    setData(null);
    setSelectedHistoryId(null);
    setActivePage("dashboard");

    try {
      // ↓ This is the EXACT same call as the original page.tsx — no changes
      const result = await runQuery(trimmed);
      setData(result);

      // Save to history
      const entry = saveQuery(user.id, {
        question: trimmed,
        timestamp: Date.now(),
        status: "success",
        data: result,
        error: null,
      });

      setHistory(getHistory(user.id));
      setSelectedHistoryId(entry.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);

      // Save failed query to history too
      saveQuery(user.id, {
        question: trimmed,
        timestamp: Date.now(),
        status: "error",
        data: null,
        error: msg,
      });
      setHistory(getHistory(user.id));
    } finally {
      setLoading(false);
    }
  }, [question, user]);

  // ── History actions ─────────────────────────────────────────────────────────
  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setSelectedHistoryId(entry.id);
    setQuestion(entry.question);
    setData(entry.data);
    setError(entry.error);
    setActivePage("history");
  }, []);

  const handleDeleteHistory = useCallback((id: string) => {
    if (!user) return;
    deleteQuery(user.id, id);
    setHistory(getHistory(user.id));
    if (selectedHistoryId === id) setSelectedHistoryId(null);
  }, [user, selectedHistoryId]);

  const handleClearHistory = useCallback(() => {
    if (!user) return;
    clearHistory(user.id);
    setHistory([]);
    setSelectedHistoryId(null);
  }, [user]);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const results = data?.results ?? [];
  const kpiCards = data ? deriveKPICards(results, data.semantic_query) : [];

  // ── Page title for Navbar ────────────────────────────────────────────────────
  const PAGE_TITLES: Record<SidebarPage, string> = {
    dashboard:  "Dashboard Overview",
    history:    "Query History",
    analysis:   "Query Analysis",
    settings:   "Settings",
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--color-bg)",
    }}>
      {/* ── Sidebar ── */}
      <div style={{ display: "flex", flexShrink: 0 }}>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Navbar */}
        <Navbar title={PAGE_TITLES[activePage]} />

        {/* Content area */}
        <main style={{ flex: 1, overflow: "auto", padding: "0" }}>

          {/* ══════════════════════════════════════════════
              DASHBOARD / ASK-AI page
          ══════════════════════════════════════════════ */}
          {activePage === "dashboard" && (
            <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>

              {/* Query Input */}
              <QueryInput
                question={question}
                onChange={setQuestion}
                onRun={() => handleRunQuery()}
                onClear={() => { setQuestion(""); setData(null); setError(null); }}
                loading={loading}
              />

              {/* Loading */}
              {loading && (
                <div style={{ marginTop: 20 }}>
                  <LoadingState />
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div style={{ marginTop: 20 }}>
                  <ErrorState error={error} onDismiss={() => setError(null)} />
                </div>
              )}

              {/* Results */}
              {data && !loading && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.4s ease forwards" }}>

                  {/* KPI Cards */}
                  {kpiCards.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 12,
                      }}>
                        Key Metrics
                      </div>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 14,
                      }}>
                        {kpiCards.map((card, i) => (
                          <KPICard
                            key={i}
                            label={card.label}
                            value={card.value}
                            animate={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chart */}
                  {results.length > 0 && (
                    <DynamicChart results={results} />
                  )}

                  {/* Query Tabs */}
                  <div>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 12,
                    }}>
                      Query Details
                    </div>
                    <QueryTabs data={data} />
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!data && !loading && !error && (
                <div style={{ marginTop: 20 }}>
                  <EmptyState onSelect={(s) => { setQuestion(s); }} />
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════
              HISTORY page
          ══════════════════════════════════════════════ */}
          {activePage === "history" && (
            <div style={{
              display: "flex",
              height: "calc(100vh - 64px)",
              overflow: "hidden",
            }}>
              {/* Left panel: history list */}
              <div style={{
                width: 340,
                minWidth: 340,
                borderRight: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                overflowY: "auto",
                height: "100%",
              }}>
                <QueryHistory
                  history={history}
                  onSelect={handleSelectHistory}
                  onDelete={handleDeleteHistory}
                  onClear={handleClearHistory}
                  onRerun={(q) => handleRunQuery(q)}
                  selectedId={selectedHistoryId}
                />
              </div>

              {/* Right panel: selected query result */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                {data ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.3s ease forwards" }}>
                    {/* Question header */}
                    <div style={{
                      padding: "14px 18px",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      boxShadow: "var(--shadow-sm)",
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Query</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text)" }}>{question}</div>
                    </div>

                    {/* KPIs */}
                    {kpiCards.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                        {kpiCards.map((card, i) => (
                          <KPICard key={i} label={card.label} value={card.value} animate />
                        ))}
                      </div>
                    )}

                    {/* Chart */}
                    {results.length > 0 && <DynamicChart results={results} />}

                    {/* Tabs */}
                    <QueryTabs data={data} />
                  </div>
                ) : error ? (
                  <ErrorState error={error} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-text-muted)", fontSize: 14 }}>
                    Select a query from the history panel to view results.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              ANALYSIS page
          ══════════════════════════════════════════════ */}
          {activePage === "analysis" && (
            <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
              {data ? (
                <QueryAnalysis question={question} data={data} />
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px 24px",
                  textAlign: "center",
                }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    background: "var(--color-surface-2)",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)", margin: "0 0 8px" }}>No query to analyse</h3>
                  <p style={{ fontSize: 13.5, color: "var(--color-text-muted)", margin: "0 0 20px", lineHeight: 1.5 }}>
                    Run a business question first, then come back here to see detailed insights.
                  </p>
                  <button
                    onClick={() => setActivePage("dashboard")}
                    style={{
                      padding: "9px 20px",
                      borderRadius: 8,
                      border: "none",
                      background: "var(--color-primary)",
                      color: "white",
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Ask a Question
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════
              SETTINGS page
          ══════════════════════════════════════════════ */}
          {activePage === "settings" && <SettingsPage />}

        </main>
      </div>
    </div>
  );
}

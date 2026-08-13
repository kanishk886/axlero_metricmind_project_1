"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/history";

interface QueryHistoryProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onRerun: (question: string) => void;
  selectedId?: string | null;
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return days === 1 ? "Yesterday" : `${days} days ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isToday(timestamp: number): boolean {
  const d = new Date(timestamp);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function QueryHistory({
  history, onSelect, onDelete, onClear, onRerun, selectedId,
}: QueryHistoryProps) {
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = search.trim()
    ? history.filter((h) => h.question.toLowerCase().includes(search.toLowerCase()))
    : history;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", margin: 0 }}>Query History</h2>
          {history.length > 0 && (
            confirmClear ? (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { onClear(); setConfirmClear(false); }} style={dangerBtn}>Confirm</button>
                <button onClick={() => setConfirmClear(false)} style={ghostBtn}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} style={ghostBtn}>Clear all</button>
            )
          )}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px 8px 32px",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              color: "var(--color-text)",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-text-muted)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}>
              <polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4"/>
            </svg>
            <p style={{ fontSize: 13, margin: 0 }}>
              {search ? "No matching queries" : "No queries yet"}
            </p>
            {!search && <p style={{ fontSize: 12, marginTop: 4 }}>Run a query to see history here</p>}
          </div>
        ) : (
          filtered.map((entry, i) => {
            const selected = entry.id === selectedId;
            const today = isToday(entry.timestamp);

            return (
              <div
                key={entry.id}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${selected ? "var(--color-primary-muted)" : "transparent"}`,
                  background: selected ? "var(--color-primary-light)" : "transparent",
                  marginBottom: 2,
                  overflow: "hidden",
                  transition: "all 150ms",
                }}
              >
                <button
                  onClick={() => onSelect(entry)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {/* Question */}
                  <div style={{
                    fontSize: 13.5,
                    fontWeight: selected ? 600 : 500,
                    color: selected ? "var(--color-primary)" : "var(--color-text)",
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {entry.question}
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 11,
                      color: entry.status === "error" ? "#EF4444" : "var(--color-text-muted)",
                    }}>
                      {today ? `Today · ${formatTime(entry.timestamp)}` : formatRelativeTime(entry.timestamp)}
                    </span>
                    {entry.status === "error" && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: "rgba(239,68,68,0.1)",
                        color: "#EF4444",
                      }}>
                        Failed
                      </span>
                    )}
                  </div>
                </button>

                {/* Actions row (shown for selected) */}
                {selected && (
                  <div style={{
                    display: "flex",
                    gap: 6,
                    padding: "0 12px 10px",
                  }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRerun(entry.question); }}
                      style={actionBtn}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      Re-run
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                      style={{ ...actionBtn, color: "#EF4444", borderColor: "rgba(239,68,68,0.2)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid var(--color-border)",
  background: "transparent",
  color: "var(--color-text-muted)",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
};

const dangerBtn: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid rgba(239,68,68,0.3)",
  background: "rgba(239,68,68,0.1)",
  color: "#EF4444",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const actionBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid var(--color-border)",
  background: "transparent",
  color: "var(--color-text-secondary)",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 150ms",
};

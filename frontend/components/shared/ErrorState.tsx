"use client";

import React from "react";


interface ErrorStateProps {
  error: string;
  onDismiss?: () => void;
}

function classifyError(error: string): { title: string; detail: string; type: "backend" | "ollama" | "query" | "empty" | "generic" } {
  const lower = error.toLowerCase();

  if (lower.includes("cannot reach") || lower.includes("failed to fetch") || lower.includes("network") || lower.includes("econnrefused")) {
    return {
      title: "Unable to connect to MetricMind backend",
      detail: "Make sure the FastAPI server is running on port 8000: uvicorn backend.main:app --reload --port 8000",
      type: "backend",
    };
  }

  if (lower.includes("ollama") || lower.includes("llama") || lower.includes("model") || lower.includes("connection refused")) {
    return {
      title: "AI model is currently unavailable",
      detail: "Please ensure Ollama is running with the llama3.2:3b model: ollama run llama3.2:3b",
      type: "ollama",
    };
  }

  if (lower.includes("unsupported") || lower.includes("semantic") || lower.includes("dimension") || lower.includes("measure")) {
    return {
      title: "We couldn't understand this business question",
      detail: "Try using a supported measure (e.g. total sales, profit) or dimension (e.g. region, category, segment).",
      type: "query",
    };
  }

  if (lower.includes("no data") || lower.includes("no records") || lower.includes("empty")) {
    return {
      title: "No data found for this query",
      detail: "The query ran successfully but returned no results. Try a different time range or dimension.",
      type: "empty",
    };
  }

  return { title: "Something went wrong", detail: error, type: "generic" };
}

const TYPE_ICONS: Record<string, React.ReactElement> = {
  backend: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  ollama: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
    </svg>
  ),
  query: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  empty: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
    </svg>
  ),
  generic: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

export default function ErrorState({ error, onDismiss }: ErrorStateProps) {
  const { title, detail, type } = classifyError(error);

  return (
    <div
      id="error-message"
      style={{
        background: "rgba(239,68,68,0.04)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 14,
        padding: "20px",
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        animation: "fadeIn 0.3s ease forwards",
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        background: "rgba(239,68,68,0.1)",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#EF4444",
        flexShrink: 0,
      }}>
        {TYPE_ICONS[type]}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14.5, fontWeight: 600, color: "#DC2626", margin: "0 0 4px" }}>{title}</p>
        <p style={{ fontSize: 13, color: "#991B1B", margin: 0, lineHeight: 1.5 }}>{detail}</p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#EF4444",
            padding: 4,
            borderRadius: 6,
            opacity: 0.6,
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}

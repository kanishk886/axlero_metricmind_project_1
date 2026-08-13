"use client";

const SUGGESTIONS = [
  "Show total sales by region",
  "Show total profit by category",
  "Show quarterly revenue",
  "Show top 10 customers",
];

interface EmptyStateProps {
  onSelect: (q: string) => void;
}

export default function EmptyState({ onSelect }: EmptyStateProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
      textAlign: "center",
      animation: "fadeIn 0.4s ease forwards",
    }}>
      {/* Icon */}
      <div style={{
        width: 72,
        height: 72,
        background: "var(--color-primary-light)",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        boxShadow: "0 0 0 8px rgba(22,163,74,0.06)",
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <circle cx="9" cy="10" r="1" fill="var(--color-primary)"/>
          <circle cx="12" cy="10" r="1" fill="var(--color-primary)"/>
          <circle cx="15" cy="10" r="1" fill="var(--color-primary)"/>
        </svg>
      </div>

      <h3 style={{
        fontSize: 20,
        fontWeight: 700,
        color: "var(--color-text)",
        margin: "0 0 8px",
        letterSpacing: "-0.01em",
      }}>
        Ask your first business question
      </h3>

      <p style={{
        fontSize: 14,
        color: "var(--color-text-muted)",
        maxWidth: 380,
        lineHeight: 1.6,
        margin: "0 0 28px",
      }}>
        Type a question in natural language above to generate insights, KPI cards, and visualizations from your Snowflake data.
      </p>

      {/* Suggestion chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 480 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 150ms",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-light)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-primary-muted)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-primary)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 20, opacity: 0.7 }}>
        Powered by LangChain · Ollama (llama3.2:3b) · Snowflake
      </p>
    </div>
  );
}

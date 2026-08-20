"use client";

const SUGGESTIONS = [
  "Show total sales by region",
  "Show total profit by category",
  "Show quarterly revenue by category",
  "Show average sales by category",
  "Show total sales for Africa",
  "Show average sales by segment",
  "Show total sales by ship mode",
];

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export default function SuggestionChips({ onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
      <span style={{ fontSize: 12, color: "var(--color-text-muted)", alignSelf: "center", fontWeight: 500 }}>Try:</span>
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          id={`suggestion-${s.replace(/\s+/g, "-").toLowerCase()}`}
          onClick={() => onSelect(s)}
          disabled={disabled}
          style={{
            padding: "5px 12px",
            borderRadius: 20,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text-secondary)",
            fontSize: 12.5,
            fontWeight: 500,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 150ms",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => {
            if (!disabled) {
              const el = e.currentTarget;
              el.style.background = "var(--color-primary-light)";
              el.style.borderColor = "var(--color-primary-muted)";
              el.style.color = "var(--color-primary)";
            }
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget;
            el.style.background = "var(--color-surface-2)";
            el.style.borderColor = "var(--color-border)";
            el.style.color = "var(--color-text-secondary)";
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

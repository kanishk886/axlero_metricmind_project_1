"use client";

import SuggestionChips from "./SuggestionChips";

interface QueryInputProps {
  question: string;
  onChange: (q: string) => void;
  onRun: () => void;
  onClear: () => void;
  loading: boolean;
}

export default function QueryInput({ question, onChange, onRun, onClear, loading }: QueryInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && question.trim()) onRun();
    }
  }

  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: 14,
      padding: "20px 20px 16px",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ marginBottom: 10 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--color-text)", margin: 0, letterSpacing: "-0.01em" }}>Ask a Business Question</h2>
        <p style={{ fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 3, margin: "3px 0 0" }}>Ask questions about your business data in natural language. Press Enter to run.</p>
      </div>

      {/* Textarea row */}
      <div style={{ position: "relative", marginTop: 14 }}>
        {/* AI icon */}
        <div style={{
          position: "absolute",
          left: 14,
          top: 14,
          color: "var(--color-primary)",
          pointerEvents: "none",
          zIndex: 1,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9 14v2m6-2v2"/>
          </svg>
        </div>

        <textarea
          id="question-input"
          value={question}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Show profit by regions"
          disabled={loading}
          rows={2}
          style={{
            width: "100%",
            paddingLeft: 42,
            paddingRight: 170,
            paddingTop: 13,
            paddingBottom: 13,
            background: "var(--color-surface-2)",
            border: "1.5px solid var(--color-border)",
            borderRadius: 10,
            color: "var(--color-text)",
            fontSize: 14.5,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.5,
            transition: "border-color 150ms, box-shadow 150ms",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-primary)";
            e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Buttons */}
        <div style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          gap: 6,
        }}>
          {question && (
            <button
              id="clear-btn"
              onClick={onClear}
              disabled={loading}
              style={{
                padding: "7px 12px",
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text-secondary)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              Clear
            </button>
          )}
          <button
            id="run-query-btn"
            onClick={onRun}
            disabled={loading || !question.trim()}
            style={{
              padding: "7px 18px",
              borderRadius: 8,
              border: "none",
              background: loading || !question.trim() ? "var(--color-surface-3)" : "var(--color-primary)",
              color: loading || !question.trim() ? "var(--color-text-muted)" : "white",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: loading || !question.trim() ? "not-allowed" : "pointer",
              transition: "all 150ms",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              boxShadow: loading || !question.trim() ? "none" : "0 2px 8px rgba(22,163,74,0.25)",
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 13,
                  height: 13,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
                Running…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Run Query
              </>
            )}
          </button>
        </div>
      </div>

      <SuggestionChips onSelect={onChange} disabled={loading} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

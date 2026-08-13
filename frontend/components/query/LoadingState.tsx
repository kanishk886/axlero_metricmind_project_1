"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { id: 1, label: "Understanding question", duration: 1200 },
  { id: 2, label: "Building semantic query", duration: 1800 },
  { id: 3, label: "Validating query", duration: 1000 },
  { id: 4, label: "Fetching data from Snowflake", duration: 2000 },
  { id: 5, label: "Preparing visualization", duration: 800 },
];

export default function LoadingState() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        setCurrentStage(i);
      }, elapsed);
      timers.push(t);
      elapsed += stage.duration;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: 14,
      padding: "32px 28px",
      boxShadow: "var(--shadow-md)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 44,
          height: 44,
          background: "var(--color-primary-light)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 600, color: "var(--color-text)", fontSize: 15 }}>MetricMind AI is analysing your question</div>
          <div style={{ fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 2 }}>LangChain → Ollama (llama3.2:3b) → Snowflake</div>
        </div>
        {/* Spinning indicator */}
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <div style={{
            width: 24,
            height: 24,
            border: "3px solid var(--color-border)",
            borderTopColor: "var(--color-primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
        </div>
      </div>

      {/* Stages */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STAGES.map((stage, i) => {
          const done = i < currentStage;
          const active = i === currentStage;
          const pending = i > currentStage;

          return (
            <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Icon */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: done ? "var(--color-primary)" : active ? "var(--color-primary-light)" : "var(--color-surface-2)",
                border: active ? "2px solid var(--color-primary)" : "2px solid transparent",
                transition: "all 400ms",
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : active ? (
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    animation: "pulse 1s ease-in-out infinite",
                  }} />
                ) : (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-border-strong)" }} />
                )}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                color: done ? "var(--color-primary)" : active ? "var(--color-text)" : "var(--color-text-muted)",
                transition: "color 300ms",
              }}>
                {stage.label}
              </span>

              {/* Progress bar (active stage) */}
              {active && (
                <div style={{ flex: 1, height: 3, background: "var(--color-surface-2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    background: "var(--color-primary)",
                    borderRadius: 4,
                    animation: `progressBar ${stage.duration}ms linear forwards`,
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.85); } }
        @keyframes progressBar { from { width:0% } to { width:100% } }
      `}</style>
    </div>
  );
}

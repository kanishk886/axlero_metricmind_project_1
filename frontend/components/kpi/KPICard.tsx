"use client";

import React from "react";
import { formatNumber } from "@/lib/insights";


interface KPICardProps {
  label: string;
  value: unknown;
  icon?: "sales" | "profit" | "orders" | "customers" | "quantity" | "discount" | "shipping" | "margin" | "generic";
  rank?: "highest" | "lowest" | null;
  animate?: boolean;
}

const ICONS: Record<string, React.ReactElement> = {
  sales: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  profit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  orders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  customers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  quantity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  discount: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  shipping: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  margin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  generic: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

function detectIcon(label: string): KPICardProps["icon"] {
  const l = label.toLowerCase();
  if (l.includes("sale")) return "sales";
  if (l.includes("profit") && !l.includes("margin")) return "profit";
  if (l.includes("order")) return "orders";
  if (l.includes("customer")) return "customers";
  if (l.includes("quantity") || l.includes("qty")) return "quantity";
  if (l.includes("discount")) return "discount";
  if (l.includes("ship")) return "shipping";
  if (l.includes("margin")) return "margin";
  return "generic";
}

export default function KPICard({ label, value, icon, rank, animate }: KPICardProps) {
  const resolvedIcon: string = icon ?? detectIcon(label) ?? "generic";
  const displayValue = typeof value === "number" ? formatNumber(value) : String(value ?? "—");

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        padding: "20px 20px 18px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "box-shadow 200ms, transform 200ms",
        cursor: "default",
        animation: animate ? "fadeIn 0.4s ease forwards" : undefined,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Top bar accent */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "linear-gradient(90deg, #16A34A, #4ADE80)",
        borderRadius: "14px 14px 0 0",
      }} />

      {/* Icon */}
      <div style={{
        width: 40,
        height: 40,
        background: "var(--color-primary-light)",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-primary)",
        flexShrink: 0,
      }}>
        {ICONS[resolvedIcon] ?? ICONS["generic"]}
      </div>

      {/* Content */}
      <div>
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 6,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 26,
          fontWeight: 800,
          color: "var(--color-text)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          animation: animate ? "countUp 0.5s ease forwards" : undefined,
        }}>
          {displayValue}
        </div>

        {rank && (
          <div style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 8px",
            borderRadius: 20,
            background: rank === "highest" ? "var(--color-primary-light)" : "rgba(239,68,68,0.1)",
            color: rank === "highest" ? "var(--color-primary)" : "#EF4444",
            fontSize: 11,
            fontWeight: 600,
          }}>
            {rank === "highest" ? "▲ Highest" : "▼ Lowest"}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper: derive KPI cards from result data
export function deriveKPICards(
  results: Record<string, unknown>[],
  semanticQuery?: Record<string, unknown>
): Array<{ label: string; value: unknown }> {
  if (results.length === 0) return [];

  const keys = Object.keys(results[0]);

  // Single row → show all columns as KPIs
  if (results.length === 1) {
    return keys.map((k) => ({
      label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: results[0][k],
    }));
  }

  // Multi-row → aggregate numeric columns
  const numericKeys = keys.filter((k) => typeof results[0][k] === "number");
  const cards: Array<{ label: string; value: unknown }> = [];

  for (const key of numericKeys) {
    const total = results.reduce((s, r) => s + (typeof r[key] === "number" ? (r[key] as number) : 0), 0);
    cards.push({
      label: `Total ${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
      value: total,
    });
  }

  // Add count of dimension
  const stringKeys = keys.filter((k) => typeof results[0][k] === "string");
  if (stringKeys.length > 0) {
    cards.push({
      label: `${stringKeys[0].replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Count`,
      value: results.length,
    });
  }

  return cards.slice(0, 4); // Max 4 KPI cards
}

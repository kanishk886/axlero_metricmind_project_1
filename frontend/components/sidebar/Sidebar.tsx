"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/providers";


export type SidebarPage = "dashboard" | "history" | "analysis" | "settings";

interface SidebarProps {
  activePage: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
}

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactElement> = {
    dashboard: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    "ask-ai": (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
        <circle cx="12" cy="10" r="1" fill="currentColor"/>
        <circle cx="15" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
    history: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 8 12 12 14 14"/>
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
      </svg>
    ),
    analysis: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    settings: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    logout: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    chevron: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    ),
  };
  return icons[name] ?? null;
}

const NAV_ITEMS: { id: SidebarPage; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "history", label: "Query History", icon: "history" },
  { id: "analysis", label: "Query Analysis", icon: "analysis" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const w = collapsed ? 72 : 260;

  return (
    <aside
      style={{
        width: w,
        minWidth: w,
        maxWidth: w,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        transition: "width 250ms cubic-bezier(0.4,0,0.2,1), min-width 250ms cubic-bezier(0.4,0,0.2,1), max-width 250ms cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? "20px 16px" : "20px 20px",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        minHeight: 72,
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
          <div style={{
            width: 36,
            height: 36,
            background: "#16A34A",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 0 1px rgba(22,163,74,0.3)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16l4-4 4 4 4-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text)", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>MetricMind</div>
              <div style={{ fontSize: 10, color: "var(--color-text-muted)", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>AI BI Engine</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={collapseBtn} title="Collapse sidebar">
            <Icon name="chevron" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }}>
        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                border: "none",
                background: active ? "var(--color-primary-light)" : "transparent",
                color: active ? "var(--color-primary)" : "var(--color-text-secondary)",
                fontWeight: active ? 600 : 500,
                fontSize: 13.5,
                cursor: "pointer",
                transition: "background 150ms, color 150ms",
                marginBottom: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}><Icon name={item.icon} /></span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)", flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: user + collapse toggle */}
      <div style={{ padding: "8px 8px 16px", borderTop: "1px solid var(--color-border)" }}>
        {/* Expand button when collapsed */}
        {collapsed && (
          <button onClick={() => setCollapsed(false)} style={{ ...collapseBtn, margin: "0 auto 8px", display: "flex" }} title="Expand sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}

        {/* User profile */}
        {!collapsed && user && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 8,
            marginBottom: 4,
          }}>
            <div style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #16A34A, #4ADE80)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {user.avatarInitials}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.role}</div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "10px" : "10px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "#EF4444",
            fontWeight: 500,
            fontSize: 13.5,
            cursor: "pointer",
            transition: "background 150ms",
            opacity: 0.75,
          }}
        >
          <Icon name="logout" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

const collapseBtn: React.CSSProperties = {
  background: "var(--color-surface-2)",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  cursor: "pointer",
  padding: 4,
  color: "var(--color-text-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  transition: "background 150ms",
};

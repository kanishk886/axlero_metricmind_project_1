"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers";
import { useTheme } from "@/app/providers";

interface NavbarProps {
  title?: string;
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export default function Navbar({ title }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header style={{
      height: 64,
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 16,
      position: "sticky",
      top: 0,
      zIndex: 40,
      backdropFilter: "blur(8px)",
    }}>
      {/* Left: greeting */}
      <div style={{ flex: 1 }}>
        {user && (
          <div>
            <span style={{ color: "var(--color-text-muted)", fontSize: 13 }}>{greeting()}, </span>
            <span style={{ color: "var(--color-text)", fontWeight: 600, fontSize: 14 }}>{user.name}</span>
          </div>
        )}
        {title && <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 1 }}>{title}</div>}
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Status badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          background: "var(--color-primary-light)",
          borderRadius: 20,
          marginRight: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-primary)", letterSpacing: "0.02em" }}>AI READY</span>
        </div>

        {/* Theme toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={iconBtn}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Notifications */}
        <button style={iconBtn} title="Notifications">
          <BellIcon />
        </button>

        {/* User dropdown */}
        <div style={{ position: "relative" }}>
          <button
            id="user-menu-btn"
            onClick={() => setDropdownOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              cursor: "pointer",
              transition: "background 150ms",
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg, #16A34A, #4ADE80)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
            }}>
              {user?.avatarInitials ?? "U"}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-text)", lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ fontSize: 10.5, color: "var(--color-text-muted)", lineHeight: 1 }}>{user?.role}</div>
            </div>
            <span style={{ color: "var(--color-text-muted)" }}><ChevronDownIcon /></span>
          </button>

          {dropdownOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 48 }} onClick={() => setDropdownOpen(false)} />
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                boxShadow: "var(--shadow-lg)",
                minWidth: 180,
                zIndex: 49,
                overflow: "hidden",
                animation: "scaleIn 0.15s ease",
              }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{user?.email}</div>
                </div>
                <div style={{ padding: "6px" }}>
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      color: "#EF4444",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "background 150ms",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const iconBtn: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  background: "var(--color-surface-2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "var(--color-text-secondary)",
  transition: "background 150ms, color 150ms",
};

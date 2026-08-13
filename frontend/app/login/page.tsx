"use client";

/**
 * app/login/page.tsx
 *
 * Professional MetricMind login page.
 * Uses frontend-only demo auth — does NOT affect the AI backend.
 *
 * Demo credentials:
 *   Email:    demo@metricmind.ai
 *   Password: MetricMind2025
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";

// ─── Icons ────────────────────────────────────────────────────────────────────

function LogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 3v18h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 16l4-4 4 4 4-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-logged-in users
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError(null);
    setSubmitting(true);

    // Small artificial delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const result = await login(email.trim(), password, rememberMe);

    if (result.success) {
      router.replace("/dashboard");
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  if (isLoading) return null;

  return (
    <div style={styles.page}>
      {/* Background decoration */}
      <div style={styles.bgGradient} />
      <div style={styles.bgDots} />

      <div style={styles.container}>
        {/* Left panel — branding */}
        <div style={styles.brandPanel}>
          <div style={styles.brandContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}><LogoIcon /></div>
              <div>
                <div style={styles.brandName}>MetricMind</div>
                <div style={styles.brandSubtitle}>AI Powered Semantic BI Engine</div>
              </div>
            </div>

            <h1 style={styles.brandHeading}>
              Turn Business Questions Into<br />
              <span style={styles.brandAccent}>Actionable Insights</span>
            </h1>

            <p style={styles.brandDesc}>
              Ask questions in plain English. MetricMind's AI engine translates them into
              precise SQL, queries your Snowflake data, and returns beautiful visualizations — instantly.
            </p>

            <div style={styles.features}>
              {[
                { icon: "🧠", text: "Natural language to SQL via LLM" },
                { icon: "📊", text: "Real-time Snowflake data" },
                { icon: "🔍", text: "Semantic query validation" },
                { icon: "📈", text: "Auto-generated visualizations" },
              ].map((f) => (
                <div key={f.text} style={styles.featureItem}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <span style={styles.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — login form */}
        <div style={styles.formPanel}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Welcome back</h2>
              <p style={styles.cardSubtitle}>Sign in to your MetricMind workspace</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form} noValidate>
              {/* Email */}
              <div style={styles.field}>
                <label htmlFor="email" style={styles.label}>Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="demo@metricmind.ai"
                  disabled={submitting}
                  autoComplete="email"
                  style={{
                    ...styles.input,
                    ...(error ? styles.inputError : {}),
                  }}
                />
              </div>

              {/* Password */}
              <div style={styles.field}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="••••••••••••"
                    disabled={submitting}
                    autoComplete="current-password"
                    style={{
                      ...styles.input,
                      paddingRight: 44,
                      ...(error ? styles.inputError : {}),
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={styles.eyeBtn}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div style={styles.rememberRow}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>Remember me for 7 days</span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div style={styles.errorBox} role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={styles.errorText}>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                id="login-btn"
                type="submit"
                disabled={submitting || !email.trim() || !password.trim()}
                style={{
                  ...styles.submitBtn,
                  ...(submitting || !email.trim() || !password.trim() ? styles.submitBtnDisabled : {}),
                }}
              >
                {submitting ? (
                  <>
                    <span style={styles.spinner}><SpinnerIcon /></span>
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div style={styles.demoHint}>
              <div style={styles.demoHintInner}>
                <span style={styles.demoLabel}>Demo credentials</span>
                <div style={styles.demoCredentials}>
                  <div>
                    <span style={styles.demoKey}>Email</span>
                    <span style={styles.demoVal}>demo@metricmind.ai</span>
                  </div>
                  <div>
                    <span style={styles.demoKey}>Password</span>
                    <span style={styles.demoVal}>MetricMind2025</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setEmail("demo@metricmind.ai"); setPassword("MetricMind2025"); setError(null); }}
                  style={styles.fillBtn}
                >
                  Fill credentials
                </button>
              </div>
            </div>
          </div>

          <p style={styles.footerText}>
            © 2025 MetricMind · AI Powered Semantic BI Engine
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "stretch",
    position: "relative",
    overflow: "hidden",
    background: "#0F172A",
  },
  bgGradient: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(22,163,74,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 10%, rgba(14,165,233,0.1) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  bgDots: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    pointerEvents: "none",
  },
  container: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    zIndex: 1,
  },
  // Brand panel (left side) — hidden on small screens via parent flex wrapping
  brandPanel: {
    flex: "1 1 50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 48px",
    minWidth: 0,
  },
  brandContent: {
    maxWidth: 480,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 40,
  },
  logoIcon: {
    width: 48,
    height: 48,
    background: "#16A34A",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 0 0 1px rgba(22,163,74,0.4), 0 4px 20px rgba(22,163,74,0.3)",
  },
  brandName: {
    color: "#F1F5F9",
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-0.01em",
  },
  brandSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
    letterSpacing: "0.02em",
  },
  brandHeading: {
    color: "#F1F5F9",
    fontSize: 36,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    marginBottom: 20,
  },
  brandAccent: {
    background: "linear-gradient(135deg, #16A34A, #4ADE80)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  brandDesc: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 36,
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
    width: 32,
    height: 32,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    color: "#CBD5E1",
    fontSize: 14,
  },
  // Form panel (right side)
  formPanel: {
    flex: "0 0 480px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#1E293B",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "36px 32px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  cardHeader: {
    marginBottom: 28,
  },
  cardTitle: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    margin: 0,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: "#64748B",
    fontSize: 14,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#F1F5F9",
    fontSize: 14,
    outline: "none",
    transition: "border-color 150ms, box-shadow 150ms",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "rgba(239,68,68,0.5)",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748B",
    display: "flex",
    alignItems: "center",
    padding: 2,
    borderRadius: 4,
    transition: "color 150ms",
  },
  rememberRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  checkbox: {
    width: 15,
    height: 15,
    accentColor: "#16A34A",
    cursor: "pointer",
  },
  checkboxText: {
    color: "#94A3B8",
    fontSize: 13,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 8,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
  },
  submitBtn: {
    width: "100%",
    padding: "12px 20px",
    background: "#16A34A",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background 150ms, box-shadow 150ms, transform 80ms",
    boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
    marginTop: 4,
  },
  submitBtnDisabled: {
    background: "#334155",
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.6,
  },
  spinner: {
    animation: "spin 0.8s linear infinite",
    display: "flex",
    alignItems: "center",
  },
  demoHint: {
    marginTop: 24,
  },
  demoHintInner: {
    background: "rgba(22,163,74,0.08)",
    border: "1px solid rgba(22,163,74,0.2)",
    borderRadius: 10,
    padding: "14px 16px",
  },
  demoLabel: {
    color: "#4ADE80",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: 8,
  },
  demoCredentials: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 10,
  },
  demoKey: {
    color: "#64748B",
    fontSize: 12,
    marginRight: 8,
    minWidth: 60,
    display: "inline-block",
  },
  demoVal: {
    color: "#CBD5E1",
    fontSize: 12,
    fontFamily: "monospace",
  },
  fillBtn: {
    background: "rgba(22,163,74,0.15)",
    border: "1px solid rgba(22,163,74,0.3)",
    color: "#4ADE80",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 150ms",
  },
  footerText: {
    color: "#334155",
    fontSize: 12,
    marginTop: 24,
    textAlign: "center",
  },
};

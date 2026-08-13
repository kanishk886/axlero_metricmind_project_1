"use client";

/**
 * app/providers.tsx
 *
 * AuthContext + ThemeContext for the entire app.
 * These are pure frontend contexts — no backend calls.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { getUser, loginUser, logoutUser, type User } from "@/lib/auth";

// ─── Auth Context ──────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<{ success: true } | { success: false; error: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <Providers>");
  return ctx;
}

// ─── Theme Context ─────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <Providers>");
  return ctx;
}

// ─── Providers ─────────────────────────────────────────────────────────────────

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Hydrate auth from localStorage on mount
  useEffect(() => {
    const storedUser = getUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  // Hydrate theme from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("metricmind_theme") as "light" | "dark" | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolved = stored ?? (prefersDark ? "dark" : "light");
      setTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    } catch {
      // ignore SSR
    }
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean
    ): Promise<{ success: true } | { success: false; error: string }> => {
      const result = loginUser(email, password, rememberMe);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    []
  );

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("metricmind_theme", next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

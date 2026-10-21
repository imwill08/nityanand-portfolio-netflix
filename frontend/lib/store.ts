"use client";
import { useCallback, useEffect, useState } from "react";
import { archive, chapters as baseChapters, owner, type Chapter } from "@/data/portfolio";

export interface PortfolioData {
  owner: typeof owner;
  chapters: Chapter[];
}

export interface ApiError {
  status?: number;
  statusText?: string;
  url?: string;
  message?: string;
  responseBody?: any;
  timestamp: string;
}

const AUTH = "portfolio-admin-auth";
const TOKEN_KEY = "portfolio-jwt-token";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fallback demo credentials
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin123";

/**
 * Dummy/Offline fallback data (kept intact aside as requested).
 * This will ONLY be used when the backend API throws an error.
 */
export const dummyData = (): PortfolioData => {
  const chapters: Chapter[] = JSON.parse(JSON.stringify(baseChapters));
  for (const c of chapters) {
    if (c.cards && c.rowTitle) {
      c.rows = [{ h: c.rowTitle, cards: c.cards }, ...(c.rows ?? [])];
      if (c.k === 4) c.rows.push({ h: "From the archives", cards: JSON.parse(JSON.stringify(archive)) });
      delete c.cards;
      delete c.rowTitle;
    }
  }
  return { owner: { ...owner }, chapters };
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export function usePortfolioData() {
  // Start with empty/nullish state until first fetch completes
  const [data, setData] = useState<PortfolioData>(dummyData);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchFromBackend = useCallback(async () => {
    setLoading(true);
    const targetUrl = `${API_BASE}/portfolio`;

    try {
      const res = await fetch(targetUrl, { cache: "no-store" });

      if (!res.ok) {
        // Backend returned a non-200 HTTP error (e.g. 500, 404, 502)
        let errorBody: any = null;
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorBody = await res.json();
          } else {
            errorBody = await res.text();
          }
        } catch {
          errorBody = `HTTP Error ${res.status}: ${res.statusText}`;
        }

        const apiErr: ApiError = {
          status: res.status,
          statusText: res.statusText,
          url: targetUrl,
          message: `API responded with status ${res.status}`,
          responseBody: errorBody,
          timestamp: new Date().toLocaleTimeString(),
        };

        // When API throws an error: show dummy data and show error modal
        setError(apiErr);
        setIsFallback(true);
        setData(dummyData());
        setLoading(false);
        setReady(true);
        return;
      }

      // API call succeeded!
      const remote = await res.json();
      setError(null);
      setIsFallback(false);

      if (remote) {
        // Use EXACT data returned by API (even if chapters is empty [])
        setData({
          owner: remote.owner || { name: "", email: "", phone: "", tel: "", linkedin: "", github: "" },
          chapters: Array.isArray(remote.chapters) ? remote.chapters : [],
        });
      } else {
        setData({
          owner: { name: "", email: "", phone: "", tel: "", linkedin: "", github: "" },
          chapters: [],
        });
      }
    } catch (err: any) {
      // Network failure / Fetch threw error (e.g. connection refused, offline)
      const apiErr: ApiError = {
        status: 0,
        statusText: "Connection Failed",
        url: targetUrl,
        message: err?.message || "Failed to fetch from backend",
        responseBody: {
          error: "NetworkError",
          message: err?.message || "Failed to connect to backend API server at " + targetUrl,
          hint: "Ensure the NestJS backend is running on http://localhost:5000",
        },
        timestamp: new Date().toLocaleTimeString(),
      };

      // Show dummy data and set error modal
      setError(apiErr);
      setIsFallback(true);
      setData(dummyData());
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    fetchFromBackend();
  }, [fetchFromBackend]);

  const update = useCallback(
    async (d: PortfolioData) => {
      setData(d);

      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/portfolio`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            owner: d.owner,
            chapters: d.chapters,
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => res.statusText);
          setError({
            status: res.status,
            statusText: res.statusText,
            url: `${API_BASE}/portfolio`,
            message: "Failed to save portfolio changes",
            responseBody: errBody,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } catch (err: any) {
        setError({
          status: 0,
          statusText: "Network Error",
          url: `${API_BASE}/portfolio`,
          message: err?.message || "Could not save to backend",
          responseBody: { error: err?.message },
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    },
    [],
  );

  const reset = useCallback(async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/portfolio/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const remote = await res.json();
        setData({
          owner: remote.owner,
          chapters: remote.chapters || [],
        });
        setError(null);
        setIsFallback(false);
      } else {
        const errBody = await res.json().catch(() => res.statusText);
        setError({
          status: res.status,
          statusText: res.statusText,
          url: `${API_BASE}/portfolio/reset`,
          responseBody: errBody,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err: any) {
      setError({
        status: 0,
        statusText: "Network Error",
        url: `${API_BASE}/portfolio/reset`,
        message: err?.message,
        responseBody: { error: err?.message },
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    data,
    update,
    reset,
    ready,
    loading,
    error,
    clearError,
    refetch: fetchFromBackend,
    isFallback,
  };
}

export const isAuthed = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH) === "1";
};

export const login = async (u: string, p: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.accessToken) {
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(AUTH, "1");
        return true;
      }
    }
  } catch (err) {
    console.warn("Backend auth unavailable, checking local fallback:", err);
  }

  // Fallback if backend is offline during local dev
  const ok = u === ADMIN_USER && p === ADMIN_PASS;
  if (ok) {
    localStorage.setItem(TOKEN_KEY, "demo-admin-token");
    localStorage.setItem(AUTH, "1");
  }
  return ok;
};

export const logout = () => {
  try {
    localStorage.removeItem(AUTH);
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("storage"));
  } catch {}
};

export function useAdminAuth() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const check = () => {
      setHasToken(Boolean(getToken()));
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return { hasToken };
}

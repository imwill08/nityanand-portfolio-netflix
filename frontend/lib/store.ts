"use client";
import { useCallback, useEffect, useState } from "react";
import { archive, chapters as baseChapters, owner, type Chapter } from "@/data/portfolio";

export interface PortfolioData {
  owner: typeof owner;
  chapters: Chapter[];
}

const KEY = "portfolio-data-v2";
const AUTH = "portfolio-admin-auth";
const TOKEN_KEY = "portfolio-jwt-token";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fallback demo credentials
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin123";

export const defaults = (): PortfolioData => {
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

export function loadData(): PortfolioData {
  const d = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return d;
    const s = JSON.parse(raw) as Partial<PortfolioData>;
    return {
      owner: { ...d.owner, ...s.owner },
      chapters: Array.isArray(s.chapters) ? s.chapters : d.chapters,
    };
  } catch {
    return d;
  }
}

export const saveData = (d: PortfolioData) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
};

export const resetData = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaults);
  const [ready, setReady] = useState(false);

  // Initial load from cache + fetch live from NestJS backend
  useEffect(() => {
    const cached = loadData();
    setData(cached);
    setReady(true);

    async function fetchFromBackend() {
      try {
        const res = await fetch(`${API_BASE}/portfolio`, { cache: "no-store" });
        if (res.ok) {
          const remote = await res.json();
          if (remote && remote.owner && Array.isArray(remote.chapters)) {
            const formatted: PortfolioData = {
              owner: { ...cached.owner, ...remote.owner },
              chapters: remote.chapters,
            };
            setData(formatted);
            saveData(formatted);
          }
        }
      } catch (err) {
        // Backend offline or starting up, fallback to local cache seamlessly
        console.warn("Backend not reached, using local data:", err);
      }
    }

    fetchFromBackend();
  }, []);

  const update = useCallback(
    async (d: PortfolioData) => {
      setData(d);
      saveData(d);

      // Sync to NestJS backend if available
      try {
        const token = getToken();
        await fetch(`${API_BASE}/portfolio`, {
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
      } catch (err) {
        console.warn("Could not sync update to backend:", err);
      }
    },
    [],
  );

  const reset = useCallback(async () => {
    resetData();
    const def = defaults();
    setData(def);

    try {
      const token = getToken();
      await fetch(`${API_BASE}/portfolio/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.warn("Could not reset backend:", err);
    }
  }, []);

  return { data, update, reset, ready };
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
    localStorage.setItem(AUTH, "1");
  }
  return ok;
};

export const logout = () => {
  try {
    localStorage.removeItem(AUTH);
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

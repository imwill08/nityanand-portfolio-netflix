"use client";
import { useCallback, useEffect, useState } from "react";
import { archive, chapters as baseChapters, owner, type Chapter } from "@/data/portfolio";

export interface PortfolioData { owner: typeof owner; chapters: Chapter[]; }

const KEY = "portfolio-data-v2";
const AUTH = "portfolio-admin-auth";
// Demo credentials — replace with a real backend auth when the API is ready.
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin123";

export const defaults = (): PortfolioData => {
  const chapters: Chapter[] = JSON.parse(JSON.stringify(baseChapters));
  // Fold the legacy "cards + archive" structure into plain editable rows.
  for (const c of chapters) {
    if (c.cards && c.rowTitle) {
      c.rows = [{ h: c.rowTitle, cards: c.cards }, ...(c.rows ?? [])];
      if (c.k === 4) c.rows.push({ h: "From the archives", cards: JSON.parse(JSON.stringify(archive)) });
      delete c.cards; delete c.rowTitle;
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
    return { owner: { ...d.owner, ...s.owner }, chapters: Array.isArray(s.chapters) ? s.chapters : d.chapters };
  } catch { return d; }
}
export const saveData = (d: PortfolioData) => localStorage.setItem(KEY, JSON.stringify(d));
export const resetData = () => localStorage.removeItem(KEY);

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => { setData(loadData()); setReady(true); }, []);
  const update = useCallback((d: PortfolioData) => { setData(d); saveData(d); }, []);
  const reset = useCallback(() => { resetData(); setData(defaults()); }, []);
  return { data, update, reset, ready };
}

export const isAuthed = () => typeof window !== "undefined" && localStorage.getItem(AUTH) === "1";
export const login = (u: string, p: string) => { const ok = u === ADMIN_USER && p === ADMIN_PASS; if (ok) localStorage.setItem(AUTH, "1"); return ok; };
export const logout = () => localStorage.removeItem(AUTH);

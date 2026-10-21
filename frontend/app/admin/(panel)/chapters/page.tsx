"use client";
import { useEffect, useState } from "react";
import ChapterPreview from "@/admin/ChapterPreview";
import type { Card, Chapter, IconKey, Row } from "@/data/portfolio";
import { usePortfolioData } from "@/lib/store";

const ICONS: IconKey[] = ["clip", "trend", "award", "film", "user", "mail", "phone", "link", "file"];
const ACTIONS: ["play" | "next" | "mail", string][] = [["play", "Play story"], ["next", "Go to next chapter"], ["mail", "Send email"]];
const lines = (s: string) => s.split("\n");
const blankChapter = (k: number): Chapter => ({
  k, icon: "film", c: ["#E50914", "#5a050b"], label: "New", title: "New chapter", match: 90, year: "2025", role: "Role", where: "Company",
  summary: "Describe this chapter.", points: [], rows: [], buttons: [["▶ Play story", "play"], ["ⓘ Next chapter", "next"]],
});

export default function ChaptersPage() {
  const { data, update, reset, ready } = usePortfolioData();
  const [sel, setSel] = useState(0);
  const [form, setForm] = useState<Chapter | null>(null);
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const chapters = data.chapters;

  useEffect(() => {
    if (!ready) return;
    const i = Math.min(sel, chapters.length - 1);
    setForm(i >= 0 ? JSON.parse(JSON.stringify(chapters[i])) : null);
    setDirty(false);
    if (i !== sel) setSel(Math.max(i, 0));
  }, [ready, sel, chapters]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 1800); };
  const commit = (list: Chapter[], msg: string) => { update({ ...data, chapters: list }); flash(msg); };
  const edit = (f: Chapter) => { setForm(f); setDirty(true); };
  const set = <K extends keyof Chapter>(k: K, v: Chapter[K]) => form && edit({ ...form, [k]: v });

  const save = (e: React.FormEvent) => { e.preventDefault(); if (form) commit(chapters.map((c, i) => (i === sel ? form : c)), "Chapter saved"); };
  const add = () => { const k = Math.max(0, ...chapters.map((c) => c.k)) + 1; commit([...chapters, blankChapter(k)], "Chapter added"); setSel(chapters.length); };
  const remove = (i: number) => {
    if (!confirm(`Delete chapter "${chapters[i].title}"? This cannot be undone.`)) return;
    commit(chapters.filter((_, j) => j !== i), "Chapter deleted"); setSel(Math.max(0, i - 1));
  };
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= chapters.length) return;
    const list = [...chapters]; [list[i], list[j]] = [list[j], list[i]]; commit(list, "Order updated"); setSel(j);
  };

  // rows / cards helpers
  const rows = form?.rows ?? [];
  const setRows = (r: Row[]) => set("rows", r);
  const patchRow = (ri: number, p: Partial<Row>) => setRows(rows.map((r, i) => (i === ri ? { ...r, ...p } : r)));
  const patchCard = (ri: number, ci: number, p: Partial<Card>) => patchRow(ri, { cards: rows[ri].cards.map((c, i) => (i === ci ? { ...c, ...p } : c)) });

  return (
    <div className="split">
      <div>
        <div className="chap-list">
          {chapters.map((c, i) => (
            <div key={c.k} className={`chap-item${i === sel ? " on" : ""}`}>
              <button className="ci-main" onClick={() => setSel(i)}>
                <span className="th" style={{ background: `linear-gradient(135deg,${c.c[0]},${c.c[1]})` }} />
                <div><b>{c.title}</b><span>{c.label} · {c.role}</span></div>
              </button>
              <div className="ci-act">
                <button aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
                <button aria-label="Move down" onClick={() => move(i, 1)} disabled={i === chapters.length - 1}>▼</button>
                <button aria-label="Delete" className="del" onClick={() => remove(i)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
        <div className="row-actions" style={{ marginTop: 14 }}>
          <button className="abtn" onClick={add}>+ Add chapter</button>
          <button className="abtn ghost sm" onClick={() => confirm("Restore ALL content to defaults?") && (reset(), flash("Restored defaults"))}>Reset all</button>
        </div>
      </div>

      {form ? (
        <form className="panel" onSubmit={save}>
          <div className="ed-head">
            <h2>Edit chapter {sel + 1}{dirty && <em> · unsaved</em>}</h2>
            <div className="row-actions">
              <button type="button" className="abtn ghost" onClick={() => setPreview(true)}>👁 Preview</button>
              <button className="abtn" type="submit">Save changes</button>
            </div>
          </div>

          <h3 className="sec">Basics</h3>
          <div className="grid2">
            <div className="fld"><label htmlFor="lb">Menu label</label><input id="lb" value={form.label} onChange={(e) => set("label", e.target.value)} /></div>
            <div className="fld"><label htmlFor="t">Title</label><input id="t" value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
            <div className="fld"><label htmlFor="r">Role</label><input id="r" value={form.role} onChange={(e) => set("role", e.target.value)} /></div>
            <div className="fld"><label htmlFor="y">Year</label><input id="y" value={form.year} onChange={(e) => set("year", e.target.value)} /></div>
            <div className="fld"><label htmlFor="w">Where</label><input id="w" value={form.where} onChange={(e) => set("where", e.target.value)} /></div>
            <div className="fld"><label htmlFor="m">Match %</label><input id="m" type="number" min={0} max={100} value={form.match} onChange={(e) => set("match", Number(e.target.value))} /></div>
          </div>
          <div className="fld"><label htmlFor="s">Summary</label><textarea id="s" value={form.summary} onChange={(e) => set("summary", e.target.value)} /></div>

          <h3 className="sec">Look</h3>
          <div className="grid2">
            <div className="fld"><label htmlFor="ic">Icon</label><select id="ic" value={form.icon} onChange={(e) => set("icon", e.target.value as IconKey)}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select></div>
            <div className="fld"><label htmlFor="c0">Gradient start</label><input id="c0" type="color" value={form.c[0]} onChange={(e) => set("c", [e.target.value, form.c[1]])} /></div>
            <div className="fld"><label htmlFor="c1">Gradient end</label><input id="c1" type="color" value={form.c[1]} onChange={(e) => set("c", [form.c[0], e.target.value])} /></div>
          </div>

          <h3 className="sec">Hero buttons</h3>
          <div className="grid2">
            {[0, 1].map((n) => {
              const b = form.buttons?.[n] ?? ["", "play"] as [string, "play"];
              const setB = (v: [string, "play" | "next" | "mail"]) => { const nb = [...(form.buttons ?? blankChapter(0).buttons!)]; nb[n] = v; set("buttons", nb as Chapter["buttons"]); };
              return (
                <div key={n} className="fld">
                  <label>{n === 0 ? "Primary" : "Secondary"} button</label>
                  <input value={b[0]} onChange={(e) => setB([e.target.value, b[1]])} />
                  <select value={b[1]} onChange={(e) => setB([b[0], e.target.value as "play" | "next" | "mail"])}>{ACTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                </div>
              );
            })}
          </div>

          <h3 className="sec">Highlights <small>(one per line — also the story scenes)</small></h3>
          <div className="fld"><textarea value={(form.points ?? []).join("\n")} onChange={(e) => set("points", lines(e.target.value))} /></div>
          <h3 className="sec">Custom story scenes <small>(optional, one per line — overrides summary + highlights)</small></h3>
          <div className="fld"><textarea value={(form.scenes ?? []).join("\n")} onChange={(e) => set("scenes", e.target.value.trim() ? lines(e.target.value) : [])} /></div>

          <h3 className="sec">Rows &amp; cards</h3>
          {rows.map((r, ri) => (
            <div className="proj-card" key={ri}>
              <div className="hd">
                <input className="row-title" value={r.h} placeholder="Row title" onChange={(e) => patchRow(ri, { h: e.target.value })} />
                <button type="button" className="abtn danger sm" onClick={() => confirm("Delete this row and all its cards?") && setRows(rows.filter((_, i) => i !== ri))}>Delete row</button>
              </div>
              {r.cards.map((c, ci) => (
                <div className="card-ed" key={ci}>
                  <div className="hd"><b>{c.t || "Untitled card"}</b>
                    <button type="button" className="abtn danger sm" onClick={() => patchRow(ri, { cards: r.cards.filter((_, i) => i !== ci) })}>Delete</button></div>
                  <div className="grid2">
                    <div className="fld"><label>Title</label><input value={c.t} onChange={(e) => patchCard(ri, ci, { t: e.target.value })} /></div>
                    <div className="fld"><label>Description</label><input value={c.d ?? ""} onChange={(e) => patchCard(ri, ci, { d: e.target.value })} /></div>
                    <div className="fld"><label>Role tag</label><input value={c.r ?? ""} onChange={(e) => patchCard(ri, ci, { r: e.target.value || undefined })} /></div>
                    <div className="fld"><label>Outcome / tech</label><input value={c.o ?? ""} onChange={(e) => patchCard(ri, ci, { o: e.target.value || undefined })} /></div>
                    <div className="fld"><label>Link (https:, mailto:, tel:)</label><input value={c.go ?? ""} onChange={(e) => patchCard(ri, ci, { go: e.target.value || undefined })} /></div>
                    <div className="fld"><label>Icon</label><select value={c.icon ?? ""} onChange={(e) => patchCard(ri, ci, { icon: (e.target.value || undefined) as IconKey | undefined })}><option value="">none</option>{ICONS.map((i) => <option key={i}>{i}</option>)}</select></div>
                  </div>
                  <div className="fld"><label>Story scenes (one per line)</label><textarea value={(c.sc ?? []).join("\n")} onChange={(e) => patchCard(ri, ci, { sc: e.target.value.trim() ? lines(e.target.value) : undefined })} /></div>
                  <label className="chk"><input type="checkbox" checked={!!c.dead} onChange={(e) => patchCard(ri, ci, { dead: e.target.checked || undefined })} /> Not clickable</label>
                </div>
              ))}
              <button type="button" className="abtn ghost sm" onClick={() => patchRow(ri, { cards: [...r.cards, { t: "New card", d: "" }] })}>+ Add card</button>
            </div>
          ))}
          <button type="button" className="abtn ghost" onClick={() => setRows([...rows, { h: "New row", cards: [{ t: "New card", d: "" }] }])}>+ Add row</button>

          <div className="row-actions sticky-save">
            <button type="button" className="abtn ghost" onClick={() => setPreview(true)}>👁 Preview</button>
            <button className="abtn" type="submit">Save changes</button>
          </div>
        </form>
      ) : <div className="panel"><h2>No chapters</h2><p className="hint">Add your first chapter.</p></div>}

      {preview && form && <ChapterPreview chapter={form} chapters={chapters} idx={sel} ownerName={data.owner?.name} onClose={() => setPreview(false)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

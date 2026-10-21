"use client";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProjectCarousel from "@/components/ProjectCarousel";
import StoryModal, { type Story } from "@/components/StoryModal";
import type { Card, Chapter } from "@/data/portfolio";
import { buildRows, storyScenes } from "@/lib/rows";

/** Full-screen preview of a (possibly unsaved) chapter, rendered with the real site components. */
export default function ChapterPreview({ chapter, chapters, idx, onClose }: { chapter: Chapter; chapters: Chapter[]; idx: number; onClose: () => void }) {
  const [story, setStory] = useState<Story | null>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape" && !story) onClose(); };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose, story]);

  const p = chapter;
  const list = chapters.map((c, i) => (i === idx ? p : c));
  const play = (start = 0) => setStory({ title: p.title, scenes: storyScenes(p), c: p.c, match: p.match, tags: [p.role, p.year], start });
  const onCard = (c: Card) => {
    if (c.at != null && c.at < 0) return;
    if (c.at != null) return play(c.at);
    if (c.go) return;
    setStory({ title: c.t, scenes: c.sc?.length ? c.sc : [c.d ?? c.t], c: p.c, match: p.match, tags: c.r ? [c.r] : [], outcome: c.o });
  };

  return (
    <div className="pv-back" role="dialog" aria-modal="true" aria-label="Preview">
      <div className="pv-bar">
        <b>Live preview</b><span>Unsaved changes shown exactly as on the site</span>
        <i style={{ flex: 1 }} />
        <button className={`abtn sm ${mobile ? "" : "ghost"}`} onClick={() => setMobile(!mobile)}>{mobile ? "Mobile" : "Desktop"}</button>
        <button className="abtn sm ghost" onClick={onClose}>✕ Close</button>
      </div>
      <div className="pv-stage">
        <div className={`pv ${mobile ? "m" : ""}`}>
          <div className="pv-nav"><span className="logo">NITYANAND</span>{list.slice(0, 5).map((c) => <a key={c.k}>{c.label}</a>)}</div>
          <HeroSection p={p} onAction={(a) => (a === "play" ? play(0) : undefined)} />
          <main id="rows">{buildRows(p, list, idx).map((r, i) => <ProjectCarousel key={r.h + i} row={r} grad={p.c} onCard={onCard} />)}</main>
        </div>
      </div>
      {story && <StoryModal story={story} onClose={() => setStory(null)} />}
    </div>
  );
}

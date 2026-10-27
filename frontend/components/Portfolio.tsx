"use client";
import { useCallback, useState } from "react";
import SplashScreen from "./SplashScreen";
import ProfileSelector from "./ProfileSelector";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProjectCarousel from "./ProjectCarousel";
import StoryModal, { type Story } from "./StoryModal";
import ApiErrorModal from "./ApiErrorModal";
import type { Card } from "@/data/portfolio";
import { usePortfolioData } from "@/lib/store";
import { buildRows, storyScenes } from "@/lib/rows";
import { getCardImage, CHAPTER_COVER_IMAGES } from "@/lib/cardImages";

export default function Portfolio() {
  const { data, error, clearError, refetch, isFallback } = usePortfolioData();
  const { owner, chapters } = data;
  const [cur, setCur] = useState<number | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const closeStory = useCallback(() => setStory(null), []);

  const hasChapters = chapters && chapters.length > 0;
  const idx = hasChapters ? Math.min(cur ?? 0, chapters.length - 1) : 0;
  const p = hasChapters ? chapters[idx] : null;

  const pick = (i: number) => {
    setCur(i);
    window.scrollTo(0, 0);
  };
  const nav = (v: number | "home") => {
    if (v === "home") setCur(null);
    else pick(v);
  };
  const play = (start = 0) => {
    if (!p) return;
    setStory({
      title: p.title,
      scenes: storyScenes(p),
      c: p.c,
      match: p.match,
      tags: [p.role, p.year],
      start,
      img: CHAPTER_COVER_IMAGES[p.k],
    });
  };

  const onCard = (c: Card) => {
    if (c.at != null && c.at < 0) return pick(-c.at - 1);
    if (c.go) {
      if (c.go.startsWith("http")) window.open(c.go, "_blank", "noopener");
      else window.location.href = c.go;
      return;
    }
    if (c.at != null) return play(c.at);
    if (!p) return;
    setStory({
      title: c.t,
      scenes: c.sc?.length ? c.sc : [c.d ?? c.t],
      c: p.c,
      match: p.match,
      tags: c.r ? [c.r] : [],
      outcome: c.o,
      img: getCardImage(c, p?.k),
    });
  };

  const action = (a: "play" | "next" | "mail") => {
    if (a === "play") play(0);
    else if (a === "next" && chapters.length > 0) pick((idx + 1) % chapters.length);
    else window.location.href = `mailto:${owner.email}`;
  };

  return (
    <>
      <SplashScreen ownerName={owner?.name} />

      {/* Fallback Banner if API error occurred */}
      {isFallback && (
        <aside className="offline-banner" role="status">
          <span>⚠️ Backend API offline or error. Showing fallback dummy data.</span>
          {error && (
            <button className="abtn sm ghost" onClick={() => {}} style={{ padding: "4px 10px", fontSize: 12 }}>
              View Error
            </button>
          )}
        </aside>
      )}

      <ProfileSelector owner={owner} chapters={chapters} hidden={cur !== null} onPick={pick} />

      {cur !== null && (
        <div id="app" style={{ display: "block" }}>
          {p ? (
            <>
              <Navbar chapter={p} chapters={chapters} onGo={nav} ownerName={owner?.name} />
              <HeroSection p={p} onAction={action} ownerName={owner?.name} />
              <main id="rows">
                {buildRows(p, chapters, idx).map((r, i) => (
                  <ProjectCarousel key={r.h + i} row={r} grad={p.c} onCard={onCard} />
                ))}
              </main>
            </>
          ) : (
            <div style={{ minHeight: "80vh", display: "grid", placeItems: "center", textAlign: "center", padding: "60px 20px" }}>
              <div>
                <h2 style={{ fontSize: "2.5rem", marginBottom: 14 }}>No Data Available</h2>
                <p style={{ color: "#aaa", maxWidth: 450, margin: "0 auto 24px", lineHeight: 1.6 }}>
                  API returned 0 chapters. No chapters currently exist in the database.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button className="b w" onClick={() => nav("home")}>
                    ← Back
                  </button>
                  <a className="b g" href="/admin/chapters">
                    Add Chapters in Admin
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {story && <StoryModal story={story} onClose={closeStory} />}
      <ApiErrorModal error={error} onClose={clearError} onRetry={refetch} />
    </>
  );
}

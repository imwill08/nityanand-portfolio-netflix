"use client";
import { useCallback, useState } from "react";
import SplashScreen from "./SplashScreen";
import ProfileSelector from "./ProfileSelector";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProjectCarousel from "./ProjectCarousel";
import StoryModal, { type Story } from "./StoryModal";
import type { Card } from "@/data/portfolio";
import { usePortfolioData } from "@/lib/store";
import { buildRows, storyScenes } from "@/lib/rows";

export default function Portfolio() {
  const { data } = usePortfolioData();
  const { owner, chapters } = data;
  const [cur, setCur] = useState<number | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const closeStory = useCallback(() => setStory(null), []);
  const idx = Math.min(cur ?? 0, Math.max(chapters.length - 1, 0));
  const p = chapters[idx];

  const pick = (i: number) => { setCur(i); window.scrollTo(0, 0); };
  const nav = (v: number | "home") => { if (v === "home") setCur(null); else pick(v); };
  const play = (start = 0) => setStory({ title: p.title, scenes: storyScenes(p), c: p.c, match: p.match, tags: [p.role, p.year], start });

  const onCard = (c: Card) => {
    if (c.at != null && c.at < 0) return pick(-c.at - 1);
    if (c.go) { if (c.go.startsWith("http")) window.open(c.go, "_blank", "noopener"); else window.location.href = c.go; return; }
    if (c.at != null) return play(c.at);
    setStory({ title: c.t, scenes: c.sc?.length ? c.sc : [c.d ?? c.t], c: p.c, match: p.match, tags: c.r ? [c.r] : [], outcome: c.o });
  };
  const action = (a: "play" | "next" | "mail") => {
    if (a === "play") play(0); else if (a === "next") pick((idx + 1) % chapters.length); else window.location.href = `mailto:${owner.email}`;
  };

  return (
    <>
      <SplashScreen ownerName={owner.name} />
      <ProfileSelector owner={owner} chapters={chapters} hidden={cur !== null} onPick={pick} />
      {cur !== null && p && (
        <div id="app" style={{ display: "block" }}>
          <Navbar chapter={p} chapters={chapters} onGo={nav} ownerName={owner.name} />
          <HeroSection p={p} onAction={action} ownerName={owner.name} />
          <main id="rows">{buildRows(p, chapters, idx).map((r, i) => <ProjectCarousel key={r.h + i} row={r} grad={p.c} onCard={onCard} />)}</main>
        </div>
      )}
      {story && <StoryModal story={story} onClose={closeStory} />}
    </>
  );
}

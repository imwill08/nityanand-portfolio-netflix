"use client";
import { useEffect, useRef, useState } from "react";
import type { Gradient } from "@/data/portfolio";
export interface Story { title: string; scenes: string[]; c: Gradient; match: number; tags: string[]; outcome?: string; start?: number; img?: string; }
export default function StoryModal({ story, onClose }: { story: Story; onClose: () => void }) {
  const [i, setI] = useState(story.start ?? 0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  const end = () => (i < story.scenes.length - 1 ? setI(i + 1) : setDone(true));
  const toggle = () => { if (done) { setI(0); setDone(false); setPaused(false); } else setPaused(!paused); };
  const [first, ...rest] = story.scenes;
  return (
    <div id="modal" className="on" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label={story.title}>
      <div className="mp">
        <button id="x" ref={closeRef} aria-label="Close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className={`player${paused ? " paused" : ""}`}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: story.img
                ? `linear-gradient(rgba(10,10,10,0.65), rgba(10,10,10,0.85)), url("${story.img}") center/cover no-repeat`
                : `linear-gradient(120deg,${story.c[0]},${story.c[1]})`,
            }}
          />
          <div id="st" key={i}>{story.scenes[i]}</div>
          <div className="ctrl">
            <button
              onClick={toggle}
              aria-label={done ? "Replay" : paused ? "Play" : "Pause"}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              {done ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              ) : paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
            </button>
            <div className="bar"><i key={`${i}-${done}`} className={done ? "" : "go"} style={done ? { width: "100%" } : undefined} onAnimationEnd={end} /></div>
            <span>{i + 1} / {story.scenes.length}</span>
          </div>
        </div>
        <div className="info">
          <div id="mt">{story.title}</div>
          <div className="meta"><span className="match">{story.match}% Match</span>{story.tags.map((t) => <span className="pill" key={t}>{t}</span>)}</div>
          <p>{first}</p>
          <ul>{rest.map((x) => <li key={x}>{x}</li>)}</ul>
          {story.outcome && <div className="out">{story.outcome}</div>}
        </div>
      </div>
    </div>
  );
}

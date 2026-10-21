"use client";
import { useEffect, useRef, useState } from "react";
import type { Gradient } from "@/data/portfolio";
export interface Story { title: string; scenes: string[]; c: Gradient; match: number; tags: string[]; outcome?: string; start?: number; }
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
        <button id="x" ref={closeRef} aria-label="Close" onClick={onClose}>✕</button>
        <div className={`player${paused ? " paused" : ""}`}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg,${story.c[0]},${story.c[1]})` }} />
          <div id="st" key={i}>{story.scenes[i]}</div>
          <div className="ctrl">
            <button onClick={toggle} aria-label={done ? "Replay" : paused ? "Play" : "Pause"}>{done ? "↻" : paused ? "▶" : "❚❚"}</button>
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

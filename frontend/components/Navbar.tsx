"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import type { Chapter } from "@/data/portfolio";
interface Props { chapter: Chapter; chapters: Chapter[]; onGo: (i: number | "home") => void; }
export default function Navbar({ chapter, chapters, onGo }: Props) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const go = (v: number | "home") => { setOpen(false); onGo(v); };
  const grad = `linear-gradient(135deg,${chapter.c[0]},${chapter.c[1]})`;
  return (
    <>
      <nav className={`top${solid || open ? " solid" : ""}`} aria-label="Main">
        <button className="logo" onClick={() => go("home")} aria-label="Home">NITYANAND</button>
        {chapters.slice(0, 5).map((c, i) => <a key={c.k} role="button" tabIndex={0} onClick={() => go(i)} onKeyDown={(e) => e.key === "Enter" && go(i)}>{c.label}</a>)}
        <button id="me" onClick={() => go("home")} aria-label="Switch chapter"><span className="av" style={{ background: grad }}><Icon name={chapter.icon} /></span><span>Switch</span></button>
        <a className="login-btn" href="/admin/login">Login</a>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      </nav>
      {open && (
        <div className="menu" role="menu">
          {chapters.map((c, i) => <button key={c.k} role="menuitem" onClick={() => go(i)}>{c.label}</button>)}
          <button role="menuitem" onClick={() => go("home")}>All chapters</button>
          <a role="menuitem" href="/admin/login" style={{ display: "block", padding: "14px 4px", fontSize: 18, color: "#e50914" }}>Admin login</a>
        </div>
      )}
    </>
  );
}

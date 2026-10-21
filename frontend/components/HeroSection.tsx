import Icon from "./Icon";
import type { Chapter } from "@/data/portfolio";
export default function HeroSection({ p, onAction }: { p: Chapter; onAction: (a: "play" | "next" | "mail") => void }) {
  const bt: [string, "play" | "next" | "mail"][] = p.buttons && p.buttons.length >= 2 ? p.buttons : [["▶ Play story", "play"], ["ⓘ Next chapter", "next"]];
  return (
    <header className="bill">
      <div className="art" style={{ background: `linear-gradient(120deg,${p.c[0]},${p.c[1]})` }}><Icon name={p.icon} /></div>
      <div className="c">
        <div className="kick"><b>N</b>CHAPTER {p.k}</div>
        <h2>{p.title}</h2>
        <div className="meta"><span className="match">{p.match}% Match</span><span>{p.year}</span><span className="pill">{p.role}</span><span>{p.where}</span></div>
        <p>{p.summary}</p>
        <div className="btns">
          <button className="b w" onClick={() => onAction(bt[0][1])}>{bt[0][0]}</button>
          <button className="b g" onClick={() => onAction(bt[1][1])}>{bt[1][0]}</button>
        </div>
      </div>
    </header>
  );
}

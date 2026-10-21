import Icon from "./Icon";
import type { Chapter } from "@/data/portfolio";

export default function HeroSection({
  p,
  onAction,
  ownerName,
}: {
  p: Chapter;
  onAction: (a: "play" | "next" | "mail") => void;
  ownerName?: string;
}) {
  const bt: [string, "play" | "next" | "mail"][] =
    p.buttons && p.buttons.length > 0
      ? p.buttons
      : [
          ["▶ Play story", "play"],
          ["ⓘ Next chapter", "next"],
        ];
  const initial = ownerName ? ownerName.charAt(0).toUpperCase() : "N";

  return (
    <header className="bill">
      <div className="art" style={{ background: `linear-gradient(120deg,${p.c[0]},${p.c[1]})` }}>
        <Icon name={p.icon} />
      </div>
      <div className="c">
        <div className="kick">
          <b>{initial}</b>CHAPTER {p.k}
        </div>
        <h2>{p.title}</h2>
        <div className="meta">
          <span className="match">{p.match}% Match</span>
          <span>{p.year}</span>
          <span className="pill">{p.role}</span>
          <span>{p.where}</span>
        </div>
        <p>{p.summary}</p>
        <div className="btns">
          {bt.map(([label, act], i) => (
            <button
              key={i}
              className={`b ${i === 0 ? "w" : "g"}`}
              onClick={() => onAction(act)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

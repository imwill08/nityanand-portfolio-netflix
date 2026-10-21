import Icon from "./Icon";
import type { Chapter } from "@/data/portfolio";

function cleanSeparators(text?: string): string {
  if (!text) return "";
  return text
    .replace(/[\uFFFD\u00A0\uFEFF]/g, " · ")
    .replace(/\s+\?\s+/g, " · ")
    .replace(/\s*·\s*/g, " · ")
    .replace(/(?:\s*·\s*)+/g, " · ")
    .trim();
}

function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/[\uFFFD\uFEFF]/g, "")
    .trim();
}

function cleanButtonText(label: string): string {
  if (!label) return "";
  return label
    .replace(/^[\uFFFD▶►▸▷ⓘℹ️✉️?\s·-]+/u, "")
    .replace(/[\uFFFD]/g, "")
    .trim();
}

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
          ["Play story", "play"],
          ["Next chapter", "next"],
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
        <h2>{cleanText(p.title)}</h2>
        <div className="meta">
          <span className="match">{p.match}% Match</span>
          <span>{cleanSeparators(p.year)}</span>
          <span className="pill">{cleanText(p.role)}</span>
          <span>{cleanSeparators(p.where)}</span>
        </div>
        <p>{cleanText(p.summary)}</p>
        <div className="btns">
          {bt.map(([label, act], i) => {
            const labelText =
              cleanButtonText(label) ||
              (act === "play" ? "Play story" : act === "next" ? "Next chapter" : "Email me");

            return (
              <button
                key={i}
                className={`b ${i === 0 ? "w" : "g"}`}
                onClick={() => onAction(act)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 700,
                }}
              >
                {act === "play" && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ flexShrink: 0 }}
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
                {act === "next" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                )}
                {act === "mail" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                )}
                <span>{labelText}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

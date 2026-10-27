import Icon from "./Icon";
import type { Chapter } from "@/data/portfolio";
import { CHAPTER_HERO_IMAGES } from "@/lib/cardImages";

interface Props {
  hidden: boolean;
  onPick: (i: number) => void;
  owner: { email: string };
  chapters: Chapter[];
}

export default function ProfileSelector({ hidden, onPick, owner, chapters }: Props) {
  return (
    <div id="profiles" className={hidden ? "hide" : ""} aria-hidden={hidden}>
      <h1>Which chapter do you want to watch?</h1>

      {chapters.length === 0 ? (
        <div style={{ textAlign: "center", color: "#aaa", padding: "40px 20px", maxWidth: 500 }}>
          <p style={{ fontSize: "1.3rem", color: "#fff", marginBottom: 10 }}>No Data Available</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 20 }}>
            The backend API responded successfully, but there are no chapters saved in the database.
          </p>
          <a className="mgr" href="/admin/chapters">
            Open Admin to Add Chapters
          </a>
        </div>
      ) : (
        <div className="plist">
          {chapters.map((p, i) => (
            <button
              key={p.k}
              className="prof"
              tabIndex={hidden ? -1 : 0}
              style={{ animationDelay: `${i * 70}ms` }}
              onClick={() => onPick(i)}
            >
              <div
                className="av"
                style={{
                  background: `linear-gradient(135deg,${p.c[0]},${p.c[1]})`,
                  ...(p.k === 5 || p.bg
                    ? {
                        backgroundImage: `url("${p.bg || CHAPTER_HERO_IMAGES[p.k]}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}),
                }}
              >
                {!(p.k === 5 || p.bg) && <Icon name={p.icon} />}
              </div>
              <div className="pl">{p.label}</div>
              <small>Chapter {p.k}</small>
            </button>
          ))}
        </div>
      )}

      {/* {owner?.email && (
        <a className="mgr" href={`mailto:${owner.email}`}>
          Contact me
        </a>
      )} */}
    </div>
  );
}

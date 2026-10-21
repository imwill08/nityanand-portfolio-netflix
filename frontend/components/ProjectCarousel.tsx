import Icon from "./Icon";
import type { Card, Gradient, Row } from "@/data/portfolio";
interface Props { row: Row; grad: Gradient; onCard: (c: Card) => void; }
export default function ProjectCarousel({ row, grad, onCard }: Props) {
  return (
    <section className="row">
      <h3>{row.h}</h3>
      <div className="track">
        {row.cards.map((c, i) => {
          const live = !c.dead;
          return (
            <div key={c.t + i} className={`card${c.dead ? " dead" : ""}`} style={{ background: `linear-gradient(135deg,${grad[0]},${grad[1]})` }}
              role={live ? "button" : undefined} tabIndex={live ? 0 : -1}
              onClick={() => live && onCard(c)} onKeyDown={(e) => { if (live && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onCard(c); } }}>
              {c.n ? <i className="n">{c.n}</i> : c.icon ? <i className="n"><Icon name={c.icon} /></i> : null}
              <b>{c.t}</b>{c.d && <span>{c.d}</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

import Icon from "./Icon";
import type { Chapter } from "@/data/portfolio";
interface Props { hidden: boolean; onPick: (i: number) => void; owner: { email: string }; chapters: Chapter[]; }
export default function ProfileSelector({ hidden, onPick, owner, chapters }: Props) {
  return (
    <div id="profiles" className={hidden ? "hide" : ""} aria-hidden={hidden}>
      <h1>Which chapter do you want to watch?</h1>
      <div className="plist">
        {chapters.map((p, i) => (
          <button key={p.k} className="prof" tabIndex={hidden ? -1 : 0} style={{ animationDelay: `${i * 70}ms` }} onClick={() => onPick(i)}>
            <div className="av" style={{ background: `linear-gradient(135deg,${p.c[0]},${p.c[1]})` }}><Icon name={p.icon} /></div>
            <div className="pl">{p.label}</div><small>Chapter {p.k}</small>
          </button>
        ))}
      </div>
      <a className="mgr" href={`mailto:${owner.email}`}>Contact me</a>
    </div>
  );
}

import type { Chapter, Row } from "@/data/portfolio";
import { CHAPTER_COVER_IMAGES, HIGHLIGHT_IMAGES } from "./cardImages";

/** Rows shown under the hero of a chapter — shared by the public site and the admin preview. */
export function buildRows(p: Chapter, chapters: Chapter[], idx: number): Row[] {
  const rows: Row[] = [];
  if (p.points?.length) {
    rows.push({
      h: "Highlights from this chapter",
      cards: p.points.map((t, i) => ({
        t,
        n: i + 1,
        at: i + 1,
        img: HIGHLIGHT_IMAGES[p.k]?.[i],
      })),
    });
  }
  if (p.rows) rows.push(...p.rows.filter((r) => r.cards.length));
  if (chapters.length > 1) {
    rows.push({
      h: "More chapters",
      cards: chapters
        .map((q, j) => ({ q, j }))
        .filter((x) => x.j !== idx)
        .map(({ q, j }) => ({
          t: q.title,
          d: `Chapter ${q.k} — ${q.role}`,
          icon: q.icon,
          at: -(j + 1),
          img: CHAPTER_COVER_IMAGES[q.k],
        })),
    });
  }
  return rows;
}

export const storyScenes = (p: Chapter) => (p.scenes?.length ? p.scenes : [p.summary, ...(p.points ?? [])]);

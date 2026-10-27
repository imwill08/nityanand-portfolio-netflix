"use client";
import Link from "next/link";
import { usePortfolioData } from "@/lib/store";

export default function Dashboard() {
  const { data } = usePortfolioData();
  const cards = data.chapters.reduce((n, c) => n + (c.rows ?? []).reduce((m, r) => m + r.cards.length, 0), 0);
  const stats = [
    { l: "Chapters", v: data.chapters.length },
    { l: "Cards", v: cards },
    { l: "Contact email", v: "✓" },
    { l: "Status", v: "Live" },
  ];
  return (
    <>
      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.l}>
            <small>{s.l}</small><b>{s.v}</b>
          </div>
        ))}
      </div>
      <section className="panel">
        <h2>Welcome back</h2>
        <p className="hint">
          Manage everything shown on your public portfolio, update chapter content, and change your profile picture or hero images.
        </p>
        <div className="row-actions">
          <Link className="abtn" href="/admin/chapters">Manage chapters &amp; media</Link>
          <Link className="abtn ghost" href="/admin/profile">Change profile picture &amp; info</Link>
        </div>
      </section>
    </>
  );
}

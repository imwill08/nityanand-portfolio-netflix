"use client";
import { useEffect, useState } from "react";
import { usePortfolioData, type PortfolioData } from "@/lib/store";

export default function ProfilePage() {
  const { data, update, ready } = usePortfolioData();
  const [o, setO] = useState<PortfolioData["owner"] | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (ready) setO(data.owner);
  }, [ready, data.owner]);

  if (!o) return null;

  const f = (k: keyof typeof o, label: string) => (
    <div className="fld">
      <label htmlFor={k}>{label}</label>
      <input id={k} value={o[k]} onChange={(e) => setO({ ...o, [k]: e.target.value })} />
    </div>
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();

    // Sync contact cards in Chapter 5 with the updated owner info
    const updatedChapters = (data.chapters || []).map((ch) => {
      const rows = (ch.rows || []).map((r) => {
        if (r.h === "Get in touch" || r.h === "Contact") {
          const cards = r.cards.map((card) => {
            if (card.t === "Email" || card.icon === "mail") {
              return { ...card, d: o.email, go: `mailto:${o.email}` };
            }
            if (card.t === "Phone" || card.icon === "phone") {
              return { ...card, d: o.phone, go: `tel:${o.tel || o.phone}` };
            }
            if (card.t === "LinkedIn" || card.icon === "link") {
              return { ...card, go: o.linkedin };
            }
            if (card.t === "GitHub" || card.icon === "file") {
              return { ...card, go: o.github };
            }
            return card;
          });
          return { ...r, cards };
        }
        return r;
      });
      return { ...ch, rows };
    });

    update({ ...data, owner: o, chapters: updatedChapters });
    setToast("Profile saved");
    setTimeout(() => setToast(""), 1800);
  };

  return (
    <form className="panel" onSubmit={save}>
      <h2>Profile &amp; Contact</h2>
      <div className="grid2">
        {f("name", "Name")}
        {f("email", "Email")}
        {f("phone", "Phone")}
        {f("tel", "Phone (tel: link)")}
        {f("linkedin", "LinkedIn URL")}
        {f("github", "GitHub URL")}
      </div>
      <button className="abtn" type="submit">
        Save profile
      </button>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </form>
  );
}

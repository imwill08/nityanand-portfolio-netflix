"use client";
import { useEffect, useState } from "react";
import { usePortfolioData, type PortfolioData } from "@/lib/store";

export default function ProfilePage() {
  const { data, update, ready } = usePortfolioData();
  const [o, setO] = useState<PortfolioData["owner"] | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => { if (ready) setO(data.owner); }, [ready, data.owner]);
  if (!o) return null;
  const f = (k: keyof typeof o, label: string) => (
    <div className="fld"><label htmlFor={k}>{label}</label><input id={k} value={o[k]} onChange={(e) => setO({ ...o, [k]: e.target.value })} /></div>
  );
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update({ ...data, owner: o });
    setToast("Profile saved"); setTimeout(() => setToast(""), 1800);
  };
  return (
    <form className="panel" onSubmit={save}>
      <h2>Profile & Contact</h2>
      <div className="grid2">{f("name", "Name")}{f("email", "Email")}{f("phone", "Phone")}{f("tel", "Phone (tel: link)")}{f("linkedin", "LinkedIn URL")}{f("github", "GitHub URL")}</div>
      <button className="abtn" type="submit">Save profile</button>
      {toast && <div className="toast" role="status">{toast}</div>}
    </form>
  );
}

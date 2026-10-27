"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./nav";
import { usePortfolioData } from "@/lib/store";

export default function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const path = usePathname();
  const { data } = usePortfolioData();
  const title = NAV.find((n) => n.href === path)?.label ?? "Admin";
  const avatar = data.owner?.avatar || data.chapters?.find((c) => c.k === 5)?.bg;

  return (
    <header className="adm-top">
      <button className="adm-burger" aria-label="Menu" onClick={onMenu}>☰</button>
      <h1>{title}</h1>
      <span className="sp" />
      <Link className="view" href="/" target="_blank">View site</Link>
      <div className="adm-user">
        {avatar ? (
          <img
            src={avatar}
            alt="Admin"
            style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover" }}
          />
        ) : (
          <i>A</i>
        )}
        <span>{data.owner?.name || "Admin"}</span>
      </div>
    </header>
  );
}

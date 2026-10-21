"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./nav";

export default function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const path = usePathname();
  const title = NAV.find((n) => n.href === path)?.label ?? "Admin";
  return (
    <header className="adm-top">
      <button className="adm-burger" aria-label="Menu" onClick={onMenu}>☰</button>
      <h1>{title}</h1>
      <span className="sp" />
      <Link className="view" href="/" target="_blank">View site</Link>
      <div className="adm-user"><i>A</i><span>Admin</span></div>
    </header>
  );
}

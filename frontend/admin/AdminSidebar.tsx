"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/store";
import { ICONS, NAV } from "./nav";

export default function AdminSidebar({ open }: { open: boolean }) {
  const path = usePathname();
  const router = useRouter();
  return (
    <aside className={`adm-side${open ? " open" : ""}`}>
      <span className="adm-logo">NITYANAND</span>
      <span className="adm-sub">Admin Studio</span>
      <nav className="adm-nav" aria-label="Admin">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={path === n.href ? "on" : ""}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[n.icon] }} />
            {n.label}
          </Link>
        ))}
      </nav>
      <button className="out-btn" onClick={() => { logout(); router.replace("/admin/login"); }}>Sign out</button>
    </aside>
  );
}

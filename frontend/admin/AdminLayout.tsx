"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthed } from "@/lib/store";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

/** Admin layout: fixed sidebar + fixed header; only the content area scrolls. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { if (isAuthed()) setOk(true); else router.replace("/admin/login"); }, [router]);
  useEffect(() => setOpen(false), [path]);

  if (!ok) return <div className="adm" style={{ placeItems: "center", display: "grid" }}><span className="adm-logo">NITYANAND</span></div>;

  return (
    <div className="adm">
      <AdminSidebar open={open} />
      {open && <div className="adm-scrim" onClick={() => setOpen(false)} />}
      <div className="adm-main">
        <AdminHeader onMenu={() => setOpen(!open)} />
        <div className="adm-body">{children}</div>
      </div>
    </div>
  );
}

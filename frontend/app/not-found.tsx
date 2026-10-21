import Link from "next/link";
export default function NotFound() {
  return (<main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}><div><h1 style={{ fontSize: "clamp(2rem,6vw,4rem)" }}>Page not found</h1><p style={{ margin: "12px 0 24px", color: "var(--g)" }}>This chapter does not exist.</p><Link className="mgr" href="/">Back home</Link></div></main>);
}

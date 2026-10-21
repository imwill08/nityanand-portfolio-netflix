"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(u.trim(), p);
    if (ok) router.replace("/admin");
    else setErr("Incorrect username or password.");
  };
  return (
    <main className="login">
      <form className="login-box" onSubmit={submit}>
        <span className="adm-logo">NITYANAND</span>
        <h1>Sign In</h1>
        {err && <div className="login-err" role="alert">{err}</div>}
        <div className="fld"><input id="u" aria-label="Username" placeholder="Username" autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} required /></div>
        <div className="fld"><input id="p" aria-label="Password" placeholder="Password" type="password" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} required /></div>
        <button className="abtn" type="submit">Sign In</button>
        <p className="login-note">Demo login: <code>admin</code> / <code>admin123</code><br /><Link href="/">← Back to portfolio</Link></p>
      </form>
    </main>
  );
}

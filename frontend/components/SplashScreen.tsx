"use client";
import { useEffect, useState } from "react";
export default function SplashScreen() {
  const [out, setOut] = useState(false);
  useEffect(() => { const id = setTimeout(() => setOut(true), 2900); return () => clearTimeout(id); }, []);
  return (
    <div id="splash" className={out ? "out" : ""} onClick={() => setOut(true)} aria-hidden={out}>
      <div className="mark">N</div><div className="ssub">NITYANAND</div>
    </div>
  );
}

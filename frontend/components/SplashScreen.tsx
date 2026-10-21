"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ ownerName }: { ownerName?: string }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOut(true), 2900);
    return () => clearTimeout(id);
  }, []);

  const name = ownerName || "NITYANAND";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div id="splash" className={out ? "out" : ""} onClick={() => setOut(true)} aria-hidden={out}>
      <div className="mark">{initial}</div>
      <div className="ssub">{name.toUpperCase()}</div>
    </div>
  );
}

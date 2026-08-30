"use client";

import { useEffect, useState } from "react";
import SakuraExperience from "./SakuraExperience";
import SakuraMobileExperience from "./SakuraMobileExperience";

export default function SakuraResponsiveExperience() {
  const [mode, setMode] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setMode(query.matches ? "mobile" : "desktop");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (mode === null) {
    return <main className="min-h-[100dvh] bg-[#f1dfcf]" aria-hidden="true" />;
  }

  return mode === "mobile" ? <SakuraMobileExperience /> : <SakuraExperience />;
}

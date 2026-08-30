"use client";

import { useEffect, useState } from "react";
import SakuraExperience from "./SakuraExperience";
import SakuraMobileExperience from "./SakuraMobileExperience";

export default function SakuraResponsiveExperience() {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (mobile === null) return <main className="min-h-[100dvh] bg-[#f1dfcf]" aria-hidden="true" />;
  return mobile ? <SakuraMobileExperience /> : <SakuraExperience />;
}

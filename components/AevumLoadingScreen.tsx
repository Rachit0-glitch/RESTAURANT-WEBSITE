"use client";

import { useState, useEffect } from "react";

export default function AevumLoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1600; // 1.6s polished luxury pace

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Designer editorial phase captions
  const getPhaseText = () => {
    if (progress < 35) return "01 // HARMONIZING SENSORY ELEMENTS";
    if (progress < 70) return "02 // PREPARING TOYOSU MORNING CATCH";
    if (progress < 98) return "03 // CRAFTING ARTISANAL OMAKASE";
    return "04 // REVEALING EXPERIENCE";
  };

  const formattedProgress = progress < 10 ? `0${progress}` : `${progress}`;

  return (
    <div
      className={`fixed inset-0 z-[99998] flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-[#060606] text-white transition-all duration-700 select-none overflow-hidden ${
        isFadingOut
          ? "opacity-0 scale-[1.03] filter blur-[6px] pointer-events-none"
          : "opacity-100 scale-100 filter blur-0"
      }`}
    >
      {/* Background Japanese Watermark Monogram */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[28vw] font-black text-white/[0.02] tracking-[0.2em] pointer-events-none leading-none select-none"
      >
        櫻
      </div>

      {/* Subtle Central Warmth */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#e60012]/[0.06] rounded-full blur-[100px] pointer-events-none"
      />

      {/* Top Header Rail: Editorial Coordinates */}
      <header className="relative z-10 flex justify-between items-center text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#e60012] animate-pulse" />
          <span className="text-white font-bold">SAKURA (桜処)</span>
          <span className="hidden sm:inline text-neutral-600">/</span>
          <span className="hidden sm:inline text-neutral-500">ATELIER OMAKASE</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <span>GINZA, TOKYO</span>
          <span className="hidden md:inline font-sans font-light">35.6719° N, 139.7640° E</span>
        </div>
      </header>

      {/* Center Stage: Haute Editorial Composition */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto text-center">
        {/* Brand Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-md flex items-center justify-center p-2.5 shadow-[0_0_30px_rgba(230,0,18,0.25)]">
            <img
              src="/sakura-assets/_assets/media/6c06138391acf332fac3fc3d9be64b42.png"
              alt="Sakura Emblem"
              className="w-full h-full object-contain filter invert opacity-90"
            />
          </div>
        </div>

        {/* Japanese Title & Subtitle */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-serif tracking-[0.3em] text-[#e60012] uppercase font-bold">
              極上 鮨処
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-light tracking-[0.35em] uppercase text-white/95">
            SAKURA CULINARY
          </h1>
        </div>

        {/* Heroic Precision Counter */}
        <div className="relative flex items-baseline justify-center mb-6">
          <span className="font-serif text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-white/90 tabular-nums">
            {formattedProgress}
          </span>
          <span className="text-xl sm:text-2xl font-mono text-[#e60012] ml-2 font-light">
            %
          </span>
        </div>

        {/* Hairline Laser Progress Line */}
        <div className="w-64 sm:w-80 space-y-3">
          <div className="relative h-[1px] w-full bg-white/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#e60012] to-amber-300 transition-all duration-75 ease-out shadow-[0_0_12px_#e60012]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
            {getPhaseText()}
          </p>
        </div>
      </main>

      {/* Bottom Footer Rail: Provenance & Craft */}
      <footer className="relative z-10 flex justify-between items-end text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-500 uppercase">
        <div className="flex flex-col items-start gap-1">
          <span className="text-neutral-400">EST. 1988</span>
          <span className="hidden sm:inline text-neutral-600">MICHELIN SELECTION</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-600">CURATED BY</span>
          <span className="text-neutral-300 font-bold">AEVUM STUDIO</span>
        </div>
      </footer>
    </div>
  );
}

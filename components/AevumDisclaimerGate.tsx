"use client";

import { useState, useEffect } from "react";

export default function AevumDisclaimerGate({
  onAccept,
}: {
  onAccept?: () => void;
}) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const accepted = sessionStorage.getItem("aevum_disclaimer_accepted");
      if (accepted === "true") {
        setIsAccepted(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleEnter = () => {
    try {
      sessionStorage.setItem("aevum_disclaimer_accepted", "true");
    } catch {
      // Ignore storage errors
    }
    setIsAccepted(true);
    if (onAccept) onAccept();
  };

  if (mounted && isAccepted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aevum-modal-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-3xl transition-opacity duration-300 select-none"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.95)] text-white text-left">
        {/* Brand Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e60012]" />
            <span className="font-mono text-xs font-bold tracking-[0.24em] text-white uppercase">
              AEVUM°
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400">
            Portfolio Showcase
          </span>
        </div>

        {/* Modal Content */}
        <div className="py-7 space-y-4">
          <h2
            id="aevum-modal-title"
            className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-white uppercase leading-tight"
          >
            Before You Continue
          </h2>
          <p className="text-[14px] sm:text-[15px] leading-[1.75] text-neutral-300 font-normal">
            This is an interactive web engineering &amp; design showcase created by AEVUM. The product concepts, 3D assets, and interfaces presented here were engineered purely for agency portfolio and demonstration purposes. No commercial sales are intended. By continuing, you acknowledge this is an interactive design &amp; development showcase by AEVUM.
          </p>
        </div>

        {/* Action Button & Agency Meta */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline-block">
            Engineering Showcase
          </span>
          <button
            type="button"
            onClick={handleEnter}
            style={{ backgroundColor: "#e60012" }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#e60012] hover:bg-[#ff1a2d] text-white font-extrabold text-xs tracking-[0.16em] uppercase px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Enter Showcase</span>
            <span className="text-sm font-normal">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

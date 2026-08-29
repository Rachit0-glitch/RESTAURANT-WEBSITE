"use client";

export default function SakuraTransitionBanner() {
  const tickerItems = [
    "伝統と革新",
    "SAKURA CULINARY ATELIER",
    "一期一会",
    "TOYOSU MORNING CATCH",
    "職人の技",
    "36-YEAR ARTISANAL HERITAGE",
    "極上旨味",
    "PREMIUM OMAKASE EXPERIENCE",
    "純手打ち",
    "MICHELIN-INSPIRED CRAFT",
  ];

  return (
    <div className="relative w-full z-30 bg-[#0c0b0a] text-white py-4 sm:py-5 border-y border-[#e60012]/30 overflow-hidden select-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Background Subtle Red Halo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-15 bg-[radial-gradient(#e60012_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-16 bg-[#e60012]/10 rounded-full blur-2xl pointer-events-none"
      />

      {/* Slim Single Dual-Scroll Japanese Marquee */}
      <div className="flex whitespace-nowrap overflow-hidden py-1">
        <div className="flex gap-10 items-center animate-[ticker_30s_linear_infinite] will-change-transform">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={`ticker-slim-${idx}`} className="flex items-center gap-10">
              <span className="text-xs sm:text-sm font-serif font-black tracking-[0.28em] uppercase text-white/95 flex items-center gap-3">
                <span className="text-[#e60012] font-black">◈</span>
                <span>{item}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded border border-[#e60012]/60 bg-[#e60012]/15 text-[10px] font-mono font-bold text-[#e60012] tracking-widest uppercase">
                旬
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

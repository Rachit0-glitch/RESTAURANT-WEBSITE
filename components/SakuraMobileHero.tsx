"use client";

import { useState } from "react";

interface SakuraMobileHeroProps {
  onExploreMenu: () => void;
  isHeroRevealed?: boolean;
}

export default function SakuraMobileHero({
  onExploreMenu,
  isHeroRevealed = true,
}: SakuraMobileHeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-[#f4eee5] overflow-hidden flex flex-col justify-between md:hidden select-none font-sans">
      {/* --- Background Artwork: Pagoda, Koi & Cherry Blossom Petals --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Japanese Pagoda & Koi Sketch on Right */}
        <div
          className="absolute top-0 right-0 w-[340px] h-[480px] bg-no-repeat bg-contain bg-right-top opacity-35"
          style={{
            backgroundImage: "url('/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png')",
            backgroundPosition: "85% 5%",
            backgroundSize: "260%",
          }}
        />

        {/* Traditional Wave Pattern on Lower Left */}
        <div
          className="absolute bottom-32 left-0 w-[240px] h-[240px] bg-no-repeat bg-contain bg-left-bottom opacity-20"
          style={{
            backgroundImage: "url('/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png')",
            backgroundPosition: "5% 85%",
            backgroundSize: "300%",
          }}
        />

        {/* Floating Sakura Petals */}
        <div className="absolute top-16 right-16 w-4 h-3 bg-pink-300/60 rounded-full rotate-45 blur-[0.3px] animate-pulse" />
        <div className="absolute top-44 right-8 w-5 h-3.5 bg-pink-400/50 rounded-full -rotate-12 blur-[0.2px]" />
        <div className="absolute top-[380px] right-20 w-4 h-2.5 bg-pink-300/50 rounded-full rotate-[30deg]" />
        <div className="absolute top-[480px] left-8 w-4 h-3 bg-pink-400/40 rounded-full -rotate-45" />
      </div>

      {/* --- Top Mobile Header --- */}
      <header className="relative z-30 flex items-center justify-between px-6 pt-7 pb-2">
        {/* Brand Logo "SUSHI" */}
        <div className="flex items-center">
          <span className="text-[32px] font-black tracking-[-0.04em] uppercase text-black font-sans leading-none">
            SUSHI
          </span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="flex flex-col justify-center items-end gap-[5px] p-2 cursor-pointer focus:outline-none"
        >
          <span className={`w-7 h-[2.5px] bg-black rounded-full transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`} />
          <span className={`w-7 h-[2.5px] bg-black rounded-full transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-7 h-[2.5px] bg-black rounded-full transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`} />
        </button>
      </header>

      {/* --- Main Hero Content --- */}
      <div className="relative z-20 flex flex-col px-6 pt-2 pb-0">
        {/* Japanese Tagline Badge / Tape Sticker */}
        <div className="self-start mb-3">
          <div
            className="inline-flex items-center bg-[#fffdfa] px-3.5 py-1.5 rounded-[2px] shadow-[0_4px_14px_rgba(0,0,0,0.09)] border border-black/5 -rotate-[2.5deg] transform origin-left"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.06))" }}
          >
            <span className="text-[14px] font-bold tracking-wider text-black">
              最高の<span className="text-[#e60012] font-black">寿司</span>盛り合わせ
            </span>
          </div>
        </div>

        {/* Massive Bold Hero Headline */}
        <h1 className="flex flex-col text-[52px] xs:text-[56px] font-black uppercase tracking-[-0.035em] leading-[0.88] text-black">
          <span>AUTHENTIC</span>
          <span>JAPANESE</span>
          <span className="text-[#e60012]">DINING.</span>
        </h1>

        {/* Subtitle Description */}
        <p className="text-[#4a4a4a] text-[15px] leading-snug font-medium mt-4 max-w-[280px]">
          Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.
        </p>

        {/* Explore Menu CTA Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onExploreMenu}
            className="inline-flex items-center gap-3 bg-black hover:bg-neutral-900 active:scale-95 text-white rounded-full px-7 py-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-200 cursor-pointer"
          >
            <span className="text-[12px] font-black tracking-[0.2em] uppercase text-white">
              EXPLORE MENU
            </span>
            <svg
              className="w-4 h-4 stroke-current stroke-[2.5] fill-none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- Lower Food Stage: Giant Watermark + Seal Stamp + Platter --- */}
      <div className="relative z-10 w-full mt-2 flex flex-col justify-end overflow-visible">
        {/* Giant "SUSHI" Watermark Typography behind Platter */}
        <div
          className="absolute right-2 top-0 z-0 select-none pointer-events-none"
          style={{ transform: "translateY(-15%)" }}
        >
          <span className="text-[115px] sm:text-[135px] font-black uppercase tracking-[-0.04em] text-[#1c1c1c] leading-none block">
            SUSHI
          </span>
        </div>

        {/* Traditional Japanese Seal Stamp on Left */}
        <div className="absolute left-5 top-12 z-20 flex flex-col items-center select-none pointer-events-none">
          <div className="border-[1.5px] border-[#cc0012] rounded-[3px] px-1.5 py-2 bg-[#f4eee5]/80 backdrop-blur-xs flex flex-col items-center">
            <span className="text-[11px] font-serif font-black text-[#cc0012] [writing-mode:vertical-rl] tracking-[0.3em] leading-tight">
              極上 鮨処
            </span>
          </div>
          <span className="text-[8px] font-mono font-bold tracking-widest text-[#cc0012] mt-1">
            EST. 1998
          </span>
        </div>

        {/* High-Resolution Sushi Platter on Wooden Board */}
        <div className="relative z-10 w-full overflow-visible">
          <img
            src="/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png"
            alt="Authentic Sushi Platter"
            className="w-full scale-[1.14] origin-bottom-left translate-y-3 -translate-x-1 object-cover pointer-events-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.4)]"
            loading="eager"
          />
        </div>
      </div>

      {/* --- Mobile Full-Screen Navigation Drawer --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-2xl flex flex-col justify-between p-8 text-white animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black tracking-tight uppercase text-white">
              SUSHI
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-bold"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-6 my-auto text-left">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-3xl font-black uppercase tracking-tight text-white hover:text-[#e60012] text-left transition-colors"
            >
              01. Home
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onExploreMenu();
              }}
              className="text-3xl font-black uppercase tracking-tight text-white hover:text-[#e60012] text-left transition-colors"
            >
              02. Menu & Dishes
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById("dishes-1");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-3xl font-black uppercase tracking-tight text-white hover:text-[#e60012] text-left transition-colors"
            >
              03. Tonkotsu Ramen
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById("dishes-1");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-3xl font-black uppercase tracking-tight text-white hover:text-[#e60012] text-left transition-colors"
            >
              04. Reservation
            </button>
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>極上 鮨処 • EST. 1998</span>
            <span className="text-[#e60012] font-mono">AEVUM°</span>
          </div>
        </div>
      )}
    </section>
  );
}

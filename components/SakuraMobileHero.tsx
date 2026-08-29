"use client";

import { useEffect, useRef, useState } from "react";

interface ElementLayout {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  fontSize?: number;
}

interface MobileHeroLayoutConfig {
  header: ElementLayout;
  tagline: ElementLayout;
  headline: ElementLayout;
  subtitle: ElementLayout;
  ctaButton: ElementLayout;
  watermark: ElementLayout;
  sealStamp: ElementLayout;
  sushiPlatter: ElementLayout;
  bgArtwork: ElementLayout;
}

const DEFAULT_MOBILE_LAYOUT: MobileHeroLayoutConfig = {
  header: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
  tagline: { x: 0, y: 0, scale: 1, rotate: -2.5, opacity: 1 },
  headline: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, fontSize: 52 },
  subtitle: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
  ctaButton: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
  watermark: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0.95, fontSize: 115 },
  sealStamp: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
  sushiPlatter: { x: 0, y: 0, scale: 1.14, rotate: 0, opacity: 1 },
  bgArtwork: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0.35 },
};

interface SakuraMobileHeroProps {
  onExploreMenu: () => void;
  isHeroRevealed?: boolean;
}

export default function SakuraMobileHero({
  onExploreMenu,
  isHeroRevealed = true,
}: SakuraMobileHeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calibratorOpen, setCalibratorOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<keyof MobileHeroLayoutConfig>("sushiPlatter");
  const [dragModeActive, setDragModeActive] = useState(false);
  const [layout, setLayout] = useState<MobileHeroLayoutConfig>(DEFAULT_MOBILE_LAYOUT);
  const [copiedToast, setCopiedToast] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Load layout from localStorage if previously saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sakura_mobile_hero_layout");
      if (saved) {
        setLayout(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateSelected = (partial: Partial<ElementLayout>) => {
    setLayout((prev) => ({
      ...prev,
      [selectedElement]: {
        ...prev[selectedElement],
        ...partial,
      },
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem("sakura_mobile_hero_layout", JSON.stringify(layout));
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(layout, null, 2));
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleReset = () => {
    setLayout(DEFAULT_MOBILE_LAYOUT);
    try {
      localStorage.removeItem("sakura_mobile_hero_layout");
    } catch {
      // ignore
    }
  };

  const handleReplayAnim = () => {
    setAnimKey((prev) => prev + 1);
  };

  // Dragging support for direct screen manipulation
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number; initialElemX: number; initialElemY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialElemX: 0,
    initialElemY: 0,
  });

  const handleTouchStart = (elemKey: keyof MobileHeroLayoutConfig, e: React.TouchEvent) => {
    if (!dragModeActive) return;
    setSelectedElement(elemKey);
    const touch = e.touches[0];
    dragRef.current = {
      isDragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      initialElemX: layout[elemKey].x,
      initialElemY: layout[elemKey].y,
    };
  };

  const handleTouchMove = (elemKey: keyof MobileHeroLayoutConfig, e: React.TouchEvent) => {
    if (!dragModeActive || !dragRef.current.isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragRef.current.startX;
    const dy = touch.clientY - dragRef.current.startY;
    setLayout((prev) => ({
      ...prev,
      [elemKey]: {
        ...prev[elemKey],
        x: Math.round(dragRef.current.initialElemX + dx),
        y: Math.round(dragRef.current.initialElemY + dy),
      },
    }));
  };

  const handleTouchEnd = () => {
    dragRef.current.isDragging = false;
  };

  const elementOptions: { key: keyof MobileHeroLayoutConfig; label: string; icon: string }[] = [
    { key: "sushiPlatter", label: "Sushi Platter", icon: "🍱" },
    { key: "headline", label: "Headline (Dining.)", icon: "✍️" },
    { key: "tagline", label: "Tagline Sticker", icon: "🏷️" },
    { key: "subtitle", label: "Subtitle", icon: "📄" },
    { key: "ctaButton", label: "Explore CTA", icon: "🔘" },
    { key: "watermark", label: "SUSHI Text", icon: "🔠" },
    { key: "sealStamp", label: "Seal Stamp", icon: "🔴" },
    { key: "bgArtwork", label: "Pagoda / Koi", icon: "⛩️" },
    { key: "header", label: "Top Header", icon: "📱" },
  ];

  const current = layout[selectedElement];

  return (
    <section
      key={`hero-${animKey}`}
      className="relative w-full min-h-screen bg-[#f4eee5] overflow-hidden flex flex-col justify-between md:hidden select-none font-sans"
    >
      {/* Toast Alert */}
      {copiedToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[999] bg-neutral-900/95 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="text-emerald-400">✓</span> Layout Saved & Copied!
        </div>
      )}

      {/* --- Background Artwork: Pagoda, Koi & Cherry Blossom Petals with Live Animation --- */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          transform: `translate(${layout.bgArtwork.x}px, ${layout.bgArtwork.y}px) scale(${layout.bgArtwork.scale}) rotate(${layout.bgArtwork.rotate}deg)`,
          opacity: layout.bgArtwork.opacity,
          transition: "transform 0.1s ease-out, opacity 0.2s ease",
        }}
      >
        {/* Japanese Pagoda & Koi Sketch on Right */}
        <div
          className="absolute top-0 right-0 w-[340px] h-[480px] bg-no-repeat bg-contain bg-right-top animate-fade-in-slow"
          style={{
            backgroundImage: "url('/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png')",
            backgroundPosition: "85% 5%",
            backgroundSize: "260%",
          }}
        />

        {/* Traditional Wave Pattern on Lower Left */}
        <div
          className="absolute bottom-32 left-0 w-[240px] h-[240px] bg-no-repeat bg-contain bg-left-bottom opacity-60"
          style={{
            backgroundImage: "url('/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png')",
            backgroundPosition: "5% 85%",
            backgroundSize: "300%",
          }}
        />

        {/* Animated Floating Sakura Petals */}
        <div className="absolute top-16 right-16 w-4 h-3 bg-pink-300/70 rounded-full rotate-45 blur-[0.3px] animate-float-petal-1" />
        <div className="absolute top-44 right-8 w-5 h-3.5 bg-pink-400/60 rounded-full -rotate-12 blur-[0.2px] animate-float-petal-2" />
        <div className="absolute top-[380px] right-20 w-4 h-2.5 bg-pink-300/60 rounded-full rotate-[30deg] animate-float-petal-3" />
        <div className="absolute top-[480px] left-8 w-4 h-3 bg-pink-400/50 rounded-full -rotate-45 animate-float-petal-1" />
      </div>

      {/* --- Top Mobile Header --- */}
      <header
        className={`relative z-30 flex items-center justify-between px-6 pt-7 pb-2 transition-all duration-500 animate-slide-down ${dragModeActive && selectedElement === "header" ? "ring-2 ring-red-500 ring-offset-2 rounded-lg bg-red-500/10" : ""}`}
        style={{
          transform: `translate(${layout.header.x}px, ${layout.header.y}px) scale(${layout.header.scale}) rotate(${layout.header.rotate}deg)`,
          opacity: layout.header.opacity,
        }}
        onTouchStart={(e) => handleTouchStart("header", e)}
        onTouchMove={(e) => handleTouchMove("header", e)}
        onTouchEnd={handleTouchEnd}
      >
        {/* Brand Logo "SUSHI" */}
        <div className="flex items-center">
          <span className="text-[32px] font-black tracking-[-0.04em] uppercase text-black font-sans leading-none hover:scale-105 transition-transform">
            SUSHI
          </span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="flex flex-col justify-center items-end gap-[5px] p-2 cursor-pointer focus:outline-none active:scale-90 transition-transform"
        >
          <span className={`w-7 h-[2.5px] bg-black rounded-full transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`} />
          <span className={`w-7 h-[2.5px] bg-black rounded-full transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-7 h-[2.5px] bg-black rounded-full transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`} />
        </button>
      </header>

      {/* --- Main Hero Content --- */}
      <div className="relative z-20 flex flex-col px-6 pt-2 pb-0">
        {/* Japanese Tagline Badge / Tape Sticker with Stamp Animation */}
        <div
          className={`self-start mb-3 transition-all duration-300 animate-stamp-pop ${dragModeActive && selectedElement === "tagline" ? "ring-2 ring-red-500 ring-offset-2 rounded-sm bg-red-500/10" : ""}`}
          style={{
            transform: `translate(${layout.tagline.x}px, ${layout.tagline.y}px) scale(${layout.tagline.scale}) rotate(${layout.tagline.rotate}deg)`,
            opacity: layout.tagline.opacity,
          }}
          onTouchStart={(e) => handleTouchStart("tagline", e)}
          onTouchMove={(e) => handleTouchMove("tagline", e)}
          onTouchEnd={handleTouchEnd}
          onClick={() => { if (dragModeActive) setSelectedElement("tagline"); }}
        >
          <div
            className="inline-flex items-center bg-[#fffdfa] px-3.5 py-1.5 rounded-[2px] shadow-[0_4px_14px_rgba(0,0,0,0.09)] border border-black/5 transform origin-left"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.06))" }}
          >
            <span className="text-[14px] font-bold tracking-wider text-black">
              最高の<span className="text-[#e60012] font-black">寿司</span>盛り合わせ
            </span>
          </div>
        </div>

        {/* Massive Bold Hero Headline with Stagger Animation */}
        <div
          className={`flex flex-col select-none transition-all duration-300 ${dragModeActive && selectedElement === "headline" ? "ring-2 ring-red-500 ring-offset-2 rounded-lg bg-red-500/10 p-1" : ""}`}
          style={{
            transform: `translate(${layout.headline.x}px, ${layout.headline.y}px) scale(${layout.headline.scale}) rotate(${layout.headline.rotate}deg)`,
            opacity: layout.headline.opacity,
          }}
          onTouchStart={(e) => handleTouchStart("headline", e)}
          onTouchMove={(e) => handleTouchMove("headline", e)}
          onTouchEnd={handleTouchEnd}
          onClick={() => { if (dragModeActive) setSelectedElement("headline"); }}
        >
          <h1
            className="flex flex-col font-black uppercase tracking-[-0.035em] leading-[0.88] text-black"
            style={{ fontSize: `${layout.headline.fontSize || 52}px` }}
          >
            <span className="inline-block animate-slide-up-1">AUTHENTIC</span>
            <span className="inline-block animate-slide-up-2">JAPANESE</span>
            <span className="inline-block text-[#e60012] animate-slide-up-3">DINING.</span>
          </h1>
        </div>

        {/* Subtitle Description */}
        <div
          className={`mt-4 max-w-[280px] transition-all duration-300 animate-fade-in-delayed ${dragModeActive && selectedElement === "subtitle" ? "ring-2 ring-red-500 ring-offset-2 rounded-md bg-red-500/10" : ""}`}
          style={{
            transform: `translate(${layout.subtitle.x}px, ${layout.subtitle.y}px) scale(${layout.subtitle.scale}) rotate(${layout.subtitle.rotate}deg)`,
            opacity: layout.subtitle.opacity,
          }}
          onTouchStart={(e) => handleTouchStart("subtitle", e)}
          onTouchMove={(e) => handleTouchMove("subtitle", e)}
          onTouchEnd={handleTouchEnd}
          onClick={() => { if (dragModeActive) setSelectedElement("subtitle"); }}
        >
          <p className="text-[#4a4a4a] text-[15px] leading-snug font-medium">
            Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.
          </p>
        </div>

        {/* Explore Menu CTA Button */}
        <div
          className={`mt-5 self-start transition-all duration-300 animate-fade-in-delayed ${dragModeActive && selectedElement === "ctaButton" ? "ring-2 ring-red-500 ring-offset-4 rounded-full" : ""}`}
          style={{
            transform: `translate(${layout.ctaButton.x}px, ${layout.ctaButton.y}px) scale(${layout.ctaButton.scale}) rotate(${layout.ctaButton.rotate}deg)`,
            opacity: layout.ctaButton.opacity,
          }}
          onTouchStart={(e) => handleTouchStart("ctaButton", e)}
          onTouchMove={(e) => handleTouchMove("ctaButton", e)}
          onTouchEnd={handleTouchEnd}
          onClick={() => { if (dragModeActive) setSelectedElement("ctaButton"); }}
        >
          <button
            type="button"
            onClick={onExploreMenu}
            className="inline-flex items-center gap-3 bg-black hover:bg-neutral-900 active:scale-95 text-white rounded-full px-7 py-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-200 cursor-pointer"
          >
            <span className="text-[12px] font-black tracking-[0.2em] uppercase text-white">
              EXPLORE MENU
            </span>
            <svg
              className="w-4 h-4 stroke-current stroke-[2.5] fill-none animate-pulse"
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
          className={`absolute right-2 top-0 z-0 select-none transition-all duration-300 animate-slide-in-right ${dragModeActive && selectedElement === "watermark" ? "ring-2 ring-red-500 ring-offset-2 rounded-lg" : ""}`}
          style={{
            transform: `translate(${layout.watermark.x}px, ${layout.watermark.y - 15}%) scale(${layout.watermark.scale}) rotate(${layout.watermark.rotate}deg)`,
            opacity: layout.watermark.opacity,
          }}
          onTouchStart={(e) => handleTouchStart("watermark", e)}
          onTouchMove={(e) => handleTouchMove("watermark", e)}
          onTouchEnd={handleTouchEnd}
          onClick={() => { if (dragModeActive) setSelectedElement("watermark"); }}
        >
          <span
            className="font-black uppercase tracking-[-0.04em] text-[#1c1c1c] leading-none block"
            style={{ fontSize: `${layout.watermark.fontSize || 115}px` }}
          >
            SUSHI
          </span>
        </div>

        {/* Traditional Japanese Seal Stamp on Left */}
        <div
          className={`absolute left-5 top-12 z-20 flex flex-col items-center select-none transition-all duration-300 animate-seal-stamp ${dragModeActive && selectedElement === "sealStamp" ? "ring-2 ring-red-500 ring-offset-2 rounded-md bg-red-500/10 p-1" : ""}`}
          style={{
            transform: `translate(${layout.sealStamp.x}px, ${layout.sealStamp.y}px) scale(${layout.sealStamp.scale}) rotate(${layout.sealStamp.rotate}deg)`,
            opacity: layout.sealStamp.opacity,
          }}
          onTouchStart={(e) => handleTouchStart("sealStamp", e)}
          onTouchMove={(e) => handleTouchMove("sealStamp", e)}
          onTouchEnd={handleTouchEnd}
          onClick={() => { if (dragModeActive) setSelectedElement("sealStamp"); }}
        >
          <div className="border-[1.5px] border-[#cc0012] rounded-[3px] px-1.5 py-2 bg-[#f4eee5]/80 backdrop-blur-xs flex flex-col items-center shadow-sm">
            <span className="text-[11px] font-serif font-black text-[#cc0012] [writing-mode:vertical-rl] tracking-[0.3em] leading-tight">
              極上 鮨処
            </span>
          </div>
          <span className="text-[8px] font-mono font-bold tracking-widest text-[#cc0012] mt-1">
            EST. 1998
          </span>
        </div>

        {/* High-Resolution Sushi Platter on Wooden Board with Entrance Slide */}
        <div
          className={`relative z-10 w-full overflow-visible transition-all duration-300 ${dragModeActive && selectedElement === "sushiPlatter" ? "ring-4 ring-red-500 ring-offset-4 rounded-2xl" : ""}`}
          style={{
            transform: `translate(${layout.sushiPlatter.x}px, ${layout.sushiPlatter.y + 12}px) scale(${layout.sushiPlatter.scale}) rotate(${layout.sushiPlatter.rotate}deg)`,
            opacity: layout.sushiPlatter.opacity,
          }}
          onTouchStart={(e) => handleTouchStart("sushiPlatter", e)}
          onTouchMove={(e) => handleTouchMove("sushiPlatter", e)}
          onTouchEnd={handleTouchEnd}
          onClick={() => { if (dragModeActive) setSelectedElement("sushiPlatter"); }}
        >
          <img
            src="/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png"
            alt="Authentic Sushi Platter"
            className="w-full origin-bottom-left object-cover pointer-events-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.42)] animate-platter-entrance"
            loading="eager"
          />
        </div>
      </div>

      {/* --- FLOATING MOBILE CALIBRATOR TRIGGER BUTTON --- */}
      <div className="fixed bottom-5 right-5 z-[99] flex flex-col items-end gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => setCalibratorOpen(!calibratorOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-950/90 hover:bg-neutral-900 active:scale-95 text-white shadow-2xl border border-white/20 backdrop-blur-lg transition-all text-xs font-black tracking-wider uppercase cursor-pointer"
        >
          <span className="text-red-500 animate-spin">⚙️</span>
          <span>{calibratorOpen ? "Close Studio" : "🛠️ Mobile Studio"}</span>
        </button>
      </div>

      {/* --- MOBILE CALIBRATOR / POSITIONING & RESIZING DRAWER --- */}
      {calibratorOpen && (
        <div className="fixed inset-x-0 bottom-0 z-[100] bg-neutral-950/98 text-white rounded-t-3xl border-t border-white/15 p-5 shadow-[0_-15px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl max-h-[85vh] overflow-y-auto font-sans flex flex-col gap-4 animate-slide-up-modal">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-sm font-black tracking-wider uppercase text-white">
                Mobile Layout & Motion Studio
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReplayAnim}
                title="Replay Entrance Animation"
                className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold hover:bg-white/20 active:scale-90"
              >
                🔄 Replay
              </button>
              <button
                type="button"
                onClick={() => setCalibratorOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold hover:bg-white/20"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Touch Drag Mode Toggle */}
          <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">👆 Direct Touch Drag Mode</span>
              <span className="text-[10px] text-neutral-400">Touch & drag elements directly on screen</span>
            </div>
            <button
              type="button"
              onClick={() => setDragModeActive(!dragModeActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${dragModeActive ? "bg-red-600 text-white shadow-lg shadow-red-600/50" : "bg-neutral-800 text-neutral-300"}`}
            >
              {dragModeActive ? "ACTIVE (ON)" : "OFF"}
            </button>
          </div>

          {/* Element Selector Pills */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
              Select Element to Adjust:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {elementOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedElement(opt.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${selectedElement === opt.key ? "bg-red-600 text-white shadow-md shadow-red-600/40 scale-105" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls for Current Selected Element */}
          <div className="bg-neutral-900/90 rounded-2xl p-4 border border-white/10 flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-black uppercase text-red-400">
                Adjusting: {elementOptions.find((o) => o.key === selectedElement)?.label}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                X: {current.x}px | Y: {current.y}px | S: {current.scale}x
              </span>
            </div>

            {/* X Position */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Horizontal (X Position):</span>
                <span className="font-bold text-white">{current.x}px</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateSelected({ x: current.x - 2 })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={current.x}
                  onChange={(e) => updateSelected({ x: Number(e.target.value) })}
                  className="flex-1 accent-red-600 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => updateSelected({ x: current.x + 2 })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Y Position */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Vertical (Y Position):</span>
                <span className="font-bold text-white">{current.y}px</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateSelected({ y: current.y - 2 })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="1"
                  value={current.y}
                  onChange={(e) => updateSelected({ y: Number(e.target.value) })}
                  className="flex-1 accent-red-600 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => updateSelected({ y: current.y + 2 })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Scale / Size */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Scale / Size:</span>
                <span className="font-bold text-white">{current.scale.toFixed(2)}x</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateSelected({ scale: Math.max(0.3, current.scale - 0.02) })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.01"
                  value={current.scale}
                  onChange={(e) => updateSelected({ scale: Number(e.target.value) })}
                  className="flex-1 accent-red-600 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => updateSelected({ scale: Math.min(2.5, current.scale + 0.02) })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rotation / Tilt */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Rotation Angle:</span>
                <span className="font-bold text-white">{current.rotate.toFixed(1)}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateSelected({ rotate: current.rotate - 0.5 })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="0.5"
                  value={current.rotate}
                  onChange={(e) => updateSelected({ rotate: Number(e.target.value) })}
                  className="flex-1 accent-red-600 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => updateSelected({ rotate: current.rotate + 0.5 })}
                  className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Font Size (if applicable) */}
            {current.fontSize !== undefined && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">Font Size:</span>
                  <span className="font-bold text-white">{current.fontSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateSelected({ fontSize: (current.fontSize || 50) - 1 })}
                    className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="30"
                    max="160"
                    step="1"
                    value={current.fontSize}
                    onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
                    className="flex-1 accent-red-600 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => updateSelected({ fontSize: (current.fontSize || 50) + 1 })}
                    className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar (Save, Copy, Reset) */}
          <div className="grid grid-cols-3 gap-2 pt-1 pb-4">
            <button
              type="button"
              onClick={handleSave}
              className="py-3 bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-lg shadow-red-600/30 text-white"
            >
              💾 Save
            </button>
            <button
              type="button"
              onClick={handleCopyJSON}
              className="py-3 bg-neutral-800 hover:bg-neutral-700 active:scale-95 rounded-xl font-bold text-xs flex items-center justify-center gap-1 text-white"
            >
              📋 Copy JSON
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-3 bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 active:scale-95 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

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

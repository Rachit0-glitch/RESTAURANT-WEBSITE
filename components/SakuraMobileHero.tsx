"use client";

import React, { useEffect, useRef, useState } from "react";

export type MobileElementKey =
  | "header"
  | "tagline"
  | "headline"
  | "subtitle"
  | "ctaButton"
  | "watermark"
  | "sealStamp"
  | "sushiPlatter"
  | "tunaPieceLeft"
  | "tunaPieceRight"
  | "tunaPieceBottom"
  | "bgArtwork"
  | "floatingPetals";

export interface MobileElementState {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  fontSize?: number;
  width?: number;
  height?: number;
  visible?: boolean;
}

export type MobileHeroConfig = Record<MobileElementKey, MobileElementState>;

const DEFAULT_CONFIG: MobileHeroConfig = {
  header: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, visible: true },
  tagline: { x: 0, y: 0, scale: 1, rotate: -2.5, opacity: 1, visible: true },
  headline: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, fontSize: 54, visible: true },
  subtitle: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, visible: true },
  ctaButton: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, visible: true },
  watermark: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0.95, fontSize: 120, visible: true },
  sealStamp: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, visible: true },
  sushiPlatter: { x: 0, y: 0, scale: 1.15, rotate: 0, opacity: 1, visible: true },
  tunaPieceLeft: { x: -20, y: 140, scale: 0.7, rotate: 12, opacity: 0.95, visible: true },
  tunaPieceRight: { x: 260, y: 220, scale: 0.65, rotate: -15, opacity: 0.95, visible: true },
  tunaPieceBottom: { x: -10, y: 520, scale: 0.6, rotate: 5, opacity: 0.9, visible: true },
  bgArtwork: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0.35, visible: true },
  floatingPetals: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0.8, visible: true },
};

const ELEMENT_LABELS: Record<MobileElementKey, { label: string; icon: string }> = {
  sushiPlatter: { label: "Sushi Platter", icon: "🍱" },
  tunaPieceLeft: { label: "Floating Tuna (Left)", icon: "🐟" },
  tunaPieceRight: { label: "Floating Tuna (Right)", icon: "🍣" },
  tunaPieceBottom: { label: "Floating Tuna (Bottom)", icon: "🥢" },
  headline: { label: "Headline (AUTHENTIC...)", icon: "✍️" },
  tagline: { label: "Tagline Badge (最高の...)", icon: "🏷️" },
  subtitle: { label: "Subtitle Description", icon: "📄" },
  ctaButton: { label: "Explore Button", icon: "🔘" },
  watermark: { label: "SUSHI Watermark", icon: "🔠" },
  sealStamp: { label: "Red Seal Stamp", icon: "🔴" },
  bgArtwork: { label: "Pagoda / Koi Sketch", icon: "⛩️" },
  header: { label: "Top Header Logo", icon: "📱" },
  floatingPetals: { label: "Sakura Petals", icon: "🌸" },
};

export default function SakuraMobileHero({
  onExploreMenu,
  isHeroRevealed = true,
}: {
  onExploreMenu: () => void;
  isHeroRevealed?: boolean;
}) {
  const [config, setConfig] = useState<MobileHeroConfig>(DEFAULT_CONFIG);
  const [selectedKey, setSelectedKey] = useState<MobileElementKey>("sushiPlatter");
  const [isCalibratorOpen, setIsCalibratorOpen] = useState(false);
  const [isDragModeEnabled, setIsDragModeEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"position" | "animations" | "hierarchy">("position");
  const [ambientAnimation, setAmbientAnimation] = useState(true);
  const [animStage, setAnimStage] = useState<"idle" | "playing">("playing");
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load saved config from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sakura_mobile_hero_calibrator_v3");
      if (saved) {
        setConfig((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Trigger entrance animation on mount
  useEffect(() => {
    setAnimStage("playing");
  }, []);

  const replayAnimation = () => {
    setAnimStage("idle");
    setTimeout(() => {
      setAnimStage("playing");
    }, 50);
  };

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const updateSelected = (partial: Partial<MobileElementState>) => {
    setConfig((prev) => ({
      ...prev,
      [selectedKey]: {
        ...prev[selectedKey],
        ...partial,
      },
    }));
  };

  const toggleVisibility = (key: MobileElementKey) => {
    setConfig((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        visible: prev[key].visible === false ? true : false,
      },
    }));
  };

  const saveConfig = () => {
    try {
      localStorage.setItem("sakura_mobile_hero_calibrator_v3", JSON.stringify(config));
      showToast("✓ Layout Saved to LocalStorage!");
    } catch {
      // ignore
    }
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem("sakura_mobile_hero_calibrator_v3");
      showToast("↺ Layout Reset to Defaults");
    } catch {
      // ignore
    }
  };

  // Pointer drag handling for touch and mouse
  const dragStateRef = useRef<{
    key: MobileElementKey | null;
    startX: number;
    startY: number;
    initX: number;
    initY: number;
  }>({
    key: null,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const onPointerDown = (key: MobileElementKey, e: React.PointerEvent) => {
    if (!isDragModeEnabled) return;
    e.stopPropagation();
    setSelectedKey(key);

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    dragStateRef.current = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      initX: config[key].x,
      initY: config[key].y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStateRef.current.key) return;
    const currentKey = dragStateRef.current.key;
    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;

    setConfig((prev) => ({
      ...prev,
      [currentKey]: {
        ...prev[currentKey],
        x: Math.round(dragStateRef.current.initX + dx),
        y: Math.round(dragStateRef.current.initY + dy),
      },
    }));
  };

  const onPointerUp = () => {
    if (dragStateRef.current.key) {
      dragStateRef.current.key = null;
    }
  };

  const current = config[selectedKey];

  return (
    <section
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="relative w-full min-h-[100dvh] bg-[#f4eee5] overflow-hidden flex flex-col justify-between lg:hidden select-none font-sans touch-none"
      style={{ touchAction: isDragModeEnabled ? "none" : "auto" }}
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[999] bg-neutral-900/95 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/20">
          <span className="text-emerald-400 font-bold">✓</span> {copiedToast}
        </div>
      )}

      {/* Real-time Position HUD */}
      {isDragModeEnabled && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40 bg-black/80 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-2 shadow-lg border border-white/10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {ELEMENT_LABELS[selectedKey].icon} {ELEMENT_LABELS[selectedKey].label}: <b>X:{current.x}px</b>, <b>Y:{current.y}px</b>, <b>Scale:{current.scale}x</b>
          </span>
        </div>
      )}

      {/* --- 1. Background Artwork: Pagoda & Koi Sketch --- */}
      {config.bgArtwork.visible !== false && (
        <div
          onPointerDown={(e) => onPointerDown("bgArtwork", e)}
          className={`absolute inset-0 pointer-events-auto z-0 overflow-hidden cursor-grab active:cursor-grabbing transition-opacity duration-700 ${animStage === "playing" ? "opacity-100" : "opacity-0"}`}
          style={{
            transform: `translate(${config.bgArtwork.x}px, ${config.bgArtwork.y}px) scale(${config.bgArtwork.scale}) rotate(${config.bgArtwork.rotate}deg)`,
            opacity: config.bgArtwork.opacity,
          }}
        >
          <div
            className="absolute top-0 right-0 w-[340px] h-[480px] bg-no-repeat bg-contain bg-right-top"
            style={{
              backgroundImage: "url('/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png')",
              backgroundPosition: "85% 5%",
              backgroundSize: "260%",
            }}
          />
          <div
            className="absolute bottom-32 left-0 w-[240px] h-[240px] bg-no-repeat bg-contain bg-left-bottom opacity-40"
            style={{
              backgroundImage: "url('/sakura-assets/_assets/media/ba78b4a30520331745a674cd7d48884f.png')",
              backgroundPosition: "5% 85%",
              backgroundSize: "300%",
            }}
          />
        </div>
      )}

      {/* --- 2. Floating Animated Cherry Blossom Petals --- */}
      {config.floatingPetals.visible !== false && (
        <div
          onPointerDown={(e) => onPointerDown("floatingPetals", e)}
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          style={{
            transform: `translate(${config.floatingPetals.x}px, ${config.floatingPetals.y}px) scale(${config.floatingPetals.scale})`,
            opacity: config.floatingPetals.opacity,
          }}
        >
          <div className={`absolute top-16 right-16 w-4 h-3 bg-pink-300/70 rounded-full rotate-45 blur-[0.3px] ${ambientAnimation ? "animate-float-petal-1" : ""}`} />
          <div className={`absolute top-44 right-8 w-5 h-3.5 bg-pink-400/60 rounded-full -rotate-12 blur-[0.2px] ${ambientAnimation ? "animate-float-petal-2" : ""}`} />
          <div className={`absolute top-[380px] right-20 w-4 h-2.5 bg-pink-300/60 rounded-full rotate-[30deg] ${ambientAnimation ? "animate-float-petal-3" : ""}`} />
          <div className={`absolute top-[480px] left-8 w-4 h-3 bg-pink-400/50 rounded-full -rotate-45 ${ambientAnimation ? "animate-float-petal-1" : ""}`} />
        </div>
      )}

      {/* --- 3. FLOATING TUNA PIECES (Interactive Floating Fresh Tuna Nigiri Elements) --- */}
      {/* Floating Tuna Left */}
      {config.tunaPieceLeft.visible !== false && (
        <div
          onPointerDown={(e) => onPointerDown("tunaPieceLeft", e)}
          className={`absolute top-0 left-0 z-25 cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${selectedKey === "tunaPieceLeft" ? "ring-2 ring-red-500 ring-offset-2 rounded-2xl bg-red-500/10 p-1" : ""}`}
          style={{
            transform: `translate(${config.tunaPieceLeft.x}px, ${config.tunaPieceLeft.y}px) scale(${config.tunaPieceLeft.scale}) rotate(${config.tunaPieceLeft.rotate}deg)`,
            opacity: config.tunaPieceLeft.opacity,
          }}
        >
          <img
            src="/sakura-assets/_assets/media/b04f0772236c0166269f504ed52d6aa2.png"
            alt="Floating Fresh Tuna"
            className={`w-[180px] pointer-events-none drop-shadow-[0_18px_25px_rgba(0,0,0,0.28)] ${ambientAnimation ? "animate-float-petal-1" : ""}`}
          />
        </div>
      )}

      {/* Floating Tuna Right */}
      {config.tunaPieceRight.visible !== false && (
        <div
          onPointerDown={(e) => onPointerDown("tunaPieceRight", e)}
          className={`absolute top-0 left-0 z-25 cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${selectedKey === "tunaPieceRight" ? "ring-2 ring-red-500 ring-offset-2 rounded-2xl bg-red-500/10 p-1" : ""}`}
          style={{
            transform: `translate(${config.tunaPieceRight.x}px, ${config.tunaPieceRight.y}px) scale(${config.tunaPieceRight.scale}) rotate(${config.tunaPieceRight.rotate}deg)`,
            opacity: config.tunaPieceRight.opacity,
          }}
        >
          <img
            src="/sakura-assets/_assets/media/93855b7c7aeeca97d67876867446a9b1.png"
            alt="Floating Salmon & Tuna"
            className={`w-[160px] pointer-events-none drop-shadow-[0_20px_28px_rgba(0,0,0,0.3)] ${ambientAnimation ? "animate-float-petal-2" : ""}`}
          />
        </div>
      )}

      {/* Floating Tuna Bottom */}
      {config.tunaPieceBottom.visible !== false && (
        <div
          onPointerDown={(e) => onPointerDown("tunaPieceBottom", e)}
          className={`absolute top-0 left-0 z-25 cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${selectedKey === "tunaPieceBottom" ? "ring-2 ring-red-500 ring-offset-2 rounded-2xl bg-red-500/10 p-1" : ""}`}
          style={{
            transform: `translate(${config.tunaPieceBottom.x}px, ${config.tunaPieceBottom.y}px) scale(${config.tunaPieceBottom.scale}) rotate(${config.tunaPieceBottom.rotate}deg)`,
            opacity: config.tunaPieceBottom.opacity,
          }}
        >
          <img
            src="/sakura-assets/_assets/media/2036415e6c26b3751795e13146e6af46.png"
            alt="Floating Nigiri Piece"
            className={`w-[150px] pointer-events-none drop-shadow-[0_16px_22px_rgba(0,0,0,0.25)] ${ambientAnimation ? "animate-float-petal-3" : ""}`}
          />
        </div>
      )}

      {/* --- 4. Top Mobile Header Logo & Menu --- */}
      {config.header.visible !== false && (
        <header
          onPointerDown={(e) => onPointerDown("header", e)}
          className={`relative z-30 flex items-center justify-between px-4 sm:px-6 pt-5 sm:pt-7 pb-2 cursor-grab active:cursor-grabbing transition-all ${selectedKey === "header" ? "ring-2 ring-red-500/80 ring-offset-2 rounded-xl bg-red-500/10" : ""}`}
          style={{
            transform: `translate(${config.header.x}px, ${config.header.y}px) scale(${config.header.scale}) rotate(${config.header.rotate}deg)`,
            opacity: config.header.opacity,
          }}
        >
          <div className="flex items-center">
            <span className="text-[28px] sm:text-[32px] font-black tracking-[-0.04em] uppercase text-black font-sans leading-none">
              SUSHI
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle menu"
            className="flex flex-col justify-center items-end gap-[5px] p-2 cursor-pointer focus:outline-none"
          >
            <span className={`w-7 h-[2.5px] bg-black rounded-full transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`} />
            <span className={`w-7 h-[2.5px] bg-black rounded-full transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-7 h-[2.5px] bg-black rounded-full transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`} />
          </button>
        </header>
      )}

      {/* --- 5. Main Hero Typography & Content --- */}
      <div className="relative z-20 flex flex-col px-4 sm:px-6 pt-1 sm:pt-2 pb-0 pointer-events-auto">
        {/* Japanese Tagline Badge / Sticker */}
        {config.tagline.visible !== false && (
          <div
            onPointerDown={(e) => onPointerDown("tagline", e)}
            className={`self-start mb-2 sm:mb-3 cursor-grab active:cursor-grabbing transition-all ${selectedKey === "tagline" ? "ring-2 ring-red-500 ring-offset-2 rounded bg-red-500/10" : ""}`}
            style={{
              transform: `translate(${config.tagline.x}px, ${config.tagline.y}px) scale(${config.tagline.scale}) rotate(${config.tagline.rotate}deg)`,
              opacity: config.tagline.opacity,
            }}
          >
            <div
              className="inline-flex items-center bg-[#fffdfa] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-[2px] shadow-[0_4px_14px_rgba(0,0,0,0.09)] border border-black/5"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.06))" }}
            >
              <span className="text-[13px] sm:text-[14px] font-bold tracking-wider text-black">
                最高の<span className="text-[#e60012] font-black">寿司</span>盛り合わせ
              </span>
            </div>
          </div>
        )}

        {/* Massive Bold Hero Headline */}
        {config.headline.visible !== false && (
          <div
            onPointerDown={(e) => onPointerDown("headline", e)}
            className={`flex flex-col select-none cursor-grab active:cursor-grabbing transition-all ${selectedKey === "headline" ? "ring-2 ring-red-500 ring-offset-2 rounded-lg bg-red-500/10 p-1" : ""}`}
            style={{
              transform: `translate(${config.headline.x}px, ${config.headline.y}px) scale(${config.headline.scale}) rotate(${config.headline.rotate}deg)`,
              opacity: config.headline.opacity,
            }}
          >
            <h1
              className="flex flex-col font-black uppercase tracking-[-0.035em] leading-[0.88] text-black"
              style={{ fontSize: `clamp(36px, 11.5vw, ${config.headline.fontSize || 54}px)` }}
            >
              <span className={`inline-block transition-transform duration-500 ${animStage === "playing" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                AUTHENTIC
              </span>
              <span className={`inline-block transition-transform duration-500 delay-100 ${animStage === "playing" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                JAPANESE
              </span>
              <span className={`inline-block text-[#e60012] transition-transform duration-500 delay-200 ${animStage === "playing" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                DINING.
              </span>
            </h1>
          </div>
        )}

        {/* Subtitle Description */}
        {config.subtitle.visible !== false && (
          <div
            onPointerDown={(e) => onPointerDown("subtitle", e)}
            className={`mt-3 sm:mt-4 max-w-[280px] sm:max-w-[320px] cursor-grab active:cursor-grabbing transition-all ${selectedKey === "subtitle" ? "ring-2 ring-red-500 ring-offset-2 rounded-md bg-red-500/10 p-1" : ""}`}
            style={{
              transform: `translate(${config.subtitle.x}px, ${config.subtitle.y}px) scale(${config.subtitle.scale}) rotate(${config.subtitle.rotate}deg)`,
              opacity: config.subtitle.opacity,
            }}
          >
            <p className="text-[#4a4a4a] text-[13.5px] sm:text-[15px] leading-snug font-medium">
              Fresh sashimi, handcrafted nigiri, and traditional seasonal dishes.
            </p>
          </div>
        )}

        {/* Explore Menu CTA Button */}
        {config.ctaButton.visible !== false && (
          <div
            onPointerDown={(e) => onPointerDown("ctaButton", e)}
            className={`mt-4 sm:mt-5 self-start cursor-grab active:cursor-grabbing transition-all ${selectedKey === "ctaButton" ? "ring-2 ring-red-500 ring-offset-4 rounded-full" : ""}`}
            style={{
              transform: `translate(${config.ctaButton.x}px, ${config.ctaButton.y}px) scale(${config.ctaButton.scale}) rotate(${config.ctaButton.rotate}deg)`,
              opacity: config.ctaButton.opacity,
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onExploreMenu();
              }}
              className="inline-flex items-center gap-2.5 sm:gap-3 bg-black hover:bg-neutral-900 active:scale-95 text-white rounded-full px-6 sm:px-7 py-3 sm:py-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-200 cursor-pointer"
            >
              <span className="text-[11px] sm:text-[12px] font-black tracking-[0.2em] uppercase text-white">
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
        )}
      </div>

      {/* --- 6. Lower Stage: SUSHI Watermark + Seal Stamp + Platter --- */}
      <div className="relative z-10 w-full mt-2 flex flex-col justify-end overflow-visible">
        {/* Giant "SUSHI" Watermark Typography */}
        {config.watermark.visible !== false && (
          <div
            onPointerDown={(e) => onPointerDown("watermark", e)}
            className={`absolute right-2 top-0 z-0 select-none cursor-grab active:cursor-grabbing transition-all ${selectedKey === "watermark" ? "ring-2 ring-red-500 ring-offset-2 rounded-lg" : ""}`}
            style={{
              transform: `translate(${config.watermark.x}px, ${config.watermark.y - 18}%) scale(${config.watermark.scale}) rotate(${config.watermark.rotate}deg)`,
              opacity: config.watermark.opacity,
            }}
          >
            <span
              className="font-black uppercase tracking-[-0.04em] text-[#1c1c1c] leading-none block"
              style={{ fontSize: `${config.watermark.fontSize || 120}px` }}
            >
              SUSHI
            </span>
          </div>
        )}

        {/* Traditional Japanese Seal Stamp on Left */}
        {config.sealStamp.visible !== false && (
          <div
            onPointerDown={(e) => onPointerDown("sealStamp", e)}
            className={`absolute left-5 top-12 z-20 flex flex-col items-center select-none cursor-grab active:cursor-grabbing transition-all ${selectedKey === "sealStamp" ? "ring-2 ring-red-500 ring-offset-2 rounded-md bg-red-500/10 p-1" : ""}`}
            style={{
              transform: `translate(${config.sealStamp.x}px, ${config.sealStamp.y}px) scale(${config.sealStamp.scale}) rotate(${config.sealStamp.rotate}deg)`,
              opacity: config.sealStamp.opacity,
            }}
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
        )}

        {/* High-Resolution Sushi Platter on Wooden Board */}
        {config.sushiPlatter.visible !== false && (
          <div
            onPointerDown={(e) => onPointerDown("sushiPlatter", e)}
            className={`relative z-10 w-full overflow-visible cursor-grab active:cursor-grabbing transition-all ${selectedKey === "sushiPlatter" ? "ring-4 ring-red-500/80 ring-offset-4 rounded-3xl" : ""}`}
            style={{
              transform: `translate(${config.sushiPlatter.x}px, ${config.sushiPlatter.y + 12}px) scale(${config.sushiPlatter.scale}) rotate(${config.sushiPlatter.rotate}deg)`,
              opacity: config.sushiPlatter.opacity,
            }}
          >
            <img
              src="/sakura-assets/_assets/media/2cccb1d8bca202e0ae7adde1a1d5d489.png"
              alt="Authentic Sushi Platter"
              className={`w-full origin-bottom-left object-cover pointer-events-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.42)] ${ambientAnimation ? "hover:scale-[1.02] transition-transform duration-500" : ""}`}
              loading="eager"
            />
          </div>
        )}
      </div>

      {/* --- FLOATING CONTROLLER DOCK --- */}
      <div className="fixed bottom-4 right-4 z-[99] flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={replayAnimation}
          title="Replay Entrance Animation"
          className="w-10 h-10 rounded-full bg-neutral-900/90 text-white flex items-center justify-center text-sm shadow-xl border border-white/20 backdrop-blur-md active:scale-90"
        >
          ▶️
        </button>
        <button
          type="button"
          onClick={() => setIsCalibratorOpen(!isCalibratorOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-950/95 text-white shadow-2xl border border-white/20 backdrop-blur-lg active:scale-95 text-xs font-black tracking-wider uppercase"
        >
          <span className="text-red-500">🛠️</span>
          <span>{isCalibratorOpen ? "Close Studio" : "Mobile Studio"}</span>
        </button>
      </div>

      {/* --- INTERACTIVE MOBILE CALIBRATOR DRAWER --- */}
      {isCalibratorOpen && (
        <div className="fixed inset-x-0 bottom-0 z-[100] bg-neutral-950/98 text-white rounded-t-3xl border-t border-white/15 p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl max-h-[85vh] overflow-y-auto flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-xs font-black tracking-widest uppercase text-white">
                Mobile Layout & Tuna Calibrator
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={replayAnimation}
                className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold hover:bg-white/20 active:scale-95"
              >
                ▶ Replay
              </button>
              <button
                type="button"
                onClick={() => setIsCalibratorOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("position")}
              className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === "position" ? "bg-red-600 text-white" : "text-neutral-400"}`}
            >
              📍 Position & Size
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hierarchy")}
              className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === "hierarchy" ? "bg-red-600 text-white" : "text-neutral-400"}`}
            >
              👁️ Show / Hide Elements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("animations")}
              className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === "animations" ? "bg-red-600 text-white" : "text-neutral-400"}`}
            >
              ✨ Animations
            </button>
          </div>

          {/* TAB 1: Position & Dragging */}
          {activeTab === "position" && (
            <div className="flex flex-col gap-3">
              {/* Drag Mode Toggle */}
              <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">👆 Direct Screen Dragging</span>
                  <span className="text-[10px] text-neutral-400">Touch & drag elements directly on screen</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDragModeEnabled(!isDragModeEnabled)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-colors ${isDragModeEnabled ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/40" : "bg-neutral-800 text-neutral-400"}`}
                >
                  {isDragModeEnabled ? "ENABLED" : "DISABLED"}
                </button>
              </div>

              {/* Element Selector Pills */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Select Element to Adjust:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {(Object.keys(ELEMENT_LABELS) as MobileElementKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSelectedKey(k)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${selectedKey === k ? "bg-red-600 text-white shadow-md shadow-red-600/40 scale-105" : "bg-neutral-800 text-neutral-300"}`}
                    >
                      <span>{ELEMENT_LABELS[k].icon}</span>
                      <span>{ELEMENT_LABELS[k].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Sliders & Step Buttons */}
              <div className="bg-neutral-900/90 rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-black uppercase text-red-400">
                    {ELEMENT_LABELS[selectedKey].icon} {ELEMENT_LABELS[selectedKey].label}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    X: {current.x}px | Y: {current.y}px | S: {current.scale}x
                  </span>
                </div>

                {/* X Position */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-400">X Position (Horizontal):</span>
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
                      max="350"
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
                    <span className="text-neutral-400">Y Position (Vertical):</span>
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
                      min="-200"
                      max="700"
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

                {/* Scale */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-400">Scale / Size:</span>
                    <span className="font-bold text-white">{current.scale.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSelected({ scale: Math.max(0.2, current.scale - 0.02) })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 active:bg-red-600 font-black text-sm flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.2"
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

                {/* Rotation */}
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
              </div>
            </div>
          )}

          {/* TAB 2: Hierarchy & Element Toggles (Remove/Show Unwanted Elements) */}
          {activeTab === "hierarchy" && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs text-neutral-300">
                Toggle elements ON or OFF to clean up mobile hierarchy:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(ELEMENT_LABELS) as MobileElementKey[]).map((k) => (
                  <div
                    key={k}
                    className="flex items-center justify-between bg-white/5 px-3 py-2.5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <span>{ELEMENT_LABELS[k].icon}</span>
                      <span className="text-xs font-bold text-white">{ELEMENT_LABELS[k].label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(k)}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-colors ${config[k].visible !== false ? "bg-emerald-600 text-white" : "bg-neutral-800 text-neutral-500"}`}
                    >
                      {config[k].visible !== false ? "VISIBLE" : "HIDDEN"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Animation Settings */}
          {activeTab === "animations" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">🌸 Floating Tuna & Petals Motion</span>
                  <span className="text-[10px] text-neutral-400">Continuous gentle floating & breeze physics</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAmbientAnimation(!ambientAnimation)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black ${ambientAnimation ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400"}`}
                >
                  {ambientAnimation ? "ON" : "OFF"}
                </button>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl flex flex-col gap-3">
                <span className="text-xs font-bold text-white">🎬 Replay Entrance Sequence</span>
                <button
                  type="button"
                  onClick={replayAnimation}
                  className="py-3 bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
                >
                  <span>▶️ Trigger Full Entrance Animation</span>
                </button>
              </div>
            </div>
          )}

          {/* Global Action Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={saveConfig}
              className="py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-lg text-white"
            >
              💾 Save
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                showToast("✓ Copied JSON Config!");
              }}
              className="py-3 bg-neutral-800 hover:bg-neutral-700 active:scale-95 rounded-xl font-bold text-xs flex items-center justify-center gap-1 text-white"
            >
              📋 Copy JSON
            </button>
            <button
              type="button"
              onClick={resetConfig}
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

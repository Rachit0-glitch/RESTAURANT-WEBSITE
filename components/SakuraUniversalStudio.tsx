"use client";

import React, { useEffect, useRef, useState } from "react";
import SakuraExperience from "./SakuraExperience";
import SakuraMobileHero from "./SakuraMobileHero";

export type DeviceMode =
  | "responsive"
  | "iphone"
  | "iphone-landscape"
  | "ipad"
  | "laptop"
  | "desktop"
  | "multi-grid";

interface DevicePreset {
  id: DeviceMode;
  name: string;
  icon: string;
  width: number;
  height: number;
  isLandscape?: boolean;
}

const DEVICE_PRESETS: DevicePreset[] = [
  { id: "responsive", name: "Responsive (Native)", icon: "🌐", width: 0, height: 0 },
  { id: "iphone", name: "iPhone 15 Pro", icon: "📱", width: 393, height: 852 },
  { id: "iphone-landscape", name: "iPhone Landscape", icon: "📲", width: 852, height: 393, isLandscape: true },
  { id: "ipad", name: "iPad Air 10.9\"", icon: "📟", width: 820, height: 1180 },
  { id: "laptop", name: "MacBook Laptop", icon: "💻", width: 1366, height: 860 },
  { id: "desktop", name: "Desktop (1080p)", icon: "🖥️", width: 1920, height: 1080 },
  { id: "multi-grid", name: "Multi-Device Grid", icon: "🔀", width: 0, height: 0 },
];

export default function SakuraUniversalStudio() {
  const [activeDevice, setActiveDevice] = useState<DeviceMode>("iphone");
  const [zoomLevel, setZoomLevel] = useState<number>(0.9);
  const [showBezel, setShowBezel] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const selectedPreset = DEVICE_PRESETS.find((p) => p.id === activeDevice) || DEVICE_PRESETS[0];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-[#0f0f12] text-neutral-200" : "bg-[#f5f5f7] text-neutral-800"} font-sans select-none`}>
      {/* Toast Alert */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] bg-neutral-900/95 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span> {copiedToast}
        </div>
      )}

      {/* --- TOP STUDIO CONTROL BAR --- */}
      <header className="sticky top-0 z-50 bg-[#16161b]/95 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Brand & Mode Title */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1.5 rounded-xl border border-red-500/30 text-xs font-bold hover:bg-red-600/30 transition-colors"
          >
            ← Back to Site
          </a>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h1 className="text-sm font-black tracking-wider uppercase text-white">
              Multi-Device Visual Studio
            </h1>
          </div>
        </div>

        {/* Device Switcher Segmented Buttons */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          {DEVICE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActiveDevice(preset.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeDevice === preset.id ? "bg-red-600 text-white shadow-md shadow-red-600/40" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
            >
              <span>{preset.icon}</span>
              <span className="hidden sm:inline">{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Studio Utilities (Zoom, Bezel, Refresh) */}
        <div className="flex items-center gap-2">
          {activeDevice !== "responsive" && activeDevice !== "multi-grid" && (
            <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 text-xs font-mono">
              <span className="text-neutral-400">Zoom:</span>
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(0.4, zoomLevel - 0.1))}
                className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="w-9 text-center font-bold text-white">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
                className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          )}

          {activeDevice !== "responsive" && activeDevice !== "multi-grid" && (
            <button
              type="button"
              onClick={() => setShowBezel(!showBezel)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${showBezel ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-white/10 text-neutral-400"}`}
            >
              {showBezel ? "🖼️ Frame: ON" : "Frame: OFF"}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const url = window.location.origin;
              navigator.clipboard.writeText(url);
              showToast("✓ Copied Live Site URL!");
            }}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-xs font-bold text-white border border-white/10"
          >
            🔗 Share Link
          </button>
        </div>
      </header>

      {/* --- STUDIO CANVAS VIEWPORT AREA --- */}
      <main className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center relative">
        {/* 1. NATIVE RESPONSIVE VIEW */}
        {activeDevice === "responsive" && (
          <div className="w-full min-h-screen">
            <SakuraExperience />
          </div>
        )}

        {/* 2. MULTI-DEVICE SPLIT GRID VIEW */}
        {activeDevice === "multi-grid" && (
          <div className="w-full max-w-7xl py-6 flex flex-col gap-8 items-center">
            <div className="text-center">
              <h2 className="text-xl font-black uppercase text-white tracking-wide">
                Live Multi-Device Synchronized Preview
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Preview your restaurant website simultaneously on Mobile, Tablet, and Desktop!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
              {/* Column 1: Mobile */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  📱 Mobile (iPhone 15 Pro)
                </span>
                <div
                  className="rounded-[36px] overflow-hidden border-[6px] border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-[#f4eee5]"
                  style={{ width: "360px", height: "720px" }}
                >
                  <iframe
                    src="/"
                    title="Mobile View"
                    className="w-full h-full border-0 pointer-events-auto"
                  />
                </div>
              </div>

              {/* Column 2: Tablet */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  📟 Tablet (iPad Air)
                </span>
                <div
                  className="rounded-[28px] overflow-hidden border-[6px] border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-[#f4eee5]"
                  style={{ width: "420px", height: "600px" }}
                >
                  <iframe
                    src="/"
                    title="Tablet View"
                    className="w-full h-full border-0 pointer-events-auto"
                  />
                </div>
              </div>

              {/* Column 3: Desktop */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  💻 Desktop / Laptop
                </span>
                <div
                  className="rounded-[20px] overflow-hidden border-[6px] border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-[#f4eee5]"
                  style={{ width: "450px", height: "300px" }}
                >
                  <iframe
                    src="/"
                    title="Desktop View"
                    className="w-full h-full border-0 pointer-events-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. INDIVIDUAL DEVICE SIMULATOR FRAME */}
        {activeDevice !== "responsive" && activeDevice !== "multi-grid" && (
          <div
            className="transition-all duration-300 flex flex-col items-center"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center top",
            }}
          >
            {/* Device Dimension Badge */}
            <div className="mb-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-neutral-400 border border-white/10 flex items-center gap-2">
              <span className="text-white font-bold">{selectedPreset.name}</span>
              <span>•</span>
              <span>{selectedPreset.width}px × {selectedPreset.height}px</span>
            </div>

            {/* Realistic Device Mockup Frame */}
            <div
              className={`relative overflow-hidden transition-all duration-300 ${showBezel ? (selectedPreset.id.includes("iphone") ? "rounded-[48px] border-[10px] border-[#1e1e24] shadow-[0_25px_70px_rgba(0,0,0,0.7)]" : selectedPreset.id === "ipad" ? "rounded-[32px] border-[12px] border-[#25252b] shadow-[0_25px_70px_rgba(0,0,0,0.7)]" : "rounded-[16px] border-[10px] border-[#2d2d35] shadow-[0_25px_70px_rgba(0,0,0,0.7)]") : "rounded-none border border-white/20 shadow-2xl"}`}
              style={{
                width: `${selectedPreset.width}px`,
                height: `${selectedPreset.height}px`,
                backgroundColor: "#f4eee5",
              }}
            >
              {/* iPhone Dynamic Island / Speaker cutout */}
              {showBezel && selectedPreset.id === "iphone" && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-24 h-6 bg-black rounded-full pointer-events-none flex items-center justify-end px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800" />
                </div>
              )}

              {/* Embedded Site Frame with Live Interactive Calibration Tool */}
              <iframe
                src="/"
                title={selectedPreset.name}
                className="w-full h-full border-0 pointer-events-auto"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

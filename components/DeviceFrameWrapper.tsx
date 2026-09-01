"use client";

import React, { useState, useEffect } from "react";

export type DeviceMode = "fullscreen" | "tablet" | "mobile";

export default function DeviceFrameWrapper({ children }: { children: React.ReactNode }) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("fullscreen");
  const [zoomLevel, setZoomLevel] = useState<number>(0.65);
  const [isInsideIframe, setIsInsideIframe] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.self !== window.top) {
        setIsInsideIframe(true);
      }
    } catch {
      setIsInsideIframe(true);
    }
  }, []);

  // When inside the simulated iframe, render content directly with zero outer shell
  if (isInsideIframe) {
    return <>{children}</>;
  }

  const isTablet = deviceMode === "tablet";
  const frameWidth = isTablet ? 820 : 390;
  const frameHeight = isTablet ? 1100 : 844;

  const handleModeChange = (mode: DeviceMode) => {
    setDeviceMode(mode);
    if (mode === "tablet") setZoomLevel(0.65);
    else if (mode === "mobile") setZoomLevel(0.85);
    setIframeKey((prev) => prev + 1);
  };

  if (deviceMode === "fullscreen") {
    return (
      <div className="relative w-full min-h-screen">
        {/* Floating Top Device Simulator Switcher */}
        <div className="fixed top-4 right-4 z-[9999] bg-neutral-900/90 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-2xl flex items-center gap-1.5 text-xs text-white">
          <button
            type="button"
            onClick={() => handleModeChange("fullscreen")}
            className="px-3 py-1 rounded-full font-bold bg-white text-black shadow transition-all cursor-pointer"
          >
            💻 Laptop (Full)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("tablet")}
            className="px-3 py-1 rounded-full font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            📟 iPad Tablet (820px)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("mobile")}
            className="px-3 py-1 rounded-full font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            📱 iPhone Mobile (390px)
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center py-4 px-4 select-none overflow-x-hidden">
      {/* Floating Top Device Simulator Switcher & Zoom Controls */}
      <div className="sticky top-2 z-[9999] mb-4 bg-neutral-900/95 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-2xl flex items-center gap-2 text-xs text-white">
        {/* Device Switcher */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleModeChange("fullscreen")}
            className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
              deviceMode === "fullscreen" ? "bg-white text-black shadow" : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            💻 Laptop (Full)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("tablet")}
            className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
              deviceMode === "tablet" ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            📟 iPad Tablet (820px)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("mobile")}
            className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
              deviceMode === "mobile" ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            📱 iPhone Mobile (390px)
          </button>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-white/20" />

        {/* Zoom Level Pills */}
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-full border border-white/10 text-[11px]">
          <span className="text-neutral-400 px-1.5 font-medium">Scale:</span>
          {[
            { label: "Fit Screen (65%)", val: 0.65 },
            { label: "75%", val: 0.75 },
            { label: "100%", val: 1.0 },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => setZoomLevel(item.val)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                zoomLevel === item.val
                  ? "bg-amber-400 text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outer Scaled Container so page doesn't have excess scroll */}
      <div
        className="flex items-start justify-center transition-all duration-300"
        style={{
          width: `${(frameWidth + 32) * zoomLevel}px`,
          height: `${(frameHeight + 80) * zoomLevel}px`,
        }}
      >
        {/* Simulated Device Frame with Scale Transform */}
        <div
          className="relative bg-neutral-900 rounded-[48px] p-3.5 shadow-[0_30px_90px_rgba(0,0,0,0.95)] border-[5px] border-neutral-700/80 transition-all duration-300"
          style={{
            width: `${frameWidth + 28}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
          }}
        >
          {/* Device Notch / Camera / Speaker */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-800 rounded-full flex items-center justify-center gap-2 z-50 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700" />
            <div className="w-12 h-1 rounded-full bg-neutral-950" />
          </div>

          {/* Screen Iframe Container */}
          <div
            className="relative bg-white rounded-[36px] overflow-hidden shadow-inner"
            style={{
              width: `${frameWidth}px`,
              height: `${frameHeight}px`,
              maxWidth: "100%",
            }}
          >
            <iframe
              key={iframeKey}
              src="/"
              title={`${deviceMode} preview`}
              className="w-full h-full border-0 bg-white"
              style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
            />
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1 bg-white/40 rounded-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

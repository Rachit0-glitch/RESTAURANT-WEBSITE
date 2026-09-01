"use client";

import React, { useState, useEffect } from "react";
import { useLayoutEditor } from "../context/LayoutEditorContext";

export default function DeviceFrameWrapper({ children }: { children: React.ReactNode }) {
  const { activeDevice } = useLayoutEditor();
  const [isInsideIframe, setIsInsideIframe] = useState<boolean>(false);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 1440,
    height: 900,
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.self !== window.top) {
        setIsInsideIframe(true);
      }
    } catch {
      setIsInsideIframe(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inside the simulated iframe, render content directly with real device media queries
  if (isInsideIframe) {
    return <>{children}</>;
  }

  // If in desktop mode on main window, render full width
  if (activeDevice === "desktop") {
    return <div className="relative w-full min-h-screen">{children}</div>;
  }

  const isTablet = activeDevice === "tablet";
  const frameWidth = isTablet ? 820 : 390;
  const frameHeight = isTablet ? 1100 : 844;

  // Auto-fit calculations so tablet & mobile frames fit 100% within laptop viewport without scrolling
  const bezelPadding = 28;
  const totalFrameWidth = frameWidth + bezelPadding;
  const totalFrameHeight = frameHeight + bezelPadding;

  const availableHeight = Math.max(400, viewportSize.height - 110);
  const availableWidth = Math.max(300, viewportSize.width - 80);

  const maxScaleByHeight = availableHeight / totalFrameHeight;
  const maxScaleByWidth = availableWidth / totalFrameWidth;

  const calculatedZoom = Math.min(
    isTablet ? 0.75 : 0.9,
    maxScaleByHeight,
    maxScaleByWidth
  );
  const activeZoom = Math.max(0.35, Math.min(1.0, Number(calculatedZoom.toFixed(2))));

  return (
    <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center p-4 select-none overflow-hidden fixed inset-0">
      {/* Scaled Device Container */}
      <div
        className="flex items-center justify-center transition-all duration-300 relative"
        style={{
          width: `${totalFrameWidth * activeZoom}px`,
          height: `${totalFrameHeight * activeZoom}px`,
        }}
      >
        {/* Device Hardware Bezel */}
        <div
          className="relative bg-neutral-900 rounded-[48px] p-3.5 shadow-[0_30px_90px_rgba(0,0,0,0.95)] border-[5px] border-neutral-700/80 transition-all duration-300 origin-center"
          style={{
            width: `${totalFrameWidth}px`,
            height: `${totalFrameHeight}px`,
            transform: `scale(${activeZoom})`,
          }}
        >
          {/* Device Camera / Speaker Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-800 rounded-full flex items-center justify-center gap-2 z-50 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 border border-neutral-700" />
            <div className="w-12 h-1 rounded-full bg-neutral-950" />
          </div>

          {/* Screen Content via Iframe for True Viewport Media Queries */}
          <div
            className="relative bg-white rounded-[36px] overflow-hidden shadow-inner w-full h-full"
            style={{
              width: `${frameWidth}px`,
              height: `${frameHeight}px`,
            }}
          >
            <iframe
              key={`device-preview-${activeDevice}`}
              src="/"
              title={`${activeDevice} preview`}
              className="w-full h-full border-0 bg-white"
              style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
            />
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1 bg-white/40 rounded-full pointer-events-none z-50" />
        </div>
      </div>
    </div>
  );
}

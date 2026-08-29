"use client";

import React, { useState } from "react";

export type PoseConfig = {
  startY: number;
  startX: number;
  startScale: number;
  startOpacity: number;
  startBlur: number;

  endY: number;
  endX: number;
  endScale: number;
  endOpacity: number;

  duration: number; // seconds
  delay: number; // seconds
  easing: string;
};

export type MotionStudioConfig = {
  sushi: PoseConfig;
  platter: PoseConfig;
  mode: "animate" | "start" | "end" | "scrub";
  scrubProgress: number; // 0 to 100
};

export const DEFAULT_STUDIO_CONFIG: MotionStudioConfig = {
  sushi: {
    startY: 425,
    startX: -10,
    startScale: 0.36,
    startOpacity: 0,
    startBlur: 8,

    endY: 60,
    endX: 0,
    endScale: 1.0,
    endOpacity: 1,

    duration: 0.95,
    delay: 0.82,
    easing: "cubic-bezier(0.08, 0.98, 0.2, 1)",
  },
  platter: {
    startY: 40,
    startX: 0,
    startScale: 1.38,
    startOpacity: 0,
    startBlur: 10,

    endY: 0,
    endX: 0,
    endScale: 1.0,
    endOpacity: 1,

    duration: 1.1,
    delay: 0.08,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  mode: "animate",
  scrubProgress: 100,
};

export default function HeroMotionCalibrator({
  config,
  onChange,
  onReplay,
  dishMode = "solid",
  onSetDishMode,
}: {
  config: MotionStudioConfig;
  onChange: (updated: MotionStudioConfig) => void;
  onReplay: () => void;
  dishMode?: "solid" | "ghost" | "hidden";
  onSetDishMode?: (mode: "solid" | "ghost" | "hidden") => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTarget, setActiveTarget] = useState<"platter" | "sushi">("platter");
  const [activeTab, setActiveTab] = useState<"start" | "end" | "timing">("start");
  const [copied, setCopied] = useState(false);

  const currentPose = activeTarget === "sushi" ? config.sushi : config.platter;

  const updateTargetPose = (partial: Partial<PoseConfig>) => {
    if (activeTarget === "sushi") {
      onChange({
        ...config,
        sushi: { ...config.sushi, ...partial },
      });
    } else {
      onChange({
        ...config,
        platter: { ...config.platter, ...partial },
      });
    }
  };

  const updateGlobal = (partial: Partial<MotionStudioConfig>) => {
    onChange({ ...config, ...partial });
  };

  const handleTabChange = (tab: "start" | "end" | "timing") => {
    setActiveTab(tab);
    if (tab === "start") updateGlobal({ mode: "start" });
    else if (tab === "end") updateGlobal({ mode: "end" });
  };

  const handleCopy = () => {
    const cssCode = `/* Calibrated SUSHI Motion Parameters */
@keyframes hero-sushi-custom {
  0% {
    opacity: ${config.sushi.startOpacity};
    transform: translate3d(${config.sushi.startX}px, ${config.sushi.startY}px, 0) scale(${config.sushi.startScale});
    filter: blur(${config.sushi.startBlur}px);
  }
  100% {
    opacity: ${config.sushi.endOpacity};
    transform: translate3d(${config.sushi.endX}px, ${config.sushi.endY}px, 0) scale(${config.sushi.endScale});
    filter: blur(0);
  }
}

.hero-animate-title {
  animation: hero-sushi-custom ${config.sushi.duration}s ${config.sushi.easing} ${config.sushi.delay}s both;
}

/* Calibrated Platter (Dish) Motion Parameters */
@keyframes hero-platter-custom {
  0% {
    opacity: ${config.platter.startOpacity};
    transform: translate3d(${config.platter.startX}px, ${config.platter.startY}px, 0) scale(${config.platter.startScale});
    filter: blur(${config.platter.startBlur}px);
  }
  100% {
    opacity: ${config.platter.endOpacity};
    transform: translate3d(${config.platter.endX}px, ${config.platter.endY}px, 0) scale(${config.platter.endScale});
    filter: blur(0);
  }
}

.hero-animate-platter {
  animation: hero-platter-custom ${config.platter.duration}s ${config.platter.easing} ${config.platter.delay}s both;
}`;

    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "Smooth Exponential (Settle)", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
    { label: "Extreme Speed-Ramp", value: "cubic-bezier(0.08, 0.98, 0.2, 1)" },
    { label: "Punchy Elastic Snap", value: "cubic-bezier(0.2, 1.25, 0.25, 1)" },
    { label: "Gentle Natural Ease", value: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-[999999] font-mono text-xs select-none">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="flex items-center gap-2.5 bg-[#0e0d0c] hover:bg-[#e60012] text-white border border-white/20 px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-bold uppercase tracking-wider"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#e60012] animate-pulse" />
          <span>Motion Studio</span>
        </button>
      </div>
    );
  }

  // Minimized Compact Bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-[999999] font-mono text-xs select-none">
        <div className="flex items-center gap-3 bg-[#0d0c0b]/95 backdrop-blur-2xl border border-white/20 text-white shadow-[0_15px_40px_rgba(0,0,0,0.8)] px-4 py-2.5 rounded-full">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e60012]" />
            <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-200">
              Motion Studio
            </span>
          </div>

          <div className="h-4 w-px bg-white/15" />

          {/* Quick Play Button */}
          <button
            type="button"
            onClick={onReplay}
            style={{ backgroundColor: "#e60012" }}
            className="px-3 py-1 rounded-full bg-[#e60012] hover:bg-[#ff1a2d] text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-all active:scale-95 flex items-center gap-1"
          >
            <span>▶</span>
            <span>Test Animation</span>
          </button>

          {/* Target Switcher Pill */}
          <button
            type="button"
            onClick={() => setActiveTarget(activeTarget === "platter" ? "sushi" : "platter")}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-[10px] font-bold uppercase tracking-wider text-neutral-300 cursor-pointer"
          >
            Target: {activeTarget === "platter" ? "🍱 Platter" : "🍣 Sushi Text"}
          </button>

          <div className="h-4 w-px bg-white/15" />

          {/* Maximize & Close */}
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            title="Expand Panel"
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-xs"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            title="Close Panel"
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-[999999] font-mono text-xs select-none">
      <div className="w-84 sm:w-96 rounded-2xl bg-[#0d0c0b]/95 backdrop-blur-2xl border border-white/20 text-white shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 sm:p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e60012]" />
            <span className="font-bold tracking-wider uppercase text-white">
              Hero Motion Studio
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              title="Minimize to floating bar"
              className="text-neutral-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer text-sm font-bold leading-none"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Close"
              className="text-neutral-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Target Element Selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-neutral-400">
            Select Element to Calibrate
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTarget("platter")}
              className={`py-2 rounded-lg font-bold text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTarget === "platter"
                  ? "bg-amber-600 text-white shadow-lg"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>🍱</span>
              <span>Sushi Platter (Dish)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTarget("sushi")}
              className={`py-2 rounded-lg font-bold text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTarget === "sushi"
                  ? "bg-[#e60012] text-white shadow-lg"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>🍣</span>
              <span>SUSHI Text</span>
            </button>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => handleTabChange("start")}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              config.mode === "start"
                ? "bg-amber-600 text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Start Pose
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("end")}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              config.mode === "end"
                ? "bg-emerald-600 text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            End Pose
          </button>
          <button
            type="button"
            onClick={() => updateGlobal({ mode: "scrub" })}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              config.mode === "scrub"
                ? "bg-blue-600 text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Scrub
          </button>
          <button
            type="button"
            onClick={onReplay}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              config.mode === "animate"
                ? "bg-[#e60012] text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            ▶ Play
          </button>
        </div>

        {/* Scrub Slider */}
        {config.mode === "scrub" && (
          <div className="space-y-1.5 bg-blue-950/30 border border-blue-500/30 p-3 rounded-xl">
            <div className="flex justify-between text-blue-300 font-bold">
              <span>Timeline Scrubber</span>
              <span>{config.scrubProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.scrubProgress}
              onChange={(e) => updateGlobal({ scrubProgress: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleTabChange("start")}
            className={`pb-2 px-2 transition-all font-semibold cursor-pointer ${
              activeTab === "start"
                ? "text-[#e60012] border-b-2 border-[#e60012]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {activeTarget === "platter" ? "Platter Start (Big)" : "Sushi Start"}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("end")}
            className={`pb-2 px-2 transition-all font-semibold cursor-pointer ${
              activeTab === "end"
                ? "text-[#e60012] border-b-2 border-[#e60012]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {activeTarget === "platter" ? "Platter End (Original)" : "Sushi End"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timing")}
            className={`pb-2 px-2 transition-all font-semibold cursor-pointer ${
              activeTab === "timing"
                ? "text-[#e60012] border-b-2 border-[#e60012]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Timing &amp; Ease
          </button>
        </div>

        {/* TAB 1: Start Position Controls */}
        {activeTab === "start" && (
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Start Scale (Size)</span>
                <span className="text-[#e60012] font-bold">{currentPose.startScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.02"
                value={currentPose.startScale}
                onChange={(e) => {
                  updateTargetPose({ startScale: Number(e.target.value) });
                  updateGlobal({ mode: "start" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Start Y (Down/Up)</span>
                <span className="text-[#e60012] font-bold">{currentPose.startY}px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="700"
                step="5"
                value={currentPose.startY}
                onChange={(e) => {
                  updateTargetPose({ startY: Number(e.target.value) });
                  updateGlobal({ mode: "start" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Start X (Left/Right)</span>
                <span className="text-[#e60012] font-bold">{currentPose.startX}px</span>
              </div>
              <input
                type="range"
                min="-400"
                max="400"
                step="5"
                value={currentPose.startX}
                onChange={(e) => {
                  updateTargetPose({ startX: Number(e.target.value) });
                  updateGlobal({ mode: "start" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Start Opacity</span>
                <span className="text-[#e60012] font-bold">{currentPose.startOpacity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentPose.startOpacity}
                onChange={(e) => {
                  updateTargetPose({ startOpacity: Number(e.target.value) });
                  updateGlobal({ mode: "start" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Start Blur</span>
                <span className="text-[#e60012] font-bold">{currentPose.startBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={currentPose.startBlur}
                onChange={(e) => {
                  updateTargetPose({ startBlur: Number(e.target.value) });
                  updateGlobal({ mode: "start" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: End Position Controls */}
        {activeTab === "end" && (
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>End Scale</span>
                <span className="text-[#e60012] font-bold">{currentPose.endScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.02"
                value={currentPose.endScale}
                onChange={(e) => {
                  updateTargetPose({ endScale: Number(e.target.value) });
                  updateGlobal({ mode: "end" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>End Y Offset</span>
                <span className="text-[#e60012] font-bold">{currentPose.endY}px</span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                step="5"
                value={currentPose.endY}
                onChange={(e) => {
                  updateTargetPose({ endY: Number(e.target.value) });
                  updateGlobal({ mode: "end" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>End X Offset</span>
                <span className="text-[#e60012] font-bold">{currentPose.endX}px</span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                step="5"
                value={currentPose.endX}
                onChange={(e) => {
                  updateTargetPose({ endX: Number(e.target.value) });
                  updateGlobal({ mode: "end" });
                }}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Timing & Easing Controls */}
        {activeTab === "timing" && (
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Duration</span>
                <span className="text-[#e60012] font-bold">{currentPose.duration.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={currentPose.duration}
                onChange={(e) => updateTargetPose({ duration: Number(e.target.value) })}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Delay</span>
                <span className="text-[#e60012] font-bold">{currentPose.delay.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.05"
                value={currentPose.delay}
                onChange={(e) => updateTargetPose({ delay: Number(e.target.value) })}
                className="w-full accent-[#e60012] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-neutral-300">Easing Preset</span>
              <div className="grid grid-cols-2 gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => updateTargetPose({ easing: p.value })}
                    className={`p-2 rounded-xl text-[10px] text-left border transition-all cursor-pointer ${
                      currentPose.easing === p.value
                        ? "bg-[#e60012]/20 border-[#e60012] text-white font-bold"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReplay}
            style={{ backgroundColor: "#e60012" }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#e60012] hover:bg-[#ff1a2d] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>▶</span>
            <span>Test Animation</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer"
          >
            {copied ? "✓ Copied!" : "📋 Copy CSS"}
          </button>

          <button
            type="button"
            onClick={() => onChange(DEFAULT_STUDIO_CONFIG)}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

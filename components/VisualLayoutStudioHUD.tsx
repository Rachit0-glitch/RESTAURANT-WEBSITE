"use client";

import React, { useState, useEffect } from "react";
import { useLayoutEditor, REGISTERED_ELEMENTS } from "../context/LayoutEditorContext";

export default function VisualLayoutStudioHUD() {
  const {
    isEditorActive,
    setIsEditorActive,
    activeDevice,
    setActiveDevice,
    viewportWidth,
    selectedElementId,
    setSelectedElementId,
    getTransform,
    updateTransform,
    resetElement,
    resetDeviceLayout,
    resetAll,
    exportJSON,
    exportCSS,
    applyPreset,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useLayoutEditor();

  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const selectedItemMeta = REGISTERED_ELEMENTS.find((el) => el.id === selectedElementId);
  const transform = selectedElementId ? getTransform(selectedElementId) : null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const deviceIcon = activeDevice === "mobile" ? "📱" : activeDevice === "tablet" ? "📟" : "💻";

  return (
    <>
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-emerald-600 text-white px-4 py-2 rounded-full text-xs shadow-2xl animate-bounce flex items-center gap-2 font-medium">
          <span>✓</span> {copiedNotification} copied to clipboard!
        </div>
      )}

      {/* Floating Lightweight Bottom Control Pill */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2 pointer-events-auto select-none">
        <div className="flex items-center gap-2 bg-[#121214]/95 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-2xl text-white">
          {/* Quick Profile Target Switcher */}
          <div className="flex items-center bg-black/50 rounded-full p-0.5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveDevice("desktop")}
              className={`px-3 py-1 rounded-full transition-all font-bold cursor-pointer ${
                activeDevice === "desktop" ? "bg-[#e16b5c] text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              💻 Desktop
            </button>
            <button
              type="button"
              onClick={() => setActiveDevice("tablet")}
              className={`px-3 py-1 rounded-full transition-all font-bold cursor-pointer ${
                activeDevice === "tablet" ? "bg-[#e16b5c] text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              📟 Tablet
            </button>
            <button
              type="button"
              onClick={() => setActiveDevice("mobile")}
              className={`px-3 py-1 rounded-full transition-all font-bold cursor-pointer ${
                activeDevice === "mobile" ? "bg-[#e16b5c] text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              📱 Mobile
            </button>
          </div>

          {/* Undo & Redo Quick Buttons in HUD */}
          {isEditorActive && (
            <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/10">
              <button
                type="button"
                disabled={!canUndo}
                onClick={undo}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  canUndo
                    ? "text-amber-300 hover:bg-white/15 cursor-pointer"
                    : "text-zinc-600 opacity-40 cursor-not-allowed"
                }`}
                title="Undo (Ctrl+Z)"
              >
                ↶
              </button>
              <button
                type="button"
                disabled={!canRedo}
                onClick={redo}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  canRedo
                    ? "text-amber-300 hover:bg-white/15 cursor-pointer"
                    : "text-zinc-600 opacity-40 cursor-not-allowed"
                }`}
                title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
              >
                ↷
              </button>
            </div>
          )}

          {/* Master Drag Mode Toggle Button */}
          <button
            type="button"
            onClick={() => setIsEditorActive(!isEditorActive)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
              isEditorActive
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-rose-500/30"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <span>{isEditorActive ? "🎯 Dragging Active" : "✨ Drag & Edit Mode"}</span>
          </button>

          {/* Expand Advanced Controls Drawer */}
          {isEditorActive && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
                isExpanded ? "bg-white/30 text-white" : "bg-white/10 hover:bg-white/20 text-zinc-300"
              }`}
              title="Toggle Fine-Tuning Drawer"
            >
              {isExpanded ? "✕" : "⚙️"}
            </button>
          )}
        </div>
      </div>

      {/* Advanced Fine-Tuning Slide-out Drawer */}
      {isEditorActive && isExpanded && (
        <div className="fixed bottom-20 right-6 z-[9998] w-80 max-h-[75vh] flex flex-col bg-[#141416]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl text-white font-sans overflow-hidden">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                Fine-Tuning ({activeDevice})
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!canUndo}
                  onClick={undo}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    canUndo ? "bg-white/15 text-amber-300 hover:bg-white/25" : "text-zinc-600"
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  Undo ↶
                </button>
                <button
                  type="button"
                  disabled={!canRedo}
                  onClick={redo}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    canRedo ? "bg-white/15 text-amber-300 hover:bg-white/25" : "text-zinc-600"
                  }`}
                  title="Redo (Ctrl+Y)"
                >
                  Redo ↷
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-3.5 space-y-3.5 overflow-y-auto text-xs custom-scrollbar">
            {/* Selected Element Quick Details */}
            {selectedElementId && transform ? (
              <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="font-bold text-amber-300 truncate">
                    {selectedItemMeta?.name || selectedElementId}
                  </span>
                  <button
                    type="button"
                    onClick={() => resetElement(selectedElementId)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Size / Scale */}
                <div>
                  <div className="flex justify-between text-zinc-300 text-[11px] mb-1">
                    <span>Size / Scale:</span>
                    <span className="font-mono text-amber-300 font-bold">{Math.round(transform.scale * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="20"
                      max="300"
                      step="5"
                      value={Math.round(transform.scale * 100)}
                      onChange={(e) => updateTransform(selectedElementId, { scale: Number(e.target.value) / 100 }, false)}
                      onMouseUp={() => updateTransform(selectedElementId, { scale: transform.scale }, true)}
                      onTouchEnd={() => updateTransform(selectedElementId, { scale: transform.scale }, true)}
                      className="w-full accent-[#e16b5c] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => updateTransform(selectedElementId, { scale: 1 }, true)}
                      className="px-1.5 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px]"
                    >
                      100%
                    </button>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <div className="flex justify-between text-zinc-300 text-[11px] mb-1">
                    <span>Rotation:</span>
                    <span className="font-mono text-amber-300">{transform.rotate}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={transform.rotate}
                      onChange={(e) => updateTransform(selectedElementId, { rotate: Number(e.target.value) }, false)}
                      onMouseUp={() => updateTransform(selectedElementId, { rotate: transform.rotate }, true)}
                      onTouchEnd={() => updateTransform(selectedElementId, { rotate: transform.rotate }, true)}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => updateTransform(selectedElementId, { rotate: 0 }, true)}
                      className="px-1.5 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px]"
                    >
                      0°
                    </button>
                  </div>
                </div>

                {/* Opacity */}
                <div>
                  <div className="flex justify-between text-zinc-300 text-[11px] mb-1">
                    <span>Opacity:</span>
                    <span className="font-mono text-amber-300">{Math.round(transform.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={Math.round(transform.opacity * 100)}
                    onChange={(e) => updateTransform(selectedElementId, { opacity: Number(e.target.value) / 100 }, false)}
                    onMouseUp={() => updateTransform(selectedElementId, { opacity: transform.opacity }, true)}
                    onTouchEnd={() => updateTransform(selectedElementId, { opacity: transform.opacity }, true)}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-black/30 border border-dashed border-white/20 rounded-xl p-3 text-center text-zinc-400 text-[11px]">
                💡 Click any element on screen to drag, resize with corner handles or mouse wheel.
              </div>
            )}

            {/* Quick Presets */}
            <div>
              <span className="block text-[10px] text-zinc-400 font-semibold uppercase mb-1.5">Quick Presets</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset("default")}
                  className="py-1.5 px-2 bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors"
                >
                  <span className="font-semibold text-white">Default</span>
                  <span className="block text-[9px] text-zinc-400">Stock layout</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("compact")}
                  className="py-1.5 px-2 bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors"
                >
                  <span className="font-semibold text-white">Compact</span>
                  <span className="block text-[9px] text-zinc-400">Tight mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("cinematic")}
                  className="py-1.5 px-2 bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors"
                >
                  <span className="font-semibold text-white">Cinematic</span>
                  <span className="block text-[9px] text-zinc-400">Grand visuals</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("playful")}
                  className="py-1.5 px-2 bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors"
                >
                  <span className="font-semibold text-white">Playful</span>
                  <span className="block text-[9px] text-zinc-400">Dynamic angles</span>
                </button>
              </div>
            </div>

            {/* Actions: Copy CSS / Reset */}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(exportCSS(), "Custom CSS")}
                className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold transition-colors"
              >
                Copy CSS
              </button>
              <button
                type="button"
                onClick={() => resetDeviceLayout(activeDevice)}
                className="flex-1 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[11px] font-semibold transition-colors"
              >
                Reset {activeDevice}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

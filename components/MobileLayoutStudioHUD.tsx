"use client";

import React, { useState } from "react";
import { useMobileLayout, REGISTERED_MOBILE_ELEMENTS } from "../context/MobileLayoutEditorContext";

export default function MobileLayoutStudioHUD() {
  const {
    isEditorActive,
    setIsEditorActive,
    selectedElementId,
    setSelectedElementId,
    getTransform,
    updateTransform,
    resetElement,
    resetAll,
    exportCSS,
  } = useMobileLayout();

  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedTransform = selectedElementId ? getTransform(selectedElementId) : null;

  const nudge = (dx: number, dy: number) => {
    if (!selectedElementId || !selectedTransform) return;
    updateTransform(selectedElementId, {
      x: selectedTransform.x + dx,
      y: selectedTransform.y + dy,
    });
  };

  const adjustScale = (dScale: number) => {
    if (!selectedElementId || !selectedTransform) return;
    updateTransform(selectedElementId, {
      scale: Math.max(0.1, Math.min(3, +(selectedTransform.scale + dScale).toFixed(2))),
    });
  };

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(exportCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed top-4 right-4 z-[99999] pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsEditorActive(!isEditorActive)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl transition-all duration-300 flex items-center gap-1.5 ${
            isEditorActive
              ? "bg-red-600 text-white ring-2 ring-red-400"
              : "bg-black/80 hover:bg-black text-white/90 border border-white/20 backdrop-blur-md"
          }`}
        >
          <span>📱</span>
          <span>{isEditorActive ? "Close Mobile Editor" : "Edit Mobile"}</span>
        </button>
      </div>

      {/* Mobile Editor Floating Dock */}
      {isEditorActive && (
        <div className="fixed bottom-3 left-3 right-3 z-[99999] pointer-events-auto bg-neutral-950/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-3 text-white shadow-2xl transition-all flex flex-col gap-2">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Mobile Layout Tool</span>
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-white/5"
              >
                {isCollapsed ? "▲ Expand" : "▼ Collapse"}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow"
              >
                Export CSS
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              {/* Element Selector */}
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-neutral-400 whitespace-nowrap">Element:</label>
                <select
                  value={selectedElementId || ""}
                  onChange={(e) => setSelectedElementId(e.target.value || null)}
                  className="w-full bg-neutral-900 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">-- Tap or Select an Element --</option>
                  {REGISTERED_MOBILE_ELEMENTS.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coordinate Controls */}
              {selectedElementId && selectedTransform ? (
                <div className="flex flex-col gap-2 pt-1">
                  {/* Position Values & Step Buttons */}
                  <div className="flex items-center justify-between text-xs bg-neutral-900/80 p-2 rounded-lg border border-white/5">
                    <div className="font-mono text-neutral-300">
                      X: <span className="text-amber-400 font-bold">{selectedTransform.x}px</span> | Y:{" "}
                      <span className="text-amber-400 font-bold">{selectedTransform.y}px</span> | Scale:{" "}
                      <span className="text-amber-400 font-bold">{selectedTransform.scale}</span>
                    </div>
                  </div>

                  {/* Nudge Buttons Grid */}
                  <div className="grid grid-cols-6 gap-1 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => nudge(-10, 0)}
                      className="bg-neutral-800 hover:bg-neutral-700 py-1.5 rounded active:bg-red-600"
                    >
                      -10 X
                    </button>
                    <button
                      type="button"
                      onClick={() => nudge(10, 0)}
                      className="bg-neutral-800 hover:bg-neutral-700 py-1.5 rounded active:bg-red-600"
                    >
                      +10 X
                    </button>
                    <button
                      type="button"
                      onClick={() => nudge(0, -10)}
                      className="bg-neutral-800 hover:bg-neutral-700 py-1.5 rounded active:bg-red-600"
                    >
                      -10 Y
                    </button>
                    <button
                      type="button"
                      onClick={() => nudge(0, 10)}
                      className="bg-neutral-800 hover:bg-neutral-700 py-1.5 rounded active:bg-red-600"
                    >
                      +10 Y
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustScale(-0.05)}
                      className="bg-neutral-800 hover:bg-neutral-700 py-1.5 rounded active:bg-red-600"
                    >
                      -0.05 Scale
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustScale(0.05)}
                      className="bg-neutral-800 hover:bg-neutral-700 py-1.5 rounded active:bg-red-600"
                    >
                      +0.05 Scale
                    </button>
                  </div>

                  {/* Quick Reset for Element */}
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => resetElement(selectedElementId)}
                      className="text-[10px] text-neutral-400 hover:text-white underline"
                    >
                      Reset This Element
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-neutral-400 italic text-center py-1">
                  Tap any element directly on screen to drag and position it.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Export CSS Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl w-full max-w-lg p-4 flex flex-col gap-3 shadow-2xl text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-500">Generated Mobile CSS (@media max-width: 768px)</h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1"
              >
                ✕ Close
              </button>
            </div>
            <textarea
              readOnly
              value={exportCSS()}
              rows={10}
              className="w-full bg-black/80 border border-white/15 rounded-lg p-2.5 font-mono text-xs text-emerald-400 select-all focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCopyCSS}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                {copied ? "✓ Copied to Clipboard!" : "Copy CSS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

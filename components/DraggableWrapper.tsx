"use client";

import React, { useRef, useState, useEffect } from "react";
import { useLayoutEditor } from "../context/LayoutEditorContext";

interface DraggableWrapperProps {
  id: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableDrag?: boolean;
}

export default function DraggableWrapper({
  id,
  label,
  children,
  className = "",
  style = {},
  disableDrag = false,
}: DraggableWrapperProps) {
  const {
    isEditorActive,
    selectedElementId,
    setSelectedElementId,
    getTransform,
    updateTransform,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useLayoutEditor();

  const isSelected = isEditorActive && selectedElementId === id;
  const transform = getTransform(id);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialScale: number;
  }>({ startX: 0, startY: 0, initialX: 0, initialY: 0, initialScale: 1 });

  // Handle Dragging
  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditorActive || disableDrag) return;
    if ((e.target as HTMLElement).closest(".on-element-toolbar, .resize-handle")) return;

    e.preventDefault();
    e.stopPropagation();
    setSelectedElementId(id);
    setIsDragging(true);

    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: transform.x,
      initialY: transform.y,
      initialScale: transform.scale,
    };
  };

  const getParentScale = (): number => {
    if (wrapperRef.current) {
      // 1. Check if wrapper has a measurable client rect vs design stage
      const stage = wrapperRef.current.closest("[data-stage-width]") as HTMLElement | null;
      if (stage) {
        const stageDesignWidth = parseFloat(stage.dataset.stageWidth || "1920");
        const stageRect = stage.getBoundingClientRect();
        if (stageRect.width > 0 && stageDesignWidth > 0) {
          const ratio = stageRect.width / stageDesignWidth;
          if (ratio > 0.05 && ratio < 20) {
            return ratio;
          }
        }
      }

      // 2. Computed matrix / matrix3d walk up the DOM
      let curr = wrapperRef.current.parentElement;
      while (curr) {
        const style = window.getComputedStyle(curr);
        const transform = style.transform;
        if (transform && transform !== "none") {
          const match2d = transform.match(/^matrix\((.+)\)$/);
          if (match2d) {
            const values = match2d[1].split(", ");
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            const s = Math.sqrt(a * a + b * b);
            if (s > 0) return s;
          }
          const match3d = transform.match(/^matrix3d\((.+)\)$/);
          if (match3d) {
            const values = match3d[1].split(", ");
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            const c = parseFloat(values[2]);
            const s = Math.sqrt(a * a + b * b + c * c);
            if (s > 0) return s;
          }
        }
        curr = curr.parentElement;
      }
    }
    return 1;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging && !isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    const parentScale = getParentScale() || 1;

    if (isDragging) {
      const dx = (e.clientX - dragStartRef.current.startX) / parentScale;
      const dy = (e.clientY - dragStartRef.current.startY) / parentScale;
      updateTransform(id, {
        x: Math.round(dragStartRef.current.initialX + dx),
        y: Math.round(dragStartRef.current.initialY + dy),
      }, false);
    } else if (isResizing) {
      const dy = (e.clientY - dragStartRef.current.startY) / parentScale;
      const dx = (e.clientX - dragStartRef.current.startX) / parentScale;
      
      const distance = isResizing.includes("bottom") || isResizing.includes("right")
        ? (dx + dy) / 180
        : -(dx + dy) / 180;

      const newScale = Math.max(0.2, Math.min(3.0, Number((dragStartRef.current.initialScale + distance).toFixed(2))));
      updateTransform(id, { scale: newScale }, false);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging && !isResizing) return;
    e.preventDefault();
    e.stopPropagation();
    const parentScale = getParentScale() || 1;
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
      // Record history on drag release if moved
      const dx = (e.clientX - dragStartRef.current.startX) / parentScale;
      const dy = (e.clientY - dragStartRef.current.startY) / parentScale;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        updateTransform(id, {
          x: Math.round(dragStartRef.current.initialX + dx),
          y: Math.round(dragStartRef.current.initialY + dy),
        }, true);
      }
    }
    if (isResizing) {
      setIsResizing(null);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
      updateTransform(id, { scale: transform.scale }, true);
    }
  };

  // Direct Wheel-to-Resize only when Alt key is explicitly held
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isEditorActive || disableDrag) return;
    if (e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      const newScale = Math.max(0.2, Math.min(3.0, Number((transform.scale + delta).toFixed(2))));
      updateTransform(id, { scale: newScale }, true);
    }
  };

  // Corner Resize
  const handleResizeStart = (e: React.PointerEvent, handleType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(handleType);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: transform.x,
      initialY: transform.y,
      initialScale: transform.scale,
    };
  };

  const combinedTransform = `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale}) rotate(${transform.rotate}deg)`;
  
  const filterStyle = [
    transform.brightness !== 100 ? `brightness(${transform.brightness}%)` : null,
    transform.contrast !== 100 ? `contrast(${transform.contrast}%)` : null,
    transform.shadowBlur && transform.shadowBlur > 0
      ? `drop-shadow(0px 8px ${transform.shadowBlur}px ${transform.shadowColor || "rgba(0,0,0,0.3)"})`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: React.CSSProperties = {
    ...style,
    transform: style.transform ? `${style.transform} ${combinedTransform}` : combinedTransform,
    opacity: (style.opacity !== undefined ? Number(style.opacity) : 1) * transform.opacity,
    zIndex: transform.zIndex !== undefined ? transform.zIndex : style.zIndex,
    filter: filterStyle ? `${style.filter || ""} ${filterStyle}`.trim() : style.filter,
    fontSize: transform.fontSizeScale && transform.fontSizeScale !== 1 ? `calc(1em * ${transform.fontSizeScale})` : style.fontSize,
    transition: isDragging || isResizing || isEditorActive ? "none" : undefined,
    cursor: isEditorActive ? (isDragging ? "grabbing" : "grab") : undefined,
    userSelect: isEditorActive ? "none" : undefined,
    touchAction: isEditorActive ? "none" : undefined,
  };

  return (
    <div
      ref={wrapperRef}
      data-layout-id={id}
      className={`relative inline-block ${!isEditorActive ? "transition-transform duration-75" : ""} ${className} ${
        isEditorActive
          ? isSelected
            ? "ring-2 ring-[#e16b5c] ring-offset-1 ring-offset-black/40 shadow-2xl z-50"
            : "hover:ring-1 hover:ring-amber-400/80 cursor-grab"
          : ""
      }`}
      style={mergedStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onClick={(e) => {
        if (isEditorActive) {
          e.stopPropagation();
          setSelectedElementId(id);
        }
      }}
    >
      {/* Tight On-Element Control Bar attached right to top border (Hidden during active drag/resize to prevent flicker) */}
      {!isDragging && !isResizing && isEditorActive && (
        <div
          className={`on-element-toolbar absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-sans whitespace-nowrap z-[120] transition-all flex items-center gap-1 shadow-lg backdrop-blur-md pointer-events-auto ${
            isSelected
              ? "bg-[#18181b]/95 text-white border border-[#e16b5c] shadow-red-500/20"
              : "bg-black/80 text-amber-300 opacity-60 hover:opacity-100 border border-white/10"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-semibold text-amber-300 text-[10px]">{label || id}</span>
          <span className="text-zinc-300 font-mono text-[9px] font-bold">
            {Math.round(transform.scale * 100)}%
          </span>

          {isSelected && (
            <div className="flex items-center gap-1 pl-1 border-l border-white/20">
              {/* Scalable Down Button (-) */}
              <button
                type="button"
                className="w-5 h-4.5 rounded bg-white/15 hover:bg-rose-500 hover:text-white flex items-center justify-center text-xs font-black text-amber-300 transition-colors shadow-sm cursor-pointer"
                title="Decrease Size / Scale Down (-10%)"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTransform(id, { scale: Math.max(0.2, Number((transform.scale - 0.1).toFixed(2))) }, true);
                }}
              >
                −
              </button>

              {/* Scalable Up Button (+) */}
              <button
                type="button"
                className="w-5 h-4.5 rounded bg-white/15 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-xs font-black text-amber-300 transition-colors shadow-sm cursor-pointer"
                title="Increase Size / Scale Up (+10%)"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTransform(id, { scale: Math.min(3.0, Number((transform.scale + 0.1).toFixed(2))) }, true);
                }}
              >
                +
              </button>

              {/* Rotate Left */}
              <button
                type="button"
                className="w-4 h-4 rounded bg-white/10 hover:bg-white/30 flex items-center justify-center text-[10px] text-zinc-300 hover:text-white"
                title="Rotate Left (-15°)"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTransform(id, { rotate: (transform.rotate - 15) }, true);
                }}
              >
                ↺
              </button>

              {/* Rotate Right */}
              <button
                type="button"
                className="w-4 h-4 rounded bg-white/10 hover:bg-white/30 flex items-center justify-center text-[10px] text-zinc-300 hover:text-white"
                title="Rotate Right (+15°)"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTransform(id, { rotate: (transform.rotate + 15) }, true);
                }}
              >
                ↻
              </button>

              {/* Undo Quick Button */}
              {canUndo && (
                <button
                  type="button"
                  className="w-4 h-4 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 flex items-center justify-center text-[10px]"
                  title="Undo (Ctrl+Z)"
                  onClick={(e) => {
                    e.stopPropagation();
                    undo();
                  }}
                >
                  ↶
                </button>
              )}

              {/* Redo Quick Button */}
              {canRedo && (
                <button
                  type="button"
                  className="w-4 h-4 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 flex items-center justify-center text-[10px]"
                  title="Redo (Ctrl+Y)"
                  onClick={(e) => {
                    e.stopPropagation();
                    redo();
                  }}
                >
                  ↷
                </button>
              )}

              {/* Reset Single Item */}
              <button
                type="button"
                className="w-4 h-4 rounded bg-rose-500/20 hover:bg-rose-500/40 flex items-center justify-center text-[10px] text-rose-300"
                title="Reset Position & Size"
                onClick={(e) => {
                  e.stopPropagation();
                  updateTransform(id, { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }, true);
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resize corner handles */}
      {isSelected && (
        <>
          <div
            className="resize-handle absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#e16b5c] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform z-[110]"
            onPointerDown={(e) => handleResizeStart(e, "top-left")}
          />
          <div
            className="resize-handle absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#e16b5c] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform z-[110]"
            onPointerDown={(e) => handleResizeStart(e, "top-right")}
          />
          <div
            className="resize-handle absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#e16b5c] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform z-[110]"
            onPointerDown={(e) => handleResizeStart(e, "bottom-left")}
          />
          <div
            className="resize-handle absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#e16b5c] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform z-[110]"
            onPointerDown={(e) => handleResizeStart(e, "bottom-right")}
          />
        </>
      )}

      {children}
    </div>
  );
}

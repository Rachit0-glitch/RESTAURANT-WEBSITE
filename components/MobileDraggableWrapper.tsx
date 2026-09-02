"use client";

import React, { useRef } from "react";
import { useMobileLayout } from "../context/MobileLayoutEditorContext";

interface MobileDraggableWrapperProps {
  id: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export default function MobileDraggableWrapper({
  id,
  label,
  children,
  className = "",
}: MobileDraggableWrapperProps) {
  const {
    isEditorActive,
    selectedElementId,
    setSelectedElementId,
    getTransform,
    updateTransform,
  } = useMobileLayout();

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; initialTransformX: number; initialTransformY: number }>({
    x: 0,
    y: 0,
    initialTransformX: 0,
    initialTransformY: 0,
  });

  const transform = getTransform(id);
  const isSelected = isEditorActive && selectedElementId === id;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isEditorActive) return;
    e.stopPropagation();
    setSelectedElementId(id);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialTransformX: transform.x,
      initialTransformY: transform.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;
      updateTransform(id, {
        x: Math.round(dragStartRef.current.initialTransformX + dx),
        y: Math.round(dragStartRef.current.initialTransformY + dy),
      });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const dynamicStyle: React.CSSProperties = isEditorActive
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
        zIndex: transform.zIndex ?? (isSelected ? 50 : 10),
        touchAction: "none",
      }
    : {};

  return (
    <div
      data-mobile-id={id}
      onPointerDown={handlePointerDown}
      style={dynamicStyle}
      className={`${className} ${
        isEditorActive
          ? `cursor-move select-none ${
              isSelected
                ? "ring-2 ring-red-500 ring-offset-2 ring-offset-black rounded-lg"
                : "hover:ring-1 hover:ring-amber-400/80 rounded"
            }`
          : ""
      }`}
    >
      {isEditorActive && isSelected && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-50">
          {label || id} (X:{transform.x}, Y:{transform.y})
        </div>
      )}
      {children}
    </div>
  );
}

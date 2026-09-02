"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ElementTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex?: number;
}

export type MobileLayoutMap = Record<string, ElementTransform>;

export const DEFAULT_MOBILE_LAYOUT: MobileLayoutMap = {
  "hero-top-ribbon": { x: 0, y: -380, scale: 0.85, rotation: 0, zIndex: 10 },
  "hero-seal-stamp": { x: 140, y: -260, scale: 0.8, rotation: 0, zIndex: 10 },
  "hero-title": { x: 0, y: -160, scale: 0.7, rotation: 0, zIndex: 6 },
  "hero-sushi-platter": { x: 0, y: 110, scale: 0.85, rotation: 0, zIndex: 10 },
  "hero-cta-button": { x: 0, y: 380, scale: 0.95, rotation: 0, zIndex: 12 },
  "zen-audio-player": { x: 0, y: 0, scale: 0.85, rotation: 0, zIndex: 10 },
  "dishes-top-card": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
  "dishes-bottom-card": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
  "dishes-ramen-dish": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
  "dishes-platter-dish": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
  "dishes-udon-dish": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
  "dishes-tempura-dish": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
  "dishes-yakitori-dish": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
  "dishes-okonomiyaki-dish": { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 },
};

export const REGISTERED_MOBILE_ELEMENTS = [
  { id: "hero-top-ribbon", label: "Japanese Ribbon Banner" },
  { id: "hero-seal-stamp", label: "Japanese Seal Stamp" },
  { id: "hero-title", label: "SAKURA Title" },
  { id: "hero-sushi-platter", label: "Hero Sushi Platter" },
  { id: "hero-cta-button", label: "Explore Menu CTA Card" },
  { id: "zen-audio-player", label: "Zen Audio Pill" },
  { id: "dishes-top-card", label: "Top Dish Info" },
  { id: "dishes-bottom-card", label: "Bottom Dish Info" },
  { id: "dishes-ramen-dish", label: "Tonkotsu Ramen" },
  { id: "dishes-platter-dish", label: "Dishes Platter" },
  { id: "dishes-udon-dish", label: "Udon Bowl" },
  { id: "dishes-tempura-dish", label: "Tempura Plate" },
  { id: "dishes-yakitori-dish", label: "Yakitori Skewers" },
  { id: "dishes-okonomiyaki-dish", label: "Okonomiyaki Dish" },
];

const STORAGE_KEY = "sakura_mobile_layout_v1";

interface MobileLayoutContextType {
  isEditorActive: boolean;
  setIsEditorActive: (active: boolean) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  layouts: MobileLayoutMap;
  getTransform: (id: string) => ElementTransform;
  updateTransform: (id: string, partial: Partial<ElementTransform>) => void;
  resetElement: (id: string) => void;
  resetAll: () => void;
  exportCSS: () => string;
}

const MobileLayoutContext = createContext<MobileLayoutContextType | null>(null);

export function MobileLayoutProvider({ children }: { children: React.ReactNode }) {
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [layouts, setLayouts] = useState<MobileLayoutMap>(DEFAULT_MOBILE_LAYOUT);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLayouts({ ...DEFAULT_MOBILE_LAYOUT, ...JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
  }, []);

  const saveLayouts = (updated: MobileLayoutMap) => {
    setLayouts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const getTransform = (id: string): ElementTransform => {
    return layouts[id] || { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 };
  };

  const updateTransform = (id: string, partial: Partial<ElementTransform>) => {
    const current = getTransform(id);
    const updated = {
      ...layouts,
      [id]: { ...current, ...partial },
    };
    saveLayouts(updated);
  };

  const resetElement = (id: string) => {
    const defaultTransform = DEFAULT_MOBILE_LAYOUT[id] || { x: 0, y: 0, scale: 1, rotation: 0, zIndex: 10 };
    updateTransform(id, defaultTransform);
  };

  const resetAll = () => {
    saveLayouts(DEFAULT_MOBILE_LAYOUT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const exportCSS = (): string => {
    const lines: string[] = ["@media (max-width: 768px) {"];
    for (const [id, t] of Object.entries(layouts)) {
      lines.push(`  [data-mobile-id="${id}"] {`);
      lines.push(`    transform: translate3d(${t.x}px, ${t.y}px, 0) scale(${t.scale}) rotate(${t.rotation}deg);`);
      if (t.zIndex) lines.push(`    z-index: ${t.zIndex};`);
      lines.push(`  }`);
    }
    lines.push("}");
    return lines.join("\n");
  };

  return (
    <MobileLayoutContext.Provider
      value={{
        isEditorActive,
        setIsEditorActive,
        selectedElementId,
        setSelectedElementId,
        layouts,
        getTransform,
        updateTransform,
        resetElement,
        resetAll,
        exportCSS,
      }}
    >
      {children}
    </MobileLayoutContext.Provider>
  );
}

export function useMobileLayout(): MobileLayoutContextType {
  const context = useContext(MobileLayoutContext);
  if (!context) {
    throw new Error("useMobileLayout must be used within MobileLayoutProvider");
  }
  return context;
}

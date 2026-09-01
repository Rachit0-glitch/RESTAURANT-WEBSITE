"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type {
  DeviceMode,
  ElementTransform,
  DeviceLayoutMap,
  FullLayoutStore,
  DraggableItemMeta,
} from "../types/layoutEditor";

const STORAGE_KEY = "sakura_custom_layout_v19";

export const REGISTERED_ELEMENTS: DraggableItemMeta[] = [
  // Hero Section Elements
  { id: "hero-bg", name: "🖼️ Hero Background Image", category: "Hero", description: "Main section background texture/image" },
  { id: "hero-title", name: "🔤 Hero SUSHI Title", category: "Hero", description: "Oversized Japanese calligraphy & SUSHI typography" },
  { id: "hero-sushi-platter", name: "🍣 Hero Sushi Platter Centerpiece", category: "Hero", description: "Main 4K sushi platter wooden board" },
  { id: "hero-top-ribbon", name: "🏷️ Japanese Paper Ribbon (最高の寿司盛り合わせ)", category: "Hero", description: "Top center white paper banner" },
  { id: "hero-seal-stamp", name: "💮 Traditional Red Seal (極上 鮨処)", category: "Hero", description: "Vertical authentic Japanese stamp" },
  { id: "hero-cta-button", name: "🥢 Hero Tagline Card (AUTHENTIC JAPANESE DINING.)", category: "Hero", description: "Headline copy, description & explore menu button" },
  { id: "hero-floating-salmon", name: "🐟 Floating Salmon Nigiri", category: "Hero", description: "Floating salmon piece top-right" },
  { id: "hero-floating-avocado", name: "🥑 Floating Avocado Slice", category: "Hero", description: "Floating fresh avocado garnish" },
  { id: "hero-floating-leaf", name: "🍃 Floating Shiso Leaf", category: "Hero", description: "Floating seasonal herb garnish" },
  { id: "hero-floating-ginger", name: "🫚 Floating Ginger & Wasabi", category: "Hero", description: "Garnish condiment accent" },
  
  // Navigation & Controls
  { id: "navbar-brand", name: "🔴 Navbar Brand / Logo", category: "Navigation", description: "Sakura top logo emblem" },
  { id: "navbar-links", name: "🧭 Navbar Navigation Links", category: "Navigation", description: "Home, Menu, Contact navigation links" },
  { id: "zen-audio-player", name: "🎵 Zen Sound Control Pill", category: "Navigation", description: "Interactive audio toggle pill" },

  // Dishes Carousel Section Elements
  { id: "dishes-bg", name: "🖼️ Dishes Section Background", category: "Dishes", description: "Dishes menu section full-bleed background" },
  { id: "dishes-top-black-band", name: "⬛ Dishes Top Black Line / Block", category: "Dishes", description: "Top decorative black accent line block" },
  { id: "dishes-bottom-black-band", name: "⬛ Dishes Bottom Black Line / Block", category: "Dishes", description: "Bottom decorative black accent line block" },
  { id: "dishes-ramen-dish", name: "🍜 Tonkotsu Ramen Bowl", category: "Dishes", description: "Signature handcrafted Ramen dish" },
  { id: "dishes-platter-dish", name: "🍱 Sushi Deluxe Platter", category: "Dishes", description: "Signature sushi platter plate" },
  { id: "dishes-udon-dish", name: "🍲 Kake Udon Bowl", category: "Dishes", description: "Savory dashi udon dish" },
  { id: "dishes-tempura-dish", name: "🍤 Crispy Tempura Plate", category: "Dishes", description: "Golden fried shrimp & vegetables" },
  { id: "dishes-yakitori-dish", name: "🍢 Grilled Yakitori Skewers", category: "Dishes", description: "Glazed chicken tare skewers" },
  { id: "dishes-okonomiyaki-dish", name: "🥞 Osaka Okonomiyaki Dish", category: "Dishes", description: "Japanese savory pancake" },
  { id: "dishes-top-card", name: "📋 Dishes Top Info Card (01 / 03 / 05)", category: "Dishes", description: "Top dish title, number & description" },
  { id: "dishes-bottom-card", name: "📋 Dishes Bottom Info Card (02 / 04 / 06)", category: "Dishes", description: "Bottom dish title, number & description" },
];

export const DEFAULT_TRANSFORM: ElementTransform = {
  x: 0,
  y: 0,
  scale: 1.0,
  rotate: 0,
  opacity: 1.0,
  fontSizeScale: 1.0,
  zIndex: 10,
  shadowBlur: 0,
  shadowColor: "rgba(0,0,0,0.2)",
  brightness: 100,
  contrast: 100,
};

const DEFAULT_STORE: FullLayoutStore = {
  desktop: {
    "hero-sushi-platter": { x: -93, y: -279, scale: 1.25, rotate: 0, opacity: 1, zIndex: 10 },
    "hero-title": { x: -173, y: -108, scale: 1.2, rotate: 0, opacity: 1, zIndex: 10 },
    "hero-cta-button": { x: -48, y: -141, scale: 1.25, rotate: 0, opacity: 1, zIndex: 10 },
    "dishes-okonomiyaki-dish": { x: 45, y: 26, scale: 1, rotate: 0, opacity: 1, zIndex: 10 },
    "dishes-bottom-black-band": { x: -139, y: 18, scale: 1, rotate: 0, opacity: 1, zIndex: 10 },
    "dishes-yakitori-dish": { x: -31, y: -26, scale: 1, rotate: 0, opacity: 1, zIndex: 10 },
  },
  tablet: {
    "hero-title": { x: -600, y: -572, scale: 1.55, rotate: 0, opacity: 1, zIndex: 6 },
    "hero-sushi-platter": { x: -658, y: -679, scale: 1.6, rotate: 0, opacity: 1, zIndex: 10 },
    "hero-cta-button": { x: 985, y: -1291, scale: 2.85, rotate: 0, opacity: 1, zIndex: 12 },
    "hero-top-ribbon": { x: -10, y: 18, scale: 1, rotate: 0, opacity: 1, zIndex: 10 },
  },
  mobile: {
    "hero-top-ribbon": { x: 0, y: -235, scale: 0.95, rotate: 0, opacity: 1, zIndex: 10 },
    "hero-seal-stamp": { x: 128, y: -205, scale: 0.85, rotate: 0, opacity: 1, zIndex: 10 },
    "hero-title": { x: 0, y: -150, scale: 0.65, rotate: 0, opacity: 1, fontSizeScale: 0.95, zIndex: 6 },
    "hero-sushi-platter": { x: 0, y: -15, scale: 0.65, rotate: 0, opacity: 1, zIndex: 10 },
    "hero-cta-button": { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 12 },
    "zen-audio-player": { x: -105, y: 355, scale: 0.9, rotate: 0, opacity: 1, zIndex: 10 },
  },
};

interface LayoutEditorContextType {
  isEditorActive: boolean;
  setIsEditorActive: (active: boolean) => void;
  activeDevice: DeviceMode;
  setActiveDevice: (device: DeviceMode) => void;
  viewportWidth: number;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  
  // History
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // Actions
  getTransform: (elementId: string) => ElementTransform;
  updateTransform: (elementId: string, partial: Partial<ElementTransform>, recordHistory?: boolean) => void;
  resetElement: (elementId: string) => void;
  resetDeviceLayout: (device: DeviceMode) => void;
  resetAll: () => void;
  exportJSON: () => string;
  exportCSS: () => string;
  importJSON: (jsonStr: string) => boolean;
  applyPreset: (presetName: "default" | "compact" | "cinematic" | "playful") => void;
}

const LayoutEditorContext = createContext<LayoutEditorContextType | null>(null);

export function LayoutEditorProvider({ children }: { children: React.ReactNode }) {
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [activeDevice, setActiveDeviceState] = useState<DeviceMode>("desktop");
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(10);
  const [layouts, setLayouts] = useState<FullLayoutStore>(DEFAULT_STORE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Undo / Redo History Stacks
  const [historyPast, setHistoryPast] = useState<FullLayoutStore[]>([]);
  const [historyFuture, setHistoryFuture] = useState<FullLayoutStore[]>([]);
  const layoutsRef = useRef(layouts);
  layoutsRef.current = layouts;

  // Auto-detect screen size and device profile seamlessly
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLayouts(parsed);
      }
    } catch (e) {
      console.warn("Failed to load custom layouts from localStorage:", e);
    }
    setIsHydrated(true);

    const handleResize = () => {
      const w = window.innerWidth;
      setViewportWidth(w);
      if (w <= 768) {
        setActiveDeviceState("mobile");
      } else if (w <= 1024) {
        setActiveDeviceState("tablet");
      } else {
        setActiveDeviceState("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Persist to localStorage and sync across frames
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setLayouts(parsed);
        } catch {}
      }
      if (e.key === "sakura_layout_editor_mode_active") {
        setIsEditorActive(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setIsEditorActiveWithSync = useCallback((active: boolean) => {
    setIsEditorActive(active);
    try {
      localStorage.setItem("sakura_layout_editor_mode_active", active ? "true" : "false");
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("sakura-editor-active", isEditorActive);
    }
  }, [isEditorActive]);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
      } catch (e) {
        console.warn("Failed to save layout to localStorage:", e);
      }
    }
  }, [layouts, isHydrated]);

  const undo = useCallback(() => {
    setHistoryPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, -1);

      setHistoryFuture((prevFuture) => [layoutsRef.current, ...prevFuture]);
      setLayouts(previous);
      return newPast;
    });
  }, []);

  const redo = useCallback(() => {
    setHistoryFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setHistoryPast((prevPast) => [...prevPast, layoutsRef.current]);
      setLayouts(next);
      return newFuture;
    });
  }, []);

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditorActive) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditorActive, undo, redo]);

  const setActiveDevice = (device: DeviceMode) => {
    setActiveDeviceState(device);
  };

  const getTransform = useCallback(
    (elementId: string): ElementTransform => {
      const deviceLayout = layouts[activeDevice] || {};
      const elTransform = deviceLayout[elementId];
      if (!elTransform) {
        return DEFAULT_TRANSFORM;
      }
      return {
        ...DEFAULT_TRANSFORM,
        ...elTransform,
      };
    },
    [layouts, activeDevice]
  );

  const updateTransform = useCallback(
    (elementId: string, partial: Partial<ElementTransform>, recordHistory: boolean = false) => {
      if (recordHistory) {
        setHistoryPast((prev) => [...prev.slice(-30), layoutsRef.current]);
        setHistoryFuture([]);
      }

      setLayouts((prev) => {
        const currentDeviceLayout = prev[activeDevice] || {};
        const currentTransform = currentDeviceLayout[elementId] || { ...DEFAULT_TRANSFORM };
        const updated = {
          ...currentTransform,
          ...partial,
        };

        if (snapToGrid && gridSize > 1) {
          if (partial.x !== undefined) updated.x = Math.round(updated.x / gridSize) * gridSize;
          if (partial.y !== undefined) updated.y = Math.round(updated.y / gridSize) * gridSize;
        }

        return {
          ...prev,
          [activeDevice]: {
            ...currentDeviceLayout,
            [elementId]: updated,
          },
        };
      });
    },
    [activeDevice, snapToGrid, gridSize]
  );

  const resetElement = useCallback(
    (elementId: string) => {
      setHistoryPast((prev) => [...prev.slice(-30), layoutsRef.current]);
      setHistoryFuture([]);
      setLayouts((prev) => {
        const currentDeviceLayout = { ...prev[activeDevice] };
        delete currentDeviceLayout[elementId];
        return {
          ...prev,
          [activeDevice]: currentDeviceLayout,
        };
      });
    },
    [activeDevice]
  );

  const resetDeviceLayout = useCallback((device: DeviceMode) => {
    setHistoryPast((prev) => [...prev.slice(-30), layoutsRef.current]);
    setHistoryFuture([]);
    setLayouts((prev) => ({
      ...prev,
      [device]: DEFAULT_STORE[device] || {},
    }));
  }, []);

  const resetAll = useCallback(() => {
    setHistoryPast((prev) => [...prev.slice(-30), layoutsRef.current]);
    setHistoryFuture([]);
    setLayouts(DEFAULT_STORE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportJSON = useCallback(() => {
    return JSON.stringify(layouts, null, 2);
  }, [layouts]);

  const exportCSS = useCallback(() => {
    let css = `/* Generated Sakura Custom Layout CSS */\n`;
    (["desktop", "tablet", "mobile"] as DeviceMode[]).forEach((dev) => {
      const mediaQuery =
        dev === "mobile"
          ? "@media (max-width: 768px) {\n"
          : dev === "tablet"
          ? "@media (min-width: 769px) and (max-width: 1024px) {\n"
          : "@media (min-width: 1025px) {\n";

      css += mediaQuery;
      const map = layouts[dev] || {};
      Object.entries(map).forEach(([id, t]) => {
        css += `  [data-layout-id="${id}"] {\n`;
        if (t.x !== 0 || t.y !== 0 || t.scale !== 1 || t.rotate !== 0) {
          css += `    transform: translate3d(${t.x}px, ${t.y}px, 0) scale(${t.scale}) rotate(${t.rotate}deg);\n`;
        }
        if (t.opacity !== 1) css += `    opacity: ${t.opacity};\n`;
        if (t.fontSizeScale && t.fontSizeScale !== 1) css += `    font-size: calc(1em * ${t.fontSizeScale});\n`;
        if (t.zIndex !== undefined) css += `    z-index: ${t.zIndex};\n`;
        css += `  }\n`;
      });
      css += `}\n\n`;
    });
    return css;
  }, [layouts]);

  const importJSON = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === "object") {
        setHistoryPast((prev) => [...prev.slice(-30), layoutsRef.current]);
        setHistoryFuture([]);
        setLayouts(parsed);
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON string:", e);
    }
    return false;
  }, []);

  const applyPreset = useCallback((presetName: "default" | "compact" | "cinematic" | "playful") => {
    setHistoryPast((prev) => [...prev.slice(-30), layoutsRef.current]);
    setHistoryFuture([]);
    if (presetName === "default") {
      resetAll();
    } else if (presetName === "compact") {
      setLayouts({
        desktop: {
          "hero-title": { x: 0, y: -60, scale: 0.85, rotate: 0, opacity: 1, fontSizeScale: 0.85 },
          "hero-sushi-platter": { x: 0, y: 20, scale: 0.85, rotate: 0, opacity: 1 },
          "hero-cta-button": { x: 0, y: 10, scale: 0.9, rotate: 0, opacity: 1 },
        },
        tablet: {
          "hero-title": { x: 0, y: -40, scale: 0.75, rotate: 0, opacity: 1, fontSizeScale: 0.75 },
          "hero-sushi-platter": { x: 0, y: 10, scale: 0.75, rotate: 0, opacity: 1 },
        },
        mobile: {
          "hero-title": { x: 0, y: -30, scale: 0.65, rotate: 0, opacity: 1, fontSizeScale: 0.65 },
          "hero-sushi-platter": { x: 0, y: 40, scale: 0.65, rotate: 0, opacity: 1 },
        },
      });
    } else if (presetName === "cinematic") {
      setLayouts({
        desktop: {
          "hero-title": { x: 0, y: -80, scale: 1.1, rotate: 0, opacity: 0.9, fontSizeScale: 1.1 },
          "hero-sushi-platter": { x: 0, y: 40, scale: 1.25, rotate: -2, opacity: 1, shadowBlur: 35, shadowColor: "rgba(0,0,0,0.4)" },
          "hero-floating-salmon": { x: 40, y: -30, scale: 1.2, rotate: 12, opacity: 1 },
          "hero-floating-avocado": { x: -40, y: 20, scale: 1.2, rotate: -15, opacity: 1 },
        },
        tablet: {
          "hero-title": { x: 0, y: -50, scale: 0.95, rotate: 0, opacity: 0.95 },
          "hero-sushi-platter": { x: 0, y: 30, scale: 1.05, rotate: -2, opacity: 1 },
        },
        mobile: {
          "hero-title": { x: 0, y: -30, scale: 0.8, rotate: 0, opacity: 0.95 },
          "hero-sushi-platter": { x: 0, y: 40, scale: 0.85, rotate: -2, opacity: 1 },
        },
      });
    } else if (presetName === "playful") {
      setLayouts({
        desktop: {
          "hero-title": { x: -20, y: -30, scale: 1.05, rotate: -4, opacity: 1 },
          "hero-sushi-platter": { x: 30, y: 20, scale: 1.1, rotate: 6, opacity: 1 },
          "hero-floating-salmon": { x: 60, y: -40, scale: 1.3, rotate: 25, opacity: 1 },
          "hero-floating-avocado": { x: -60, y: 50, scale: 1.2, rotate: -20, opacity: 1 },
          "hero-cta-button": { x: 0, y: 30, scale: 1.15, rotate: -3, opacity: 1 },
        },
        tablet: {
          "hero-title": { x: 0, y: -20, scale: 0.9, rotate: -3, opacity: 1 },
          "hero-sushi-platter": { x: 0, y: 20, scale: 0.95, rotate: 4, opacity: 1 },
        },
        mobile: {
          "hero-title": { x: 0, y: -20, scale: 0.75, rotate: -2, opacity: 1 },
          "hero-sushi-platter": { x: 0, y: 30, scale: 0.8, rotate: 3, opacity: 1 },
        },
      });
    }
  }, [resetAll]);

  const setActiveDeviceWithSync = useCallback((device: DeviceMode) => {
    setActiveDeviceState(device);
    try {
      localStorage.setItem("sakura_active_sim_device", device);
    } catch {}
  }, []);

  return (
    <LayoutEditorContext.Provider
      value={{
        isEditorActive,
        setIsEditorActive: setIsEditorActiveWithSync,
        activeDevice,
        setActiveDevice: setActiveDeviceWithSync,
        viewportWidth,
        selectedElementId,
        setSelectedElementId,
        snapToGrid,
        setSnapToGrid,
        gridSize,
        setGridSize,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
        undo,
        redo,
        getTransform,
        updateTransform,
        resetElement,
        resetDeviceLayout,
        resetAll,
        exportJSON,
        exportCSS,
        importJSON,
        applyPreset,
      }}
    >
      {children}
    </LayoutEditorContext.Provider>
  );
}

export function useLayoutEditor(): LayoutEditorContextType {
  const context = useContext(LayoutEditorContext);
  if (!context) {
    return {
      isEditorActive: false,
      setIsEditorActive: () => {},
      activeDevice: "desktop",
      setActiveDevice: () => {},
      viewportWidth: 1440,
      selectedElementId: null,
      setSelectedElementId: () => {},
      snapToGrid: false,
      setSnapToGrid: () => {},
      gridSize: 10,
      setGridSize: () => {},
      canUndo: false,
      canRedo: false,
      undo: () => {},
      redo: () => {},
      getTransform: () => DEFAULT_TRANSFORM,
      updateTransform: () => {},
      resetElement: () => {},
      resetDeviceLayout: () => {},
      resetAll: () => {},
      exportJSON: () => "{}",
      exportCSS: () => "",
      importJSON: () => false,
      applyPreset: () => {},
    };
  }
  return context;
}

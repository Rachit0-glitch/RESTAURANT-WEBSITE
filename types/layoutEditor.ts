export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface ElementTransform {
  x: number; // offset X in pixels
  y: number; // offset Y in pixels
  scale: number; // multiplier (e.g., 1.0)
  rotate: number; // degrees (e.g., 0)
  opacity: number; // 0 to 1
  fontSizeScale?: number; // text multiplier (e.g., 1.0)
  zIndex?: number;
  shadowBlur?: number; // shadow intensity
  shadowColor?: string;
  brightness?: number; // 100%
  contrast?: number; // 100%
}

export type DeviceLayoutMap = Record<string, ElementTransform>;

export interface FullLayoutStore {
  desktop: DeviceLayoutMap;
  tablet: DeviceLayoutMap;
  mobile: DeviceLayoutMap;
}

export interface DraggableItemMeta {
  id: string;
  name: string;
  category: "Hero" | "Dishes" | "Navigation" | "Effects" | "Footer";
  description?: string;
  defaultPosition?: { x: number; y: number };
}

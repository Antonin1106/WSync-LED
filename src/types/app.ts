import type { LedMappingMode } from "./led";

export type Settings = {
  ip: string;
  fps: number;
  ledX: number;
  ledY: number;
  mappingMode: LedMappingMode;
  gain: number;
  smooth: number;
  threshold: number;
  gamma: number;
  saturation: number;
  reverse: boolean;
  lang: string;
};

export type CachedVideoMeta = {
  id: number;
  name: string;
  type: string;
  size: number;
  savedAt: number;
};

export type CachedVideo = CachedVideoMeta & {
  blob: Blob;
};

export type LedOverride = {
  enabled: boolean;
  color?: string;
};

export type Rgb = [number, number, number];

export type LedPosition = {
  id: number;
  outputIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  sample: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  side: "grid" | "top" | "right" | "bottom" | "left";
};

export type LedFrame = {
  packet: Uint8Array;
  colors: Rgb[];
  positions: LedPosition[];
};

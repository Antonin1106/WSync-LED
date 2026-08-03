// types/app.ts
// Types used by the app

import type { LedMappingMode } from './led';

export type Settings = {
  ip: string;
  path: string;
  fps: number;
  leds: number;
  ledX: number;
  ledY: number;
  mappingMode: LedMappingMode;
  gain: number;
  smooth: number;
  threshold: number;
  gamma: number;
  saturation: number;
  reverse: boolean;
  lang: 'en' | 'fr';
  autoCompute: boolean;
  computeExactLedCount: boolean;
  protocol: 'ddp' | 'JSON';
  dataType: 'RGB' | 'RGBW';
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

export type RGBW = [number, number, number, number];

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
  side: 'grid' | 'top' | 'right' | 'bottom' | 'left';
};

export type LedFrame = {
  rgbBytes: Uint8Array;
  colors: RGBW[];
  positions: LedPosition[];
};

export interface LedGrid {
  ledX: number;
  ledY: number;
}

export type NumberConstraint = {
  min?: number;
  max?: number;
  step?: number;
  type: 'number' | 'boolean' | 'string'
  values?: Array<string>;
};
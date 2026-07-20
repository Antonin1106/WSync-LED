// config/appConfig.ts
// Global app settings

import type { Settings } from '../types/app';
import type { LedMappingLabel, LedMappingMode } from '../types/led';

export const SETTINGS_KEY = 'wsync-led-settings-v1';
export const LED_OVERRIDES_KEY = 'wsync-led-overrides-v1';

export const mappingModes: Array<{ value: LedMappingMode; label: LedMappingLabel; }> = [
  {
    value: 'classic',
    label: 'Classic',
  },
  {
    value: 'perimeter',
    label: 'Perimeter',
  },
  {
    value: 'border',
    label: 'Border',
  },
];

export const initialSettings: Settings = {
  ip: '',
  path: 'ws',
  fps: 24,
  leds: 150,
  ledX: 15,
  ledY: 10,
  mappingMode: 'classic',
  gain: 1.3,
  smooth: 0.35,
  threshold: 8,
  gamma: 2.2,
  saturation: 1,
  reverse: false,
  lang: 'en',
  autoCompute: false,
  computeExactLedCount: false,
};

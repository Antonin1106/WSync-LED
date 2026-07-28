// config/appConfig.ts
// Global app settings

import type { Settings } from '../types/app';
import type { LedMappingLabel, LedMappingMode } from '../types/led';

export const SETTINGS_KEY = 'wsync-led-settings-v1';
export const LED_OVERRIDES_KEY = 'wsync-led-overrides-v1';

export const mappingModes: Array<{ value: LedMappingMode; label: LedMappingLabel; }> = [
  {
    value: 'grid',
    label: 'Grid',
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
  autoCompute: true,
  computeExactLedCount: false,
  dataType: 'RGB',
  fps: 24,
  gain: 1.3,
  gamma: 2.2,
  ip: '',
  lang: 'en',
  ledX: 15,
  ledY: 10,
  leds: 150,
  mappingMode: 'grid',
  path: 'ws',
  protocol: 'ddp',
  reverse: false,
  saturation: 1,
  smooth: 0.35,
  threshold: 8,
};

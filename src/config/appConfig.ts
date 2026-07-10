import type { Settings } from '../types/app';
import type { LedMappingMode } from '../types/led';

export const SETTINGS_KEY = 'wsync-led-settings-v1';
export const LED_OVERRIDES_KEY = 'wsync-led-overrides-v1';

export const mappingModes: Array<{ value: LedMappingMode; label: string; description: string }> = [
  {
    value: 'classic',
    label: 'Classic',
    description: 'Grid mapping. LED X by LED Y, unchanged.',
  },
  {
    value: 'perimeter',
    label: 'Perimeter',
    description: 'Full screen perimeter: top, right, bottom, left.',
  },
  {
    value: 'border',
    label: 'Border',
    description: 'Three-sided perimeter: top, right, left. No bottom edge.',
  },
];

export const initialSettings: Settings = {
  ip: '',
  path: 'ws',
  fps: 24,
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
};

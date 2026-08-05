// config/appConfig.ts
// Global app settings

import { getColorsSettings } from '../lib/colors/colors';
import type { NumberConstraint, Settings } from '../types/app';
import type { LedMappingLabel, LedMappingMode } from '../types/led';

export const SETTINGS_KEY = 'wsync-led-settings-v1';
export const LED_OVERRIDES_KEY = 'wsync-led-overrides-v1';
export const AP_IP = '192.168.4.1';

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
  gamma: 2,
  ip: '',
  lang: 'en',
  leds: 150,
  ledX: 15,
  ledY: 10,
  mappingMode: 'grid',
  path: 'ws',
  protocol: 'ddp',
  reverse: false,
  saturation: 1,
  smooth: 0.35,
  threshold: 8,
};

/**
 * Builds numeric constraints for settings, including limits that depend on other settings.
 * @param settings Current application settings.
 * @returns Numeric constraints keyed by setting name.
 */
export function getConstraints(
  settings: Settings,
): Record<keyof Settings, NumberConstraint> {
  const { MAX_JSON_PIXELS, isJSON } = getColorsSettings(settings);

  return {
    autoCompute: { type: 'boolean' },
    computeExactLedCount: { type: 'boolean' },
    dataType: { type: 'string', values: ['RGB', 'RGBW'] },
    fps: { min: 5, max: 60, type: 'number' },
    gain: { min: 0.2, max: 4, step: 0.05, type: 'number' },
    gamma: { min: 1, max: 3.4, step: 0.05, type: 'number' },
    ip: { type: 'string' },
    lang: { type: 'string', values: ['en', 'fr'] },
    leds: { min: 1, max: isJSON ? MAX_JSON_PIXELS : 1600, type: 'number' },
    ledX: { min: 1, max: isJSON ? 10 : 40, type: 'number' },
    ledY: { min: 1, max: isJSON ? 15 : 40, type: 'number' },
    mappingMode: { type: 'string', values: mappingModes.map((m) => m.value) },
    path: { type: 'string' },
    protocol: { type: 'string', values: ['ddp', 'JSON', 'border'] },
    reverse: { type: 'boolean' },
    saturation: { min: 0, max: 2.5, step: 0.05, type: 'number' },
    smooth: { min: 0, max: 0.95, step: 0.01, type: 'number' },
    threshold: { min: 0, max: 80, type: 'number' },
  };
}

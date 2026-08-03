// lib/ledLayout/ledLayout.ts
// Helpers for the led layout


import type { Settings } from '../../types/app';
import createLedPositions from './createLedPositions/createLedPositions';
import { buildLedFrame } from './buildLedFrame/buildLedFrame';

/**
 * Calculates the total number of LEDs for the selected mapping/compute mode.
 * @param settings Current LED layout settings.
 * @returns LED count for the active mapping mode.
 */
export function getLedCount(settings: Settings) {
  if (settings.autoCompute && settings.computeExactLedCount) return settings.leds; // Return all LEDs included unused
  if (settings.mappingMode === 'perimeter') return settings.ledX * 2 + settings.ledY * 2;
  if (settings.mappingMode === 'border') return settings.ledX + settings.ledY * 2;
  return settings.ledX * settings.ledY;
}

/**
 * Computes the analysis canvas size used for frame sampling.
 * @param settings Current LED layout settings.
 * @returns Width and height constraints for the analysis surface.
 */
export function getAnalysisSize(settings: Settings) {
  return {
    width: Math.max(64, Math.min(240, settings.ledX * 6)),
    height: Math.max(48, Math.min(180, settings.ledY * 12)),
  };
}

export { buildLedFrame, createLedPositions };
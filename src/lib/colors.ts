import type { Rgb } from '../types/app';

/**
 * Converts a hexadecimal color string into an RGB triplet.
 * @param hex Hexadecimal color code such as #ff00aa.
 * @returns RGB channel values as integers.
 */
export function hexToRgb(hex: string): Rgb {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

/**
 * Applies a gamma correction curve to a color channel value.
 * @param value Channel value in the 0-255 range.
 * @param gamma Gamma exponent to apply.
 * @returns Corrected channel value.
 */
export function applyGamma(value: number, gamma: number) {
  return Math.pow(value / 255, gamma) * 255;
}

/**
 * Adjusts the saturation of an RGB color while preserving luminance.
 * @param rgb Source color channels.
 * @param saturation Saturation multiplier.
 * @returns Saturation-adjusted RGB color.
 */
export function applySaturation(rgb: Rgb, saturation: number): Rgb {
  const [r, g, b] = rgb;
  const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;

  return [
    gray + (r - gray) * saturation,
    gray + (g - gray) * saturation,
    gray + (b - gray) * saturation,
  ];
}

/**
 * Clamps a color channel to the valid 0-255 byte range.
 * @param value Raw channel value.
 * @returns Rounded channel value clipped to the valid range.
 */
export function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

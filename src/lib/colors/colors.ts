// lib/colors/colors.ts
// Color helpers

import type { RGBW, Settings } from '../../types/app';

/**
 * Converts a hexadecimal color string into an RGBW tuple.
 * @param hex Hexadecimal color code such as #ff00aa or #ff00aaff.
 * @returns RGBW channel values as integers.
 * @description This function parses a hexadecimal color string, extracting the red, green, and blue components.
 * It then converts these values into an RGBW format, which includes a white channel calculated based on the RGB values.
 * The function supports both 6-character and 8-character hex codes (rgba is not supported), with or without a leading '#'.
 */
export function hexToRgbw(hex: string): RGBW {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return RGBToRGBW(r, g, b);
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
 * Adjusts the saturation of an RGBW color while preserving luminance.
 * @param rgbw Source color channels.
 * @param saturation Saturation multiplier.
 * @returns Saturation-adjusted RGBW color.
 */
export function applySaturation(rgbw: RGBW, saturation: number): RGBW {
  const [r, g, b, w] = rgbw;
  const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;

  return [
    gray + (r - gray) * saturation,
    gray + (g - gray) * saturation,
    gray + (b - gray) * saturation,
    w,
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

/**
 * Converts RGB values to RGBW values by calculating the white channel based on the minimum of the RGB channels and adjusting the RGB channels accordingly.
 * This function is useful for LED setups that support RGBW color space, allowing for more accurate color representation and energy efficiency.
 * @param r Red channel value (0-255).
 * @param g Green channel value (0-255).
 * @param b Blue channel value (0-255).
 * @returns An array containing the adjusted RGB values and the calculated white channel value as [R, G, B, W].
 * @description The white channel is calculated with a basic algorithm based on the minimum of the RGB channels
 * and a saturation factor to ensure that the resulting color maintains its intended hue while utilizing the white channel effectively.
 */
export function RGBToRGBW(r: number, g: number, b: number): RGBW {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  const saturation = max === 0 ? 0 : (max - min) / max;
  const factor = Math.pow(1 - saturation, 2);

  const w = min * factor * 0.8;

  return [r - w, g - w, b - w, w];
}

/**
 * Manage color settings and calculations based on the provided settings.
 * @param settings Current LED settings.
 * @returns An object containing color-related properties and functions.
 */
export function getColorsSettings(settings: Settings) {

  const dataType = settings.dataType.toUpperCase();
  const isRGBW = dataType === 'RGBW';
  const isRGB = dataType === 'RGB';
  const BYTES_PER_PIXELS = isRGBW ? 4 : 3; // RGB = 3 bytes/px ; RGBW = 4 bytes/px
  const MAX_RGBW_PIXELS = 354; // 1428 bytes / 4
  const MAX_RGB_PIXELS = 472; // 1428 bytes / 3
  const MAX_DDP_PIXELS = isRGBW ? MAX_RGBW_PIXELS : MAX_RGB_PIXELS; // Maximum number of RGB(W) pixels per DDP packet

  return {
    dataType,
    isRGB,
    isRGBW,
    BYTES_PER_PIXELS,
    MAX_DDP_PIXELS,
  };
}

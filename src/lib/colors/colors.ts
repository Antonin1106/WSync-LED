// lib/colors/colors.ts
// Color helpers

import type { RGBW, Settings } from '../../types/app';

/**
 * Converts a hexadecimal color string into an RGBW tuple.
 * @param hex Hexadecimal color code such as #ff00aa or #ff00aaff.
 * @returns RGBW channel values as integers.
 * This function parses a hexadecimal color string, extracting the red, green, and blue components.
 * It then converts these values into an RGBW format, which includes a white channel calculated based on the RGB values.
 * The function supports both 6-character and 8-character hex codes (rgba is not supported), with or without a leading '#'.
 */
export function hexToRgbw(hex: string): RGBW {
  const value = hex.replace('#', '').trim();
  const safeValue = value.length >= 6 ? value.slice(0, 6) : value.padEnd(6, '0');
  const r = parseInt(safeValue.slice(0, 2), 16) || 0;
  const g = parseInt(safeValue.slice(2, 4), 16) || 0;
  const b = parseInt(safeValue.slice(4, 6), 16) || 0;

  return RGBToRGBW(r, g, b);
}

/**
 * Converts an RGBW color array into a hexadecimal color string.
 * This function does not return the alpha channel in the hex string, as it is not supported in this context.
 * However, the white channel is included in the conversion to ensure accurate color representation for LED applications.
 * @param rgbw An array containing the red, green, blue, and white channel values.
 * @returns A hexadecimal color string representing the RGB color.
 */
export function rgbwToHex(rgbw: RGBW) {

  const toHex = (c: number): string => {
    let h = c.toString(16).toUpperCase();
    if (h.length === 1)
      h = '0' + h;
    return h.slice(0, 2);
  };

  // Include the white channel in the RGB conversion
  // to ensure accurate representation
  const r = toHex(rgbw[0] + rgbw[3]);
  const g = toHex(rgbw[1] + rgbw[3]);
  const b = toHex(rgbw[2] + rgbw[3]);
  // const w = toHex(rgbw[3] ?? 0);

  return r + g + b; // We dont't use alpha in RRGGBBAA as white channel.
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
 * The white channel is calculated with a basic algorithm based on the minimum of the RGB channels
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
  const BYTES_PER_PIXELS = isRGBW ? 4 : 3; // RGB = 3 bytes/led ; RGBW = 4 bytes/led
  const MAX_RGBW_PIXELS = 354; // 1428 bytes / 4 (per packet)
  const MAX_RGB_PIXELS = 472; // 1428 bytes / 3 (per packet)
  const MAX_DDP_PIXELS = isRGBW ? MAX_RGBW_PIXELS : MAX_RGB_PIXELS; // Maximum number of RGB(W) pixels per DDP packet
  const MAX_JSON_PIXELS = 150; // This is an arbitrary limit for JSON packets to avoid overwhelming the controller buffer.
  const isJSON = settings.protocol === 'JSON';

  return {
    dataType,
    isRGB,
    isRGBW,
    isJSON,
    BYTES_PER_PIXELS,
    MAX_DDP_PIXELS,
    MAX_JSON_PIXELS,
  };
}

/**
 * Normalizes RGBW values to ensure that the combined intensity of the RGB channels and the white channel does not exceed the maximum value of 255 for any channel.
 * @param rgbw An array containing the red, green, blue, and white channel values.
 * @returns A normalized RGBW array where the values are scaled down proportionally if any channel exceeds 255, maintaining the color balance while preventing overflow.
 */
export function normalizeRGBW(rgbw: RGBW): RGBW {
  const [r, g, b, w] = rgbw;
  const max = Math.max(r + w, g + w, b + w);

  if (max <= 255)
    return [r, g, b, w];

  const scale = 255 / max;

  return [
    r * scale,
    g * scale,
    b * scale,
    w * scale,
  ];
}
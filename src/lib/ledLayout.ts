import { applyGamma, applySaturation, clampChannel, hexToRgb } from './colors';
import type { LedFrame, LedOverride, LedPosition, Rgb, Settings } from '../types/app';
import t from './lang';

type LayoutBounds = {
  width: number;
  height: number;
};

/**
 * Calculates the total number of LEDs for the selected mapping mode.
 * @param settings Current LED layout settings.
 * @returns LED count for the active mapping mode.
 */
export function getLedCount(settings: Settings) {
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

/**
 * Returns a user-facing description of the active mapping mode.
 * @param settings Current LED layout settings.
 * @returns Help text explaining current mapping behavior.
 */
export function getModeHelp(settings: Settings) {
  if (settings.mappingMode === 'perimeter') {
    return t('perimeterHelp', { ledX: settings.ledX, ledY: settings.ledY });
  }

  if (settings.mappingMode === 'border')
    return t('borderHelp', { ledX: settings.ledX, ledY: settings.ledY });

  return t('classicHelp', { ledX: settings.ledX, ledY: settings.ledY });
}

/**
 * Maps a logical LED index to the output ordering used for transmission.
 * @param logicalIndex Index before output reordering.
 * @param total Total number of LEDs.
 * @param settings Current LED settings.
 * @returns Output index for the LED.
 */
function outputIndex(logicalIndex: number, total: number, settings: Settings) {
  let index = logicalIndex;

  if (settings.reverse) {
    index = total - 1 - index;
  }

  return index;
}

/**
 * Clips a sample rectangle to the available frame bounds.
 * @param x X coordinate of the sample origin.
 * @param y Y coordinate of the sample origin.
 * @param width Sample width.
 * @param height Sample height.
 * @param bounds Available analysis bounds.
 * @returns Valid sample rectangle.
 */
function sampleRect(
  x: number,
  y: number,
  width: number,
  height: number,
  bounds: LayoutBounds,
) {
  return {
    x: Math.max(0, Math.floor(x)),
    y: Math.max(0, Math.floor(y)),
    width: Math.max(1, Math.min(bounds.width - Math.floor(x), Math.ceil(width))),
    height: Math.max(1, Math.min(bounds.height - Math.floor(y), Math.ceil(height))),
  };
}

/**
 * Creates the LED positions and sampling rectangles for the active layout.
 * @param settings Current LED layout settings.
 * @param bounds Width and height of the analysis surface.
 * @returns Array of LED positions with sampling metadata.
 */
export function createLedPositions(settings: Settings, bounds: LayoutBounds): LedPosition[] {
  const total = getLedCount(settings);

  if (settings.mappingMode === 'perimeter' || settings.mappingMode === 'border') {
    const positions: LedPosition[] = [];
    const edge = Math.max(4, Math.round(Math.min(bounds.width, bounds.height) * 0.08));
    const topW = bounds.width / settings.ledX;
    const sideH = bounds.height / settings.ledY;

    for (let i = 0; i < settings.ledX; i++) {
      positions.push({
        id: positions.length,
        outputIndex: 0,
        x: i / settings.ledX,
        y: 0,
        width: 1 / settings.ledX,
        height: edge / bounds.height,
        sample: sampleRect(i * topW, 0, topW, edge, bounds),
        side: 'top',
      });
    }

    for (let i = 0; i < settings.ledY; i++) {
      positions.push({
        id: positions.length,
        outputIndex: 0,
        x: 1 - edge / bounds.width,
        y: i / settings.ledY,
        width: edge / bounds.width,
        height: 1 / settings.ledY,
        sample: sampleRect(bounds.width - edge, i * sideH, edge, sideH, bounds),
        side: 'right',
      });
    }

    if (settings.mappingMode === 'perimeter') {
      for (let i = settings.ledX - 1; i >= 0; i--) {
        positions.push({
          id: positions.length,
          outputIndex: 0,
          x: i / settings.ledX,
          y: 1 - edge / bounds.height,
          width: 1 / settings.ledX,
          height: edge / bounds.height,
          sample: sampleRect(i * topW, bounds.height - edge, topW, edge, bounds),
          side: 'bottom',
        });
      }
    }

    for (let i = settings.ledY - 1; i >= 0; i--) {
      positions.push({
        id: positions.length,
        outputIndex: 0,
        x: 0,
        y: i / settings.ledY,
        width: edge / bounds.width,
        height: 1 / settings.ledY,
        sample: sampleRect(0, i * sideH, edge, sideH, bounds),
        side: 'left',
      });
    }

    return positions.map((position, index) => ({
      ...position,
      id: index,
      outputIndex: settings.reverse ? total - 1 - index : index,
    }));
  }

  const positions: LedPosition[] = [];
  const cellW = bounds.width / settings.ledX;
  const cellH = bounds.height / settings.ledY;

  for (let y = 0; y < settings.ledY; y++) {
    for (let x = 0; x < settings.ledX; x++) {
      const id = y * settings.ledX + x;
      positions.push({
        id,
        outputIndex: outputIndex(id, total, settings),
        x: x / settings.ledX,
        y: y / settings.ledY,
        width: 1 / settings.ledX,
        height: 1 / settings.ledY,
        sample: sampleRect(x * cellW, y * cellH, cellW, cellH, bounds),
        side: 'grid',
      });
    }
  }

  return positions;
}

/**
 * Computes an average RGB color for a single LED sample area.
 * @param img Source image data.
 * @param position LED position and sampling rectangle.
 * @param settings Visual processing settings.
 * @returns Average RGB value for the sampled area.
 */
function averageColor(img: ImageData, position: LedPosition, settings: Settings): Rgb {
  const { x, y, width, height } = position.sample;
  const px = img.data;
  let r = 0;
  let g = 0;
  let b = 0;
  let c = 0;

  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      const id = (yy * img.width + xx) * 4;
      r += px[id] as number * (px[id] as number);
      g += px[id + 1] as number * (px[id + 1] as number);
      b += px[id + 2] as number * (px[id + 2] as number);
      c++;
    }
  }

  r = Math.sqrt(r / c);
  g = Math.sqrt(g / c);
  b = Math.sqrt(b / c);

  const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
  if (luminance < settings.threshold) return [0, 0, 0];

  return applySaturation(
    [
      applyGamma(r, settings.gamma) * settings.gain,
      applyGamma(g, settings.gamma) * settings.gain,
      applyGamma(b, settings.gamma) * settings.gain,
    ],
    settings.saturation,
  );
}

/**
 * Builds the LED frame packet and per-LED color array for transmission.
 * @param img Source image frame.
 * @param settings Current visual processing settings.
 * @param overrides Per-LED overrides.
 * @param previous Previous frame colors used for smoothing.
 * @returns Packet payload and resulting LED colors.
 */
export function buildLedFrame(
  img: ImageData,
  settings: Settings,
  overrides: Record<number, LedOverride>,
  previous: Rgb[],
): LedFrame {
  const positions = createLedPositions(settings, { width: img.width, height: img.height });
  const packet = new Uint8Array(1 + positions.length * 3);
  const colors: Rgb[] = new Array(positions.length);

  packet[0] = 0x10;

  positions.forEach((position) => {
    const override = overrides[position.id];
    let rgb: Rgb;

    if (override && !override.enabled) {
      rgb = [0, 0, 0];
    } else if (override?.color) {
      rgb = hexToRgb(override.color);
    } else {
      rgb = averageColor(img, position, settings);
    }

    const previousRgb = previous[position.id] ?? rgb;
    const smooth = settings.smooth;
    const finalRgb: Rgb = [
      previousRgb[0] * smooth + rgb[0] * (1 - smooth),
      previousRgb[1] * smooth + rgb[1] * (1 - smooth),
      previousRgb[2] * smooth + rgb[2] * (1 - smooth),
    ];
    const clamped: Rgb = [
      clampChannel(finalRgb[0]),
      clampChannel(finalRgb[1]),
      clampChannel(finalRgb[2]),
    ];
    const packetIndex = 1 + position.outputIndex * 3;

    colors[position.id] = clamped;
    packet[packetIndex] = clamped[0];
    packet[packetIndex + 1] = clamped[1];
    packet[packetIndex + 2] = clamped[2];
  });

  return { packet, colors, positions };
}

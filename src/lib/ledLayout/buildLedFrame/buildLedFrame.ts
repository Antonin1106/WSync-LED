// lib/ledLayout/buildLedFrame/buildLedFrame.ts
// buildLedFrame helper for the led layout.

import type { LedFrame, LedOverride, LedPosition, RGBW, Settings } from '../../../types/app';
import { applyGamma, applySaturation, clampChannel, getColorsSettings, hexToRgbw, normalizeRGBW, RGBToRGBW } from '../../colors/colors';
import { createLedPositions } from '../ledLayout';

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
    previous: RGBW[],
): LedFrame {
    const positions = createLedPositions(settings, { width: img.width, height: img.height });
    const colors: RGBW[] = new Array(positions.length);
    const { BYTES_PER_PIXELS, isRGBW } = getColorsSettings(settings);
    const rgbBytes = new Uint8Array(positions.length * BYTES_PER_PIXELS);

    positions.forEach((position) => {
        const override = overrides[position.id];
        let rgbw: RGBW;

        if (override && !override.enabled) {
            rgbw = [0, 0, 0, 0];
        } else if (override?.color) {
            rgbw = hexToRgbw(override.color);
        } else {
            rgbw = averageColor(img, position, settings);
        }

        const previousColor = previous[position.id] ?? rgbw;
        const smooth = settings.smooth;
        const finalColor: RGBW = [
            previousColor[0] * smooth + rgbw[0] * (1 - smooth),
            previousColor[1] * smooth + rgbw[1] * (1 - smooth),
            previousColor[2] * smooth + rgbw[2] * (1 - smooth),
            previousColor[3] * smooth + rgbw[3] * (1 - smooth),
        ];
        const clamped: RGBW = [
            clampChannel(finalColor[0]),
            clampChannel(finalColor[1]),
            clampChannel(finalColor[2]),
            clampChannel(finalColor[3]),
        ];

        colors[position.id] = clamped;
        const led = position.outputIndex * BYTES_PER_PIXELS;
        rgbBytes[led] = clamped[0];
        rgbBytes[led + 1] = clamped[1];
        rgbBytes[led + 2] = clamped[2];
        if (isRGBW)
            rgbBytes[led + 3] = clamped[3];

    });

    return { rgbBytes, colors, positions };
}


/**
 * Computes an average RGBW color for a single LED sample area.
 * @param img Source image data.
 * @param position LED position and sampling rectangle.
 * @param settings Visual processing settings.
 * @returns Average RGBW value for the sampled area.
 */
function averageColor(img: ImageData, position: LedPosition, settings: Settings): RGBW {
    const { x, y, width, height } = position.sample;
    const px = img.data;
    let r = 0;
    let g = 0;
    let b = 0;
    let w = 0;
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

    const processColor = (color: number) =>
        applyGamma(Math.sqrt(color / c), settings.gamma) * settings.gain;

    r = processColor(r);
    g = processColor(g);
    b = processColor(b);

    const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
    if (luminance < settings.threshold)
        return [0, 0, 0, 0];

    if (getColorsSettings(settings).isRGBW)
        [r, g, b, w] = RGBToRGBW(r, g, b);

    return normalizeRGBW(applySaturation([r, g, b, w], settings.saturation));
}
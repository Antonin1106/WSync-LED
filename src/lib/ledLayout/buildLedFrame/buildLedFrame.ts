// lib/ledLayout/buildLedFrame/buildLedFrame.ts
// buildLedFrame helper for the led layout.

import type { LedFrame, LedOverride, LedPosition, Rgb, Settings } from '../../../types/app';
import { applyGamma, applySaturation, clampChannel, hexToRgb } from '../../colors/colors';
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
    previous: Rgb[],
): LedFrame {
    const positions = createLedPositions(settings, { width: img.width, height: img.height });
    const colors: Rgb[] = new Array(positions.length);
    const rgbBytes = new Uint8Array(positions.length * 3);

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

        colors[position.id] = clamped;
        const led = position.outputIndex * 3;
        rgbBytes[led] = clamped[0];
        rgbBytes[led + 1] = clamped[1];
        rgbBytes[led + 2] = clamped[2];

    });

    return { rgbBytes, colors, positions };
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
// lib/ledLayout/computeLedBorder.ts
// Function to find optimal led border dimension

import type { LedGrid } from '../../types/app';

/**
 * Computes the optimal LED border dimensions (ledX and ledY) based on the provided image dimensions and total number of LEDs.
 * @param imageWidth - The width of the image or video frame.
 * @param imageHeight - The height of the image or video frame.
 * @param totalLeds - The total number of LEDs in the layout.
 * @returns An object containing the computed ledX and ledY values.
 */
export default function computeLedBorder(
    imageWidth: number,
    imageHeight: number,
    totalLeds: number,
): LedGrid {
    const targetRatio = imageWidth / imageHeight;

    let best: LedGrid = { ledX: 1, ledY: 1 };
    let bestScore = Number.POSITIVE_INFINITY;

    // Total LEDs along border is used = x + 2y (x on top, y on each side)
    // For a given y, solve x = totalLeds - 2 * y
    for (let y = 1; y <= totalLeds - 1; y++) {
        const x = totalLeds - 2 * y;

        if (x < 1) continue;

        const used = x + 2 * y;
        // Ratio of LEDs along width vs height (x vs 2*y)
        const ratio = x / (2 * y);

        const ratioError = Math.abs(ratio - targetRatio);
        const unused = totalLeds - used;

        const score = ratioError * 1000 + unused;

        if (score < bestScore) {
            bestScore = score;
            best = { ledX: x, ledY: y };
        }
    }

    return best;
}
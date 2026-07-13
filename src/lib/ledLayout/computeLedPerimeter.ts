// lib/ledLayout/computeLedPerimeter.ts
// Function to find optimal led perimeter dimension

import type { LedGrid } from '../../types/app';

/**
 * Computes the optimal LED perimeter dimensions (ledX and ledY) based on the provided image dimensions and total number of LEDs.
 * @param imageWidth - The width of the image or video frame.
 * @param imageHeight - The height of the image or video frame.
 * @param totalLeds - The total number of LEDs in the layout.
 * @returns An object containing the computed ledX and ledY values.
 */
export default function computeLedPerimeter(
    imageWidth: number,
    imageHeight: number,
    totalLeds: number,
): LedGrid {
    const targetRatio = imageWidth / imageHeight;

    let best: LedGrid = { ledX: 1, ledY: 1 };
    let bestScore = Number.POSITIVE_INFINITY;

    // Total LEDs along perimeter is used = 2*(x + y)
    // For a given y, solve x = floor(totalLeds/2 - y)
    const half = Math.floor(totalLeds / 2);
    for (let y = 1; y <= Math.max(1, half - 1); y++) {
        const x = Math.floor(half - y);

        if (x < 1) continue;

        const used = 2 * (x + y);
        // Ratio of LEDs along width vs height (2*x vs 2*y) simplifies to x / y
        const ratio = x / y;

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
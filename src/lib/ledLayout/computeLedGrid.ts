// lib/ledLayout/computeLedGrid.ts
// Function to find optimal led grid dimension

import type { LedGrid } from '../../types/app';

// UNUSED

/**
 * Computes the optimal LED grid dimensions (ledX and ledY) based on the provided image dimensions and total number of LEDs.
 * @param imageWidth - The width of the image or video frame.
 * @param imageHeight - The height of the image or video frame.
 * @param totalLeds - The total number of LEDs in the layout.
 * @returns An object containing the computed ledX and ledY values.
 */
export default function computeLedGrid(
    imageWidth: number,
    imageHeight: number,
    totalLeds: number,
): LedGrid {
    const targetRatio = imageWidth / imageHeight;

    let best = { ledX: totalLeds, ledY: 1 };
    let bestError = Number.POSITIVE_INFINITY;

    for (let y = 1; y <= Math.sqrt(totalLeds); y++) {
        if (totalLeds % y !== 0) continue;

        const x = totalLeds / y;

        const error1 = Math.abs(x / y - targetRatio);
        if (error1 < bestError) {
            bestError = error1;
            best = { ledX: x, ledY: y };
        }

        const error2 = Math.abs(y / x - targetRatio);
        if (error2 < bestError) {
            bestError = error2;
            best = { ledX: y, ledY: x };
        }
    }

    return best;
}
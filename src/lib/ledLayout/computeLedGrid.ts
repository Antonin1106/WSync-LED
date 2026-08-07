// lib/ledLayout/computeLedGrid.ts
// Function to find optimal led grid dimension

import type { LedGrid } from '../../types/app';

/**
 * Computes the optimal LED grid dimensions (ledX and ledY) based on the provided image dimensions and total number of LEDs.
 * This function may ignore certain LEDs when it is not possible to create a consistent grid.
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

    let best: LedGrid = { ledX: 1, ledY: 1 };
    let bestScore = Number.POSITIVE_INFINITY;

    for (let y = 1; y <= totalLeds; y++) {
        const x = Math.floor(totalLeds / y);

        if (x < 1) continue;

        const used = x * y;
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
// lib/ledLayout/createLedPositions/createLedPositions.ts
// createLedPositions helper for the led layout.

import type { LedPosition, Settings } from '../../../types/app';
import { getLedCount } from '../ledLayout';

type LayoutBounds = {
    width: number;
    height: number;
};

/**
 * Creates the LED positions and sampling rectangles for the active layout.
 * @param settings Current LED layout settings.
 * @param bounds Width and height of the analysis surface.
 * @returns Array of LED positions with sampling metadata.
 */
export default function createLedPositions(settings: Settings, bounds: LayoutBounds): LedPosition[] {
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
            outputIndex: outputIndex(index, total, settings),
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
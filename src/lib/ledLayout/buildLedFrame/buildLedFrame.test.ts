// lib/ledLayout/buildLedFrame/buildLedFrame.test.ts
// Unit tests for buildLedFrame function.

import { describe, expect, it } from 'vitest';
import { buildLedFrame } from './buildLedFrame';
import type { Settings } from '../../../types/app';

function createImage(width: number, height: number, pixels: number[]): ImageData {
    return {
        width,
        height,
        data: new Uint8ClampedArray(pixels),
    } as ImageData;
}

const settings = {
    mappingMode: 'grid',
    ledX: 1,
    ledY: 1,
    reverse: false,
    threshold: 0,
    gamma: 1,
    gain: 1,
    saturation: 1,
    smooth: 0,
    dataType: 'RGBW',
} as Settings;

describe('buildLedFrame', () => {
    it('creates packet header', () => {
        const frame = buildLedFrame(
            createImage(1, 1, [
                100, 50, 25, 255,
            ]),
            settings,
            {},
            [],
        );

        expect(frame.rgbBytes.length).toBe(4);
    });

    it('uses sampled color', () => {
        const frame = buildLedFrame(
            createImage(1, 1, [
                100, 50, 25, 255,
            ]),
            settings,
            {},
            [],
        );

        expect(frame.colors).toHaveLength(1);
        expect(Array.from(frame.rgbBytes)).toEqual(frame.colors[0]);
    });

    it('applies disabled override', () => {
        const frame = buildLedFrame(
            createImage(1, 1, [
                255, 0, 0, 255,
            ]),
            settings,
            {
                0: {
                    enabled: false,
                },
            },
            [],
        );

        expect(frame.colors[0]).toEqual([0, 0, 0, 0]);
    });

    it('applies color override', () => {
        const frame = buildLedFrame(
            createImage(1, 1, [
                255, 0, 0, 255,
            ]),
            settings,
            {
                0: {
                    enabled: true,
                    color: '#00ff00',
                },
            },
            [],
        );

        expect(frame.colors[0]).toEqual([0, 255, 0, 0]);
    });

    it('applies smoothing', () => {
        const frame = buildLedFrame(
            createImage(1, 1, [
                100, 100, 100, 255,
            ]),
            {
                ...settings,
                smooth: 0.5,
            },
            {},
            [
                [0, 0, 0, 0],
            ],
        );

        const color = frame.colors[0] ?? [0, 0, 0];

        expect(color[0]).toBeGreaterThan(0);
        expect(color[0]).toBeLessThan(100);
    });

    it('returns black below threshold', () => {
        const frame = buildLedFrame(
            createImage(1, 1, [
                10, 10, 10, 255,
            ]),
            {
                ...settings,
                threshold: 100,
            },
            {},
            [],
        );

        expect(frame.colors[0]).toEqual([0, 0, 0, 0]);
    });

    it('writes colors using outputIndex', () => {
        const img = createImage(2, 1, [
            255, 0, 0, 255,
            0, 255, 0, 255,
        ]);

        const frame = buildLedFrame(
            img,
            {
                ...settings,
                ledX: 2,
                ledY: 1,
                reverse: true,
            },
            {},
            [],
        );

        expect(frame.positions[0]?.outputIndex).toBe(1);
        expect(frame.positions[1]?.outputIndex).toBe(0);
    });
});
// lib/ledLayout/createLedPositions/createLedPositions.test.ts
// Unit tests for createLedPositions function.

import { describe, expect, it } from 'vitest';

import { createLedPositions } from '../ledLayout';
import type { Settings } from '../../../types/app';

const bounds = {
    width: 100,
    height: 50,
};

describe('createLedPositions', () => {
    it('creates a grid layout', () => {
        const settings = {
            mappingMode: 'grid',
            ledX: 2,
            ledY: 2,
            reverse: false,
        } as Settings;

        const positions = createLedPositions(settings, bounds);

        expect(positions).toHaveLength(4);

        expect(positions[0]).toMatchObject({
            id: 0,
            x: 0,
            y: 0,
            side: 'grid',
            sample: {
                x: 0,
                y: 0,
                width: 50,
                height: 25,
            },
        });

        expect(positions[3]).toMatchObject({
            id: 3,
            x: 0.5,
            y: 0.5,
            side: 'grid',
            sample: {
                x: 50,
                y: 25,
                width: 50,
                height: 25,
            },
        });
    });

    it('creates perimeter layout', () => {
        const settings = {
            mappingMode: 'perimeter',
            ledX: 2,
            ledY: 1,
            reverse: false,
        } as Settings;

        const positions = createLedPositions(settings, bounds);

        expect(positions).toHaveLength(6);

        expect(positions.map((p) => p.side)).toEqual([
            'top',
            'top',
            'right',
            'bottom',
            'bottom',
            'left',
        ]);
    });

    it('creates border layout without bottom side', () => {
        const settings = {
            mappingMode: 'border',
            ledX: 2,
            ledY: 1,
            reverse: false,
        } as Settings;

        const positions = createLedPositions(settings, bounds);

        expect(positions).toHaveLength(4);

        expect(positions.map((p) => p.side)).toEqual([
            'top',
            'top',
            'right',
            'left',
        ]);
    });

    it('reverses output indexes', () => {
        const settings = {
            mappingMode: 'grid',
            ledX: 2,
            ledY: 2,
            reverse: true,
        } as Settings;

        const positions = createLedPositions(settings, bounds);

        expect(positions.map((p) => p.outputIndex)).toEqual([3, 2, 1, 0]);
    });

    it('clips sample rectangles inside bounds', () => {
        const settings = {
            mappingMode: 'grid',
            ledX: 3,
            ledY: 3,
            reverse: false,
        } as Settings;

        const positions = createLedPositions(settings, {
            width: 10,
            height: 10,
        });

        for (const position of positions) {
            expect(position.sample.x).toBeGreaterThanOrEqual(0);
            expect(position.sample.y).toBeGreaterThanOrEqual(0);

            expect(position.sample.x + position.sample.width)
                .toBeLessThanOrEqual(10);

            expect(position.sample.y + position.sample.height)
                .toBeLessThanOrEqual(10);
        }
    });
});

/*
describe('outputIndex()', () => {
    const logicalIndex = 48;
    const totalLeds = 100;

    it('returns correct index when unreversed', () => {
        expect(outputIndex(logicalIndex, totalLeds, baseSettings)).toBe(48);
    });

    it('returns correct index when reversed', () => {
        expect(outputIndex(logicalIndex, totalLeds, { ...baseSettings, reverse: true })).toBe(51);
    });
});*/
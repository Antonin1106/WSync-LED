// lib/ledLayout/ledLayout.test.ts
// Unit tests for LEDs Layout.

import { describe, expect, it, test } from 'vitest';

import { getLedCount, outputIndex } from './ledLayout';
import { initialSettings } from '../../config/appConfig';
import type { Settings } from '../../types/app';

const baseSettings: Settings = {
    ...initialSettings,
    autoCompute: false,
    mappingMode: 'classic',
    leds: 100,
    ledX: 10,
    ledY: 5,
};

describe('getLedCount()', () => {
    it('returns all leds when autoCompute is enabled', () => {
        expect(getLedCount({ ...baseSettings, autoCompute: true })).toBe(100);
    });

    it('computes perimeter mapping', () => {
        expect(getLedCount({ ...baseSettings, mappingMode: 'perimeter' })).toBe(30); // 10*2 + 5*2
    });

    it('computes border mapping', () => {
        expect(getLedCount({ ...baseSettings, mappingMode: 'border' })).toBe(20); // 10 + 5*2
    });

    it('computes matrix mapping', () => {
        expect(getLedCount({ ...baseSettings, mappingMode: 'classic' })).toBe(50); // 10 * 5
    });
});

test.todo('getAnalysisSize()');
test.todo('sampleRect()');

describe('outputIndex()', () => {
    const logicalIndex = 48;
    const totalLeds = 100;

    it('returns right index when unreversed', () => {
        expect(outputIndex(logicalIndex, totalLeds, baseSettings)).toBe(48);
    });

    it('returns right index when reversed', () => {
        expect(outputIndex(logicalIndex, totalLeds, { ...baseSettings, reverse: true })).toBe(51);
    });
});

test.todo('createLedPositions()');
test.todo('averageColor()');
test.todo('buildLedFrame()');
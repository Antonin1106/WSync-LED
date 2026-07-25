// lib/ledLayout/ledLayout.test.ts
// Unit tests for LEDs Layout.

import { describe, expect, it } from 'vitest';

import { getAnalysisSize, getLedCount } from './ledLayout';
import { initialSettings } from '../../config/appConfig';
import type { Settings } from '../../types/app';

const baseSettings: Settings = {
    ...initialSettings,
    autoCompute: false,
    mappingMode: 'grid',
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
        expect(getLedCount({ ...baseSettings, mappingMode: 'grid' })).toBe(50); // 10 * 5
    });
});

describe('getAnalysisSize()', () => {
    function jsonFormatSize(width: number, height: number) {
        return JSON.stringify({ width, height });
    }

    it('returns correct size for 15x10 grid', () => {
        expect(JSON.stringify(getAnalysisSize({ ...baseSettings, ledX: 15, ledY: 10 })))
            .toBe(jsonFormatSize(90, 120));
    });

    it('returns correct size for 10x10 grid', () => {
        expect(JSON.stringify(getAnalysisSize({ ...baseSettings, ledX: 10, ledY: 10 })))
            .toBe(jsonFormatSize(64, 120));
    });

    it('returns correct size for 10x4 grid', () => {
        expect(JSON.stringify(getAnalysisSize({ ...baseSettings, ledX: 10, ledY: 4 })))
            .toBe(jsonFormatSize(64, 48));
    });

    it('returns correct size for 50x50 grid', () => {
        expect(JSON.stringify(getAnalysisSize({ ...baseSettings, ledX: 50, ledY: 50 })))
            .toBe(jsonFormatSize(240, 180));
    });
});
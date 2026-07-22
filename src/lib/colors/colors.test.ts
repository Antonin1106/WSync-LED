// lib/colors/colors.test.ts
// Unit tests for color helpers.

import { describe, expect, it } from 'vitest';
import {
    applyGamma,
    applySaturation,
    clampChannel,
    hexToRgb,
} from './colors';

describe('hexToRgb', () => {
    it('converts a hex color with #', () => {
        expect(hexToRgb('#FF8040')).toEqual([255, 128, 64]);
    });

    it('converts a hex color without #', () => {
        expect(hexToRgb('00FF7F')).toEqual([0, 255, 127]);
    });

    it('converts black', () => {
        expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    });

    it('converts white', () => {
        expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
    });
});

describe('applyGamma', () => {
    it('returns 0 for a value of 0', () => {
        expect(applyGamma(0, 2.2)).toBe(0);
    });

    it('returns 255 for a value of 255', () => {
        expect(applyGamma(255, 2.2)).toBeCloseTo(255);
    });

    it('applies gamma correction', () => {
        expect(applyGamma(128, 2.2)).toBeCloseTo(55.98, 2);
    });
});

describe('applySaturation', () => {
    it('keeps the original color with saturation = 1', () => {
        expect(applySaturation([255, 100, 50], 1)).toEqual([255, 100, 50]);
    });

    it('produces grayscale with saturation = 0', () => {
        const result = applySaturation([255, 100, 50], 0);

        expect(result[0]).toBeCloseTo(result[1]);
        expect(result[1]).toBeCloseTo(result[2]);
    });

    it('increases saturation', () => {
        const result = applySaturation([200, 100, 50], 1.5);

        expect(result[0]).toBeGreaterThan(200);
        expect(result[2]).toBeLessThan(50);
    });
});

describe('clampChannel', () => {
    it('returns the same value when already valid', () => {
        expect(clampChannel(128)).toBe(128);
    });

    it('rounds decimal values', () => {
        expect(clampChannel(127.6)).toBe(128);
    });

    it('clamps negative values to 0', () => {
        expect(clampChannel(-20)).toBe(0);
    });

    it('clamps values above 255', () => {
        expect(clampChannel(300)).toBe(255);
    });
});
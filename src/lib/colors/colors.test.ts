// lib/colors/colors.test.ts
// Unit tests for color helpers.

import { describe, expect, it } from 'vitest';
import {
    applyGamma,
    applySaturation,
    clampChannel,
    getColorsSettings,
    hexToRgbw,
    normalizeRGBW,
    RGBToRGBW,
    rgbwToHex,
} from './colors';
import { initialSettings } from '../../config/appConfig';
import type { Settings } from '../../types/app';

describe('hexToRgbw', () => {
    it('converts a hex color with #', () => {
        const rgbw = hexToRgbw('#FF8040');
        expect(rgbw[0]).toBeCloseTo(251.77);
        expect(rgbw[1]).toBeCloseTo(124.77);
        expect(rgbw[2]).toBeCloseTo(60.77);
        expect(rgbw[3]).toBeCloseTo(3.23);
    });

    it('converts a hex color without #', () => {
        expect(hexToRgbw('00FF7F')).toEqual([0, 255, 127, 0]);
    });

    it('converts black', () => {
        expect(hexToRgbw('#000000')).toEqual([0, 0, 0, 0]);
    });

    it('converts white', () => {
        expect(hexToRgbw('#FFFFFF')).toEqual([51, 51, 51, 204]);
    });

    it('converts white with rgba', () => {
        expect(hexToRgbw('#FFFFFFFF')).toEqual([51, 51, 51, 204]);
    });

    it('converts white with rgba without #', () => {
        expect(hexToRgbw('FFFFFFFF')).toEqual([51, 51, 51, 204]);
    });

    it('converts incorrect longer HEX to black RGBW', () => {
        expect(hexToRgbw('GHTYK5NN')).toEqual([0, 0, 0, 0]);
    });

    it('converts incorrect short HEX to black RGBW', () => {
        expect(hexToRgbw('LGVN')).toEqual([0, 0, 0, 0]);
    });

    it('converts short HEX to RGBW', () => {
        expect(hexToRgbw('FFAA')).toEqual([255, 170, 0, 0]);
    });
});

describe('rgbwToHex', () => {
    it('converts a RGBW color to HEX (RRGGBB) with W=0', () => {
        expect(rgbwToHex([40, 60, 125, 0])).toBe('283C7D');
    });

    it('converts a RGBW color to HEX (RRGGBB) with W', () => {
        expect(rgbwToHex([50, 150, 250, 5])).toBe('379BFF');
    });

    it('converts RGBW => HEX with little values for \'0\' representation in HEX', () => {
        expect(rgbwToHex([9, 60, 125, 0])).toBe('093C7D');
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
        expect(applySaturation([255, 100, 50, 255], 1)).toEqual([255, 100, 50, 255]);
    });

    it('produces grayscale with saturation = 0', () => {
        const result = applySaturation([255, 100, 50, 255], 0);

        expect(result[0]).toBeCloseTo(result[1]);
        expect(result[1]).toBeCloseTo(result[2]);
        expect(result[3]).toBe(255);
    });

    it('increases saturation', () => {
        const result = applySaturation([200, 100, 50, 255], 1.5);

        expect(result[0]).toBeGreaterThan(200);
        expect(result[2]).toBeLessThan(50);
        expect(result[3]).toBe(255);
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

describe('RGBtoRGBW', () => {
    it('convert white RGB to RGBW', () => {
        expect(RGBToRGBW(255, 255, 255)).toEqual([51, 51, 51, 204]);
    });

    it('convert black RGB to RGBW', () => {
        expect(RGBToRGBW(0, 0, 0)).toEqual([0, 0, 0, 0]);
    });

    it('convert a RGB color to RGBW', () => {
        expect(RGBToRGBW(125, 255, 0)).toEqual([125, 255, 0, 0]);
    });

    it('convert another RGB color to RGBW', () => {
        expect(RGBToRGBW(125, 125, 125)).toEqual([25, 25, 25, 100]);
    });

    it('convert another RGB color to RGBW', () => {
        const rgbw = RGBToRGBW(200, 146, 48);
        expect(rgbw[0]).toBeCloseTo(197.78, 0);
        expect(rgbw[1]).toBeCloseTo(143.78, 0);
        expect(rgbw[2]).toBeCloseTo(45.78, 0);
        expect(rgbw[3]).toBeCloseTo(2.22, 0);
    });
});

describe('getColorsSetttings', () => {
    it('convert lowercase to uppercase for dataType', () => {
        const colorsSettings = getColorsSettings({ ...initialSettings, dataType: 'rgb' } as unknown as Settings);
        expect(colorsSettings.dataType).toBe('RGB');
    });

    it('returns values for RGBW dataType', () => {
        const colorsSettings = getColorsSettings({ ...initialSettings, dataType: 'RGBW' });
        expect(colorsSettings.isRGBW).toBe(true);
        expect(colorsSettings.isRGB).toBe(false);
        expect(colorsSettings.BYTES_PER_PIXELS).toBe(4);
        expect(colorsSettings.MAX_DDP_PIXELS).toBe(354);
        expect(colorsSettings.MAX_JSON_PIXELS).toBe(150);
    });

    it('returns values for RGB dataType', () => {
        const colorsSettings = getColorsSettings({ ...initialSettings, dataType: 'RGB' });
        expect(colorsSettings.isRGBW).toBe(false);
        expect(colorsSettings.isRGB).toBe(true);
        expect(colorsSettings.BYTES_PER_PIXELS).toBe(3);
        expect(colorsSettings.MAX_DDP_PIXELS).toBe(472);
    });

    it('returns isJson=true when JSON is set', () => {
        const colorsSettings = getColorsSettings({ ...initialSettings, protocol: 'JSON' });
        expect(colorsSettings.isJSON).toBe(true);
    });
});

describe('normalizeRGBW', () => {
    it('returns values when all colors are <= 255', () => {
        const rgbw = normalizeRGBW([51, 51, 51, 204]);
        expect(rgbw).toStrictEqual([51, 51, 51, 204]);
    });

    it('returns scaled values when a color is > 255', () => {
        const rgbw = normalizeRGBW([257, 30, 15, 0]);
        expect(rgbw[0]).toBeCloseTo(255);
        expect(rgbw[1]).toBeCloseTo(29.8, 1);
        expect(rgbw[2]).toBeCloseTo(14.9, 1);
        expect(rgbw[3]).toBeCloseTo(0);
    });
});
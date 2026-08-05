// lib/utils/validateSettings/validateSettings.test.ts
// Unit tests for settings validation.

import { describe, expect, it, vi } from 'vitest';
import * as appConfig from '../../../config/appConfig';
import type { Settings } from '../../../types/app';

// Mock the getConstraints function to return a modified version of the constraints
vi.mock('../../../config/appConfig', async () => {
    const actual = await vi.importActual<typeof appConfig>(
        '../../../config/appConfig',
    );

    return {
        ...actual,
        getConstraints: vi.fn((settings) => {
            const constraints = actual.getConstraints(settings);

            return {
                ...constraints,
                smooth: {
                    ...constraints.smooth,
                    min: undefined,
                    max: undefined,
                },
            };
        }),
    };
});

import validateSettings, { validateNumber } from './validateSettings';
const initialSettings = appConfig.initialSettings;

describe('validateSettings', () => {
    it('clamps numeric settings to their supported ranges', () => {
        expect(validateSettings({
            ...initialSettings,
            fps: 999,
            gain: -1,
            gamma: 20,
            ledX: 0,
            ledY: 100,
            threshold: -10,
        })).toEqual({
            ...initialSettings,
            fps: 60,
            gain: 0.2,
            gamma: 3.4,
            ledX: 1,
            ledY: 40,
            threshold: 0,
        });
    });

    it('applies dynamic LED limits when the protocol changes', () => {
        expect(validateSettings({
            ...initialSettings,
            leds: 1000,
            protocol: 'JSON',
        }).leds).toBe(150);
    });

    it('normalizes integer settings', () => {
        expect(validateSettings({
            ...initialSettings,
            fps: 24.9,
            leds: 12.8,
        })).toEqual({
            ...initialSettings,
            fps: 25,
            leds: 13,
        });
    });

    it('reset incorrect text value to default', () => {
        expect(validateSettings({
            ...initialSettings,
            protocol: 'unknown' as Settings['protocol'],
        })).toEqual({
            ...initialSettings,
            protocol: 'ddp',
        });
    });

    it('uses empty string when nothing is given and it is allowed', () => {
        expect(validateSettings({
            ...initialSettings,
            ip: undefined as unknown as Settings['ip'],
        })).toEqual({
            ...initialSettings,
            ip: '',
        });
    });

    it('reset non-number value to default', () => {
        expect(validateSettings({
            ...initialSettings,
            leds: 'unknown' as unknown as Settings['leds'],
        })).toEqual({
            ...initialSettings,
            leds: 150,
        });
    });

    it('uses 0 as minimum when this constraint is not defined', () => {
        const settings = {
            ...initialSettings,
            smooth: -1, // Add an incorrect value, smooth as no constraint here
        };

        expect(validateSettings(settings as Settings)).toEqual({ ...initialSettings, smooth: 0 });
        expect(appConfig.getConstraints).toHaveBeenCalledWith(settings);
    });

    it('uses 60 as maximum when this constraint is not defined', () => {
        const settings = {
            ...initialSettings,
            smooth: 80, // Add an incorrect value, smooth as no constraint here
        };

        expect(validateSettings(settings as Settings)).toEqual({ ...initialSettings, smooth: 60 });
        expect(appConfig.getConstraints).toHaveBeenCalledWith(settings);
    });

    it('set default value to boolean if it is undefined', () => {
        const settings = { ...initialSettings, reverse: undefined };
        expect(validateSettings(settings as unknown as Settings)).toEqual({ ...initialSettings, reverse: false });
        expect(appConfig.getConstraints).toHaveBeenCalledWith(settings);
    });

    it('returns actual settings when nothing has changed', () => {
        const settings = { ...initialSettings };
        expect(validateSettings(settings)).toBe(settings);
        expect(appConfig.getConstraints).toHaveBeenCalledWith(settings);
    });
});

describe('validateNumber', () => {
    const getDecimals = (value: number) => (value.toString().split('.')[1] ?? '').length;

    it('does not clamps numeric values when not needed', () => {
        expect(validateNumber(15, 10, 20)).toEqual(15);
    });

    it('clamps numeric values to ranges by minimum', () => {
        expect(validateNumber(0, 10, 20)).toEqual(10);
    });

    it('clamps numeric values to ranges by maximum', () => {
        expect(validateNumber(25, 10, 20)).toEqual(20);
    });

    it('clamps numeric values to ranges when negativ', () => {
        expect(validateNumber(-10, 0, 50)).toEqual(0);
    });

    it('return default value when Nan', () => {
        expect(validateNumber(NaN, 10, 20, 1, 15)).toEqual(15);
    });

    it('return min value default value is not given and value is Nan', () => {
        expect(validateNumber(NaN, 10, 20)).toEqual(10);
    });

    it('return a stepped number (0 decimal)', () => {
        expect(getDecimals(validateNumber(12.85, 0, 50, 1))).toBe(0);
    });

    it('return a stepped number (1 decimal)', () => {
        expect(getDecimals(validateNumber(12.87, 0, 50, 0.1))).toBe(1);
    });

    it('return a stepped number (2 decimals)', () => {
        expect(getDecimals(validateNumber(12.155, 0, 50, 0.01))).toBe(2);
    });

    it('round values', () => {
        expect(validateNumber(12.555555, 0, 50, 0.01)).toBe(12.56);
    });
});
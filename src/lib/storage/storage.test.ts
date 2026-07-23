// lib/storage/storage.test.ts
// Unit tests for storage helpers.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialSettings, LED_OVERRIDES_KEY, SETTINGS_KEY } from '../../config/appConfig';
import type { LedOverride, Settings } from '../../types/app';
import { loadOverrides, loadSettings, saveOverrides, saveSettings } from './storage';

const newSettings: Settings = {
    ...initialSettings,
    autoCompute: false,
};

const overrides: Record<number, LedOverride> = {
    0: {
        color: '#ff0000',
        enabled: true,
    },
};

afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

describe('loadSettings', () => {
    it('returns initial settings when storage is empty', () => {
        expect(loadSettings()).toEqual(initialSettings);
    });

    it('loads saved settings', () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));

        expect(loadSettings()).toEqual(newSettings);
    });

    it('merges stored settings with defaults', () => {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify({
                autoCompute: false,
            }),
        );

        expect(loadSettings()).toEqual({
            ...initialSettings,
            autoCompute: false,
        });
    });

    it('returns initial settings when JSON is invalid', () => {
        localStorage.setItem(SETTINGS_KEY, '{invalid json');

        expect(loadSettings()).toEqual(initialSettings);
    });
});

describe('saveSettings', () => {
    it('stores settings in localStorage', () => {
        saveSettings(newSettings);

        expect(localStorage.getItem(SETTINGS_KEY)).toBe(
            JSON.stringify(newSettings),
        );
    });
});

describe('loadOverrides', () => {
    it('returns an empty object when storage is empty', () => {
        expect(loadOverrides()).toEqual({});
    });

    it('loads overrides from localStorage', () => {
        localStorage.setItem(
            LED_OVERRIDES_KEY,
            JSON.stringify(overrides),
        );

        expect(loadOverrides()).toEqual(overrides);
    });

    it('returns an empty object when JSON is invalid', () => {
        localStorage.setItem(LED_OVERRIDES_KEY, '{invalid json');

        expect(loadOverrides()).toEqual({});
    });
});

describe('saveOverrides', () => {
    it('stores overrides in localStorage', () => {
        saveOverrides(overrides);

        expect(localStorage.getItem(LED_OVERRIDES_KEY)).toBe(
            JSON.stringify(overrides),
        );
    });
});
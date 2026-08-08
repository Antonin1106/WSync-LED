// lib/storage/storage.test.ts
// Unit tests for storage helpers.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialSettings, LED_OVERRIDES_KEY, SETTINGS_KEY } from '../../config/appConfig';
import type { Override, Settings } from '../../types/app';
import { exportSettings, importSettings, loadOverrides, loadSettings, saveOverrides, saveSettings } from './storage';
import type { ChangeEvent } from 'react';

const newSettings: Settings = {
    ...initialSettings,
    autoCompute: false,
};

const overrides: Override = {
    0: {
        color: '#ff0000',
        enabled: true,
    },
};

const json = (settings?: Settings, overrides?: Override) => {
    return JSON.stringify(
        {
            '$schema': 'wsync-led.schema.json',
            [LED_OVERRIDES_KEY]: overrides,
            [SETTINGS_KEY]: settings,
        }
        , undefined, 4);
};

const changeEvent = (json: string) => {
    return {
        target: {
            files: [
                new File(
                    [json],
                    'WSync-LED-config.json',
                    { type: 'application/json' },
                ),
            ],
        },
    } as unknown as ChangeEvent<HTMLInputElement, HTMLInputElement>;
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


describe('exportSettings', () => {
    it('export settings', () => {
        const dataURI = exportSettings(newSettings, overrides);
        expect(dataURI.slice(0, 31)).toBe('data:application/manifest+json,');
        expect(dataURI.slice(31)).toBe(encodeURIComponent(json(newSettings, overrides)));
    });
});

const setSettings = vi.fn();
const setOverrides = vi.fn();

describe('importSettings', () => {
    it('import settings', async () => {
        importSettings(changeEvent(json(newSettings, overrides)), setSettings, setOverrides);

        await vi.waitFor(() => {
            expect(setSettings).toHaveBeenCalledWith(newSettings);
            expect(setOverrides).toHaveBeenCalledWith(overrides);
        });
    });

    it('does not import settings without settings', async () => {
        importSettings(changeEvent(json(undefined, overrides)), setSettings, setOverrides);

        await vi.waitFor(() => {
            expect(setSettings).not.toHaveBeenCalled();
            expect(setOverrides).toHaveBeenCalledWith(overrides);
        });
    });

    it('does not import overrides without overrides', async () => {
        importSettings(changeEvent(json(newSettings, undefined)), setSettings, setOverrides);

        await vi.waitFor(() => {
            expect(setSettings).toHaveBeenCalledWith(newSettings);
            expect(setOverrides).not.toHaveBeenCalled();
        });
    });

    it('does not import settings with no files field in target', async () => {
        importSettings(
            { target: {} } as unknown as ChangeEvent<HTMLInputElement, HTMLInputElement>,
            setSettings, setOverrides,
        );

        expect(setSettings).not.toHaveBeenCalled();
        expect(setOverrides).not.toHaveBeenCalled();
    });


    it('does not import settings with no files', async () => {
        importSettings(
            { target: { files: [] } } as unknown as ChangeEvent<HTMLInputElement, HTMLInputElement>,
            setSettings, setOverrides,
        );

        expect(setSettings).not.toHaveBeenCalled();
        expect(setOverrides).not.toHaveBeenCalled();
    });

    it('does not import settings with empty file', async () => {
        importSettings(
            { target: { files: [false] } } as unknown as ChangeEvent<HTMLInputElement, HTMLInputElement>,
            setSettings, setOverrides,
        );

        expect(setSettings).not.toHaveBeenCalled();
        expect(setOverrides).not.toHaveBeenCalled();
    });

    it('does not import settings with incorrect type', async () => {
        importSettings(
            {
                target: {
                    files: [new File([], 'WSync-LED-config.json', { type: 'image/png' })],
                },
            } as unknown as ChangeEvent<HTMLInputElement, HTMLInputElement>,
            setSettings, setOverrides,
        );

        expect(setSettings).not.toHaveBeenCalled();
        expect(setOverrides).not.toHaveBeenCalled();
    });
});
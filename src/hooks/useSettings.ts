// hooks/useSettings.ts
// Settings management hook.

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { loadSettings, saveSettings } from '../lib/storage/storage';
import { getLedCount } from '../lib/ledLayout/ledLayout';
import type { SettingsHook } from '../types/hooks';
import type { Settings } from '../types/app';
import validateSettings from '../lib/utils/validateSettings/validateSettings';

/**
 * Custom React hook to manage application settings.
 * @returns An object containing the current settings, a function to update the settings, a reference to the settings, and the LED count based on the current settings.
 */
export default function useSettings(): SettingsHook {
    const [settings, updateSettings] = useState<Settings>(
        validateSettings(loadSettings()),
    );

    const settingsRef = useRef(settings);

    useEffect(() => {
        settingsRef.current = settings;
        saveSettings(settings);
    }, [settings]);

    // Validate settings before using them
    const setSettings: Dispatch<SetStateAction<Settings>> = (value) => {
        updateSettings((previous) => {
            const next = typeof value === 'function' ? value(previous) : value;
            return validateSettings(next);
        });
    };

    return {
        settings,
        setSettings,
        settingsRef,
        ledCount: getLedCount(settings),
    };
}

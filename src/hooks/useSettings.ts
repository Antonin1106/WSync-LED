// hooks/useSettings.ts
// Settings management hook.

import { useEffect, useRef, useState } from 'react';
import { loadSettings, saveSettings } from '../lib/storage';
import { getLedCount } from '../lib/ledLayout';
import type { SettingsHook } from '../types/hooks';

/**
 * Custom React hook to manage application settings.
 * @returns An object containing the current settings, a function to update the settings, a reference to the settings, and the LED count based on the current settings.
 */
export default function useSettings(): SettingsHook {
    const [settings, setSettings] = useState(loadSettings);

    const settingsRef = useRef(settings);

    useEffect(() => {
        settingsRef.current = settings;
        saveSettings(settings);
    }, [settings]);

    return {
        settings,
        setSettings,
        settingsRef,
        ledCount: getLedCount(settings),
    };
}
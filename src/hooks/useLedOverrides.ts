// hooks/useLedOverrides.ts
// LEDs overrides management hook.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { LedOverride, Settings } from '../types/app';
import { loadOverrides, saveOverrides } from '../lib/storage';
import { getLedCount } from '../lib/ledLayout';
import type { OverridesHook } from '../types/hooks';

/**
 * Custom React hook to manage LED overrides based on the current settings.
 * @param settings The current application settings.
 * @returns An object containing the current LED overrides, functions to update the overrides and selected LED, and the count of disabled LEDs based on the current settings and overrides.
 */
export default function useLedOverrides(settings: Settings): OverridesHook {
    // Index of the currently selected LED, or null if no LED is selected
    const [selectedLed, setSelectedLed] = useState<number | null>(null);

    // Current override settings
    const [ledOverrides, setLedOverrides] = useState<Record<number, LedOverride>>(loadOverrides);

    // Compute the override for the currently selected LED, if any
    const selectedOverride = selectedLed === null ? undefined : ledOverrides[selectedLed];

    // Compute the number of disabled LEDs based on overrides
    const disabledLedCount = useMemo(
        () => Object.values(ledOverrides).filter((override) => !override.enabled).length,
        [ledOverrides],
    );

    const overridesRef = useRef(ledOverrides);

    // Updates the override for the currently selected LED.
    const updateSelectedLed = (update: LedOverride | null) => {
        if (selectedLed === null) return;

        setLedOverrides((current) => {
            const next = { ...current };
            if (update) next[selectedLed] = update;
            else delete next[selectedLed];
            return next;
        });
    };

    // Store overrides at each changes
    useEffect(() => {
        overridesRef.current = ledOverrides;
        saveOverrides(ledOverrides);
    }, [ledOverrides]);

    // Ensure that the selected LED index is valid based on the current settings and LED count
    useEffect(() => {
        if (selectedLed !== null && selectedLed >= getLedCount(settings)) (() => setSelectedLed(null))();
    }, [settings, selectedLed]);

    return {
        ledOverrides,
        setLedOverrides,
        selectedLed,
        setSelectedLed,
        selectedOverride,
        disabledLedCount,
        updateSelectedLed,
        overridesRef,
    };
}

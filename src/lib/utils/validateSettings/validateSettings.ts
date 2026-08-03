// lib/utils/validateSettings/validateSettings.ts
// Utilities functions to validate settings

import { getConstraints, initialSettings } from '../../../config/appConfig';
import type { Settings } from '../../../types/app';

/**
 * Verify all settings according to their constraints.
 * @param settings Current application settings.
 * @returns Validated settings with values according to their defined constraints.
 */
export default function validateSettings(settings: Settings): Settings {
    const constraints = getConstraints(settings);

    let changed = false;
    const validated = { ...settings };
    const constraintKeys = Object.keys(constraints) as Array<keyof typeof constraints>;

    for (const key of constraintKeys) {
        const constraint = constraints[key];
        const defaultValue = initialSettings[key];
        let nextValue;

        if (!constraint)
            continue;

        const value = validated[key];

        switch (constraint.type) {
            case 'boolean':
                nextValue = Boolean(value ?? defaultValue);
                break;
            case 'string':
                if (constraint.values && !constraint.values.includes(value as never))
                    nextValue = defaultValue;
                else
                    nextValue = (value as string).trim() || defaultValue;
                break;
            case 'number':
                if (typeof value !== 'number')
                    nextValue = defaultValue;
                else
                    nextValue = validateNumber(value, constraint.min ?? 0, constraint.max ?? 60, constraint.step ?? 1, defaultValue as number);
                break;
        }

        if (nextValue !== value) {
            (validated[key] as typeof nextValue) = nextValue;
            changed = true;
        }
    }

    return changed ? validated : settings;
}

/**
 * Validates a number against specified constraints and returns a valid number.
 * @param value The number to validate.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @param step The step increment for the value.
 * @param defaultValue The default value to return if the input is invalid.
 * @returns A valid number within the specified constraints.
 */
export function validateNumber(value: number, min: number, max: number, step: number = 1, defaultValue?: number) {
    if (Number.isNaN(value))
        return defaultValue ?? min;

    const clamped = Math.min(max, Math.max(min, value));
    const decimals = (step.toString().split('.')[1] ?? '').length;
    return Number((Math.round(clamped / step) * step).toFixed(decimals));
}
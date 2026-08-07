// lib/utils/validate/validateOverrides/validateOverrides.ts
// Utilities functions to validate overrides

import type { LedOverride } from '../../../../types/app';
import { hexToRgbw, rgbwToHex } from '../../../colors/colors';

/**
 * Verify all overrides.
 * @param overrides Current overrides.
 * @returns Validated overrides.
 */
export default function validateOverrides(overrides: Record<number, unknown>): Record<number, LedOverride> {
    let changed = false;
    const reduced = Object.keys(overrides).reduce((acc: Record<number, LedOverride>, k) => {
        const key = Number(k) as number;
        const input = overrides[key] as LedOverride;

        if (input !== undefined) {
            const out: LedOverride = {
                enabled: Boolean(input.enabled ?? true),
                color: '#' + rgbwToHex(hexToRgbw((input.color ?? '').trim())),
            };

            if (Object.values(input) !== Object.values(out))
                changed = true;

            acc[key] = out as LedOverride;
        }
        return acc;
    }, {} as Record<number, LedOverride>);

    if (Object.keys(reduced).length !== Object.keys(overrides).length)
        changed = true;

    return changed ? reduced : overrides as Record<number, LedOverride>;
}
// lib/lang.ts
// Language helper for translation

import i18n from '../config/langConfig';

/**
 * Translates a key into the currently selected language.
 * @param key The translation key to look up.
 * @param options Optional interpolation values for the translation.
 * @returns The translated string in the current language.
 */
export default function t(
    key: string,
    options?: Record<string, unknown>,
): string {
    return i18n.t(key, options);
}
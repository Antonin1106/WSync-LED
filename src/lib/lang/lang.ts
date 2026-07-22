// lib/lang/lang.ts
// Language helper for translation

import i18n from '../../config/langConfig';
import type { Lang, Translation } from '../../types/lang';

/**
 * Translates a key into the currently selected language.
 * @param key The translation key to look up.
 * @param options Optional interpolation values for the translation.
 * @returns The translated string in the current language.
 */
export default function t<K extends Lang>(
    key: K,
    options?: Record<string, unknown>,
): Translation[K] {
    return i18n.t(key, options);
}
// lib/lang/lang.tsx
// Language helper for translation

import type { ReactNode } from 'react';
import i18n from '../../config/langConfig';
import type { Lang, Translation } from '../../types/lang';
import { AnimatePresence } from 'framer-motion';
import { MotionBdi } from '../../components/Motion/Motion';

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


/**
 * Translates a key using the current language and renders it inside
 * an animated motion component.
 * @param key The translation key to look up.
 * @param options Optional interpolation values for the translation.
 * @returns An animated React node containing the translated string.
 */
export function ta<K extends Lang>(
    key: K,
    options?: Record<string, unknown>,
): ReactNode {
    return (
        <AnimatePresence mode="popLayout">
            <MotionBdi
                key={t(key, options)}
                dir="ltr"
                lang={i18n.language}
            >
                {t(key, options)}
            </MotionBdi>
        </AnimatePresence>
    );
}
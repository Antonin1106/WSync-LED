// types/lang.ts
// Type used by the language feature

import type en from '../lang/en.json';

/**
 * Type representing the base structure of the translations object.
 */
type BaseTranslation = typeof en;

/**
 * Type representing the pluralization keys in the translations object.
 */
type PluralKeys = {
    [K in keyof BaseTranslation as
    K extends `${infer Base}_one` | `${infer Base}_other`
    ? Base
    : never]: string;
};

/**
 * Type representing the translations object.
 */
export type Translation = BaseTranslation & PluralKeys;

/**
 * Type representing the available languages based on the keys in the translations object.
 */
export type Lang = keyof Translation;
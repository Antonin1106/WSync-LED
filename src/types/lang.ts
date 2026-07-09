import type en from '../lang/en.json';
import type fr from '../lang/fr.json';

/**
 * Type representing the available languages based on the keys in the translations object.
 */
export type Lang = keyof typeof en | keyof typeof fr;
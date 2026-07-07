import { initialSettings, LED_OVERRIDES_KEY, SETTINGS_KEY } from "../config/appConfig";
import type { LedOverride, Settings } from "../types/app";

/**
 * Loads persisted application settings from local storage.
 * @returns Settings object merged with defaults.
 */
export function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return initialSettings;
    return { ...initialSettings, ...JSON.parse(stored) } as Settings;
  } catch {
    return initialSettings;
  }
}

/**
 * Persists application settings to local storage.
 * @param settings Settings to save.
 */
export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Loads persisted LED overrides from local storage.
 * @returns Mapping of LED identifiers to override definitions.
 */
export function loadOverrides() {
  try {
    const stored = localStorage.getItem(LED_OVERRIDES_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as Record<number, LedOverride>;
  } catch {
    return {};
  }
}

/**
 * Persists LED overrides to local storage.
 * @param overrides Mapping of LED identifiers to override definitions.
 */
export function saveOverrides(overrides: Record<number, LedOverride>) {
  localStorage.setItem(LED_OVERRIDES_KEY, JSON.stringify(overrides));
}

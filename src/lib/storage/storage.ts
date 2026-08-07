// lib/storage/storage.ts
// Utilities functions for storage

import type { ChangeEvent } from 'react';
import { initialSettings, LED_OVERRIDES_KEY, SETTINGS_KEY } from '../../config/appConfig';
import type { LedOverride, Settings } from '../../types/app';

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

/**
 * Exports the current application settings and LED overrides as a JSON string.
 * @param settings The current application settings.
 * @param overrides A record of LED override settings, allowing for custom colors or disabled states.
 * @returns A data URI containing the JSON representation of the settings and overrides.
 */
export function exportSettings(settings: Settings, overrides: Record<number, LedOverride>): string {
  const appSettings = {
    '$schema': 'wsync-led.schema.json',
    [LED_OVERRIDES_KEY]: overrides,
    [SETTINGS_KEY]: settings,
  };

  return 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(appSettings, undefined, 4));
}

/**
 * Imports application settings and LED overrides from a JSON file selected by the user.
 * @param changeEvent The change event triggered by the file input element.
 * @param setSettings A callback function to update the application settings state.
 * @param setOverrides A callback function to update the LED overrides state.
 */
export function importSettings(changeEvent: ChangeEvent<HTMLInputElement, HTMLInputElement>, setSettings: (_settings: Settings) => void, setOverrides: (_o: Record<number, LedOverride>) => void) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const imported = JSON.parse(event.target?.result as string);
    if (imported[SETTINGS_KEY]) {
      setSettings({ ...imported[SETTINGS_KEY] });
    }
    if (imported[LED_OVERRIDES_KEY]) {
      setOverrides(imported[LED_OVERRIDES_KEY]);
    }
  };

  if (!changeEvent.target.files) return;
  if (changeEvent.target.files.length <= 0) return;
  if (!changeEvent.target.files[0]) return;
  if (changeEvent.target.files[0].type !== 'application/json') return;

  reader.readAsText(changeEvent.target.files[0]);
}
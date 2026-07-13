// components/ControlPanel/ControlPanel.tsx
// Component to renders the settings panel

import { mappingModes } from '../../config/appConfig';
import t from '../../lib/lang';
import { getLedCount, getModeHelp } from '../../lib/ledLayout';
import type { Settings } from '../../types/app';
import ControlRange from './ControlRange';
import styles from './ControlPanel.module.scss';
import field from '../../styles/modules/field.module.scss';
import sections from '../../styles/modules/sections.module.scss';

type Props = {
  settings: Settings;
  ledCount: number;
  onSettingsChange: (_settings: Settings) => void;
};

/**
 * Renders the control panel for LED output settings and mapping options.
 * @param props - The properties for the ControlPanel component.
 * @param props.settings - The current application settings.
 * @param props.ledCount - The total number of LEDs configured in the application.
 * @param props.onSettingsChange - A callback function to handle changes to the application settings.
 * @returns The rendered ControlPanel component.
 */
export default function ControlPanel({ settings, ledCount, onSettingsChange }: Props) {
  /**
   * Updates a numeric setting from an input string value.
   * @param key Setting key to update.
   * @param value New numeric value as text.
   */
  function setNumber(key: keyof Settings, value: string) {
    onSettingsChange({ ...settings, [key]: parseFloat(value) });
  }

  return (
    <section className={sections.panelSection}>
      <div className={sections.sectionTitle}>
        <h2>{t('controls')}</h2>
        <span>{ledCount} LEDs</span>
      </div>

      <label className={field.field}>
        <div className={field.fieldBox}>
          <span>{t('outputIP')}</span>
          <span />
          <span>{t('wsPath')}</span>
        </div>
        <div className={field.fieldBox}>
          <input
            value={settings.ip}
            placeholder="wled.local, 192.168.1.10..."
            autoCapitalize="off"
            autoCorrect="off"
            onInput={(event) =>
              onSettingsChange({ ...settings, ip: event.currentTarget.value })
            }
          />
          <strong>/</strong>
          <input
            value={settings.path}
            placeholder="ws"
            autoCapitalize="off"
            autoCorrect="off"
            onInput={(event) =>
              onSettingsChange({ ...settings, path: event.currentTarget.value })
            }
          />
        </div>
      </label>

      <label className={field.field}>
        <span>{t('diffusionMode')}</span>
        <select
          value={settings.mappingMode}
          onChange={(event) =>
            onSettingsChange({
              ...settings,
              mappingMode: event.currentTarget.value as Settings['mappingMode'],
            })
          }
        >
          {mappingModes.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {t(mode.label)}
            </option>
          ))}
        </select>
      </label>
      <p className={styles.helperText}>{getModeHelp(settings)}</p>

      <ControlRange label={t('FPS')} value={settings.fps} min={5} max={60} step={1} onChange={(value) => setNumber('fps', value)} />

      {settings.autoCompute ?
        <ControlRange label="LEDs" value={settings.leds} min={1} max={1600} step={1} onChange={(value) => setNumber('leds', value)} />
        : <>
          <ControlRange label="LED X" value={settings.ledX} min={1} max={40} step={1} onChange={(value) => setNumber('ledX', value)} />
          <ControlRange label="LED Y" value={settings.ledY} min={1} max={40} step={1} onChange={(value) => setNumber('ledY', value)} />
        </>
      }

      <ControlRange label="Gain" value={settings.gain} min={0.2} max={4} step={0.05} onChange={(value) => setNumber('gain', value)} />
      <ControlRange label={t('smoothing')} value={settings.smooth} min={0} max={0.95} step={0.01} onChange={(value) => setNumber('smooth', value)} />
      <ControlRange label={t('threshold')} value={settings.threshold} min={0} max={80} step={1} onChange={(value) => setNumber('threshold', value)} />
      <ControlRange label="Gamma" value={settings.gamma} min={1} max={3.4} step={0.05} onChange={(value) => setNumber('gamma', value)} />
      <ControlRange label="Saturation" value={settings.saturation} min={0} max={2.5} step={0.05} onChange={(value) => setNumber('saturation', value)} />

      <div className={styles.toggleGrid}>
        <label>
          <input
            type="checkbox"
            checked={settings.autoCompute}
            onChange={(event) =>
              onSettingsChange({ ...settings, autoCompute: event.currentTarget.checked, leds: getLedCount(settings) })
            }
          />
          {t('autoCompute')}</label>
      </div>
      {settings.autoCompute && settings.mappingMode === 'classic' &&
        <div className={styles.toggleGrid}>
          <label>
            <input
              type="checkbox"
              checked={settings.computeExactLedCount}
              onChange={(event) =>
                onSettingsChange({ ...settings, computeExactLedCount: event.currentTarget.checked })
              }
            />
            {t('computeExactLedCount')}</label>
        </div>}
      <div className={styles.toggleGrid}>
        <label>
          <input
            type="checkbox"
            checked={settings.reverse}
            onChange={(event) =>
              onSettingsChange({ ...settings, reverse: event.currentTarget.checked })
            }
          />
          {t('reverseOutputOrder')}
        </label>
      </div>
    </section>
  );
}
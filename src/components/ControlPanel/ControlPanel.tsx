// components/ControlPanel/ControlPanel.tsx
// Component to renders the settings panel

import { mappingModes } from '../../config/appConfig';
import t from '../../lib/lang/lang';
import { getLedCount } from '../../lib/ledLayout/ledLayout';
import type { Settings } from '../../types/app';
import ControlRange from './ControlRange';
import styles from './ControlPanel.module.scss';
import field from '../../styles/modules/field.module.scss';
import sections from '../../styles/modules/sections.module.scss';
import { MotionDiv } from '../Motion/Motion';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ModeHelp } from './ModeHelp';

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

      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p layout className={styles.helperText}>
            <AnimatePresence mode="wait">
              <ModeHelp key={settings.mappingMode} settings={settings} />
            </AnimatePresence>
          </motion.p>
          <ControlRange key="fps" label={t('FPS')} value={settings.fps} min={5} max={60} step={1} onChange={(value) => setNumber('fps', value)} />

          {settings.autoCompute &&
            <ControlRange key="LEDs" label="LEDs" value={settings.leds} min={1} max={1600} step={1} onChange={(value) => setNumber('leds', value)} />}
          {!settings.autoCompute &&
            <ControlRange key="x" label="LED X" value={settings.ledX} min={1} max={40} step={1} onChange={(value) => setNumber('ledX', value)} />}
          {!settings.autoCompute &&
            <ControlRange key="y" label="LED Y" value={settings.ledY} min={1} max={40} step={1} onChange={(value) => setNumber('ledY', value)} />}

          <ControlRange key="gain" label="Gain" value={settings.gain} min={0.2} max={4} step={0.05} onChange={(value) => setNumber('gain', value)} />
          <ControlRange key="smooth" label={t('smoothing')} value={settings.smooth} min={0} max={0.95} step={0.01} onChange={(value) => setNumber('smooth', value)} />
          <ControlRange key="threshold" label={t('threshold')} value={settings.threshold} min={0} max={80} step={1} onChange={(value) => setNumber('threshold', value)} />
          <ControlRange key="gamma" label="Gamma" value={settings.gamma} min={1} max={3.4} step={0.05} onChange={(value) => setNumber('gamma', value)} />
          <ControlRange key="saturation" label="Saturation" value={settings.saturation} min={0} max={2.5} step={0.05} onChange={(value) => setNumber('saturation', value)} />


          <MotionDiv key="reverse" className={styles.toggleGrid} >
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
          </MotionDiv>

          <MotionDiv key="autoCompute" className={styles.toggleGrid}>
            <label>
              <input
                type="checkbox"
                checked={settings.autoCompute}
                onChange={(event) =>
                  onSettingsChange({ ...settings, autoCompute: event.currentTarget.checked, leds: getLedCount(settings) })
                }
              />
              {t('autoCompute')}</label>
          </MotionDiv>

          {settings.autoCompute && settings.mappingMode === 'grid' &&
            <MotionDiv key="computeExactLedCount" className={styles.toggleGrid}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.computeExactLedCount}
                  onChange={(event) =>
                    onSettingsChange({ ...settings, computeExactLedCount: event.currentTarget.checked })
                  }
                />
                {t('computeExactLedCount')}</label>
            </MotionDiv>}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
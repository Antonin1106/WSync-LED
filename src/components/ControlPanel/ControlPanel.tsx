// components/ControlPanel/ControlPanel.tsx
// Component to renders the settings panel

import { getConstraints, initialSettings, mappingModes } from '../../config/appConfig';
import t, { ta } from '../../lib/lang/lang';
import { getLedCount } from '../../lib/ledLayout/ledLayout';
import type { Settings } from '../../types/app';
import ControlRange from './ControlRange';
import styles from './ControlPanel.module.scss';
import field from '../../styles/modules/field.module.scss';
import sections from '../../styles/modules/sections.module.scss';
import { MotionButton, MotionDiv } from '../Motion/Motion';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ModeHelp } from './ModeHelp';
import type { ChangeEvent } from 'react';
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

  function setSettings(key: keyof Settings, event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    onSettingsChange({ ...settings, [key]: event.currentTarget.value });
  }

  const constraint = getConstraints(settings);
  const hostname = window.location.hostname;

  return (
    <section className={sections.panelSection}>
      <div className={sections.sectionTitle}>
        <h2>{ta('controls')}</h2>
        <div className={styles.ledInfo}>
          <span>{ledCount} {t('LED', { count: ledCount })}</span>
          <select
            value={settings.protocol}
            onChange={(e) => onSettingsChange({
              ...settings,
              protocol: e.target.value as 'ddp' | 'JSON',
            })}>
            <option value="ddp">DDP</option>
            <option value="JSON">{t('unstableJSON')}</option>
          </select>
          <select value={settings.dataType} onChange={(e) => setSettings('dataType', e)}>
            <option value="RGB">RGB</option>
            <option value="RGBW">RGBW</option>
          </select>
        </div>
      </div>

      <label className={field.field}>
        <div className={field.fieldBox}>
          <span>{ta('outputIP')}</span>
          <span />
          <span>{ta('wsPath')}</span>
        </div>
        <div className={field.fieldBox}>
          <input
            value={settings.ip}
            placeholder={hostname + (', wled.local, 192.168.1.10').replace(`, ${hostname}`, '')}
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
        <span>{ta('diffusionMode')}</span>
        <select
          value={settings.mappingMode}
          onChange={(e) => setSettings('mappingMode', e)}
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
          <ControlRange key="fps" label={ta('FPS')} value={settings.fps} constraint={constraint.fps} onChange={(value) => setNumber('fps', value)} />

          {settings.autoCompute &&
            <ControlRange key="LEDs" label="LEDs" value={settings.leds} constraint={constraint.leds} onChange={(value) => setNumber('leds', value)} />}
          {!settings.autoCompute &&
            <ControlRange key="x" label="LED X" value={settings.ledX} constraint={constraint.ledX} onChange={(value) => setNumber('ledX', value)} />}
          {!settings.autoCompute &&
            <ControlRange key="y" label="LED Y" value={settings.ledY} constraint={constraint.ledY} onChange={(value) => setNumber('ledY', value)} />}

          <ControlRange key="gain" label="Gain" value={settings.gain} constraint={constraint.gain} onChange={(value) => setNumber('gain', value)} />
          <ControlRange key="smooth" label={ta('smoothing')} value={settings.smooth} constraint={constraint.smooth} onChange={(value) => setNumber('smooth', value)} />
          <ControlRange key="threshold" label={ta('threshold')} value={settings.threshold} constraint={constraint.threshold} onChange={(value) => setNumber('threshold', value)} />
          <ControlRange key="gamma" label="Gamma" value={settings.gamma} constraint={constraint.gamma} onChange={(value) => setNumber('gamma', value)} />
          <ControlRange key="saturation" label="Saturation" value={settings.saturation} constraint={constraint.saturation} onChange={(value) => setNumber('saturation', value)} />

          <MotionDiv key="reverse" className={styles.toggleGrid} >
            <label>
              <input
                type="checkbox"
                checked={settings.reverse}
                onChange={(event) =>
                  onSettingsChange({ ...settings, reverse: event.currentTarget.checked })
                }
              />
              {ta('reverseOutputOrder')}
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
              {ta('autoCompute')}</label>
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
                {ta('computeExactLedCount')}</label>
            </MotionDiv>}

          <div key="bottomLayout" className={styles.bottomLayout}>
            <MotionButton onClick={() => confirm(t('sureToReset?')) && onSettingsChange(initialSettings)}>
              {ta('resetDefaultValues')}
            </MotionButton>
          </div>
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
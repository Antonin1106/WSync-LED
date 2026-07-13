// components/LedEditor/LedEditor.tsx
// Component to renders a toolbar to edut LED layout

import t from '../../lib/lang';
import type { LedOverride } from '../../types/app';
import styles from './LedEditor.module.scss';
import field from '../../styles/modules/field.module.scss';

type Props = {
  selectedLed: number | null;
  disabledLedCount: number;
  selectedOverride?: LedOverride;
  onUpdateLed: (_override: LedOverride | null) => void;
  onResetAll: () => void;
};

/**
 * Shows the active LED selection and allows editing its color or enabled state.
 * @param props - The properties for the LedEditor component.
 * @param props.selectedLed - The index of the currently selected LED, or null if none is selected.
 * @param props.disabledLedCount - The number of LEDs that are currently disabled.
 * @param props.selectedOverride - The override settings for the selected LED, if any.
 * @param props.onUpdateLed - A callback function to handle updates to the selected LED's override settings.
 * @param props.onResetAll - A callback function to reset all LED overrides to their default state.
 * @returns The rendered LedEditor component.
 */
export default function LedEditor({
  selectedLed,
  disabledLedCount,
  selectedOverride,
  onUpdateLed,
  onResetAll,
}: Props) {
  const selectedColor = selectedOverride?.color ?? '#ffffff';
  const selectedEnabled = selectedOverride?.enabled ?? true;

  return (
    <div className={styles.ledEditor}>
      <div>
        <h3>{selectedLed === null ? t('noLEDSel') : `LED ${selectedLed + 1}`}</h3>
        <p>{disabledLedCount} {t('disabledLED', { count: disabledLedCount })}</p>
      </div>
      <div className={styles.editorActions}>
        <label className={styles.colorField}>
          <span>{t('color')}</span>
          <input
            type="color"
            value={selectedColor}
            disabled={selectedLed === null}
            onChange={(event) =>
              onUpdateLed({ enabled: true, color: event.currentTarget.value })
            }
          />
        </label>
        <button
          className={`${styles.compact} ${field.ghostButton}`}
          disabled={selectedLed === null}
          onClick={() =>
            onUpdateLed({ enabled: !selectedEnabled, color: selectedOverride?.color })
          }
        >
          {selectedEnabled ? t('disable') : t('enable')}
        </button>
        <button
          className={`${styles.compact} ${field.ghostButton}`}
          disabled={selectedLed === null}
          onClick={() => onUpdateLed(null)}
        >
          {t('resetLED')}
        </button>
        <button className={`${styles.compact} ${field.ghostButton}`} onClick={onResetAll}>
          {t('resetAll')}
        </button>
         {/*<button className={`${styles.compact} ${field.ghostButton}`} onClick={() => setShowFineSettings(showFineSettings)}>
          {t('adjust')}
        </button>*/}
      </div>
    </div>
  );
}

import type { LedOverride } from "../types/app";

type Props = {
  selectedLed: number | null;
  disabledLedCount: number;
  selectedOverride?: LedOverride;
  onUpdateLed: (override: LedOverride | null) => void;
  onResetAll: () => void;
};

/**
 * Shows the active LED selection and allows editing its color or enabled state.
 */
export default function LedEditor({
  selectedLed,
  disabledLedCount,
  selectedOverride,
  onUpdateLed,
  onResetAll,
}: Props) {
  const selectedColor = selectedOverride?.color ?? "#ffffff";
  const selectedEnabled = selectedOverride?.enabled ?? true;

  return (
    <div className="led-editor">
      <div>
        <h3>{selectedLed === null ? "No LED selected" : `LED ${selectedLed + 1}`}</h3>
        <p>{disabledLedCount} disabled LED(s)</p>
      </div>
      <div className="editor-actions">
        <label className="color-field">
          <span>Color</span>
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
          className="ghost-button compact"
          disabled={selectedLed === null}
          onClick={() =>
            onUpdateLed({ enabled: !selectedEnabled, color: selectedOverride?.color })
          }
        >
          {selectedEnabled ? "Disable" : "Enable"}
        </button>
        <button
          className="ghost-button compact"
          disabled={selectedLed === null}
          onClick={() => onUpdateLed(null)}
        >
          Reset LED
        </button>
        <button className="ghost-button compact" onClick={onResetAll}>
          Reset all
        </button>
      </div>
    </div>
  );
}

// components/ControlPanel/ControlRange.tsx
// Component to renders a numeric input range

import field from '../../styles/modules/field.module.scss';

/**
 * Renders a single numeric range control with a visible value label.
 * @param props - The properties for the ControlRange component.
 * @param props.label - The label text for the range control.
 * @param props.value - The current numeric value of the range control.
 * @param props.min - The minimum value for the range control.
 * @param props.max - The maximum value for the range control.
 * @param props.step - The step increment for the range control.
 * @param props.onChange - A callback function to handle changes to the range control's value.
 * @returns The rendered ControlRange component.
 */
export default function ControlRange({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (_value: string) => void;
}) {
  return (
    <label className={field.rangeField}>
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  );
}

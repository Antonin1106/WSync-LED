// components/ControlPanel/ControlRange.tsx
// Component to renders a numeric input range

import field from '../../styles/modules/field.module.scss';
import { motion } from 'framer-motion';

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
    <motion.label
      layout
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25, position: 'absolute', width: '0%' }}
      transition={{
        opacity: { duration: 0.1, damping: 20, stiffness: 300, type: 'spring', ease: 'linear' },
        y: { duration: 0.2, damping: 15, stiffness: 100, type: 'spring', ease: 'easeInOut' },
      }}
      className={field.rangeField}>
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
    </motion.label>
  );
}

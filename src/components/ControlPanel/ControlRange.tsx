// components/ControlPanel/ControlRange.tsx
// Component to renders a numeric input range

import { useState } from 'react';
import field from '../../styles/modules/field.module.scss';
import { motion } from 'framer-motion';
import type { NumberConstraint } from '../../types/app';
import { validateNumber } from '../../lib/utils/validateSettings/validateSettings';

/**
 * Renders a single numeric range control with a visible value label.
 * @param props - The properties for the ControlRange component.
 * @param props.label - The label text for the range control.
 * @param props.value - The current numeric value of the range control.
 * @param props.constraint - The numeric constraint for the range control.
 * @param props.onChange - A callback function to handle changes to the range control's value.
 * @returns The rendered ControlRange component.
 */
export default function ControlRange({
  label,
  value,
  constraint,
  onChange,
}: {
  label: string;
  value: number;
  constraint: NumberConstraint;
  onChange: (_value: string) => void;
}) {

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value.toString());
  const min = constraint.min ?? 0;
  const max = constraint.max ?? 60;
  const step = constraint.step ?? 1;

  function commit() {
    const input = text.trim().replace(',', '.');
    const parsed = Number.parseFloat(input);
    if (Number.isNaN(parsed))
      return setText(value.toString());
    const result = validateNumber(parsed, min, max, step).toString();

    setText(result);
    onChange(result);
    setIsEditing(false);
  }

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
      className={field.rangeField}
      onClick={() => {
        if (!isEditing)
          setText(value.toString());
        setIsEditing(true);
      }}
      onBlur={() => setIsEditing(false)}
    >
      <span>
        {label}
        <strong>
          {isEditing ?
            <input
              type="text"
              inputMode="decimal"
              value={text}
              autoFocus
              onChange={(e) => setText(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter')
                  e.currentTarget.blur();

                if (e.key === 'Escape') {
                  setText(value.toString());
                  setIsEditing(false);
                  e.currentTarget.blur();
                }
              }}
            />
            : value
          }
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
    </motion.label>
  );
}

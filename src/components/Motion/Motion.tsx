// components/Motion/Motion.tsx
// Component to renders motion-enabled elements with animations

import { motion, type HTMLMotionProps } from 'framer-motion';

/**
 * Renders a motion-enabled button with hover and tap animations.
 * @param props - The properties for the MotionButton component, extending HTMLMotionProps for a button element.
 * @returns - The rendered MotionButton component with specified animations and transitions.
 */
export function MotionButton(props: HTMLMotionProps<'button'>) {
    return (
        <motion.button
            whileHover={!props.disabled ? { scale: 1.06 } : undefined}
            whileTap={{ scale: 0.95 }}
            transition={{
                duration: 0.15, damping: 10, stiffness: 200, type: 'spring', ease: 'easeInOut',
            }}
            {...props}
        />
    );
}

/**
 * Renders a motion-enabled div with fade-in and fade-out animations.
 * @param props - The properties for the MotionDiv component, extending HTMLMotionProps for a div element.
 * @returns - The rendered MotionDiv component with specified animations and transitions.
 */
export function MotionDiv(props: HTMLMotionProps<'div'>) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25, display: 'none' }}
            transition={{
                opacity: { duration: 0.1, damping: 20, stiffness: 300, type: 'spring', ease: 'linear' },
                y: { duration: 0.2, damping: 15, stiffness: 100, type: 'spring', ease: 'easeInOut' },
            }}
            {...props}
        />
    );
}

/**
 * Renders a motion-enabled span with fade-in and fade-out animations.
 * @param props - The properties for the MotionSpan component, extending HTMLMotionProps for a span element.
 * @returns - The rendered span component with specified animations and transitions.
 */
export function MotionSpan(props: HTMLMotionProps<'span'>) {
    return (
        <motion.span
            style={{ display: 'inline-block' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
                opacity: { duration: 0.15, damping: 20, stiffness: 300, type: 'spring', ease: 'linear' },
                y: { duration: 0.1, damping: 15, stiffness: 100, type: 'spring', ease: 'easeInOut' },
            }}
            {...props}
        />
    );
}
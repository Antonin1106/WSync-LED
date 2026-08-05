// components/App/Controls/Island/Island.tsx
// Render the Island component.

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styles from './Island.module.scss';
import t, { ta } from '../../../../lib/lang/lang';

/**
 * A component representing an island control for displaying connection state information.
 * @param props The properties for the Island component.
 * @param props.connectionState The actual conneciton state
 * @returns The rendered Island component.
 */
export default function Island({ connectionState }: {
    connectionState: 'connected' | 'disconnected' | 'wsError' | 'connecting' | 'ready'
}) {

    const [width, setWidth] = useState(80); // Base width
    const contentRef = useRef<HTMLDivElement | null>(null);
    const translation = t(connectionState);

    useEffect(() => {
        if (!contentRef.current)
            return;
        (() => setWidth(contentRef.current?.scrollWidth))();
    }, [setWidth, contentRef, translation]);

    return (
        <motion.div className={`${styles.island} ${styles[connectionState]}`}
            whileTap={{ scaleX: 0.8, scaleY: 0.98 }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 0.9, y: 0, width: width + 50 }}
            transition={
                {
                    type: 'spring', duration: 0.4, damping: 10, ease: 'easeOut',
                    width: { type: 'spring', duration: 0.2, damping: 14, ease: 'easeInOut', stiffness: 100 },
                }}
        >
            <div ref={contentRef}>
                {ta(connectionState)}
            </div>
        </motion.div>
    );
}
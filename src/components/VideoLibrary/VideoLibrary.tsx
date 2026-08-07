// components/VideoLibrary/VideoLibrary.tsx
// Component to renders the video library panel

import { ArrowBigDown, LucideX } from 'lucide-react';
import { FormatBytes } from '../../lib/videoCache';
import type { CachedVideoMeta } from '../../types/app';
import t, { ta } from '../../lib/lang/lang';
import styles from './VideoLibrary.module.scss';
import sections from '@/styles/modules/sections.module.scss';
import { MotionButton } from '../Motion/Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';

type Props = {
  videos: CachedVideoMeta[]; onOpen: (_id: number) => void; onDelete: (_id: number) => void;
};

/**
 * Renders the video library panel, displaying a list of cached videos with options to open or delete them.
 * @param props - The properties for the VideoLibrary component.
 * @param props.videos - An array of cached video metadata to display in the library.
 * @param props.onOpen - A callback function to handle opening a video when its corresponding button is clicked.
 * @param props.onDelete - A callback function to handle deleting a video when its corresponding button is clicked.
 * @returns The rendered VideoLibrary component.
 */
export default function VideoLibrary({ videos, onOpen, onDelete }: Props) {
  const [isHidden, setIsHidden] = useState(false);
  const libraryListRef = useRef<HTMLDivElement | null>(null);

  const onAnimationStart = () => {
    if (libraryListRef.current && libraryListRef.current.scrollHeight <= 600) libraryListRef.current.style.overflowY = 'hidden';
  };

  const onAnimationComplete = () => { if (libraryListRef.current && libraryListRef.current.scrollHeight > 600) libraryListRef.current.style.overflowY = 'auto'; };

  return (
    <motion.section
      className={sections.panelSection}
      style={{ paddingRight: 0, paddingBottom: 4 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      layout="position"
    >
      <div
        className={sections.sectionTitle}
        style={{ paddingRight: 12 }}
      >
        <h2>{ta('localLibrary')}</h2>
        <span className={styles.rightCorner}>
          <AnimatePresence mode="popLayout">
            <motion.b
              key="b"
              layout>
              {videos.length}
            </motion.b>
            {videos.length > 1 &&
              <motion.span
                key="span"
                onClick={() => setIsHidden(!isHidden)}
                initial={{ rotate: isHidden ? 180 : 0, opacity: 0, x: 50 }}
                animate={{ rotate: isHidden ? 180 : 0, opacity: 1, x: 0 }}
                exit={{ rotate: isHidden ? 180 : 0, opacity: 0, x: 50 }}
                transition={{ duration: .4, ease: 'easeInOut' }} >
                <ArrowBigDown />
              </motion.span>
            }
          </AnimatePresence>
        </span>
      </div>
      <AnimatePresence>
        {videos.length === 0 &&
          (<motion.p
            key="p"
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          > {ta('openedVideos')}
          </motion.p>)}
        <AnimatePresence>
          {(!isHidden || (videos.length <= 1 && videos.length > 0)) &&
            <motion.div
              ref={libraryListRef}
              layout
              onAnimationStart={onAnimationStart}
              onAnimationComplete={onAnimationComplete}
              className={styles.libraryList}
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 600, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut', damping: 10, stiffness: 50 }} >
              <AnimatePresence>
                {videos.map((video) => (
                  <motion.article
                    className={styles.libraryItem}
                    key={video.id}
                    initial={{ opacity: .5, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -500, height: 0, margin: 0 }}
                    transition={{ duration: .3, ease: 'easeInOut' }}
                    onAnimationStart={onAnimationStart}
                    onAnimationComplete={onAnimationComplete}
                    layout >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onOpen(video.id)}
                    >
                      <strong>{video.name}</strong>
                      <span><FormatBytes size={video.size} /></span>
                    </motion.button>
                    <MotionButton
                      className={styles.iconButton}
                      aria-label={`${t('delete')} ${video.name}`}
                      onClick={() => onDelete(video.id)} >
                      <LucideX />
                    </MotionButton>
                  </motion.article>))}
              </AnimatePresence>
            </motion.div>}
        </AnimatePresence>
      </AnimatePresence>
    </motion.section >
  );
}
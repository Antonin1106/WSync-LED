// components/VideoLibrary/VideoLibrary.tsx
// Component to renders the video library panel

import { LucideX } from 'lucide-react';
import { FormatBytes } from '../../lib/videoCache';
import type { CachedVideoMeta } from '../../types/app';
import t from '../../lib/lang/lang';
import styles from './VideoLibrary.module.scss';
import sections from '@/styles/modules/sections.module.scss';
import { MotionButton } from '../Motion/Motion';
import { motion } from 'framer-motion';

type Props = {
  videos: CachedVideoMeta[];
  onOpen: (_id: number) => void;
  onDelete: (_id: number) => void;
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
  return (
    <section className={sections.panelSection}>
      <div className={sections.sectionTitle}>
        <h2>{t('localLibrary')}</h2>
        <span>{videos.length}</span>
      </div>
      <div className={styles.libraryList}>
        {videos.length === 0 && (
          <p className={styles.emptyState}>{t('openedVideos')}</p>
        )}
        {videos.map((video) => (
          <article className={styles.libraryItem} key={video.id}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpen(video.id)}>
              <strong>{video.name}</strong>
              <span><FormatBytes size={video.size} /></span>
            </motion.button>
            <MotionButton
              className={styles.iconButton}
              aria-label={`${t('delete')} ${video.name}`}
              onClick={() => onDelete(video.id)}
            >
              <LucideX />
            </MotionButton>
          </article>
        ))}
      </div>
    </section>
  );
}

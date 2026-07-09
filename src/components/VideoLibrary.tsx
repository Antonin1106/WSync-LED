import { LucideX } from 'lucide-react';
import { formatBytes } from '../lib/videoCache';
import type { CachedVideoMeta } from '../types/app';
import t from '../lib/lang';

type Props = {
  videos: CachedVideoMeta[];
  onOpen: (_id: number) => void;
  onDelete: (_id: number) => void;
};

export default function VideoLibrary({ videos, onOpen, onDelete }: Props) {
  return (
    <section className="panel-section">
      <div className="section-title">
        <h2>{t('localLibrary')}</h2>
        <span>{videos.length}</span>
      </div>
      <div className="library-list">
        {videos.length === 0 && (
          <p className="empty-state">{t('openedVideos')}</p>
        )}
        {videos.map((video) => (
          <article className="library-item" key={video.id}>
            <button onClick={() => onOpen(video.id)}>
              <strong>{video.name}</strong>
              <span>{formatBytes(video.size)}</span>
            </button>
            <button
              className="icon-button"
              aria-label={`${t('delete')} ${video.name}`}
              onClick={() => onDelete(video.id)}
            >
              <LucideX />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

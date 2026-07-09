import type React from 'react';
import t from '../lib/lang';

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentVideoName: string;
  onLoadVideo: (_event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Renders the media player surface and file picker used to load a video source.
 */
export default function VideoCard({
  videoRef,
  canvasRef,
  currentVideoName,
  onLoadVideo,
}: Props) {
  return (
    <div className="video-card">
      <video id="video" ref={videoRef} controls playsInline preload="metadata" />
      <canvas id="canvas" ref={canvasRef} hidden />
      <label className="file-button" htmlFor="fileInput">
        {t('chooseVideo')}
      </label>
      <input
        type="file"
        id="fileInput"
        accept="video/*,.mp4,.mov,.m4v,.webm,.avi,.mkv"
        onChange={onLoadVideo}
      />
      <p className="video-name">{currentVideoName || t('noVideoLoaded')}</p>
    </div>
  );
}

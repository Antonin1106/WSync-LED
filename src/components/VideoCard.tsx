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
 * @param props - The properties for the VideoCard component.
 * @param props.videoRef - A React ref object pointing to the HTML video element for playback.
 * @param props.canvasRef - A React ref object pointing to the HTML canvas element used for LED preview rendering.
 * @param props.currentVideoName - The name of the currently loaded video file, or an empty string if none is loaded.
 * @param props.onLoadVideo - A callback function to handle the selection of a new video file from the file input.
 * @returns The rendered VideoCard component.
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

// components/App/Controls/Controls.tsx
// Component to renders the Controls section.

import { useReducer } from 'react';
import t from '../../../lib/lang/lang';
import LanguageSelector from '../../LanguageSelector/LanguageSelector';
import VideoCard from '../../VideoCard/VideoCard';
import VideoLibrary from '../../VideoLibrary/VideoLibrary';
import ControlPanel from '../../ControlPanel/ControlPanel';
import styles from './Controls.module.scss';
import field from '../../../styles/modules/field.module.scss';
import type { LedRendererHook, SettingsHook, VideoCacheHook, VideoHook, WebSocketHook } from '../../../types/hooks';
import { loadVideo, openCachedVideo } from '../../../lib/videoCache';
import { MotionButton } from '../../Motion/Motion';

/**
 * Controls component that provides the main user interface for managing video playback, LED rendering, and application settings.
 * @param props - The properties for the Controls component.
 * @param props.ledRenderer - The LED renderer hook that manages the LED rendering process.
 * @param props.settings - The settings hook that manages application settings.
 * @param props.video - The video hook that manages video playback and state.
 * @param props.videoCache - The video cache hook that manages cached videos.
 * @param props.websocket - The websocket hook that manages the websocket connection state.
 * @returns The rendered Controls component.
 */
export default function Controls({ ledRenderer, settings, video, videoCache, websocket }:
    {
        ledRenderer: LedRendererHook,
        settings: SettingsHook,
        video: VideoHook,
        videoCache: VideoCacheHook,
        websocket: WebSocketHook
    }) {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    return (
        <section className={styles.controlSurface}>
            <header className={styles.appHeader}>
                <div>
                    <p className={styles.eyebrow}>{t('desc')}</p>
                    <h1>{t('appName')}</h1>
                    <LanguageSelector onChange={() => forceUpdate()} />
                </div>

                <span
                    className={styles[websocket.connectionState]}
                >
                    {t(websocket.connectionState)}
                </span>
            </header>

            <VideoCard
                videoRef={video.videoRef}
                canvasRef={video.canvasRef}
                currentVideoName={video.currentVideoName}
                onLoadVideo={(e) => loadVideo(e, video.setVideoSource, videoCache.refreshCachedVideos, ledRenderer.start)}
            />

            <div className={styles.actionRow}>
                <MotionButton
                    className={styles.primaryButton}
                    onClick={ledRenderer.start}
                    disabled={ledRenderer.isRunning}
                >
                    {t('start')}
                </MotionButton>

                <MotionButton
                    className={field.ghostButton}
                    onClick={ledRenderer.stop}
                    disabled={!ledRenderer.isRunning}
                >
                    {t('stop')}
                </MotionButton>
            </div>

            <VideoLibrary
                videos={videoCache.cachedVideos}
                onOpen={(id) => openCachedVideo(id, video.setVideoSource, ledRenderer.start)}
                onDelete={videoCache.removeCachedVideo}
            />

            <ControlPanel
                settings={settings.settings}
                ledCount={settings.ledCount}
                onSettingsChange={settings.setSettings}
            />
        </section>
    );
}

// App.tsx
// Main app component

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import ControlPanel from './components/ControlPanel/ControlPanel';
import LedEditor from './components/LedEditor/LedEditor';
import LedPreview from './components/LedPreview/LedPreview';
import VideoCard from './components/VideoCard/VideoCard';
import VideoLibrary from './components/VideoLibrary/VideoLibrary';
import { buildLedFrame, getAnalysisSize, getLedCount } from './lib/ledLayout';
import { loadOverrides, loadSettings, saveOverrides, saveSettings } from './lib/storage';
import {
  deleteCachedVideo,
  getCachedVideos,
  readCachedVideo,
  saveCachedVideo,
} from './lib/videoCache';
import type { CachedVideoMeta, LedGrid, LedOverride, Rgb, Settings } from './types/app';
import t from './lib/lang';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import field from './styles/modules/field.module.scss';
import styles from './App.module.scss';
import computeLedGrid from './lib/ledLayout/computeLedGrid';
import computeExactLedGrid from './lib/ledLayout/computeExactLedGrid';
import computeLedPerimeter from './lib/ledLayout/computeLedPerimeter';
import computeLedBorder from './lib/ledLayout/computeLedBorder';
import { MotionButton } from './components/Motion/Motion';
import {
  Panel,
  Group,
  Separator,
} from 'react-resizable-panels';
import useIsDesktop from './lib/hooks/useIsDesktop';
/**
 * Main application shell that manages video loading, LED preview rendering and websocket streaming.
 * @returns The rendered App component.
 */
export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [cachedVideos, setCachedVideos] = useState<CachedVideoMeta[]>([]);
  const [currentVideoName, setCurrentVideoName] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [connectionState, setConnectionState] = useState('ready');
  const [ledColors, setLedColors] = useState<Rgb[]>([]);
  const [selectedLed, setSelectedLed] = useState<number | null>(null);
  const [ledOverrides, setLedOverrides] =
    useState<Record<number, LedOverride>>(loadOverrides);
  const [editLeds, setEditLeds] = useState(false);

  const settingsRef = useRef(settings);
  const overridesRef = useRef(ledOverrides);
  const previousColorsRef = useRef<Rgb[]>([]);
  const videoUrlRef = useRef<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const runningRef = useRef(false);
  const lastFrameRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const ledCount = getLedCount(settings);
  const selectedOverride = selectedLed === null ? undefined : ledOverrides[selectedLed];
  const disabledLedCount = useMemo(
    () => Object.values(ledOverrides).filter((override) => !override.enabled).length,
    [ledOverrides],
  );
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    document.title = t('appName');
    refreshCachedVideos();
  }, []);

  useEffect(() => {
    settingsRef.current = settings;
    saveSettings(settings);
    if (selectedLed !== null && selectedLed >= getLedCount(settings)) (() => setSelectedLed(null))();
  }, [settings, selectedLed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !settings.autoCompute) return;

    const updateGrid = () => {
      if (!video.videoWidth || !video.videoHeight) return;

      let leds: LedGrid;

      if (settings.mappingMode === 'classic')
        leds = settings.computeExactLedCount
          ? computeExactLedGrid(video.videoWidth, video.videoHeight, settings.leds)
          : computeLedGrid(video.videoWidth, video.videoHeight, settings.leds);
      else if (settings.mappingMode === 'perimeter')
        leds = computeLedPerimeter(video.videoWidth, video.videoHeight, settings.leds);
      else if (settings.mappingMode === 'border')
        leds = computeLedBorder(video.videoWidth, video.videoHeight, settings.leds);

      setSettings((current) => {
        if (current.ledX === leds.ledX && current.ledY === leds.ledY) return current;
        return { ...current, ledX: leds.ledX, ledY: leds.ledY };
      });
    };

    video.addEventListener('loadedmetadata', updateGrid);
    updateGrid();
    return () => video.removeEventListener('loadedmetadata', updateGrid);
  }, [currentVideoName, settings.autoCompute, settings.computeExactLedCount, settings, settings.leds]);

  useEffect(() => {
    overridesRef.current = ledOverrides;
    saveOverrides(ledOverrides);
  }, [ledOverrides]);

  useEffect(() => {
    return () => {
      stop();
      revokeVideoUrl();
    };
  }, []);

  /**
   * Refreshes the list of cached videos from IndexedDB.
   */
  async function refreshCachedVideos() {
    if (!('indexedDB' in window)) return;
    try {
      setCachedVideos(await getCachedVideos());
    } catch (error) {
      console.warn(t('unavailableVideoCache') + ' :', error);
    }
  }

  /**
   * Releases the currently active object URL for the loaded video.
   */
  function revokeVideoUrl() {
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }
  }

  /**
   * Attaches a local video blob to the media element and updates the visible file name.
   * @param blob Video file data to play.
   * @param name Human-readable file name for the current media source.
   */
  function setVideoSource(blob: Blob, name: string) {
    if (!videoRef.current) return;

    revokeVideoUrl();
    const url = URL.createObjectURL(blob);
    videoUrlRef.current = url;
    videoRef.current.src = url;
    videoRef.current.load();
    setCurrentVideoName(name);
  }

  /**
   * Handles a selected local video file and stores it in the cache.
   * @param event File input change event.
   */
  async function loadVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setVideoSource(file, file.name);

    try {
      const existingVideos = await getCachedVideos();
      let exist = false;
      existingVideos.forEach(v => {
        if (v.name === file.name && v.size === file.size) {
          exist = true;
          return;
        }
      });

      if (exist)
        return;

      await saveCachedVideo(file);
      await refreshCachedVideos();
    } catch (error) {
      console.warn(t('noVideoCache') + ' :', error);
    }
  }

  /**
   * Opens a cached video by its database identifier.
   * @param id Cached video identifier.
   */
  async function openCachedVideo(id: number) {
    try {
      const video = await readCachedVideo(id);
      if (video) setVideoSource(video.blob, video.name);
    } catch (error) {
      console.warn(t('errorOpenVideo') + ' :', error);
    }
  }

  /**
   * Removes a cached video entry and refreshes the library view.
   * @param id Cached video identifier.
   */
  async function removeCachedVideo(id: number) {
    try {
      await deleteCachedVideo(id);
      await refreshCachedVideos();
    } catch (error) {
      console.warn(t('errorDeleteVideo') + ' :', error);
    }
  }

  /**
   * Opens a websocket connection to the configured LED controller.
   */
  function connectWS() {
    wsRef.current?.close();

    const ws = new WebSocket(`ws://${settingsRef.current.ip}/${(settingsRef.current.path).replace(/^\/+/, '')}`);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => setConnectionState('connected');
    ws.onclose = () => setConnectionState('disconnected');
    ws.onerror = () => setConnectionState('wsError');
    wsRef.current = ws;
    setConnectionState('connecting');
  }

  function getStatusClass(connectionState: string) {
    switch (connectionState) {
      case 'disconnected':
        return styles.error;
      case 'connected':
        return styles.online;
      case 'wsError':
        return styles.error;
      default:
        return '';
    }
  }

  /**
   * Stops playback, cancels any pending animation frame and closes the websocket.
   */
  function stop() {
    runningRef.current = false;
    setIsRunning(false);

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    wsRef.current?.close();
    wsRef.current = null;
  }

  /**
   * Runs the animation loop and sends the next LED frame to the controller when ready.
   */
  function loop() {
    const ws = wsRef.current;

    if (!runningRef.current) return;

    if (!ws) {
      animationFrameRef.current = requestAnimationFrame(loop);
      return;
    }

    const currentSettings = settingsRef.current;
    const now = performance.now();
    if (now - lastFrameRef.current < 1000 / currentSettings.fps) {
      animationFrameRef.current = requestAnimationFrame(loop);
      return;
    }

    lastFrameRef.current = now;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(loop);
      return;
    }

    const analysis = getAnalysisSize(currentSettings);
    canvas.width = analysis.width;
    canvas.height = analysis.height;

    ctxRef.current ??= canvas.getContext('2d', { willReadFrequently: true });
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, analysis.width, analysis.height);

    const frame = buildLedFrame(
      ctx.getImageData(0, 0, analysis.width, analysis.height),
      currentSettings,
      overridesRef.current,
      previousColorsRef.current,
    );

    previousColorsRef.current = frame.colors;
    setLedColors(frame.colors);
    if (ws.readyState === 1)
      ws.send(frame.packet.slice().buffer);

    animationFrameRef.current = requestAnimationFrame(loop);
  }

  /**
   * Starts the capture loop and opens a websocket connection for streaming.
   */
  function start() {
    previousColorsRef.current = [];
    connectWS();
    runningRef.current = true;
    setIsRunning(true);
    loop();
  }

  /**
   * Updates the override for the currently selected LED.
   * @param update New override data or null to remove the override.
   */
  function updateSelectedLed(update: LedOverride | null) {
    if (selectedLed === null) return;

    setLedOverrides((current) => {
      const next = { ...current };
      if (update) next[selectedLed] = update;
      else delete next[selectedLed];
      return next;
    });
  }
  const isDesktop = useIsDesktop();

  const controls = (
    <section className={styles.controlSurface}>
      <header className={styles.appHeader}>
        <div>
          <p className={styles.eyebrow}>{t('desc')}</p>
          <h1>{t('appName')}</h1>
          <LanguageSelector onChange={() => forceUpdate()} />
        </div>

        <span
          className={
            isRunning
              ? `${styles.status} ${styles.online}`
              : styles.status
          }
        >
          {t(connectionState)}
        </span>
      </header>

      <VideoCard
        videoRef={videoRef}
        canvasRef={canvasRef}
        currentVideoName={currentVideoName}
        onLoadVideo={loadVideo}
      />

      <div className={styles.actionRow}>
        <button
          className={styles.primaryButton}
          onClick={start}
          disabled={isRunning}
        >
          {t('start')}
        </button>

        <button
          className={field.ghostButton}
          onClick={stop}
          disabled={!isRunning}
        >
          {t('stop')}
        </button>
      </div>

      <VideoLibrary
        videos={cachedVideos}
        onOpen={openCachedVideo}
        onDelete={removeCachedVideo}
      />

      <ControlPanel
        settings={settings}
        ledCount={ledCount}
        onSettingsChange={setSettings}
      />
    </section>
  );

  const preview = (
    <LedPreview
      settings={settings}
      colors={ledColors}
      overrides={ledOverrides}
      selectedLed={selectedLed}
      editMode={editLeds}
      onEditModeChange={setEditLeds}
      onSelectLed={setSelectedLed}
      videoRef={videoRef}
    >
      <LedEditor
        selectedLed={selectedLed}
        disabledLedCount={disabledLedCount}
        selectedOverride={selectedOverride}
        onUpdateLed={updateSelectedLed}
        onResetAll={() => setLedOverrides({})}
      />
    </LedPreview>
  );

  return (
    <main className={styles.appShell}>
      {isDesktop ? (
        <Group
          orientation="horizontal"
          style={{ height: '100vh', width: '100vw' }}
        >
          <Panel defaultSize="400px" minSize="350px" maxSize="700px">
            {controls}
          </Panel>

          <Separator
            style={{
              width: 1,
              cursor: 'col-resize',
              background: '#dddddd7c',
            }}
          />
          <Panel defaultSize="400px" minSize="350px">
            {preview}
          </Panel>
        </Group>
      ) : (
        <>
          {controls}
          {preview}
        </>
      )}
    </main >
  );
}
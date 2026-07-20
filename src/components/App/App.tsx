// components/App/App.tsx
// Main app component

import { useEffect, useMemo } from 'react';
import t from '../../lib/lang';
import styles from './App.module.scss';
import { Panel, Group, Separator } from 'react-resizable-panels';
import useIsDesktop from '../../hooks/useIsDesktop';
import useSettings from '../../hooks/useSettings';
import useLedOverrides from '../../hooks/useLedOverrides';
import useVideo from '../../hooks/useVideo';
import useAutoLedGrid from '../../hooks/useAutoLedGrid';
import useWebSocket from '../../hooks/useWebSocket';
import useVideoCache from '../../hooks/useVideoCache';
import useLedRenderer from '../../hooks/useLedRenderer';
import Preview from './Preview/Preview';
import Controls from './Controls/Controls';

/**
 * Main application shell that manages video loading, LED preview rendering and websocket streaming.
 * @returns The rendered App component.
 */
export default function App() {

  // Get dependencies from custom hooks
  const isDesktop = useIsDesktop();
  const settings = useSettings();
  const overrides = useLedOverrides(settings.settings);
  const video = useVideo();
  const videoCache = useVideoCache();
  const websocket = useWebSocket(settings.settingsRef);

  const ledRenderer = useLedRenderer({
    settingsRef: settings.settingsRef,
    overridesRef: overrides.overridesRef,
    videoRef: video.videoRef,
    canvasRef: video.canvasRef,
    websocket,
  });

  // Automatically compute the LED grid based on the current video dimensions and settings
  useAutoLedGrid({
    settings: settings.settings,
    currentVideoName: video.currentVideoName,
    videoRef: video.videoRef,
    setSettings: settings.setSettings,
  });

  useEffect(() => {
    document.title = t('appName');
  }, []);

  const preview = useMemo(() => (
    <Preview
      ledColors={ledRenderer.ledColors}
      overrides={overrides}
      settings={settings.settings}
      videoRef={video.videoRef}
    />
  ), [ledRenderer.ledColors, overrides, settings.settings, video.videoRef]);

  return (
    <main className={styles.appShell}>
      <Group
        disabled={!isDesktop}
        orientation={isDesktop ? 'horizontal' : 'vertical'}
        style={
          isDesktop
            ? { height: '100vh', width: '100vw' }
            : { display: 'flex', flexDirection: 'column', width: '100vw' }
        }
      >
        <Panel
          defaultSize={isDesktop ? '400px' : undefined}
          minSize={isDesktop ? '350px' : undefined}
          maxSize={isDesktop ? '700px' : undefined}
          disabled={!isDesktop}
        >
          <Controls
            ledRenderer={ledRenderer}
            settings={settings}
            video={video}
            videoCache={videoCache}
            websocket={websocket}
          />
          {!isDesktop && preview}
        </Panel>

        {isDesktop &&
          <> <Separator
            disabled={!isDesktop}
            style={
              isDesktop
                ? {
                  width: 1,
                  cursor: 'col-resize',
                  background: '#dddddd7c',
                }
                : {
                  display: 'none',
                }
            }
          />

            <Panel
              defaultSize={isDesktop ? '400px' : undefined}
              minSize={isDesktop ? '350px' : undefined}
              disabled={!isDesktop}
            >
              {preview}
            </Panel>
          </>}
      </Group>
    </main>
  );
}
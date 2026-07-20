// types/hooks.ts
// Hooks return types

import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { CachedVideoMeta, LedOverride, Rgb, Settings } from './app';


// Return type of useLedRenderer
export type LedRendererHook = {
    start: () => void;
    stop: () => void;
    isRunning: boolean;
    ledColors: Rgb[];
}

// Return type of useOverrides
export type OverridesHook = {
    ledOverrides: Record<number, LedOverride>;
    setLedOverrides: Dispatch<SetStateAction<Record<number, LedOverride>>>;
    selectedLed: number | null;
    setSelectedLed: Dispatch<SetStateAction<number | null>>;
    selectedOverride: LedOverride | undefined;
    disabledLedCount: number;
    updateSelectedLed: (_update: LedOverride | null) => void;
    overridesRef: RefObject<Record<number, LedOverride>>;
}

// Return type of useSettings
export type SettingsHook = {
    settings: Settings;
    setSettings: Dispatch<SetStateAction<Settings>>;
    settingsRef: RefObject<Settings>;
    ledCount: number;
}

// Return type of useVideo
export type VideoHook = {
    videoRef: RefObject<HTMLVideoElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    currentVideoName: string;
    setVideoSource: (_blob: Blob, _name: string) => void;
    revokeVideoUrl: () => void;
}

// Return type of useVideoCache
export type VideoCacheHook = {
    cachedVideos: CachedVideoMeta[];
    refreshCachedVideos: () => Promise<void>;
    removeCachedVideo: (_id: number) => Promise<void>;
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'ready' | 'wsError';

// Return type of useWebSocket
export type WebSocketHook = {
    wsRef: RefObject<WebSocket | null>;
    connectionState: ConnectionState;
    connect: () => void;
    disconnect: () => void;
}
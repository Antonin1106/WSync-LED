// hooks/useLedRenderer.ts
// LEDs renderer management hook.

import { useCallback, useRef, useState } from 'react';
import type { LedOverride, Rgb, Settings } from '../types/app';
import { buildLedFrame, getAnalysisSize } from '../lib/ledLayout';
import type { LedRendererHook } from '../types/hooks';
import t from '../lib/lang/lang';

/**
 * Custom React hook to manage LED rendering and streaming over WebSocket.
 * @param props An object containing references to the current settings, LED overrides, video element, canvas element, and a WebSocket manager.
 * @param props.settingsRef A reference to the current application settings.
 * @param props.overridesRef A reference to the current LED overrides.
 * @param props.videoRef A reference to the video element used for capturing frames.
 * @param props.canvasRef A reference to the canvas element used for rendering frames.
 * @param props.websocket An object containing the WebSocket reference and connection management functions.
 * @param props.websocket.wsRef A reference to the WebSocket used for streaming LED data.
 * @param props.websocket.connect A function to open the WebSocket connection.
 * @param props.websocket.disconnect A function to close the WebSocket connection.
 * @returns An object containing functions to start and stop the LED rendering loop, the current running state, and the latest LED colors.
 */
export default function useLedRenderer({ settingsRef, overridesRef, videoRef, canvasRef, websocket }: {
    settingsRef: React.RefObject<Settings>;
    overridesRef: React.RefObject<Record<number, LedOverride>>;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    websocket: {
        wsRef: React.RefObject<WebSocket | null>;
        connect: () => void;
        disconnect: () => void;
    };
}): LedRendererHook {
    const [isRunning, setIsRunning] = useState(false);
    const runningRef = useRef(false);
    const lastFrameRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);
    const [ledColors, setLedColors] = useState<Rgb[]>([]);
    const previousColorsRef = useRef<Rgb[]>([]);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    /**
    * Starts the capture loop and opens a websocket connection for streaming.
    */
    function start() {
        if (!videoRef.current?.src) {
            alert(t('pleaseSelectVideo'));
            return;
        }
        previousColorsRef.current = [];
        websocket.connect();
        runningRef.current = true;
        setIsRunning(true);
        animationFrameRef.current = requestAnimationFrame(loop);
    }

    /**
     * Stops playback, cancels any pending animation frame and closes the websocket.
     */
    const stop = useCallback(() => {
        runningRef.current = false;
        setIsRunning(false);

        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        websocket.disconnect();
    }, [websocket]);

    /**
     * Runs the animation loop and sends the next LED frame to the controller when ready.
     * @param now The current timestamp provided by requestAnimationFrame.
     */
    function loop(now: number) {
        const ws = websocket.wsRef.current;

        if (!runningRef.current) return;

        // Wait for WS connection
        if (!ws) {
            animationFrameRef.current = requestAnimationFrame(loop);
            return;
        }

        // Wait for next frame
        const currentSettings = settingsRef.current;
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

        // Build the frame
        const frame = buildLedFrame(
            ctx.getImageData(0, 0, analysis.width, analysis.height),
            currentSettings,
            overridesRef.current,
            previousColorsRef.current,
        );

        // Actualize the previous colors and send the frame to the controller if the websocket is open
        previousColorsRef.current = frame.colors;
        setLedColors(frame.colors);
        if (ws.readyState === 1)
            ws.send(frame.packet.slice().buffer);

        animationFrameRef.current = requestAnimationFrame(loop);
    }

    return {
        start,
        stop,
        isRunning,
        ledColors,
    };
}

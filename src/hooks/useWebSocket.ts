// hooks/useWebSocket.ts
// WebSocket management hook.

import { useRef, useState, type RefObject } from 'react';
import type { LedFrame, Settings } from '../types/app';
import type { ConnectionState, WebSocketHook } from '../types/hooks';
import buildDDPPackets from '../lib/protocols/DDP/DDP';

/**
 * Custom React hook to manage WebSocket connections for streaming LED data.
 * @param settingsRef A reference to the current application settings, used to configure the WebSocket connection.
 * @returns An object containing the WebSocket reference, connection state, and functions to connect and disconnect the WebSocket.
 */
export default function useWebSocket(settingsRef: RefObject<Settings>): WebSocketHook {
    const [connectionState, setConnectionState] = useState<ConnectionState>('ready');
    const wsRef = useRef<WebSocket | null>(null);

    /**
    * Opens a websocket connection to the configured LED controller.
    */
    function connect() {
        wsRef.current?.close();

        if (!settingsRef.current.ip)
            // Try on the current hostname for self-hosted platform
            settingsRef.current.ip = document.location.hostname;

        const ws = new WebSocket(`ws://${settingsRef.current.ip}/${(settingsRef.current.path).replace(/^\/+/, '')}`);
        ws.binaryType = 'arraybuffer';
        ws.onopen = () => setConnectionState('connected');
        ws.onclose = () => setConnectionState('disconnected');
        ws.onerror = () => setConnectionState('wsError');
        wsRef.current = ws;
        setConnectionState('connecting');
    }

    /**
     * Close WebSocket connection.
     */
    function disconnect() {
        wsRef.current?.close();
        wsRef.current = null;
    }

    /**
     * Sends a frame of LED data over the WebSocket connection.
     * @param frame The LED frame data to be sent, including RGB values and LED positions.
     */
    function send(frame: LedFrame) {
        if (wsRef.current?.readyState === 1) {
            let packets: Uint8Array[] = [];
            const settings = settingsRef.current;
            switch (settings.protocol) {
                case 'ddp':
                    packets = buildDDPPackets(frame.rgbBytes, settings);
                    break;
                // Others protocols must be implemented here
            }

            packets.forEach(packet => {
                // Send each packets one by one
                wsRef.current?.send(packet.slice().buffer);
            });
        }
    }

    return {
        wsRef,
        connectionState,
        connect,
        disconnect,
        send,
    };
}

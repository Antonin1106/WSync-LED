// hooks/useWebSocket.ts
// WebSocket management hook.

import { useRef, useState, type RefObject } from 'react';
import type { Settings } from '../types/app';
import type { ConnectionState, WebSocketHook } from '../types/hooks';

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

    return {
        wsRef,
        connectionState,
        connect,
        disconnect,
    };
}

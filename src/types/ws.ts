// types/ws.ts
// Type for WS transmission

export type WsClient = {
    sendFrame: (_data: Uint8Array) => void;
};

export type WLEDDeviceData = {
    brand?: string;
    ip?: string;
    leds?: {
        fps?: number;
        count?: number;
        rgbw?: boolean;
    };
};
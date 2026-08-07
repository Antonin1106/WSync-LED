// types/ws.ts
// Type for WS transmission

export type WsClient = {
    sendFrame: (_data: Uint8Array) => void;
};
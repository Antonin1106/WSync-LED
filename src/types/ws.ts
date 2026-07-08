export type WsClient = {
    sendFrame: (_data: Uint8Array) => void;
};
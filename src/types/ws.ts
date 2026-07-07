export type WsClient = {
    sendFrame: (data: Uint8Array) => void;
};
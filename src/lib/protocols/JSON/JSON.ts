// lib/protocols/JSON/JSON.ts
// Function to build JSON packets for wled controllers

import type { Settings } from '../../../types/app';
import { getColorsSettings, rgbwToHex } from '../../colors/colors';
import { getLedCount } from '../../ledLayout/ledLayout';

/**
 * Builds JSON packets from the RGB(W) buffer for transmission over WebSocket for WLED.
 * @param rgbBytes The RGB(W) byte array representing the LED colors.
 * @param settings Current LED settings.
 * @returns An array of JSON strings ready for transmission.
 * @see See official WLED documentation at https://kno.wled.ge/interfaces/websocket/ and https://kno.wled.ge/interfaces/json-api/.
 * @deprecated This function is deprecated. Streaming over JSON is not recommended : consider using alternative methods.
*/
export default function buildJSONPackets(rgbBytes: Uint8Array, settings: Settings): string[] {
    const packets: string[] = [];
    let packet: Record<string, unknown> = {};
    const { isRGBW, BYTES_PER_PIXELS } = getColorsSettings(settings);

    let pixelIndex = 0;
    const totalPixels = getLedCount(settings);
    const colors: Array<string | number> | Array<Record<number, number>> = [];
    let lastPixel = 0;

    // Build packet
    while (pixelIndex < rgbBytes.length) {
        const pixel = pixelIndex / BYTES_PER_PIXELS;
        const localIndex = pixel - lastPixel;
        let pixelCol;

        // JSON over WS on WLED support both RGB arrays and HEX values
        // HEX values looks more efficient than RGB arrays
        // But HEX values cannot use the white channel, so we need to use RGB arrays for RGBW setups
        if (!isRGBW)
            pixelCol = rgbwToHex([
                rgbBytes[pixelIndex] ?? 0,
                rgbBytes[pixelIndex + 1] ?? 0,
                rgbBytes[pixelIndex + 2] ?? 0,
                0,
            ]);
        else
            pixelCol = [
                rgbBytes[pixelIndex] ?? 0,
                rgbBytes[pixelIndex + 1] ?? 0,
                rgbBytes[pixelIndex + 2] ?? 0,
                rgbBytes[pixelIndex + 3] ?? 0,
            ];

        colors[localIndex] = pixelCol;

        // Create packets of 256 colors/packet max
        // NOTE: WLED JSON API does not support efficently more than ~150 colors at a time
        // So we cannot set more than 150 leds with JSON mode, even if the WLED JSON API supports up to 256 colors at a time
        // This part (create multiple packet) will never be reached, but we keep it for future compatibility
        if (localIndex === 256 || pixel >= totalPixels - 1) {
            // See WLED docs to understand JSON format
            // Add the starting pixel index to the colors array for WLED to know where to start writing
            packet = { seg: { i: [lastPixel, ...colors] } };
            packets.push(JSON.stringify(packet));
            lastPixel = pixel + 1; // Next pixel from next packet
            colors.length = 0; // Reset colors array for the next packet
        }

        pixelIndex += BYTES_PER_PIXELS;
    }


    return packets;
}
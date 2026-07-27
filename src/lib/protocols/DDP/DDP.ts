// lib/protocols/DDP/DDP.ts
// Function to build DDP packets for wled controllers

import type { Settings } from '../../../types/app';
import { getLedCount } from '../../ledLayout/ledLayout';

/**
 * Builds DDP packets from the RGB buffer for transmission over WebSocket for WLED.
 * @param rgbBytes The RGB byte array representing the LED colors.
 * @param settings Current LED settings.
 * @returns An array of Uint8Array packets ready for transmission.
 * @see See official DDP documentation at http://www.3waylabs.com/ddp/.
 * @see See official WLED documentation at https://kno.wled.ge/.
 */
export default function buildDDPPackets(rgbBytes: Uint8Array, settings: Settings): Uint8Array[] {
    const MAX_PIXELS = 472; // Maximum number of RGB pixels per DDP packet
    const HEADER_SIZE = 11; // DDP header size (including WLED protocol byte)

    const packets: Uint8Array[] = [];

    let pixelIndex = 0;
    const totalPixels = getLedCount(settings);

    while (pixelIndex < totalPixels) {
        // Number of pixels to include in this packet
        const remaining = totalPixels - pixelIndex;
        const pixels = remaining > MAX_PIXELS ? MAX_PIXELS : remaining;

        const payloadLength = pixels * 3; // RGB = 3 bytes/px
        const frame = new Uint8Array(HEADER_SIZE + payloadLength);

        // WLED protocol identifier
        frame[0] = 0x02;

        // Set render (PUSH) flag on the last packet
        const isLastFrame = pixelIndex + pixels === totalPixels;
        frame[1] = isLastFrame ? 0x41 : 0x40;

        // DDP header
        frame[2] = 0x00;
        frame[3] = 0x0B;
        frame[4] = 0x01;

        // Pixel data offset in bytes
        const pixelOffset = pixelIndex * 3;
        const view = new DataView(frame.buffer);

        // Write offset and payload length
        view.setUint32(5, pixelOffset);
        view.setUint16(9, payloadLength);

        // Copy RGB data into the packet
        frame.set(
            rgbBytes.slice(pixelOffset, pixelOffset + payloadLength),
            HEADER_SIZE,
        );

        packets.push(frame);

        pixelIndex += pixels;
    }

    return packets;
}
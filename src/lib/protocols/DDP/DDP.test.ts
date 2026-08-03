// lib/protocols/DDP/DDP.test.ts
// Unit tests for DDP protocol.

import { describe, expect, it } from 'vitest';
import buildDDPPackets from './DDP';
import { initialSettings } from '../../../config/appConfig';

describe('buildDDPPackets', () => {
    it('creates one packet', () => {
        const settings = { ...initialSettings, leds: 1, ledX: 1, ledY: 1 };
        const rgbBytes: Uint8Array = new Uint8Array([100, 50, 25]);
        const packets = buildDDPPackets(rgbBytes, settings);

        expect(packets[0]?.length).toBe(11 + 3);
        expect(packets[1]).toBeUndefined();
    });

    it('creates several packets', () => {
        // Create fakes values for 500 LEDs
        const settings = { ...initialSettings, leds: 500, computeExactLedCount: true };
        const LEDS = 28 * 18;
        const rgbBytes: Uint8Array = new Uint8Array(LEDS * 3);
        for (let i = 0; i < LEDS * 3; i += 3) {
            rgbBytes[i] = 50;
            rgbBytes[i + 1] = 100;
            rgbBytes[i + 2] = 150;
        }

        const packets = buildDDPPackets(rgbBytes, settings);

        // Test packets
        expect(packets[0]?.length).toBe(11 + 472 * 3);
        expect(packets[1]?.length).toBe(11 + 28 * 3);
        expect(packets[2]).toBeUndefined();

        // Test bytes headers
        expect(packets[0]?.[0]).toBe(0x02);
        expect(packets[0]?.[1]).toBe(0x40);
        expect(packets[0]?.[2]).toBe(0x00);
        expect(packets[0]?.[3]).toBe(0x0B);
        expect(packets[0]?.[4]).toBe(0x01);

        expect(packets[1]?.[0]).toBe(0x02);
        expect(packets[1]?.[1]).toBe(0x41);
        expect(packets[1]?.[2]).toBe(0x00);
        expect(packets[1]?.[3]).toBe(0x0B);
        expect(packets[1]?.[4]).toBe(0x01);

        // Test RGB bytes
        for (let i = 11; i <= 472; i += 3) {
            expect(packets[0]?.[i]).toBe(50);
            expect(packets[0]?.[i + 1]).toBe(100);
            expect(packets[0]?.[i + 2]).toBe(150);
        }

        for (let i = 11; i <= 28; i += 3) {
            expect(packets[0]?.[i]).toBe(50);
            expect(packets[0]?.[i + 1]).toBe(100);
            expect(packets[0]?.[i + 2]).toBe(150);
        }
    });
});
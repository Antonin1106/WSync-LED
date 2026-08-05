// lib/utils/scan/scan.test.ts
// Unit tests for scan function

import { beforeEach, describe, expect, it, vi } from 'vitest';
import scan from './scan';
import type { Settings } from '../../../types/app';

type SettingsUpdater = (_value: Settings | ((_prev: Settings) => Settings)) => void;
let setSettings: ReturnType<typeof vi.fn<SettingsUpdater>>;

describe('scan', () => {
    beforeEach(() => {
        vi.restoreAllMocks();

        Object.defineProperty(window, 'location', {
            value: {
                hostname: '192.168.1.10',
            },
            writable: true,
        });

        window.fetch = vi.fn();
        setSettings = vi.fn<SettingsUpdater>();
    });

    it('test the device when an IP is already configured', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                brand: 'WLED',
                ip: '10.0.0.5',
            }),
        } as Response);

        const result = await scan({
            ip: '10.0.0.5',
        } as Settings,
            setSettings,
        );

        expect(result).toBe('10.0.0.5');
        expect(fetch).toHaveBeenCalledOnce();
        expect(setSettings).toHaveBeenCalledOnce();
    });

    it('finds a WLED device on the AP address', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                brand: 'WLED',
                ip: '192.168.4.1',
                leds: {
                    fps: 42,
                    count: 150,
                    rgbw: false,
                },
            }),
        } as Response);

        await scan({} as Settings, setSettings);

        expect(setSettings).toHaveBeenCalledOnce();
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('finds a WLED device on the current hostname', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: false,
            } as Response)
            .mockResolvedValueOnce({
                ok: false,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    brand: 'WLED',
                    ip: '192.168.1.10',
                }),
            } as Response);

        await scan({} as Settings, setSettings);
        expect(setSettings).toHaveBeenCalledOnce();
    });

    it('finds a WLED device while scanning the LAN', async () => {
        vi.mocked(fetch).mockImplementation(async (url) => {
            const ip = new URL(url as string).hostname;

            if (ip === '192.168.1.42') {
                return {
                    ok: true,
                    json: async () => ({
                        brand: 'WLED',
                        ip,
                    }),
                } as Response;
            }

            return {
                ok: false,
            } as Response;
        });

        await scan({} as Settings, setSettings);
        expect(setSettings).toHaveBeenCalledOnce();
    });

    it('does not update settings when no device is found', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
        } as Response);

        await scan({} as Settings, setSettings);
        expect(setSettings).not.toHaveBeenCalled();
    });

    it('ignores fetch errors', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

        await scan({} as Settings, setSettings);
        expect(setSettings).not.toHaveBeenCalled();
    });

    it('does not test the same IP twice', async () => {
        Object.defineProperty(window, 'location', {
            value: {
                hostname: '192.168.4.1',
            },
            writable: true,
        });

        vi.mocked(fetch).mockResolvedValue({
            ok: false,
        } as Response);

        await scan({} as Settings, setSettings);
        const calls = vi.mocked(fetch).mock.calls.map(
            ([url]) => new URL(url as string).hostname,
        );
        expect(calls.filter((ip) => ip === '192.168.4.1')).toHaveLength(1);
    });

    it('aborts fetch after 50ms', async () => {
        vi.useFakeTimers();

        const abortSpy = vi.spyOn(AbortController.prototype, 'abort');

        vi.mocked(fetch).mockImplementation(
            () =>
                new Promise(() => {
                    // Never resolves
                }),
        );

        scan({} as Settings, setSettings);

        await vi.advanceTimersByTimeAsync(50);

        expect(abortSpy).toHaveBeenCalled();

        abortSpy.mockRestore();
        vi.useRealTimers();
    });

    it('does not update settings when the device is not a WLED', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                brand: 'Unknown',
                ip: '192.168.4.1',
            }),
        } as Response);

        await scan({} as Settings, setSettings);
        expect(setSettings).not.toHaveBeenCalled();
    });

    it('does not update settings when IP are not corresponding', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                brand: 'WLED',
                ip: '192.168.1.12', // Set another IP
            }),
        } as Response);

        await scan({} as Settings, setSettings);
        expect(setSettings).not.toHaveBeenCalled();
    });

    it('does not update settings when data is not a  JSON', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => 'unknown',
        } as Response);

        await scan({} as Settings, setSettings);
        expect(setSettings).not.toHaveBeenCalled();
    });

    it('updates settings with RGBW', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                brand: 'WLED',
                ip: '192.168.1.12',
                leds: { rgbw: true },
            }),
        } as Response);

        await scan({} as Settings, setSettings);
        expect(setSettings).toHaveBeenCalledOnce();
    });

    it('updates settings only when it has not been overrided before', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    brand: 'WLED',
                    ip: '192.168.4.1',
                }),
            } as Response);

        await scan({ fps: 24 } as Settings, setSettings);
        expect(setSettings).toHaveBeenCalledOnce();
    });
});
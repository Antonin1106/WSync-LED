// lib/utils/scan/scan.ts
// Scan network to find any WLED device

import type { Dispatch, SetStateAction } from 'react';
import type { Settings } from '../../../types/app';
import { initialSettings } from '../../../config/appConfig';
import type { WLEDDeviceData } from '../../../types/ws';

/**
 * Scan the network for a WLED device and return its IP address.
 * If the settings object contains an IP address, it will be returned immediately.
 * Otherwise, the function will attempt to find a WLED device on the local network.
 * @param settings The settings object containing the optional IP address.
 * @param setSettings A function to update the application settings.
 * @returns Promise undefined.
 */
export default async function scan(settings: Settings, setSettings: Dispatch<SetStateAction<Settings>>): Promise<undefined> {
    /**
     * Try to fetch the WLED device info from the given IP address.
     * @param ip The IP address to test.
     * @returns The IP address if a WLED device is found, otherwise null.
     */
    async function tryDevice(ip: string): Promise<undefined | true> {
        if (testedIp.includes(ip))
            return;

        testedIp.push(ip);

        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 50);
            const response = await fetch(`http://${ip}/json/info`, { signal: controller.signal });
            clearTimeout(timer);

            if (!response.ok)
                return;

            const data = await response.json();
            return setWLEDData(data, ip, settings, setSettings);
        } catch {
            // Skip errors
        }

        return;
    }
    const testedIp: string[] = [];

    if (settings.ip)
        return;

    // Try AP IP
    if (await tryDevice('192.168.4.1'))
        return;

    // Try current device
    if (await tryDevice(window.location.hostname))
        return;

    // Fallback : try all devices
    for (let i = 1; i <= 254; i++)
        if (await tryDevice('192.168.1.' + i))
            return;
}

function setWLEDData(data: unknown, ip: string, settings: Settings, setSettings: Dispatch<SetStateAction<Settings>>): undefined | true {
    if (typeof data !== 'object' || data === null)
        return;

    const deviceData = data as WLEDDeviceData;

    // Check if it is a WLED device
    if (deviceData.brand !== 'WLED')
        return;

    // Ensure IP is the same
    if (deviceData.ip !== ip)
        return;

    // Helper to select value to use
    const getSettingValue = <T>(current: T, initial: T, device: T | undefined): T =>
        (current === initial ? (device ?? initial) : current);

    // Save collected data to settings
    setSettings(
        {
            ...settings,
            ip,
            fps: getSettingValue(settings.fps, initialSettings.fps, deviceData.leds?.fps),
            leds: getSettingValue(settings.leds, initialSettings.leds, deviceData.leds?.count),
            dataType: deviceData.leds?.rgbw ? 'RGBW' : 'RGB',
        },
    );

    return true;
}
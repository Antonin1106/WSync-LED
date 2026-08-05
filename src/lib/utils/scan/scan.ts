// lib/utils/scan/scan.ts
// Scan network to find any WLED device

import type { Dispatch, SetStateAction } from 'react';
import type { Settings } from '../../../types/app';
import { AP_IP } from '../../../config/appConfig';
import setWLEDData from '../setWLEDData/setWLEDData';

/**
 * Scan the network for a WLED device and return its IP address.
 * If the settings object contains an IP address, it will be returned immediately.
 * Otherwise, the function will attempt to find a WLED device on the local network.
 * @param settings The settings object containing the optional IP address.
 * @param setSettings A function to update the application settings.
 * @returns Promise undefined.
 */
export default async function scan(settings: Settings, setSettings: Dispatch<SetStateAction<Settings>>): Promise<string | undefined> {
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
    const IPtoTest: string[] = [settings.ip, AP_IP, window.location.hostname];
    const testedIp: string[] = [];

    for (let i = 1; i <= 254; i++)
        IPtoTest.push(String('192.168.1.' + i));

    for (const i in IPtoTest)
        if (await tryDevice(IPtoTest[i] ?? ''))
            return IPtoTest[i];

    return;
}
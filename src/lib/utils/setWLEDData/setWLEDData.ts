// lib/utils/setWLEDData/setWLEDData.ts
// Function to set WLED data to the settings

import type { WLEDDeviceData } from '../../../types/ws';
import type { Dispatch, SetStateAction } from 'react';
import type { Settings } from '../../../types/app';
import { initialSettings } from '../../../config/appConfig';;

/**
 * Set WLED device data to the application settings.
 * @param data The data received from the WLED device.
 * @param ip The IP address of the WLED device.
 * @param settings The current application settings.
 * @param setSettings The function to update the application settings.
 * @returns undefined if it is not a valid WLED device, true if it is.
*/
export default function setWLEDData(data: unknown, ip: string, settings: Settings, setSettings: Dispatch<SetStateAction<Settings>>): undefined | true {
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
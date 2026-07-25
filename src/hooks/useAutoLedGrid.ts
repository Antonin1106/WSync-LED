// hooks/useAutoLedGrid.ts
// Led Grid management hook.

import { useEffect } from 'react';
import computeLedGrid from '../lib/ledLayout/computeLedGrid';
import computeExactLedGrid from '../lib/ledLayout/computeExactLedGrid';
import computeLedPerimeter from '../lib/ledLayout/computeLedPerimeter';
import computeLedBorder from '../lib/ledLayout/computeLedBorder';
import type { LedGrid, Settings } from '../types/app';

/**
 * Custom React hook to automatically compute the LED grid based on the current video dimensions and settings.
 * @param props An object containing the current settings, the name of the currently loaded video, a reference to the video element, and a function to update the settings.
 * @param props.settings The current application settings.
 * @param props.currentVideoName The name of the currently loaded video.
 * @param props.videoRef A reference to the video element.
 * @param props.setSettings A function to update the application settings.
 */
export default function useAutoLedGrid({ settings, currentVideoName, videoRef, setSettings }: {
    settings: Settings;
    currentVideoName: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}) {
    useEffect(() => {
        const video = videoRef.current;

        // Compute LED grid only when there's a video and when the autoCompute setting is enabled
        if (!video || !settings.autoCompute) return;

        const updateGrid = () => {
            // if (!video.videoWidth || !video.videoHeight) return;

            let leds: LedGrid; // LEDs settings

            // Execute the right compute moide based on the current diffusion mode
            switch (settings.mappingMode) {
                case 'grid':
                    leds = settings.computeExactLedCount
                        ? computeExactLedGrid(video.videoWidth, video.videoHeight, settings.leds)
                        : computeLedGrid(video.videoWidth, video.videoHeight, settings.leds);
                    break;
                case 'perimeter':
                    leds = computeLedPerimeter(video.videoWidth, video.videoHeight, settings.leds);
                    break;
                case 'border':
                    leds = computeLedBorder(video.videoWidth, video.videoHeight, settings.leds);
                    break;
            }

            // Save new computed settings
            setSettings((current) => {
                if (current.ledX === leds.ledX && current.ledY === leds.ledY) return current;
                return { ...current, ledX: leds.ledX, ledY: leds.ledY };
            });
        };

        // Update the grid at each video load
        video.addEventListener('loadedmetadata', updateGrid);
        updateGrid();
        return () => video.removeEventListener('loadedmetadata', updateGrid);
    }, [currentVideoName, settings.autoCompute, settings.computeExactLedCount, settings, settings.leds, setSettings, videoRef]);
}

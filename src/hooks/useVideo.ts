// hooks/useVideo.ts
// Video management hook.

import { useCallback, /*useEffect,*/ useRef, useState } from 'react';

/**
 * Custom React hook to manage video playback and caching.
 * @returns An object containing references to the video and canvas elements, the current video name, and functions to load, set, and revoke video sources.
 */
export default function useVideo() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [currentVideoName, setCurrentVideoName] = useState('');
    const videoUrlRef = useRef<string | null>(null);

    /**
    * Releases the currently active object URL for the loaded video.
    */
    const revokeVideoUrl = useCallback(() => {
        if (videoUrlRef.current) {
            URL.revokeObjectURL(videoUrlRef.current);
            videoUrlRef.current = null;
        }
    }, []);

    /**
    * Attaches a local video blob to the media element and updates the visible file name.
    * @param blob Video file data to play.
    * @param name Human-readable file name for the current media source.
    */
    const setVideoSource = useCallback((blob: Blob, name: string) => {
        if (!videoRef.current) return;

        revokeVideoUrl();
        const url = URL.createObjectURL(blob);
        videoUrlRef.current = url;
        videoRef.current.src = url;
        videoRef.current.load();
        setCurrentVideoName(name);
    }, [revokeVideoUrl]);

    // Revoke URL when unmount
    /*useEffect(() => {
        return () => {
            revokeVideoUrl(); // This part may cause bugs
        };
    }, [revokeVideoUrl]);*/

    return {
        videoRef,
        canvasRef,
        currentVideoName,
        setVideoSource,
    };
}

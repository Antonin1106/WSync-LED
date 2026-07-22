// hooks/useVideoCache.ts
// Video Cache management hook.

import { useEffect, useState } from 'react';
import type { CachedVideoMeta } from '../types/app';
import { deleteCachedVideo, getCachedVideos } from '../lib/videoCache';
import t from '../lib/lang/lang';

/**
 * Custom React hook to manage cached videos in IndexedDB.
 * @returns An object containing the list of cached videos, and functions to refresh the list, open a cached video, and remove a cached video.
 */
export default function useVideoCache() {

    const [cachedVideos, setCachedVideos] = useState<CachedVideoMeta[]>([]);

    // Init the list of cached videos
    useEffect(() => {
        refreshCachedVideos();
    }, []);

    /**
    * Refreshes the list of cached videos from IndexedDB.
    */
    async function refreshCachedVideos() {
        if (!('indexedDB' in window)) return;
        try {
            setCachedVideos(await getCachedVideos());
        } catch (error) {
            console.warn(t('unavailableVideoCache') + ' :', error);
        }
    }
    /**
     * Removes a cached video entry and refreshes the library view.
     * @param id Cached video identifier.
     */
    async function removeCachedVideo(id: number) {
        try {
            await deleteCachedVideo(id);
            await refreshCachedVideos();
        } catch (error) {
            console.warn(t('errorDeleteVideo') + ' :', error);
        }
    }

    return {
        cachedVideos,
        refreshCachedVideos,
        removeCachedVideo,
    };
}

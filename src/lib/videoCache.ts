// lib/videoCache.ts
// Helpers for video caching

import type { ChangeEvent } from 'react';
import { DB_NAME, DB_VERSION, STORE_NAME } from '../config/cacheConfig';
import type { CachedVideo, CachedVideoMeta } from '../types/app';
import t from './lang';
import type { VideoCacheHook, VideoHook } from '../types/hooks';

/**
 * Opens the IndexedDB database used to persist cached videos.
 * @returns A database handle.
 */
function openVideoDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('savedAt', 'savedAt');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Executes a read/write action against the videos object store.
 * @param mode Transaction mode.
 * @param action Callback that receives the object store.
 * @returns Result of the requested operation.
 */
async function withVideoStore<T>(
  mode: IDBTransactionMode,
  action: (_store: IDBObjectStore) => IDBRequest<T>,
) {
  const db = await openVideoDb();

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

/**
 * Retrieves all cached videos sorted by most recently added first.
 * @returns Cached video metadata entries.
 */
export async function getCachedVideos() {
  const db = await openVideoDb();

  return new Promise<CachedVideoMeta[]>((resolve, reject) => {
    const videos: CachedVideoMeta[] = [];
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).openCursor();

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;

      const { id, name, type, size, savedAt } = cursor.value as CachedVideo;
      videos.push({ id, name, type, size, savedAt });
      cursor.continue();
    };

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      db.close();
      resolve(videos.sort((a, b) => b.savedAt - a.savedAt));
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

/**
 * Saves a selected video file to the cache.
 * @param file Video file to store.
 */
export async function saveCachedVideo(file: File) {
  const video = {
    name: file.name,
    type: file.type || 'video/*',
    size: file.size,
    savedAt: Date.now(),
    blob: file,
  };

  await withVideoStore<IDBValidKey>('readwrite', (store) => store.add(video));
}

/**
 * Reads a cached video entry by its identifier.
 * @param id Cached video identifier.
 * @returns Promise resolving to the stored video data.
 */
export function readCachedVideo(id: number) {
  return withVideoStore<CachedVideo>('readonly', (store) => store.get(id));
}

/**
 * Deletes a cached video entry from the database.
 * @param id Cached video identifier.
 */
export async function deleteCachedVideo(id: number) {
  await withVideoStore<undefined>('readwrite', (store) => store.delete(id));
}

/**
 * Formats a byte size into a compact human-readable string.
 * @param props Proprety of the FormatBytes component
 * @param props.size Number of bytes.
 * @returns Display string with KB or MB unit.
 */
export function FormatBytes({ size }: { size: number }) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} ${t('KB')}`;
  return `${(size / 1024 / 1024).toFixed(1)} ${t('MB')}`;
}

/**
 * Opens a cached video by its database identifier.
 * @param id Cached video identifier.
 * @param setVideoSource Function to set the current video source.
 */
export const openCachedVideo = async (id: number, setVideoSource: VideoHook['setVideoSource']) => {
  try {
    const cached = await readCachedVideo(id);
    if (cached) setVideoSource(cached.blob, cached.name);
  } catch (error) {
    console.warn(t('errorOpenVideo') + ' :', error);
  }
};

/**
 * Loads a video file from an input event, saves it to the cache if not already present, and sets it as the current video source.
 * @param e The change event from the file input.
 * @param setVideoSource Function to set the current video source.
 * @param refreshCachedVideos Function to refresh the list of cached videos.
 * @returns A promise that resolves when the video is loaded and cached.
 */
export const loadVideo = async (e: ChangeEvent<HTMLInputElement>, setVideoSource: VideoHook['setVideoSource'], refreshCachedVideos: VideoCacheHook['refreshCachedVideos']) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setVideoSource(file, file.name);

  try {
    // Don't store the video if it's already cached
    if ((await getCachedVideos()).some(v => v.name === file.name && v.size === file.size))
      return;

    await saveCachedVideo(file);
    await refreshCachedVideos();
  } catch (error) {
    console.warn(t('noVideoCache') + ' :', error);
  }
};

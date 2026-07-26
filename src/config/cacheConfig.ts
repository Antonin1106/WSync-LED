// config/cacheConfig.ts
// Cache configuration

import { type WebManifest } from '@json-types/web-manifest';

export const DB_NAME = 'wsync-led-video-cache';
export const DB_VERSION = 1;
export const STORE_NAME = 'videos';

export const manifest: WebManifest = {
    'name': 'WSync-LED',
    'short_name': 'WSync',
    'start_url': './wsync.html',
    'scope': './wsync.html',
    'display': 'standalone',
    'orientation': 'any',
    'background_color': '#0b0f14',
    'theme_color': '#0b0f14',
    'icons': [], // Icons are set automatically in lib/loadAssets.ts
};
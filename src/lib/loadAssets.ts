// lib/loadAssets.ts
// Load app's assets dynamically

import svg from '../assets/app-icon.svg';
import { manifest } from '../config/cacheConfig';


createLink('icon', svg);
createLink('apple-touch-icon', svg);
createLink('manifest', await generateManifestURI());


function createLink(rel: string, href: string) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
}

async function generateManifestURI() {
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512, 1024];

    (manifest.icons as unknown) = [
        {
            src: svg,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
        },
        ...await Promise.all(
            sizes.map(async size => ({
                src: await svgToPngDataUri(svg, size),
                sizes: `${size}x${size}`,
                type: 'image/png',
                purpose: 'any maskable',
            })),
        ),
    ];

    async function svgToPngDataUri(svg: string, size: number) {
        const img = new Image();

        img.src = svg;

        await img.decode();

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, size, size);

        return canvas.toDataURL('image/png');
    }

    if (manifest.icons?.[0]) {
        manifest.icons[0].src = svg;
    }

    return 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
}


# WSync LED

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) ![Last commit](https://img.shields.io/github/last-commit/Antonin1106/WSync-LED) ![Stars](https://img.shields.io/github/stars/Antonin1106/WSync-LED)

A mobile-first Web App that analyzes colors from a local video and streams real-time LED frames over WebSocket to compatible devices on the local network.

**This software is provided under the MIT License and is supplied "as is", without any warranty. Use it at your own risk.**

The application works on any modern browser supporting the required Web APIs. As a Progressive Web App, it can be installed on mobile and desktop platforms, caches its application shell for no-Internet use, and stores previously opened videos locally using IndexedDB.

## Features

- Real-time binary WebSocket LED streaming to compatible devices.
- Built-in support for WLED using its `0x10 + RGB` binary protocol.
- Offline-ready Progressive Web App with install support and local caching.
- Local video library powered by IndexedDB.
- Supports common browser-compatible video formats (`mp4`, `mov`, `m4v`, `webm`, and any codec supported by the browser).
- LED layout visualization with interactive LED selection.
- Per-LED overrides:
  - Force a custom color.
  - Disable individual LEDs.
  - Reset a single LED.
  - Reset all overrides.
- Multiple diffusion layouts:
  - **Grid** — rectangular LED matrix (`LED X × LED Y`).
  - **Perimeter** — full-screen perimeter (top, right, bottom, left).
  - **Border** — three-sided perimeter (top, left, right).
- Advanced processing controls:
  - FPS
  - Gain
  - Smoothing
  - Threshold
  - Gamma
  - Saturation
  - Output reversal
- Language support with English and French translations with [`i18n`](https://www.npmjs.com/package/i18n).

## Compatibility

WSync LED streams LED frames through a standard WebSocket connection and can be used with any device implementing a compatible protocol.

Current supported integrations include:

- WLED binary WebSocket protocol (`0x10 + RGB`)

The streaming layer has been designed to allow additional WebSocket-compatible devices and protocols to be supported in the future.

## LED Counts by Mode

`LED X` and `LED Y` represent different values depending on the selected diffusion mode.

- **Grid**
  - Total LEDs = `LED X × LED Y`

- **Perimeter**
  - Total LEDs = `LED X + LED Y + LED X + LED Y`

- **Border**
  - Total LEDs = `LED X + LED Y + LED Y`

For edge-based modes, `LED X` controls the horizontal edges while `LED Y` controls the vertical sides.

## Installation

The application can be served from any HTTP(S) web server or web browser (via `file://`).

### Build

```bash
npm run build
```

### Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Each production build regenerates the service worker cache version, ensuring installed clients receive updated application assets.

## Progressive Web App

Host the `dist` directory on a local or remote web server.
Once served over HTTP(S), the application can be installed on supported browsers.

After the first successful load:

- The application shell is available offline,
- Previously opened videos remain stored locally through IndexedDB,
- The app will still be able to work when the origin server's URL is unable (offline), only if the target LED device is located on the local network.

## Notes

- Video compatibility depends on browser codec support rather than file extensions.
- The target LED device must be reachable over the local network.
- LED streaming is active only while playback is running and streaming has been started by the user.

## Built-in development commands

- `npm run dev` — Starts a development server with hot reload.
- `npm run build` — Builds the production bundle in the `dist` directory.
- `npm run lint` — Runs ESLint to check for code style issues.
- `npm run lint:fix` — Runs ESLint and automatically fixes fixable issues.
- `npm run check:header` — Checks for headers compliance in all files.
- `npm run check:i18n` — Checks for missing or unused translation keys in the `src/lang/` directory.
- `npm run sort-translations` — Sorts translation keys in the `src/lang/` directory for consistency.

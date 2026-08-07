# Installation

This guide explains how to install, run, and build WSync LED locally.

## Requirements

- Node.js compatible with the project dependencies.
- npm.
- A modern browser with support for video playback, canvas, WebSocket, IndexedDB, and Progressive Web App APIs.
- A reachable LED controller when testing live streaming.

## Install Dependencies

From the project root, install npm dependencies:

```bash
npm install
```

## Start Development

Run the Vite development server:

```bash
npm run dev
```

The development server runs the React application with hot reload. Use it when changing application code, styles, translations, or protocol behavior.
Go to `/wsync.html` to access the app.

## Build the Application

Create a production bundle:

```bash
npm run build
```

The build script runs linting, TypeScript checks, tests, and the Vite production build. The generated application is written to `dist/`.

The production entry file is `wsync.html`, which can be hosted from a static web server or copied to a device that can serve static files.

## Build the Documentation

> [!WARNING]
> This section covers features available only since `v2.0.0`.

Build only the TypeDoc documentation in `docs/api/`:

```bash
npm run docs:generate
```

Build the TypeDoc and VitePress documentation:

```bash
npm run docs:build
```

Preview the built documentation locally:

```bash
npm run docs:preview
```

Run the documentation server during authoring:

```bash
npm run docs:dev
```

## Useful Commands

> [!WARNING]
> This section covers features available only since `v2.0.0`.

| Command              | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Start the application development server.              |
| `npm run build`      | Build and verify the production application.           |
| `npm run lint`       | Run ESLint.                                            |
| `npm run lint:fix`   | Run ESLint and apply automatic fixes.                  |
| `npm test`           | Run translation checks, header checks, and unit tests. |
| `npm run coverage`   | Run unit tests with coverage.                          |
| `npm run docs:dev`   | Start the VitePress documentation server.              |
| `npm run docs:build` | Build the documentation site.                          |

## Deployment Notes

WSync LED is a browser application. It can be served from any HTTP or HTTPS static host, including a local web server on the same network as the LED controller, or the controller itself. [See how to self-host WSync-LED](../examples/wled#self-host-wsync-led-over-wled).

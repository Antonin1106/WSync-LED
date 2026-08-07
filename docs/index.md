# WSync LED

WSync LED is a mobile first web application that analyzes the colors of a local video and streams LED frames over WebSocket to compatible LED controllers on the local network.

It is designed for browser based video to light synchronization: select a video, choose a layout, connect to a WLED-compatible device, then stream live RGB or RGBW frames while the video plays.

## What It Does

- Samples colors from a local video in real time.
- Builds LED frames for grid, perimeter, or border layouts.
- Streams frames through WebSocket using WLED DDP or WLED JSON.
- Stores previously opened videos locally with IndexedDB.
- Lets users override individual LEDs by forcing a color or disabling an LED.
- Runs as a Progressive Web App on modern mobile and desktop browsers.

## Documentation

- [Installation](./guide/installation.md): install dependencies, run the app, and build production assets.
- [Getting Started](./guide/getting-started.md): configure a video, LED layout, and WebSocket target.
- [Architecture](./guide/architecture.md): understand the rendering, storage, and streaming flow.
- [Examples](./examples/index.md): common setup recipes.
- [API Reference](./api/modules.md): generated TypeScript API documentation.

## Typical Workflow

1. Open WSync LED in a modern browser.
2. Select a local video file.
3. Enter the LED controller host and WebSocket path.
4. Choose the protocol, color format, and LED mapping mode.
5. Adjust image processing settings.
6. Start streaming.

Streaming is active only while the renderer is running. Video files stay local to the browser; cached videos are stored through IndexedDB for offline reuse.

## Compatibility

WSync LED targets WebSocket capable LED controllers. The current implementation focuses on WLED devices:

- DDP over WebSocket for efficient RGB or RGBW streaming.
- JSON over WebSocket for compatibility, with lower practical throughput.

The app can also serve as a base for additional protocols because packet construction is isolated from the renderer and WebSocket connection management.

# Getting Started

This guide walks through the first successful WSync LED stream.

> [!WARNING]
> This section covers features available only since `v2.0.0`.

## 1. Open the App

Start the app locally with:

```bash
npm run dev
```

Then open the URL printed by Vite in a modern browser. Go to `/wsync.html`. On mobile, make sure the phone and LED controller are on the same network.

## 2. Choose a Video

Use **Choose a video** to select a local video file. The app reads frames from the browser video element and keeps previously opened videos in the local library when video caching is available.

Supported formats depend on the browser codec support. Common options include `mp4`, `mov`, `m4v`, and `webm`.

## 3. Configure the Output

Set the LED controller connection fields:

| Field        | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| Output IP    | Hostname or IP address of the WebSocket LED controller.         |
| WS Path      | WebSocket path without the leading slash. The default is `ws`.  |
| Protocol     | Packet format sent over WebSocket. DDP is recommended for WLED. |
| Color format | RGB or RGBW output bytes.                                       |

For a typical WLED device, use:

```text
Output IP: 192.168.1.10
WS Path: ws
Protocol: DDP
Color format: RGB
```

If the app is hosted directly on the target device, leaving the output IP empty lets WSync LED try the current page hostname.

## 4. Select a Layout

Choose the diffusion mode that matches the physical LED installation.

| Mode      | LED count                       |
| --------- | ------------------------------- |
| Grid      | `LED X * LED Y`                 |
| Perimeter | `LED X + LED Y + LED X + LED Y` |
| Border    | `LED X + LED Y + LED Y`         |

When automatic calculation is enabled, the app derives `LED X` and `LED Y` from the selected video and the requested LED count. Disable automatic calculation to enter the dimensions manually.

## 5. Tune the Image Processing

Use the processing controls to match the LED output to the display and room:

| Setting                     | Effect                                     |
| --------------------------- | ------------------------------------------ |
| FPS                         | Maximum stream rate.                       |
| Gain                        | Multiplies output intensity.               |
| Smoothing                   | Blends new colors with the previous frame. |
| Minimum intensity threshold | Turns very dark samples off.               |
| Gamma                       | Adjusts perceived brightness response.     |
| Saturation                  | Increases or decreases color intensity.    |
| Reverse output order        | Sends LEDs in reverse order.               |

Start with the defaults, then adjust gain, threshold, and smoothing first. These usually have the largest visible impact.

## 6. Start Streaming

Press **Start**. WSync LED opens the WebSocket connection, samples video frames through a canvas, builds LED packets, and sends them to the controller.

Press **Stop** to close the WebSocket connection and stop the render loop.

## Editing Individual LEDs

The preview supports per-LED overrides:

- Force a fixed color for one LED.
- Disable one LED.
- Reset a single LED.
- Reset all overrides.

Overrides are useful when the physical LED order or a damaged LED needs a local correction without changing the whole layout.

## Troubleshooting

If no LEDs update, check that:

- The browser can reach the LED controller host.
- The WebSocket path is correct.
- The selected protocol is supported by the target device.
- The video is loaded before pressing **Start**.
- The target device accepts the selected RGB or RGBW format.

If the browser reports a WebSocket error, confirm the IP address, path, and local network connection first.

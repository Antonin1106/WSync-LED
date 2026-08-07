# Examples

These examples show common WSync LED configurations.

## WLED grid With DDP

Use this setup for a rectangular LED matrix controlled by WLED.

| Setting        | Value                                      |
| -------------- | ------------------------------------------ |
| Output IP      | WLED device IP, for example `192.168.1.10` |
| WS Path        | `ws`                                       |
| Protocol       | DDP                                        |
| Color format   | RGB or RGBW, depending on the strip        |
| Diffusion mode | Grid                                       |
| LED X          | Matrix width                               |
| LED Y          | Matrix height                              |

> [!TIP] 
> If the physical output order is inverted, enable **Reverse output order**.

## Four-Sided Screen Ambilight

Use this setup for LEDs around all four sides of a display.

| Setting        | Value                  |
| -------------- | ---------------------- |
| Protocol       | DDP                    |
| Diffusion mode | Perimeter              |
| LED X          | LEDs on the top edge   |
| LED Y          | LEDs on each side edge |

The total LED count is:

```text
LED X + LED Y + LED X + LED Y
```

This mode samples the top, right, bottom, and left edges of the video.

## Three-Sided Screen Border

Use this setup for a strip that covers the top, left, and right sides, with no bottom edge.

| Setting        | Value                  |
| -------------- | ---------------------- |
| Protocol       | DDP                    |
| Diffusion mode | Border                 |
| LED X          | LEDs on the top edge   |
| LED Y          | LEDs on each side edge |

The total LED count is:

```text
LED X + LED Y + LED Y
```

This is useful for desk or wall installations where the bottom edge is intentionally omitted.

## Self-Hosted Device

If WSync LED is hosted by the same device that receives LED frames, leave **Output IP** empty. The app will try to connect to the current page hostname.

For example, if the page is loaded from:

```text
http://192.168.4.1/wsync.html
```

The app will try:

```text
ws://192.168.4.1/ws
```

## JSON Compatibility Mode

Use JSON only when DDP is unavailable.

| Setting      | Value                       |
| ------------ | --------------------------- |
| Protocol     | JSON                        |
| WS Path      | `ws`                        |
| Color format | RGB unless RGBW is required |

> [!IMPORTANT]
> JSON packets are larger and less suitable for high LED counts or high FPS. For stable live output, prefer DDP.
> Uses JSON only as a fallback.

## Suggested Starting Values

These defaults are a practical starting point for most setups:

| Setting                     | Value  |
| --------------------------- | ------ |
| FPS                         | `24`   |
| Gain                        | `1.3`  |
| Smoothing                   | `0.35` |
| Minimum intensity threshold | `8`    |
| Gamma                       | `2`    |
| Saturation                  | `1`    |

> [!INFO] 
> Increase gain for brighter output, increase smoothing for calmer transitions, and increase the threshold if dark scenes produce unwanted low level glow.

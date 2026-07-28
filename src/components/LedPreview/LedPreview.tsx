// components/LedPreview/LedPreview.tsx
// Component to renders a canvas-based preview of the LED layout

import { useEffect, useRef, type ReactNode } from 'react';
import { createLedPositions } from '../../lib/ledLayout/ledLayout';
import type { LedOverride, RGBW, Settings } from '../../types/app';
import t from '../../lib/lang/lang';
import styles from './LedPreview.module.scss';
import { MotionButton } from '../Motion/Motion';

type Props = {
    settings: Settings;
    colors: RGBW[];
    overrides: Record<number, LedOverride>;
    selectedLed: number | null;
    editMode: boolean;
    onEditModeChange: (_enabled: boolean) => void;
    onSelectLed: (_id: number) => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    children?: ReactNode;
};

/**
 * Renders a canvas-based preview of the LED layout and supports selecting individual LEDs.
 * @param props  - The properties for the LedPreview component.
 * @param props.settings - The current application settings, including LED layout configuration.
 * @param props.colors - An array of RGBW color values for each LED in the layout.
 * @param props.overrides - A record of LED override settings, allowing for custom colors or disabled states.
 * @param props.selectedLed - The index of the currently selected LED, or null if none is selected.
 * @param props.editMode -  A boolean indicating whether the LED selection mode is active.
 * @param props.onEditModeChange - A callback function to toggle the edit mode state.
 * @param props.onSelectLed - A callback function to handle selecting an LED when it is clicked in the preview.
 * @param props.children - Optional React children to render within the preview section.
 * @param props.videoRef - A reference to the video element used for LED frame sampling (not used in this component).
 * @returns The rendered LedPreview component.
 */
export default function LedPreview({
    settings,
    colors,
    overrides,
    selectedLed,
    editMode,
    onEditModeChange,
    onSelectLed,
    videoRef,
    children,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const latestLayoutRef = useRef<Array<{ id: number; x: number; y: number; width: number; height: number }>>([]);

    /**
     * Draws the LED layout preview inside the canvas using the current settings and colors.
     */
    function draw() {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        const DEFAULT_RATIO = 1.775; // Corresponding to 16:9

        if (!canvas || !parent) return;

        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const cssWidth = Math.max(280, Math.floor(rect.width));
        const cssHeight = Math.max(220, Math.floor(rect.height));
        const padding = 18;
        const innerW = cssWidth - padding * 2;
        const innerH = cssHeight - padding * 2;
        let videoRatio = videoRef.current ? (videoRef.current.videoWidth / videoRef.current.videoHeight) : DEFAULT_RATIO;
        videoRatio = isNaN(videoRatio) ? DEFAULT_RATIO : videoRatio;

        let previewW = innerW;
        let previewH = previewW / videoRatio;

        const positions = createLedPositions(settings, {
            width: previewW,
            height: previewH,
        });

        if (previewH > innerH) {
            previewH = innerH;
            previewW = previewH * videoRatio;
        }

        const offsetX = padding + (innerW - previewW) / 2;
        const offsetY = padding + (innerH - previewH) / 2;

        latestLayoutRef.current = positions.map((position) => ({
            id: position.id,
            x: offsetX + position.x * previewW,
            y: offsetY + position.y * previewH,
            width: position.width * previewW,
            height: position.height * previewH,
        }));

        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cssWidth, cssHeight);
        ctx.fillStyle = '#05070a';
        ctx.fillRect(0, 0, cssWidth, cssHeight);

        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, previewW, previewH);

        /**
         * Draws a rounded rectangle path for a given canvas context.
         * @param ctx Canvas rendering context.
         * @param x X coordinate of the rectangle.
         * @param y Y coordinate of the rectangle.
         * @param w Rectangle width.
         * @param h Rectangle height.
         * @param r Corner radius.
         */
        function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
            const radius = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + w, y, x + w, y + h, radius);
            ctx.arcTo(x + w, y + h, x, y + h, radius);
            ctx.arcTo(x, y + h, x, y, radius);
            ctx.arcTo(x, y, x + w, y, radius);
            ctx.closePath();
        }

        latestLayoutRef.current.forEach((position) => {
            const color = colors[position.id] ?? [18, 24, 39, 0];
            const override = overrides[position.id];
            const r = Math.min(position.width, position.height) * 0.1;

            ctx.fillStyle = override && !override.enabled
                ? '#111827'
                : `rgb(${color[0] + color[3]}, ${color[1] + color[3]}, ${color[2] + color[3]})`; // Apply white channel to RGB values in the preview
            roundRect(ctx, position.x, position.y, position.width, position.height, r);
            ctx.fill();

            ctx.strokeStyle = '#020617';
            ctx.lineWidth = 1;
            roundRect(ctx, position.x, position.y, position.width, position.height, r);
            ctx.stroke();

            if (override?.color) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                roundRect(ctx, position.x + 1, position.y + 1, position.width - 2, position.height - 2, Math.max(0, r - 1));
                ctx.stroke();
            }

            if (position.id === selectedLed) {
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 3;
                roundRect(ctx, position.x + 1.5, position.y + 1.5, position.width - 3, position.height - 3, Math.max(0, r - 1.5));
                ctx.stroke();
            }
        });
    }

    useEffect(() => {
        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    });

    /**
     * Selects the LED located at the pointer position when edit mode is active.
     * @param event Pointer event emitted by the canvas.
     */
    function pickLed(event: React.PointerEvent<HTMLCanvasElement>) {
        if (!editMode) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const hit = latestLayoutRef.current.find(
            (position) =>
                x >= position.x &&
                x <= position.x + position.width &&
                y >= position.y &&
                y <= position.y + position.height,
        );

        if (hit) onSelectLed(hit.id);
    }

    return (
        <section className={styles.previewSurface}>
            <div className={styles.previewToolbar}>
                <div>
                    <p className={styles.eyebrow}>{t('visualization')}</p>
                    <h2>{t('layout')}</h2>
                </div>
                <MotionButton
                    className={editMode ? `${styles.modeButton} ${styles.active}` : styles.modeButton}
                    onClick={() => onEditModeChange(!editMode)}
                >
                    {editMode ? t('editingActive') : t('editLEDs')}
                </MotionButton>
            </div>

            <div className={styles.previewCanvasWrap}>
                <canvas ref={canvasRef} onPointerDown={pickLed} />
            </div>

            {children}
        </section>
    );
}
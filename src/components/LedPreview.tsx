import { useEffect, useRef, type ReactNode } from 'react';
import { createLedPositions } from '../lib/ledLayout';
import type { LedOverride, Rgb, Settings } from '../types/app';

type Props = {
    settings: Settings;
    colors: Rgb[];
    overrides: Record<number, LedOverride>;
    selectedLed: number | null;
    editMode: boolean;
    onEditModeChange: (_enabled: boolean) => void;
    onSelectLed: (_id: number) => void;
    children?: ReactNode;
};

/**
 * Renders a canvas-based preview of the LED layout and supports selecting individual LEDs.
 */
export default function LedPreview({
    settings,
    colors,
    overrides,
    selectedLed,
    editMode,
    onEditModeChange,
    onSelectLed,
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
        if (!canvas || !parent) return;

        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const cssWidth = Math.max(280, Math.floor(rect.width));
        const cssHeight = Math.max(220, Math.floor(rect.height));
        const padding = 18;
        const innerW = cssWidth - padding * 2;
        const innerH = cssHeight - padding * 2;
        const positions = createLedPositions(settings, {
            width: innerW,
            height: innerH,
        });

        latestLayoutRef.current = positions.map((position) => ({
            id: position.id,
            x: padding + position.x * innerW,
            y: padding + position.y * innerH,
            width: position.width * innerW,
            height: position.height * innerH,
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
        ctx.strokeRect(padding, padding, innerW, innerH);

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
            const color = colors[position.id] ?? [18, 24, 39];
            const override = overrides[position.id];
            const r = Math.min(position.width, position.height) * 0.1;

            ctx.fillStyle = override && !override.enabled
                ? '#111827'
                : `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
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
        <section className="preview-surface">
            <div className="preview-toolbar">
                <div>
                    <p className="eyebrow">Visualization</p>
                    <h2>LED layout</h2>
                </div>
                <button
                    className={editMode ? 'mode-button active' : 'mode-button'}
                    onClick={() => onEditModeChange(!editMode)}
                >
                    {editMode ? 'Editing active' : 'Edit LEDs'}
                </button>
            </div>

            <div className="preview-canvas-wrap">
                <canvas ref={canvasRef} onPointerDown={pickLed} />
            </div>

            {children}
        </section>
    );
}

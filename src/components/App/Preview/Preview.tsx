// components/App/Preview/Preview.tsx
// Component to renders the LED preview and editor.

import { useState, type RefObject } from 'react';
import LedEditor from '../../LedEditor/LedEditor';
import LedPreview from '../../LedPreview/LedPreview';
import type { Rgb, Settings } from '../../../types/app';
import type { OverridesHook } from '../../../types/hooks';

/**
 * Preview component that renders the LED preview and editor.
 * @param props The properties for the Preview component.
 * @param props.ledColors The current colors of the LEDs to be displayed in the preview.
 * @param props.overrides The overrides containing LED override states and functions.
 * @param props.settings The current application settings.
 * @param props.videoRef A reference to the video element used for previewing.
 * @returns The rendered Preview component.
 */
export default function Preview({ ledColors, overrides, settings, videoRef }:
    {
        ledColors: Rgb[],
        overrides: OverridesHook,
        settings: Settings,
        videoRef: RefObject<HTMLVideoElement | null>
    }) {

    const [editLeds, setEditLeds] = useState(false);

    return (
        <LedPreview
            settings={settings}
            colors={ledColors}
            overrides={overrides.ledOverrides}
            selectedLed={overrides.selectedLed}
            editMode={editLeds}
            onEditModeChange={setEditLeds}
            onSelectLed={overrides.setSelectedLed}
            videoRef={videoRef}
        >
            <LedEditor
                selectedLed={overrides.selectedLed}
                disabledLedCount={overrides.disabledLedCount}
                selectedOverride={overrides.selectedOverride}
                onUpdateLed={overrides.updateSelectedLed}
                onResetAll={() => overrides.setLedOverrides({})}
            />
        </LedPreview>
    );
}
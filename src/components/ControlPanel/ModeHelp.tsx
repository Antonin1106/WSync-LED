// components/ControlPanel/ModeHelp.tsx
// Component to renders a user-facing description of the active mapping mode

import { ta } from '../../lib/lang/lang';
import { MotionSpan } from '../Motion/Motion';
import type { Settings } from '../../types/app';

/**
 * Returns a user-facing description of the active mapping mode.
 * @param props Proprety of the ModeHelp component
 * @param props.settings Current LED layout settings.
 * @returns Help text explaining current mapping behavior.
 */
export function ModeHelp({ settings }: { settings: Settings }) {
    if (settings.mappingMode === 'perimeter') {
        return <MotionSpan>{ta('perimeterHelp', { ledX: settings.ledX, ledY: settings.ledY })}</MotionSpan>;
    }

    if (settings.mappingMode === 'border')
        return <MotionSpan>{ta('borderHelp', { ledX: settings.ledX, ledY: settings.ledY })}</MotionSpan>;

    return <MotionSpan>{ta('gridHelp', { ledX: settings.ledX, ledY: settings.ledY })}</MotionSpan>;
}
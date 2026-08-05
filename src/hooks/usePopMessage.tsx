// hooks/usePopMessage.tsx
// Pop message management hook.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { SettingsHook } from '../types/hooks';
import { MotionSpan } from '../components/Motion/Motion';
import { AP_IP } from '../config/appConfig';
import t from '../lib/lang/lang';

/**
 * Custom React hook to manage messages based on the application settings.
 * @param settings The settings hook that manages application settings.
 * @returns The React component of the message (MotionSpan).
 */
export default function usePopMessage(settings: SettingsHook): ReactNode {
    const [message, setMessage] = useState<ReactNode>('');
    const previous = useRef(settings);

    const pop = (message: ReactNode) => () =>
        setMessage(prev => prev === message ? prev : message);

    useEffect(() => {
        const events: ReactNode[] = [];
        const previousAppSettings = previous.current.settings;
        // const appSettings = settings.settings;

        if (settings.scanResult === '')
            events.push(t('searchingWLED'));

        if (settings.scanResult === undefined)
            events.push(t('noWLEDfound') + '.');
        else {
            const connectedTo = (ip: string) => `${t('connectedTo')} ${ip}.`;

            switch (settings.scanResult) {
                case previousAppSettings.ip:
                    events.push(connectedTo(settings.scanResult));
                    break;
                case AP_IP:
                    events.push(connectedTo(t('APmode')));
                    break;
                case window.location.hostname:
                    events.push(connectedTo(t('currentDevice')));
                    break;
                default:
                    events.push(connectedTo(settings.scanResult));
            }
        }

        if (events.length > 0)
            pop(events[0])();

        previous.current = settings;
    }, [settings]);


    return <MotionSpan key={message?.toString()}>{message}</MotionSpan>;
}

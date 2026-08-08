// components/LanguageSelector/LanguageSelector.test.tsx
// Unit tests for LanguageSelector component.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSelector from './LanguageSelector';
import type { Lang } from '../../types/lang';
import { initialSettings } from '../../config/appConfig';
let settings = {
    ...initialSettings,
    lang: 'en',
};

let currentLanguage = 'en';

const mocks = vi.hoisted(() => ({
    saveSettings: vi.fn(),
}));

vi.mock('../../lib/storage/storage', () => ({
    loadSettings: () => settings,
    saveSettings: mocks.saveSettings,
}));

vi.mock('../../config/langConfig', () => ({
    default: {
        get language() {
            return currentLanguage;
        },
        changeLanguage: vi.fn((lang: string) => {
            currentLanguage = lang;
        }),
    },
}));

vi.mock('../../lib/lang/lang', () => {
    const translate = vi.fn((_key: Lang, _options?: Record<string, unknown>) => 'Language');

    return {
        default: translate,
    };
});

describe('LanguageSelector', () => {
    beforeEach(() => {
        settings = {
            ...initialSettings,
            lang: 'en',
        };

        currentLanguage = 'en';

        mocks.saveSettings.mockReset();
    });

    it('renders with the saved language selected', () => {
        render(<LanguageSelector setSettings={vi.fn()} />);

        expect(screen.getByRole('combobox')).toHaveValue('en');
    });

    it('changes the language', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<LanguageSelector setSettings={onChange} />);

        await user.selectOptions(screen.getByRole('combobox'), 'fr');

        expect(mocks.saveSettings).toHaveBeenCalledWith({
            ...initialSettings,
            lang: 'fr',
        });

        expect(currentLanguage).toBe('fr');

        expect(onChange).toHaveBeenCalledTimes(1);

        const updater = onChange.mock.calls[0]?.[0];
        expect(typeof updater).toBe('function');
        expect(updater({ ...initialSettings, lang: 'en' })).toEqual({
            ...initialSettings,
            lang: 'fr',
        });
    });

    it('does nothing on mount if language is already current', () => {
        settings.lang = 'en';
        currentLanguage = 'en';

        render(<LanguageSelector setSettings={vi.fn()} />);

        expect(mocks.saveSettings).not.toHaveBeenCalled();
    });

    it('loads the saved language', () => {
        settings.lang = 'fr';
        currentLanguage = 'fr';

        render(<LanguageSelector setSettings={vi.fn()} />);

        expect(screen.getByRole('combobox')).toHaveValue('fr');

        expect(mocks.saveSettings).not.toHaveBeenCalled();
    });
});
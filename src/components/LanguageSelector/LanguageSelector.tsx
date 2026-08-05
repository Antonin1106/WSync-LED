// components/LanguageSelector/LanguageSelector.tsx
// Component to select a specific language

import { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../../lib/storage/storage';
import i18n from '../../config/langConfig';
import styles from './LanguageSelector.module.scss';
import type { Settings } from '../../types/app';

/**
 * Allows the user to switch the active interface language.
 * @param props The props for the LanguageSelector component.
 * @param props.setSettings A function to update the application settings.
 * @returns The rendered LanguageSelector component.
 */
export default function LanguageSelector({ setSettings }: { setSettings: React.Dispatch<React.SetStateAction<Settings>> }) {

    const [lang, setLang] = useState(() => loadSettings().lang);

    useEffect(() => {
        const settings = loadSettings();
        if (settings.lang === lang && i18n.language === lang)
            return;

        setSettings((prev) => ({ ...prev, lang }));
        saveSettings({ ...settings, lang });

        i18n.changeLanguage(lang);
    }, [lang, setSettings]);


    return (
        <select className={styles.languageSelector} value={lang} onChange={(e) => setLang(e.target.value as Settings['lang'])}>
            <option value="en">English</option>
            <option value="fr">Français</option>
        </select>
    );
}
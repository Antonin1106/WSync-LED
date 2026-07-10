import { useEffect, useReducer, useState } from 'react';
import { loadSettings, saveSettings } from '../../lib/storage';
import i18n from '../../config/langConfig';
import styles from './LanguageSelector.module.scss';

/**
 * Allows the user to switch the active interface language.
 * @returns The rendered LanguageSelector component.
 */
export default function LanguageSelector() {

    const [lang, setLang] = useState(loadSettings().lang);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        // Save the new language
        const settings = loadSettings();
        settings.lang = lang;
        saveSettings(settings);

        i18n.changeLanguage(lang);
        forceUpdate(); // Not working yet
    }, [lang]);

    return (
        <select className={styles.languageSelector} value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
        </select>
    );
}
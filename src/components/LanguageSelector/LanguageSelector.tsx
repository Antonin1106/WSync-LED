import { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../../lib/storage';
import i18n from '../../config/langConfig';
import styles from './LanguageSelector.module.scss';

/**
 * Allows the user to switch the active interface language.
 * @param props - The props for the LanguageSelector component.
 * @param props.onChange Callback function that is called when the language is changed.
 * @returns The rendered LanguageSelector component.
 */
export default function LanguageSelector({ onChange }: { onChange: () => void }) {

    const [lang, setLang] = useState(() => loadSettings().lang);

    useEffect(() => {
        const settings = loadSettings();
        if (settings.lang === lang && i18n.language === lang) {
            return;
        }

        settings.lang = lang;
        saveSettings(settings);

        i18n.changeLanguage(lang);
        onChange();
    }, [lang, onChange]);


    return (
        <select className={styles.languageSelector} value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
        </select>
    );
}
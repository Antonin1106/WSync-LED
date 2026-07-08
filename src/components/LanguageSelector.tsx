import { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../lib/storage';

/**
 * Allows the user to switch the active interface language.
 */
export default function LanguageSelector() {

    const [lang, setLang] = useState(loadSettings().lang);

    useEffect(() => {
        const settings = loadSettings();
        settings.lang = lang;
        saveSettings(settings);
    }, [lang]);

    return (
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
        </select>
    );
}
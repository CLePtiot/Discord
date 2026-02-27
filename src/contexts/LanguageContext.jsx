import React, { createContext, useContext, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ language = 'fr', children }) => {
    const t = useCallback((key) => {
        const lang = translations[language];
        if (lang && lang[key]) return lang[key];
        // Fallback to French
        if (translations.fr[key]) return translations.fr[key];
        // Fallback to key itself
        return key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        // Fallback if used outside provider
        return {
            language: 'fr',
            t: (key) => translations.fr?.[key] || key
        };
    }
    return context;
};

export default LanguageContext;

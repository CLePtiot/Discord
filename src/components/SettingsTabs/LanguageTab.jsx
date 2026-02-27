import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const languages = [
    { id: 'fr', label: 'Français', native: 'Français' },
    { id: 'en', label: 'English (US)', native: 'Anglais (États-Unis)' },
    { id: 'es', label: 'Español', native: 'Espagnol' },
    { id: 'de', label: 'Deutsch', native: 'Allemand' },
    { id: 'pt', label: 'Português (Brasil)', native: 'Portugais (Brésil)' },
    { id: 'ja', label: '日本語', native: 'Japonais' },
    { id: 'ko', label: '한국어', native: 'Coréen' },
    { id: 'zh', label: '中文 (简体)', native: 'Chinois (Simplifié)' },
    { id: 'ru', label: 'Русский', native: 'Russe' },
    { id: 'ar', label: 'العربية', native: 'Arabe' },
    { id: 'it', label: 'Italiano', native: 'Italien' },
    { id: 'nl', label: 'Nederlands', native: 'Néerlandais' },
];

const LanguageTab = ({ preferences, setPreferences }) => {
    const currentLang = preferences?.language || 'fr';

    const handleSelect = (langId) => {
        setPreferences({ ...preferences, language: langId });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Langue</h2>

            <div style={{ marginBottom: '32px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Sélectionne la langue de l'application. Project Freedom prend en charge les langues suivantes :
                </p>

                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '4px'
                }}>
                    {languages.map((lang) => {
                        const isActive = currentLang === lang.id;
                        return (
                            <div
                                key={lang.id}
                                onClick={() => handleSelect(lang.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 16px',
                                    background: isActive ? 'rgba(88, 101, 242, 0.15)' : 'var(--bg-secondary)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: isActive ? '1px solid var(--accent-color)' : '1px solid transparent',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--bg-secondary)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        color: isActive ? 'var(--text-header)' : 'var(--text-normal)',
                                        fontWeight: isActive ? 600 : 500
                                    }}>
                                        {lang.label}
                                    </div>
                                    <div style={{
                                        color: 'var(--text-muted)', fontSize: '13px'
                                    }}>
                                        {lang.native}
                                    </div>
                                </div>
                                {isActive && (
                                    <Check size={18} color="var(--accent-color)" strokeWidth={3} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px', fontStyle: 'italic' }}>
                    Note : le changement de langue est enregistré dans tes préférences. L'interface reste en français pour cette démo.
                </p>
            </div>
        </motion.div>
    );
};

export default LanguageTab;

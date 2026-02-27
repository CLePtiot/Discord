import React from 'react';
import { motion } from 'framer-motion';

const LanguageTab = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Langue</h2>

            <div style={{ marginBottom: '32px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Sélectionne la langue de l'application. Project Freedom prend en charge les langues suivantes :
                </p>

                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', background: 'var(--bg-secondary)',
                        borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--accent-color)'
                    }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500 }}>Français</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Français</div>
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', background: 'var(--bg-secondary)',
                        borderRadius: '4px', cursor: 'not-allowed', opacity: 0.5
                    }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500 }}>English (US)</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Anglais (États-Unis)</div>
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', background: 'var(--bg-secondary)',
                        borderRadius: '4px', cursor: 'not-allowed', opacity: 0.5
                    }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500 }}>Español</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Espagnol</div>
                    </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px', fontStyle: 'italic' }}>
                    D'autres langues seront disponibles prochainement.
                </p>
            </div>
        </motion.div>
    );
};

export default LanguageTab;

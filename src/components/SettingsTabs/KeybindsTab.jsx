import React from 'react';
import { motion } from 'framer-motion';

const keybinds = [
    { action: 'Ouvrir / Fermer les paramètres', keys: ['Ctrl', ','] },
    { action: 'Recherche rapide', keys: ['Ctrl', 'K'] },
    { action: 'Basculer le micro (Mute)', keys: ['Ctrl', 'Shift', 'M'] },
    { action: 'Basculer le son (Sourdine)', keys: ['Ctrl', 'Shift', 'D'] },
    { action: 'Naviguer entre les serveurs', keys: ['Ctrl', 'Alt', '↑ / ↓'] },
    { action: 'Naviguer entre les salons', keys: ['Alt', '↑ / ↓'] },
    { action: 'Salon vocal : Rejoindre / Quitter', keys: ['Ctrl', 'Shift', 'V'] },
    { action: 'Marquer comme lu', keys: ['Échap'] },
    { action: 'Charger un fichier', keys: ['Ctrl', 'U'] },
    { action: 'Liste des amis', keys: ['Ctrl', 'Shift', 'F'] },
    { action: 'Modifier le dernier message', keys: ['↑'] },
    { action: 'Mentionner @tout le monde', keys: ['@', 'everyone'] }
];

const KeybindsTab = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Raccourcis clavier</h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Voici les raccourcis clavier disponibles dans Project Freedom. Ils te permettront de naviguer plus rapidement.
            </p>

            <div style={{
                borderRadius: '8px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)'
            }}>
                {keybinds.map((kb, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: i % 2 === 0 ? 'var(--bg-secondary)' : 'transparent',
                        borderBottom: i < keybinds.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'
                    }}>
                        <span style={{ color: 'var(--text-normal)', fontSize: '14px', fontWeight: 500 }}>
                            {kb.action}
                        </span>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {kb.keys.map((key, j) => (
                                <React.Fragment key={j}>
                                    {j > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 2px' }}>+</span>}
                                    <kbd style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderBottom: '2px solid rgba(255,255,255,0.15)',
                                        borderRadius: '4px',
                                        padding: '3px 8px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: 'var(--text-normal)',
                                        fontFamily: 'inherit',
                                        minWidth: '28px',
                                        textAlign: 'center'
                                    }}>
                                        {key}
                                    </kbd>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default KeybindsTab;

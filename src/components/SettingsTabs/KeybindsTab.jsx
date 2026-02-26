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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', textAlign: 'center'
        }}>
            <div style={{
                position: 'relative', width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: 'rgba(88, 101, 242, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid var(--accent-color)', borderRadius: '50%', opacity: 0.5 }}></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>

            <h2 style={{ color: 'var(--text-header)', marginBottom: '12px', fontSize: '24px' }}>Fonctionnalité en approche...</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px', marginBottom: '32px', lineHeight: 1.5 }}>
                La configuration personnalisée des raccourcis clavier est en cours de développement. Ils seront disponibles dans une future mise à jour !
            </p>

            {/* Animated Progress Bar */}
            <div style={{ width: '100%', maxWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    <span>Progression du Dev</span>
                    <span style={{ color: 'var(--accent-color)' }}>80%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{ height: '100%', backgroundColor: 'var(--accent-color)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}
                    >
                        {/* Light sweep animation */}
                        <motion.div
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                            style={{
                                position: 'absolute', top: 0, bottom: 0, width: '40px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                transform: 'skewX(-20deg)'
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default KeybindsTab;

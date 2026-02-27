import React from 'react';
import { motion } from 'framer-motion';
import { Keyboard, MousePointer2, Command } from 'lucide-react';

const KeybindsTab = () => {
    const keybindGroups = [
        {
            title: 'Navigation',
            binds: [
                { action: 'Naviguer entre les serveurs', keys: ['Ctrl', 'Alt', '↑ / ↓'] },
                { action: 'Naviguer entre les salons', keys: ['Alt', '↑ / ↓'] },
                { action: 'Recherche rapide', keys: ['Ctrl', 'K'] },
                { action: 'Liste des amis', keys: ['Ctrl', 'Shift', 'F'] },
            ]
        },
        {
            title: 'Chat',
            binds: [
                { action: 'Marquer comme lu', keys: ['Échap'] },
                { action: 'Charger un fichier', keys: ['Ctrl', 'U'] },
                { action: 'Modifier le dernier message', keys: ['↑'] },
                { action: 'Mentionner @tout le monde', keys: ['@', 'everyone'] },
            ]
        },
        {
            title: 'Voix & Vidéo',
            binds: [
                { action: 'Basculer le micro (Mute)', keys: ['Ctrl', 'Shift', 'M'] },
                { action: 'Basculer le son (Sourdine)', keys: ['Ctrl', 'Shift', 'D'] },
                { action: 'Salon vocal : Rejoindre / Quitter', keys: ['Ctrl', 'Shift', 'V'] },
            ]
        },
        {
            title: 'Général',
            binds: [
                { action: 'Ouvrir / Fermer les paramètres', keys: ['Ctrl', ','] },
            ]
        }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Raccourcis clavier</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {keybindGroups.map((group, gIdx) => (
                    <div key={gIdx}>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                            {group.title}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {group.binds.map((bind, bIdx) => (
                                <div key={bIdx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 0',
                                    borderBottom: bIdx < group.binds.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                                }}>
                                    <div style={{ color: 'var(--text-normal)', fontSize: '14px' }}>{bind.action}</div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {bind.keys.map((key, kIdx) => (
                                            <React.Fragment key={kIdx}>
                                                <kbd style={{
                                                    backgroundColor: 'var(--bg-tertiary)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '4px',
                                                    padding: '2px 6px',
                                                    fontSize: '12px',
                                                    color: 'var(--text-normal)',
                                                    minWidth: '24px',
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                    boxShadow: '0 2px 0 rgba(0,0,0,0.2)'
                                                }}>
                                                    {key}
                                                </kbd>
                                                {kIdx < bind.keys.length - 1 && <span style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>+</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '32px 0' }}></div>

            <div style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: 'rgba(88, 101, 242, 0.1)',
                border: '1px solid rgba(88, 101, 242, 0.2)',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
            }}>
                <Command size={24} color="var(--accent-color)" />
                <div>
                    <div style={{ color: 'var(--text-header)', fontWeight: 600, marginBottom: '4px' }}>
                        Personnalisation des raccourcis
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        La possibilité de modifier tes propres raccourcis clavier sera disponible dans une prochaine mise à jour.
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default KeybindsTab;

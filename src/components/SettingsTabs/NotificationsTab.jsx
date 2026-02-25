import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const NotificationsTab = () => {
    const [desktopNotifs, setDesktopNotifs] = useState(true);
    const [sounds, setSounds] = useState(true);
    const [badgeCount, setBadgeCount] = useState(true);
    const [taskbarFlash, setTaskbarFlash] = useState(true);
    const [dmNotifs, setDmNotifs] = useState(true);

    const settings = [
        {
            label: 'Activer les notifications bureautiques',
            desc: 'Affiche une notification du système lorsque tu reçois un message.',
            value: desktopNotifs, onChange: setDesktopNotifs
        },
        {
            label: 'Activer les sons de notification',
            desc: 'Joue un son lorsqu\'un message est reçu.',
            value: sounds, onChange: setSounds
        },
        {
            label: 'Compteur de badges non lus',
            desc: 'Affiche le nombre de messages non lus sur l\'icône de l\'application.',
            value: badgeCount, onChange: setBadgeCount
        },
        {
            label: 'Clignotement de la barre des tâches',
            desc: 'Fais clignoter l\'icône de l\'application dans la barre des tâches.',
            value: taskbarFlash, onChange: setTaskbarFlash
        },
        {
            label: 'Notifications des messages privés',
            desc: 'Reçois une notification pour chaque nouveau message privé.',
            value: dmNotifs, onChange: setDmNotifs
        }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Notifications</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Paramètres de notification
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {settings.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', borderBottom: i < settings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                        }}>
                            <div style={{ flex: 1, paddingRight: '16px' }}>
                                <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>{s.label}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.desc}</div>
                            </div>
                            <Toggle value={s.value} onChange={s.onChange} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '24px 0' }}></div>

            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>
                    Notifications des serveurs
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Tu peux personnaliser les notifications de chaque serveur en faisant un clic droit sur l'icône du serveur.
                </p>
                <div style={{
                    padding: '16px', borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-muted)', fontSize: '14px'
                }}>
                    Les paramètres par serveur apparaîtront ici.
                </div>
            </div>
        </motion.div>
    );
};

export default NotificationsTab;

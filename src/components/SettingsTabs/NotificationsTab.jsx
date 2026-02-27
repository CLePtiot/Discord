import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Volume2, MessageSquare, Smartphone } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const NotificationsTab = () => {
    const { t } = useTranslation();
    const [desktopNotifications, setDesktopNotifications] = useState(true);
    const [unreadBadge, setUnreadBadge] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [notifSounds, setNotifSounds] = useState(true);

    const notificationSettings = [
        {
            label: 'Activer les notifications de bureau',
            desc: 'Affiche une notification de bureau pour les nouveaux messages.',
            icon: <Bell size={16} color="var(--accent-color)" />,
            value: desktopNotifications,
            onChange: setDesktopNotifications
        },
        {
            label: 'Activer les sons de notification',
            desc: 'Joue un son pour les nouveaux messages et mentions.',
            icon: <Volume2 size={16} color="var(--accent-color)" />,
            value: notifSounds,
            onChange: setNotifSounds
        },
        {
            label: 'Badge de messages non lus',
            desc: 'Affiche un badge rouge sur l\'icône de l\'application lorsqu\'il y a des messages non lus.',
            icon: <MessageSquare size={16} color="var(--accent-color)" />,
            value: unreadBadge,
            onChange: setUnreadBadge
        },
        {
            label: 'Notifications Push sur mobile',
            desc: 'Reçois des notifications sur ton appareil mobile lorsque tu n\'es pas actif sur ordinateur.',
            icon: <Smartphone size={16} color="var(--accent-color)" />,
            value: pushNotifications,
            onChange: setPushNotifications
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
                    {notificationSettings.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', borderBottom: i < notificationSettings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                        }}>
                            <div style={{ flex: 1, paddingRight: '16px' }}>
                                <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {s.icon}
                                    {s.label}
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.desc}</div>
                            </div>
                            <Toggle value={s.value} onChange={s.onChange} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '24px 0' }}></div>

            {/* Test Notification Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    Test des notifications
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Tu ne sais pas si tes notifications fonctionnent ? Clique sur le bouton ci-dessous pour envoyer une notification de test.
                </p>
                <button
                    style={{
                        alignSelf: 'flex-start',
                        background: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onClick={() => {
                        if (Notification.permission === "granted") {
                            new Notification("Project Freedom", {
                                body: "Ceci est une notification de test !",
                                icon: "/favicon.ico"
                            });
                        } else if (Notification.permission !== "denied") {
                            Notification.requestPermission().then(permission => {
                                if (permission === "granted") {
                                    new Notification("Project Freedom", {
                                        body: "Ceci est une notification de test !",
                                        icon: "/favicon.ico"
                                    });
                                }
                            });
                        }
                    }}
                >
                    Envoyer une notification de test
                </button>
            </div>
        </motion.div>
    );
};

export default NotificationsTab;

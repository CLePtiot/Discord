import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const AdvancedTab = () => {
    const [devMode, setDevMode] = useState(false);
    const [hardwareAcc, setHardwareAcc] = useState(true);

    const settings = [
        {
            label: 'Mode développeur',
            desc: 'Le mode développeur affiche les identifiants en contexte dans le menu du clic droit. Utile pour la création de bots par exemple.',
            value: devMode, onChange: setDevMode
        },
        {
            label: 'Accélération matérielle',
            desc: 'L\'accélération matérielle rend Project Freedom plus fluide. Désactive-la si tu observes des baisses de FPS dans tes jeux.',
            value: hardwareAcc, onChange: setHardwareAcc
        }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Avancé</h2>

            <div style={{ marginBottom: '32px' }}>
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
        </motion.div>
    );
};

export default AdvancedTab;

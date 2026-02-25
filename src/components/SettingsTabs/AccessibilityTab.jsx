import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const AccessibilityTab = () => {
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [linkPreview, setLinkPreview] = useState(true);
    const [saturation, setSaturation] = useState(100);

    const settings = [
        {
            label: 'Réduire les animations',
            desc: 'Réduit les effets visuels et animations pour une expérience plus sobre.',
            value: reducedMotion, onChange: setReducedMotion
        },
        {
            label: 'Mode contraste élevé',
            desc: 'Augmente le contraste des éléments de l\'interface pour une meilleure lisibilité.',
            value: highContrast, onChange: setHighContrast
        },
        {
            label: 'Texte agrandi',
            desc: 'Augmente la taille de la police de base de l\'application.',
            value: largeText, onChange: setLargeText
        },
        {
            label: 'Aperçu des liens',
            desc: 'Affiche un aperçu visuel des liens partagés dans le chat.',
            value: linkPreview, onChange: setLinkPreview
        }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Accessibilité</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Options d'affichage
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

            {/* Saturation slider */}
            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Saturation des rôles
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Ajuste la saturation des couleurs de rôles dans les noms d'utilisateurs.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input
                        type="range" min="0" max="200" value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        style={{ flex: 1, accentColor: 'var(--accent-color)' }}
                    />
                    <span style={{ color: 'var(--text-normal)', fontWeight: 600, fontSize: '14px', minWidth: '48px', textAlign: 'right' }}>
                        {saturation}%
                    </span>
                </div>

                {/* Preview colors */}
                <div style={{
                    marginTop: '16px', padding: '16px', borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', gap: '16px'
                }}>
                    {['#e74c3c', '#e67e22', '#2ecc71', '#3498db', '#9b59b6'].map((color, i) => (
                        <div key={i} style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: color,
                            filter: `saturate(${saturation / 100})`,
                            transition: 'filter 0.2s ease'
                        }}></div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AccessibilityTab;

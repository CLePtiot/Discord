import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const AccessibilityTab = ({ preferences, setPreferences }) => {
    const { t } = useTranslation();
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [linkPreview, setLinkPreview] = useState(true);
    const [saturation, setSaturation] = useState(100);

    const settings = [
        {
            label: t('accessibility.reduce_motion'),
            desc: t('accessibility.reduce_motion_desc'),
            value: reducedMotion, onChange: setReducedMotion
        },
        {
            label: t('accessibility.high_contrast'),
            desc: t('accessibility.high_contrast_desc'),
            value: highContrast, onChange: setHighContrast
        },
        {
            label: t('accessibility.large_text'),
            desc: t('accessibility.large_text_desc'),
            value: largeText, onChange: setLargeText
        },
        {
            label: t('accessibility.link_preview'),
            desc: t('accessibility.link_preview_desc'),
            value: linkPreview, onChange: setLinkPreview
        }
    ];

    const appSoundsEnabled = preferences?.appSounds !== false;
    const handleToggleAppSounds = (val) => {
        setPreferences({ ...preferences, appSounds: val });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>{t('accessibility.title')}</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    {t('accessibility.display_options')}
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

            {/* ── App Sounds Toggle ── */}
            <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    {t('accessibility.audio')}
                </h3>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0',
                }}>
                    <div style={{ flex: 1, paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Volume2 size={16} color="var(--accent-color)" />
                            {t('accessibility.app_sounds')}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                            {t('accessibility.app_sounds_desc')}
                        </div>
                    </div>
                    <Toggle value={appSoundsEnabled} onChange={handleToggleAppSounds} />
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '24px 0' }}></div>

            {/* Saturation slider */}
            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    {t('accessibility.role_saturation')}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    {t('accessibility.role_saturation_desc')}
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

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '24px 0' }}></div>

            {/* Font Size slider */}
            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, margin: '24px 0 16px 0', textTransform: 'uppercase' }}>
                    {t('accessibility.font_size')}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    {t('accessibility.font_size_desc')}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>A</span>
                    <input
                        type="range" min="12" max="24" step="1"
                        value={preferences?.fontSize ?? 16}
                        onChange={(e) => setPreferences({ ...preferences, fontSize: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--accent-color)' }}
                    />
                    <span style={{ fontSize: '24px', color: 'var(--text-muted)' }}>A</span>
                </div>
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                    <span style={{ color: 'var(--text-normal)', fontWeight: 600, fontSize: '14px' }}>
                        {preferences?.fontSize ?? 16}px
                    </span>
                </div>
            </div >
        </motion.div >
    );
};

export default AccessibilityTab;

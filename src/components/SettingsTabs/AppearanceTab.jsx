import React from 'react';
import { motion } from 'framer-motion';

const AppearanceTab = ({ preferences, setPreferences }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Apparence</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>Thème</h3>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                        onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                        style={{
                            width: '200px',
                            cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', gap: '8px',
                            opacity: preferences.theme === 'dark' ? 1 : 0.6
                        }}
                    >
                        <div style={{
                            height: '100px', borderRadius: '8px',
                            backgroundColor: '#313338',
                            border: `2px solid ${preferences.theme === 'dark' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                            position: 'relative'
                        }}>
                            {preferences.theme === 'dark' && (
                                <div style={{
                                    position: 'absolute', top: 8, right: 8,
                                    width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--accent-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            )}
                        </div>
                        <span style={{ textAlign: 'center', color: 'var(--text-normal)', fontWeight: 500 }}>Sombre</span>
                    </div>

                    <div
                        onClick={() => setPreferences({ ...preferences, theme: 'amoled' })}
                        style={{
                            width: '200px',
                            cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', gap: '8px',
                            opacity: preferences.theme === 'amoled' ? 1 : 0.6
                        }}
                    >
                        <div style={{
                            height: '100px', borderRadius: '8px',
                            backgroundColor: '#000000',
                            border: `2px solid ${preferences.theme === 'amoled' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                            position: 'relative'
                        }}>
                            {preferences.theme === 'amoled' && (
                                <div style={{
                                    position: 'absolute', top: 8, right: 8,
                                    width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--accent-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            )}
                        </div>
                        <span style={{ textAlign: 'center', color: 'var(--text-normal)', fontWeight: 500 }}>Amoled</span>
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

            {/* Customization Options */}
            <div style={{ marginBottom: '32px', display: 'flex', gap: '32px' }}>
                {/* Accent Color */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>
                        Couleur d'accentuation
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                        Choisis la couleur principale pour les boutons, icônes et effets de survol.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            type="color"
                            value={preferences.accentColor || '#5865F2'}
                            onChange={(e) => setPreferences({ ...preferences, accentColor: e.target.value })}
                            style={{
                                width: '40px', height: '40px', padding: '0', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent'
                            }}
                        />
                        <div style={{ color: 'var(--text-normal)', fontFamily: 'monospace', fontSize: '14px', backgroundColor: 'var(--bg-input)', padding: '6px 12px', borderRadius: '4px' }}>
                            {preferences.accentColor || '#5865F2'}
                        </div>
                        <button
                            onClick={() => setPreferences({ ...preferences, accentColor: '#5865F2' })}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Blur Intensity */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>
                        Intensité du verre (Blur)
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                        Ajuste le niveau de flou d'arrière-plan des panneaux de l'interface.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <input
                            type="range"
                            min="0"
                            max="60"
                            value={preferences.blurIntensity ?? 40}
                            onChange={(e) => setPreferences({ ...preferences, blurIntensity: Number(e.target.value) })}
                            style={{ flex: 1, accentColor: 'var(--accent-color)' }}
                        />
                        <span style={{ color: 'var(--text-normal)', fontWeight: 600, fontSize: '14px', minWidth: '40px' }}>
                            {preferences.blurIntensity ?? 40}px
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Affichage des messages</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Le mode Amoled a été spécialement ajouté suite à vos retours pour offrir une expérience "Noir Pur" optimale.
                </p>

                {/* Visual example of the theme difference */}
                <div style={{
                    padding: '16px', borderRadius: '8px',
                    backgroundColor: preferences.theme === 'amoled' ? '#0a0a0a' : 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex', gap: '12px'
                }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', flexShrink: 0 }}></div>
                    <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-header)', fontWeight: 600 }}>Développeur</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Aujourd'hui à 12:00</span>
                        </div>
                        <div style={{ color: 'var(--text-normal)', marginTop: '4px' }}>
                            Voici à quoi ressemble le texte selon le thème que tu as choisi.
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AppearanceTab;

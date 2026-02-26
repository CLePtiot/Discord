import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const NotificationsTab = () => {
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
                    <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            </div>

            <h2 style={{ color: 'var(--text-header)', marginBottom: '12px', fontSize: '24px' }}>Fonctionnalité en approche...</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px', marginBottom: '32px', lineHeight: 1.5 }}>
                Les paramètres de notifications avancées sont en cours de développement. Ils seront disponibles dans une future mise à jour !
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

export default NotificationsTab;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ToggleSwitch from '../ToggleSwitch';

const AdvancedTab = () => {
    const [devMode, setDevMode] = useState(false);
    const [hardwareAcc, setHardwareAcc] = useState(true);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Avancé</h2>

            <div style={{ marginBottom: '32px' }}>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Mode développeur</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Le mode développeur affiche les identifiants en contexte dans le menu du clic droit. Utile pour la création de bots par exemple.</div>
                    </div>
                    <ToggleSwitch checked={devMode} onChange={() => setDevMode(!devMode)} />
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Accélération matérielle</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>L'accélération matérielle rend Project Freedom plus fluide. Désactive-la si tu observes des baisses de FPS dans tes jeux.</div>
                    </div>
                    <ToggleSwitch checked={hardwareAcc} onChange={() => setHardwareAcc(!hardwareAcc)} />
                </div>

            </div>
        </motion.div>
    );
};

export default AdvancedTab;

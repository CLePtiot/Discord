import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ToggleSwitch from '../ToggleSwitch';

const TextImagesTab = () => {
    const [showLinkImages, setShowLinkImages] = useState(true);
    const [showUploadImages, setShowUploadImages] = useState(true);
    const [showReactions, setShowReactions] = useState(true);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Texte & Images</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>Affichage des images, vidéos et Lolcats</h3>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Quand postés sous forme de liens dans le chat</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Affiche les images et vidéos liées directement dans le chat.</div>
                    </div>
                    <ToggleSwitch checked={showLinkImages} onChange={() => setShowLinkImages(!showLinkImages)} />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Quand importés directement sur Project Freedom</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Affiche les images et vidéos importées au lieu d'un lien.</div>
                    </div>
                    <ToggleSwitch checked={showUploadImages} onChange={() => setShowUploadImages(!showUploadImages)} />
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>Options de rendu des messages</h3>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Afficher les réactions sur les messages</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Permet de voir les réactions ajoutées par les autres utilisateurs.</div>
                    </div>
                    <ToggleSwitch checked={showReactions} onChange={() => setShowReactions(!showReactions)} />
                </div>
            </div>
        </motion.div>
    );
};

export default TextImagesTab;

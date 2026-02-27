import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const TextImagesTab = () => {
    const [showLinkImages, setShowLinkImages] = useState(true);
    const [showUploadImages, setShowUploadImages] = useState(true);
    const [showReactions, setShowReactions] = useState(true);
    const [showEmbeds, setShowEmbeds] = useState(true);

    const imageSettings = [
        {
            label: 'Quand postés sous forme de liens dans le chat',
            desc: 'Affiche les images et vidéos liées directement dans le chat.',
            value: showLinkImages, onChange: setShowLinkImages
        },
        {
            label: 'Quand importés directement sur Project Freedom',
            desc: 'Affiche les images et vidéos importées au lieu d\'un lien.',
            value: showUploadImages, onChange: setShowUploadImages
        }
    ];

    const messageSettings = [
        {
            label: 'Afficher les réactions sur les messages',
            desc: 'Permet de voir les réactions ajoutées par les autres utilisateurs.',
            value: showReactions, onChange: setShowReactions
        },
        {
            label: 'Afficher les embeds de liens',
            desc: 'Affiche les aperçus enrichis des liens partagés dans le chat (titre, description, image).',
            value: showEmbeds, onChange: setShowEmbeds
        }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Texte & Images</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Affichage des images, vidéos et Lolcats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {imageSettings.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', borderBottom: i < imageSettings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
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

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Options de rendu des messages
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {messageSettings.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', borderBottom: i < messageSettings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
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

export default TextImagesTab;

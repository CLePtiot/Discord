import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Volume2, Lock } from 'lucide-react';

const CreateChannelModal = ({ isOpen, onClose, onCreate, categoryName }) => {
    const [channelName, setChannelName] = useState('');
    const [channelType, setChannelType] = useState('text'); // 'text' or 'voice'
    const [isPrivate, setIsPrivate] = useState(false);

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setChannelName('');
            setChannelType('text');
            setIsPrivate(false);
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter') handleCreate();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, channelName, channelType]);

    const handleCreate = () => {
        if (!channelName.trim()) return;
        onCreate(channelName.trim().toLowerCase().replace(/\s+/g, '-'), channelType, isPrivate);
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ zIndex: 9999 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content glass-panel"
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        style={{
                            width: '460px',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 0
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '32px 32px 16px', position: 'relative' }}>
                            <button onClick={onClose} style={{
                                position: 'absolute', top: '24px', right: '24px',
                                background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                padding: '6px', borderRadius: '50%', transition: 'all 0.2s',
                                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <X size={18} />
                            </button>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-header)', letterSpacing: '-0.02em' }}>Créer un salon</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                                dans <strong style={{ color: 'var(--text-normal)' }}>{categoryName}</strong>
                            </p>
                        </div>

                        <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Channel Type Selection */}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-header)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Type de salon</label>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        { id: 'text', icon: <Hash size={24} />, label: 'Texte', desc: 'Messages, images, GIF et avis.' },
                                        { id: 'voice', icon: <Volume2 size={24} />, label: 'Vocal', desc: 'Voix, vidéo et partage d\'écran.' }
                                    ].map(type => (
                                        <div
                                            key={type.id}
                                            onClick={() => setChannelType(type.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px',
                                                background: channelType === type.id ? 'rgba(88, 101, 242, 0.15)' : 'rgba(255,255,255,0.03)',
                                                borderRadius: '12px', cursor: 'pointer',
                                                border: channelType === type.id ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.05)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ color: channelType === type.id ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                                                {type.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: 'var(--text-header)', fontSize: '15px', fontWeight: 700 }}>{type.label}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{type.desc}</div>
                                            </div>
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '50%',
                                                border: channelType === type.id ? '5px solid var(--accent-color)' : '2px solid var(--text-muted)',
                                                transition: 'all 0.2s'
                                            }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Channel Name Input */}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-header)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Nom du salon</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        {channelType === 'text' ? <Hash size={18} /> : <Volume2 size={18} />}
                                    </div>
                                    <input
                                        type="text"
                                        value={channelName}
                                        onChange={(e) => setChannelName(e.target.value)}
                                        placeholder="nouveau-salon"
                                        autoFocus
                                        style={{
                                            width: '100%',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '10px',
                                            padding: '14px 16px 14px 44px',
                                            color: 'var(--text-normal)',
                                            fontSize: '16px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(88, 101, 242, 0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            {/* Privacy Selection */}
                            <div style={{ marginTop: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-header)', fontSize: '16px', fontWeight: 500 }}>
                                            <Lock size={16} /> Salon privé
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                                            En rendant un salon privé, seuls les membres et les rôles sélectionnés pourront le voir.
                                        </div>
                                    </div>
                                    <div
                                        className={`toggle-switch ${isPrivate ? 'on' : 'off'}`}
                                        onClick={() => setIsPrivate(!isPrivate)}
                                    >
                                        <div className="toggle-switch-knob"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '24px 32px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '16px',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent', color: 'white', border: 'none',
                                    padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: 500
                                }}
                            >
                                Annuler
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreate}
                                disabled={!channelName.trim()}
                                style={{
                                    background: 'var(--accent-color)', color: 'white', border: 'none',
                                    padding: '10px 32px', borderRadius: '6px', cursor: channelName.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '15px', fontWeight: '700', opacity: channelName.trim() ? 1 : 0.5,
                                    boxShadow: '0 4px 12px rgba(88, 101, 242, 0.3)'
                                }}
                            >
                                Créer le salon
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CreateChannelModal;

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
                    className="modal-overlay glass-panel-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.7)', zIndex: 9999,
                        backdropFilter: 'blur(8px)'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content glass-panel"
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        style={{
                            width: '540px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex', flexDirection: 'column'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '24px 24px 16px', position: 'relative' }}>
                            <button onClick={onClose} style={{
                                position: 'absolute', top: '16px', right: '16px',
                                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                padding: '4px', borderRadius: '4px', transition: 'all 0.2s',
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-normal)'; e.currentTarget.style.background = 'var(--bg-modifier-hover)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                            >
                                <X size={20} />
                            </button>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-header)' }}>Créer un salon</h2>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                dans <strong style={{ color: 'var(--text-normal)' }}>{categoryName}</strong>
                            </p>
                        </div>

                        <div style={{ padding: '0 24px 24px' }}>
                            {/* Channel Type Selection */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Type de salon</label>

                                {/* Text Option */}
                                <div
                                    onClick={() => setChannelType('text')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                        background: channelType === 'text' ? 'var(--bg-active)' : 'var(--bg-modifier-hover)',
                                        borderRadius: '8px', cursor: 'pointer', marginBottom: '8px',
                                        border: channelType === 'text' ? '1px solid var(--accent-color)' : '1px solid transparent',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Hash size={24} color="var(--text-muted)" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'var(--text-header)', fontSize: '16px', fontWeight: 500 }}>Texte</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Envoyez des messages, des images, des GIF, des avis et bien plus encore</div>
                                    </div>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: channelType === 'text' ? '6px solid var(--accent-color)' : '1px solid var(--text-muted)' }}></div>
                                </div>

                                {/* Voice Option */}
                                <div
                                    onClick={() => setChannelType('voice')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                        background: channelType === 'voice' ? 'var(--bg-active)' : 'var(--bg-modifier-hover)',
                                        borderRadius: '8px', cursor: 'pointer',
                                        border: channelType === 'voice' ? '1px solid var(--accent-color)' : '1px solid transparent',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Volume2 size={24} color="var(--text-muted)" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'var(--text-header)', fontSize: '16px', fontWeight: 500 }}>Vocal</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Discutez de vive voix, partagez une vidéo, ou votre écran avec vos amis</div>
                                    </div>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: channelType === 'voice' ? '6px solid var(--accent-color)' : '1px solid var(--text-muted)' }}></div>
                                </div>
                            </div>

                            {/* Channel Name Input */}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Nom du salon</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
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
                                            background: 'var(--bg-tertiary)',
                                            border: '1px solid rgba(0,0,0,0.3)',
                                            borderRadius: '8px',
                                            padding: '12px 12px 12px 36px',
                                            color: 'var(--text-normal)',
                                            fontSize: '16px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.3)'}
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
                        <div style={{ background: 'var(--bg-secondary-alt)', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent', color: 'var(--text-normal)', border: 'none',
                                    padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                                    transition: 'text-decoration 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!channelName.trim()}
                                style={{
                                    background: 'var(--accent-color)', color: 'white', border: 'none',
                                    padding: '10px 24px', borderRadius: '4px', cursor: channelName.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '14px', fontWeight: 500, opacity: channelName.trim() ? 1 : 0.5,
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'}
                                onMouseLeave={(e) => e.target.style.background = 'var(--accent-color)'}
                            >
                                Créer le salon
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CreateChannelModal;

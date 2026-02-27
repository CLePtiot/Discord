import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { Volume2, VolumeX, MicOff, Mic } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const UserPopoutCard = ({ user, position, onClose }) => {
    const {
        userVolumes,
        setUserVolume,
        localMutedUsers,
        toggleLocalMute
    } = useAppContext();
    const { t } = useTranslation();
    const popoutRef = useRef(null);

    // Close on click outside or escape key
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoutRef.current && !popoutRef.current.contains(e.target)) {
                onClose();
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Small delay to prevent the click that opened the popout from closing it immediately
        setTimeout(() => {
            window.addEventListener('click', handleClickOutside);
            window.addEventListener('keydown', handleKeyDown);
        }, 10);

        return () => {
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!user) return null;

    // Use customized banner/bio if available (mainly for current user), otherwise fallbacks
    const banner = user.banner || '#5865F2';
    const avatar = user.avatar || 'https://i.pravatar.cc/150';
    const name = user.name || 'Utilisateur';

    return (
        <AnimatePresence>
            <motion.div
                ref={popoutRef}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                style={{
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    width: '320px',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    zIndex: 1000
                }}
            >
                {/* Banner */}
                <div style={{
                    height: '120px',
                    backgroundColor: banner.startsWith('#') ? banner : 'transparent',
                    backgroundImage: banner.startsWith('#') ? 'none' : `url("${banner}")`,
                    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
                }}></div>

                {/* Avatar */}
                <div style={{
                    position: 'absolute', top: '76px', left: '16px',
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: 'var(--bg-primary)', padding: '6px'
                }}>
                    <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        backgroundImage: `url("${avatar}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute', bottom: -2, right: -2,
                            width: '16px', height: '16px', borderRadius: '50%',
                            backgroundColor: (user?.status === 'dnd' || user?.status === 'Occupé' ? 'var(--danger-color)' :
                                user?.status === 'idle' || user?.status === 'Inactif' ? 'var(--warning-color, #f0b232)' :
                                    (user?.status === 'invisible' || user?.status === 'offline' || user?.status === 'Hors ligne') ? 'transparent' : 'var(--success-color)'),
                            border: '3px solid var(--bg-primary)',
                            ...((user?.status === 'invisible' || user?.status === 'offline' || user?.status === 'Hors ligne') ? { border: '3px solid var(--text-muted)', backgroundColor: 'var(--bg-primary)' } : {})
                        }}></div>
                    </div>
                </div>

                {/* Nitra Badge fake */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '4px', borderRadius: '6px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'linear-gradient(45deg, #ff73fa, #5865f2)' }} />
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '36px 16px 16px 16px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-header)' }}>{name}</h2>
                    <h4 style={{ margin: '4px 0 16px 0', fontSize: '14px', color: 'var(--text-normal)', fontWeight: 400 }}>{name.toLowerCase().replace(' ', '')}#1337</h4>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                    <h3 style={{ color: 'var(--text-header)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>À propos de moi</h3>
                    <div style={{ color: 'var(--text-normal)', fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {user.bio || 'Un utilisateur mystérieux...'}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                    <h3 style={{ color: 'var(--text-header)', fontSize: '12px', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>{t('account.audio_settings')}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: 'var(--text-normal)' }}>{t('account.volume')}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{userVolumes[user.name] || 100}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={userVolumes[user.name] || 100}
                            onChange={(e) => setUserVolume(user.name, parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                        />

                        <button
                            onClick={() => toggleLocalMute(user.name)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: localMutedUsers.includes(user.name) ? 'var(--danger-color)' : 'var(--bg-secondary)',
                                border: 'none',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {localMutedUsers.includes(user.name) ? <MicOff size={16} /> : <Mic size={16} />}
                            {localMutedUsers.includes(user.name) ? t('account.muted_active') : t('account.mute')}
                        </button>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                    <input
                        type="text"
                        placeholder={`Envoyer un message à @${name.toLowerCase().replace(' ', '')}`}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-normal)',
                            padding: '10px 12px',
                            borderRadius: '4px',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserPopoutCard;
